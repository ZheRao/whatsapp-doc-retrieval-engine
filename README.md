# Twilio-WhatsApp SOP Retrieval Engine

## Overview

The **Twilio-WhatsApp SOP Retrieval Engine** is a lightweight, internal utility that allows farm operators to retrieve approved 
**Standard Operating Procedures (SOPs)** and reference documents through WhatsApp.

The system is designed for:
- Deterministic, keyword-based retrieval only
- **Fast, predictable access** to operational documents with minimal cognitive overhead for operators in the field.


## What This System Does

At its core, the system:

- Accepts a structured keyword request
- Matches keywords against a curated document metadata manifest
- Returns the most relevant document links within seconds

This is a **retrieval engine**

---

### Algorithm Design

**Keyword-Based Retrieval (Deterministic)**

The retrieval algorithm operates as follows:

1. **Input parsing**

    - Operator sends a request using the standardized pattern:
        ```text
        get-keywords
        ```
    - Keywords are extracted from the message

2. **Document matching**

    - Keywords are matched against **document titles** in the metadata manifest
        - Matching is **case-insensitive** and **whitespace-insensitive**
    - Two matching strategies are applied:
        - Intersection match (all keywords present)
        - Union match (some keywords present)

3. **Result selection**

    - If **one or more intersection matches exist**:
        - Return those documents only
    - If **no intersection exists**:
        - Return union matches
        - Ordered in descending relevance, based on the number of matched keywords

4. **No matches**
    - If no documents are found:
        - The system instructs the operator to **contact their farm manager**

This ensures predictable, explainable behavior under all conditions.

---

### Operator-Friendly Interaction Design

The system is designed for **field usability**, not exploration.

If the request does not match the expected pattern (`get-keywords`):

- The system responds with instructions on how to format the query correctly

## Architecture

**High-Level Flow**

1. Incoming WhatsApp message received via Twilio
2. Twilio forwards the message to a webhook endpoint
3. Webhook handler:
    - Parses and normalizes keywords
    - Matches against the document metadata manifest
4. Matching document links are returned via WhatsApp

---

**Implementation Details**

- Implemented as a **Twilio webhook handler**
- Document metadata stored in:
    ```bash
    assets/assets_meta.private.js
    ```
- Matching logic operates on document titles only
- The system returns links, not document contents

---

**Determinism and Safety Considerations**

This system is intentionally **fully deterministic**.

For identical inputs, it will always produce identical outputs.
No stochastic or probabilistic components are used.

This design choice is intentional: when operational or safety-related procedures are involved, nondeterministic behavior (e.g., probabilistic inference or generative models) introduces unacceptable risk due to non-repeatable outputs and unverifiable reasoning paths.

The system therefore prioritizes **predictability, explainability, and auditability** over intelligence or flexibility

---

**Known Limitations**

- Requires operators to remember the query pattern
- Matches only on document titles
- No fuzzy or semantic matching
- Cannot infer intent beyond provided keywords

## Example interactions
Example WhatsApp interaction demonstrating keyword-based SOP retrieval (exact and partial matches handled automatically)  
![Alt text](assets/Twilio_demo.png)
