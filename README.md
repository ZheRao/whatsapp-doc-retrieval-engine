# SOP Retrieval Engine 

Standard Operating Procedure (SOP) documents retrieval system integrated with WhatsApp via Twilio.

## Overview

This lightweight system delivers SOP documents to field operators using a keyword-matching algorithm,
enhancing safety while minimizing communication overhead.

## What this system does

### Algorithm design

- Searches document titles using keyword intersection and union matching
- Returns union matches ordered by relevance only if no full intersection exists

### Operator-friendly interaction

- Standardized request format: `get-keywords`
- Results returned in seconds
- Case- and whitespace-insensitive

## Architecture

The system is implemented as a Twilio webhook handler that processes inbound messages,
matches keywords against a document metadata manifest (`assets/assets_meta.private.js`), and returns secure document links.

## Example interactions
Example WhatsApp interaction demonstrating keyword-based SOP retrieval (exact and partial matches handled automatically)
![Alt text](images/Twilio_demo.png)
