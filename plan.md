1. **Optimize derived state and Recharts data in CrmPage**
   - Extract the 12 array iterations (`DEMO_LEADS.filter`) used for stats and chart data into a single `useMemo` hook.
   - Calculate all counts (new, contacted, booked, whatsapp, instagram, google, referral) in one pass over the `leads` array.
   - Memoize the `sourceChartData` array to prevent `Recharts` from unnecessarily re-rendering on every keystroke (when `search` state changes).
2. **Document learning**
   - Add an entry to `.jules/bolt.md` documenting the Recharts inline array anti-pattern.
3. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
4. **Submit**
   - Commit and submit the code with a descriptive performance improvement message.
