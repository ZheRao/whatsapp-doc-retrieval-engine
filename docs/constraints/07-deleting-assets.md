# Twilio Serverless Builds & Asset Management — Design Notes

This document explains how **Twilio Serverless builds** work, why asset deletion can fail in non-obvious ways, and the **only two reliable recovery strategies** when asset references become stuck.

This applies to **both code services and asset-only services**, as Twilio does **not** distinguish between them internally.

## 1. What a Build Is (and Why It Should Not Be Manually Deleted)

In Twilio Serverless, a **Build** is:

**An immutable snapshot of a Service’s complete state at a point in time.**

A build captures:
- All **assets** (PDFs, JS files, etc.)
- All **functions** (if any)
- Service configuration and metadata

### Important invariants
- Builds are **immutable**
- Builds **cannot be edited**
- Builds **cannot be manually deleted**
- Builds may or may not be **deployed**

Twilio does **not** differentiate:
- Code services vs asset-only services
- “Deployable” services vs “document bucket” services

From Twilio’s perspective:  
**A Service is always potentially deployable, therefore all builds are treated as audit-grade artifacts.**

As a result:
- Builds are **not disposable**, even if the service only hosts documents
- Users cannot garbage-collect builds manually
- Cleanup is **time-based**, not user-controlled


## 2. Why Deleting an Old Asset Fails

Twilio enforces a strict rule:

**An asset cannot be deleted if *any existing build* references it.**

This includes:
- Undeployed builds
- Failed builds
- Pending builds
- Deployed builds (most restrictive)

When an asset deletion fails, the error usually means:
- At least one historical build snapshot still includes that asset
- Twilio cannot safely remove it without corrupting build history

### Key limitation
Twilio does **not expose**:
- Which build references which asset
- Whether the blocking build is deployed
- Any way to surgically remove references

This makes asset cleanup **non-deterministic** from the user’s perspective.


## 3. Solution 1 — Wait for Undeployed Builds to Expire (≈7 Days)

Twilio automatically deletes:

- **Builds without an active deployment after ~7 days**

This is the *only* automatic garbage-collection mechanism available.

### When this works
Waiting will unblock asset deletion **only if**:
- The build referencing the asset was **never deployed**
- All such builds have aged out of the 7-day window

Once those builds are deleted:
- Their asset references disappear
- The asset becomes deletable

### Why assets cannot be deleted before then
Because:
- Builds are immutable
- Asset references are embedded inside builds
- Twilio refuses to create historical inconsistencies

### When this does NOT work
If **any deployed build** references the asset:
- That build will **never expire**
- The asset is effectively pinned forever
- Waiting will not help


## 4. Solution 2 — Immediate Recovery (Nuke & Recreate)

If cleanup must happen **immediately**, the only deterministic solution is:

**Delete the entire service and recreate it**

Deleting a service:
- Removes all builds
- Removes all asset references
- Resets the system to a clean state

This is effectively the **only manual garbage collector** Twilio provides.

### Critical operational warning
Each asset upload implicitly creates a build.

Twilio enforces:
- ~**100 builds per hour per account** (observed behavior)

Therefore:
- Bulk uploads can silently hit build throttling
- Uploads may hang instead of failing cleanly

### Safe operational rules
- Avoid tight upload loops
- Upload in controlled batches
- Insert delays if needed
- Treat asset uploads as **CI-like operations**, not cheap file writes


## Practical Engineering Conclusions

- Twilio Serverless is **not a document management system**
- Assets should be treated as **append-only**
- Asset filenames and contents should be finalized before upload
- Cleanup should be avoided whenever possible
- If cleanup is required, prefer **service rotation** over deletion

> **In Twilio, assets become part of immutable history once included in a build.**

Design accordingly.

---

## Summary (TL;DR)

- Builds are immutable snapshots, even for asset-only services
- Assets cannot be deleted while referenced by any build
- Undeployed builds expire after ~7 days
- Deployed builds never expire
- Immediate cleanup requires deleting the service
- Bulk uploads are build-rate-limited

This behavior is by design, though poorly documented.
