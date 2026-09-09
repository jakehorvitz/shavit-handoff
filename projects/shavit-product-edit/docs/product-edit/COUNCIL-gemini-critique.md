### 1. Contradictions & Missing States
* **The OCR vs. Address Paradox:** Reel 2 specifies "address small" under "Open," but Section 5 strictly bans digit-leading street addresses. If "address small" accidentally includes "1919," the automated `accept-edit.sh` OCR check will fail.
* **Unruled Content Collisions:** Defaulting to "no dollar figures on picture" risks failing the OCR gate if the live desktop Case Studies capture (Reel 1, 9–14s) contains visible numbers/metrics in the cards.
* **The Hook Overlap:** The Mac amendment for Reel 1 (0–3s) conflicts with the shot list's tight 3-second window. Fitting a Mac, a phone, a rising animation, and the typography in 3 seconds is a compressed mess.

### 2. Hidden Complexity (1-Day Build Risk)
* **Headless Video Capture:** Generating 30fps scroll videos and device-frame renders with 3D perspective, shadows, and gloss via headless Chromium is a recipe for micro-stutter, frame drops, and rendering bugs. Doing this programmatically and cleanly in 24 hours is a massive overbuild risk.

### 3. Two Things That Will Make It "Look Shitty"
1. **Stuttery/Low-Res Scroll Footage:** Headless screen captures often look laggy and soft, destroying the premium "AirPods/Porsche" aesthetic. 
   * *Prevention:* Capture actual scroll recordings on a physical high-DPI screen using standard macOS screen recording, then import those high-fidelity files into the CSS frames.
2. **Visual Clutter of Dual Devices in 9:16:** Overlapping a landscape MacBook and portrait iPhone in a 1080×1920 frame leaves zero breathing room and renders text illegible.
   * *Prevention:* Commit to a clean two-beat cut (Macbook zoom-in, then hard cut to iPhone rise) instead of attempting a dual-device composition.

### 4. VERDICT: APPROVE WITH CHANGES

* **Fix address spec:** Explicitly define "address small" as "Kendall Street, Hillsdale" (no numbers) to pass OCR.
* **Isolate captures:** Pre-filter or blur case-study card figures on the live site before running the capture script to avoid unruled OCR failures.
* **Sequence, don't stack:** Implement the Reel 1 hook as a sequential edit (Mac 1.5s $\rightarrow$ Phone 1.5s) to preserve layout elegance.
* **Fallback capture pipeline:** Allow manual high-DPI screen recording inputs for the scroll videos if headless capture produces any frame jitter.
