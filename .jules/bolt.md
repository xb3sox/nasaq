## 2024-05-29 - Recharts array reference stability
**Learning:** Recharts charts (like `<BarChart>`) will re-render if the `data` prop receives a new array reference, even if the content is identical. In `crm-page.tsx`, doing `.map()` or inline array creation inside the JSX return caused expensive and unnecessary charting calculations on every keystroke in unrelated input fields (like the search bar).
**Action:** Always wrap data transformations for Recharts in `useMemo()` to provide a stable reference and prevent the component from performing redundant renders.
