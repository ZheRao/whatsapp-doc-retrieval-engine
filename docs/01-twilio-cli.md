# Twilio CLI — Quick Reference

**Install & Verify**

```bash
twilio --version
```

**Login/Logout**

```bash
twilio login
twilio logout
```

**Profiles (check + activate)**

List profiles:

```bash
twilio profiles:list
```

Switch active profile:

```bash
twilio profiles:use monette-zhe
```

# Common Asset Operations

**Create/Initialize an Assets Service**

Create a new **Assets service** (serverless service used to host files):

```bash
twilio assets:init --service-name sop-docs
```

**Note**: Prefer doing this in a clean working directory (note inside your code repo) to avoid confusing local pointers and 
config artifacts.

**List Assets**

```bash
twilio assets:list
```

Export list as JSON:

```bash
cd whatsapp-backend
twilio assets:list -o json > assets/assets_meta.json
```

**Upload a Single Asset**

```bash
twilio assets:upload ./grain_handling.pdf
```

**Bulk Upload (all PDFs in a folder)**

```bash
cd ~/projects/twilio-project/files
for f in *.pdf; do
    twilio assets:upload "$f"
done
```

# "Nuke" a Twilio Assets Service (Danger Zone)

Use this when a service is corrumpted / wrong structure / you want a clean reset.

**1) Find the Service SID (ZS...)**

List services:

```bash
twilio api:serverless:v1:services:list
```

**2) Optional: Check if it contains functions (to avoid deleting code services)**

```bash
twilio api:serverless:v1:services:functions:list --service-sid ZS...
```

**3) Delete the service**

```bash
twilio api:serverless:v1:services:remove --sid ZS....
```

**4) Remove local cached pointers to the old SID**

Search your machine for the old SID:

```bash
grep -R "ZS..." -n ~ 2>/dev/null | head -n 20
```

Common locations to check/remove:
- `~/.twilio-cli/plugins/@twilio-labs/plugin-assets/config.json`
- `~/path/to/code/whatsapp-backend/assets/assets_meta.private.js`

Remove the files

```bash
rm file_path
```

**5) Recreate service for asset uploads**

```bash
twilio assets:init --service-name sop-docs
```

# Directory Utilities

Count files in a directory:

```bash
ls -1 | wc -l
```
