## 2024-05-27 - Missing ARIA labels on dynamic components
**Learning:** Found a recurring pattern in the codebase where icon-only action buttons dynamically inserted into list views (such as dismiss/remove actions in inbox or setup forms) frequently lack descriptive `aria-label`s.
**Action:** Always verify `aria-label` inclusion when reviewing dynamically generated components or forms containing icon-only `<Button>` elements.
