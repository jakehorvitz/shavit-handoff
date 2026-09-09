# Media delivery status

**Source, designs and guides are published. The full media transfer is still running.**

The 23 private media archives total about 18 GB. A resumable upload job on Jake's Mac will verify every archive's SHA-256 and publish the private release automatically when all files arrive. This page will change to **Complete** after publication. Until then, the full restore command is not ready to use.

The complete recovered archive is already available locally at `~/projects/shavit-handoff`; its full restoration and editor relinking were tested. The GitHub release remains a draft until all assets are verified. Jake's Mac must remain running and connected; the upload process temporarily prevents idle sleep and releases that hold when it exits.

For Jake: local job state/logs are under `.handoff-upload/` (ignored by Git). To resume after a failure or restart, run `python3 .handoff-upload/finish_upload.py` from the local handoff repo. Completed assets with matching remote checksums are skipped. No account credentials are stored in the job folder or repository.
