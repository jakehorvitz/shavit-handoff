#!/usr/bin/env python3
"""calibrate_kb.py — calibrate the Ken-Burns affine-residual threshold for check.sh §3.

Per spec.html §06 / council finding 2: before the build loop starts, run this on
  (a) one known-good AI camera-move clip (Kling frames-mode — true parallax), and
  (b) one deliberate Ken Burns clip (ffmpeg zoompan on the same/another still),
each with its source still (recorded for provenance).

Usage:
  python3 checks/calibrate_kb.py <camera_move.mp4> <camera_still.jpg> <kb_clip.mp4> <kb_still.jpg>

Writes checks/kb_threshold.json with the residual threshold (geometric midpoint
between the KB residual and the camera-move residual). check.sh classifies a
still-derived clip as Ken Burns when its residual < threshold.
"""
import sys, os, json

def clip_residual(path):
    """Median per-frame-pair residual (px @480w) after compensating global affine motion.
    Near-zero => pure affine motion (Ken Burns). Higher => parallax (real camera move).
    Must stay in sync with the residual() metric inside check.sh §3."""
    import cv2, numpy as np
    cap = cv2.VideoCapture(path)
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if n < 8:
        raise SystemExit(f"{path}: too short ({n} frames)")
    pad = max(1, int(n * 0.15))
    a, b = pad, n - pad
    idxs = np.linspace(a, max(a, b - 4), 10).astype(int)
    res = []
    for i in idxs:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(i)); ok1, fa = cap.read()
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(i) + 3); ok2, fb = cap.read()
        if not (ok1 and ok2):
            continue
        s = 480.0 / fa.shape[1]
        ga = cv2.cvtColor(cv2.resize(fa, None, fx=s, fy=s), cv2.COLOR_BGR2GRAY)
        gb = cv2.cvtColor(cv2.resize(fb, None, fx=s, fy=s), cv2.COLOR_BGR2GRAY)
        p0 = cv2.goodFeaturesToTrack(ga, 300, 0.01, 8)
        if p0 is None or len(p0) < 30:
            continue
        p1, st, _ = cv2.calcOpticalFlowPyrLK(ga, gb, p0, None)
        g = st.ravel() == 1
        q0, q1 = p0[g].reshape(-1, 2), p1[g].reshape(-1, 2)
        if len(q0) < 30:
            continue
        M, _ = cv2.estimateAffinePartial2D(q0, q1, method=cv2.RANSAC, ransacReprojThreshold=1.0)
        if M is None:
            res.append(9.9); continue
        pred = q0 @ M[:, :2].T + M[:, 2]
        res.append(float(np.median(np.linalg.norm(pred - q1, axis=1))))
    cap.release()
    if not res:
        raise SystemExit(f"{path}: could not track features (blank/flat clip?)")
    return float(np.median(res))


def main():
    if len(sys.argv) != 5:
        print(__doc__); sys.exit(2)
    cam_clip, cam_still, kb_clip, kb_still = sys.argv[1:5]
    for f in (cam_clip, cam_still, kb_clip, kb_still):
        if not os.path.isfile(f):
            raise SystemExit(f"missing: {f}")
    cam_r = clip_residual(cam_clip)
    kb_r = clip_residual(kb_clip)
    print(f"camera-move residual: {cam_r:.4f} px  ({cam_clip})")
    print(f"ken-burns residual:   {kb_r:.4f} px  ({kb_clip})")
    if kb_r >= cam_r:
        raise SystemExit("CALIBRATION INVALID: KB residual >= camera-move residual — "
                         "the two calibration clips do not separate; pick clearer examples.")
    thr = (kb_r * cam_r) ** 0.5  # geometric midpoint
    out = {
        "threshold": thr,
        "metric": "median LK-affine residual px @480w, frame pairs i,i+3",
        "kb_residual": kb_r, "kb_clip": kb_clip, "kb_still": kb_still,
        "camera_residual": cam_r, "camera_clip": cam_clip, "camera_still": cam_still,
    }
    dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), "kb_threshold.json")
    with open(dst, "w") as f:
        json.dump(out, f, indent=2)
    print(f"threshold {thr:.4f} px written to {dst}")


if __name__ == "__main__":
    main()
