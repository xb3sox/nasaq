## 2025-02-18 - Improve accessibility of Dialog form
**Learning:** Found a pattern where Shadcn `DialogContent` forms often lacked `DialogDescription` for screen readers (which Shadcn expects) and `Input` fields were missing proper `id` bindings to their corresponding `Label`s via `htmlFor`.
**Action:** Always verify that `DialogContent` contains a `DialogDescription` (using `.sr-only` if visual text is not needed), and explicitly link form `<Label>`s to their corresponding `<Input>` fields with `htmlFor` and `id`.
