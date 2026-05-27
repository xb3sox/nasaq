## 2024-05-27 - [Memoize ChartData]
**Learning:** Recharts components often cause re-renders if the data prop is re-created on each render.
**Action:** Use useMemo for data objects or memoize formatting functions.
