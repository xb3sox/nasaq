## 2026-05-28 - Missing Dialog Descriptions in Shadcn UI Modals
**Learning:** Using `@base-ui/react/dialog` (via Shadcn `Dialog`), omitting `DialogDescription` produces screen reader accessibility gaps and sometimes console warnings, even when the UI visually requires only a title.
**Action:** Always include a visually hidden (`className="sr-only"`) `DialogDescription` inside `DialogContent` if the design doesn't necessitate a visible description.
