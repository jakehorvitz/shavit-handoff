# Anti-requirements for the stage-5 loop (shavit-product-edit)
- The build is COMPLETE. Do NOT modify any file under docs/product-edit/ (renderers, captures, footage, mockup, exports, audio, captions) or accept-edit.sh or site/.
- Your only job this iteration: run `./accept-edit.sh` from the repo root, read its output, and write .loop/acceptance.json + .loop/score.json truthfully from that output. Do not re-render, re-export, or "improve" anything.
- Nothing generated, nothing posted, no network calls beyond localhost (Palmier MCP) and shavitrootman.com.
- Never touch .bones/.
