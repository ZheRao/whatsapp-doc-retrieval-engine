# Windows → WSL File Sync (OneDrive → Linux directory)

**Goal**

Copy a batch of upload files from OneDrive (Windows) into a WSL folder for CLI operations.

**Example Setup**

Linux destination:

```text
~/files/
```

Windows source path (mounted in WSL):

```bash
win_path="/mnt/c/Users/ZheRao/OneDrive - Monette Farms/Desktop/Work Files/Projects/6-SOP/final/uploads/"
```

Sync into Linux:

```bash
rsync -av "$win_path" files/
```

# Create Assets Metadata JSON for JS Program

Export assets list into a JS-readable file:

```bash
twilio assets:list -o json > assets/assets_meta.private.js
```
