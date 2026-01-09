# Result Truncation Due to WhatsApp Delivery Limits

**Background**

The SOP retrieval system supports keyword-based document lookup using union and intersection logic. In union mode *(and sometimes intersection mode)*, 
result counts can grow arbitrarily large depending on keyword breadth.

WhatsApp outbound messages have a hard delivery limit of approximately **1600 characters**. 
Exceeding this limit causes message delivery to fail (`Twilio Error 21617`), even though the system logic executes correctly.

---

**Design Decision**

To guarantee reliable delivery and deterministic behavior, the system enforces a **fixed maximum number of returned documents**.

**Behavior**

- The full compiled set is computed internally
- The total number of matches is reported to the operator
- Only the **top N results** (currently **8**) are returned
- Results are sorted by descending relevance *(for union mode)*

**Rationale**

- Prevents silent delivery failures
- Ensures consistent operator experience
- Avoids platform-specific retry or fragmentation logic

**Example Output**

> We found 14 matches. Showing 8.

**Notes**

This is an intentional system constraint, not a limitation of the search logic itself.