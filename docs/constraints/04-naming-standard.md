# Twilio Asset Naming Convention

> **Purpose**  
Enforce predictable, searchable, and automation-safe filenames for all Twilio document uploads.

These rules are **mandatory** for every asset uploaded to Twilio.

---

**Allowed Format**

```text
words_separated_by_underscores.pdf
```

---

**Rules**

1. Use `_` (underscore) as the word separator
    - Do **not** use spaces or hyphens
2. **No spaces**
    - Spaces break consistency and complicate automation
3. **No special characters**
    - Especially
        - `-`
        - `&`
        - `(`
        - `)`
        - `,`
        - any punctuation or symbols
4. **No random or meaningless characters**
    - Filenames must contain **only descriptive, human-readable words**
    - Avoid patterns such as :
        - `-0834ee37-377a-4e70-9906-dd6416583932`
5. **PDF files only**

---

**Rationale**

- Ensures **cross-platform compatibility**
- Enables **deterministic lookup and matching**
- Prevents **CLI, API, and filesystem edge cases**
- Keeps assets **human-readable and maintainable**
- Supports **future automation without refactors**
