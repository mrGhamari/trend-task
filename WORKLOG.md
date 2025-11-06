# Work Log

This file tracks meaningful actions taken in this repository for clarity and traceability.

## How We Use This File
- Add a new entry for each substantive change or decision.
- Reference files with repo‑relative paths (e.g., `hooks/useTodos.ts`).
- Keep entries concise; group related small edits into one entry.
- Append new entries to the end of the file (newest last).

## Entry Template
```
### YYYY‑MM‑DD — Short summary
- Context: One sentence of why
- Actions: Bulleted key steps
- Files: `path/a`, `path/b`
- Outcome: Result or observable change
- Follow‑ups: Optional next steps
```

## Entries

### 2025-11-06 — Initialize work log
- Context: We want to record everything we do going forward.
- Actions: Created `WORKLOG.md` with usage notes and a reusable template.
- Files: `WORKLOG.md`
- Outcome: Work log established; ready for subsequent entries.

### 2025-11-06 — Hide empty state during loading
- Context: Empty state should not appear while data is loading.
- Actions: Render `TodoList` only when either loading is false or there are todos.
- Files: `app/page.tsx`
- Outcome: While `loading === true` and `todos.length === 0`, only the loading indicator is shown; after loading, the empty state appears if there are no todos.
