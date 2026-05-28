Title: Extract inbox feature state and panels
Repo: xb3sox/nasaq
Starting branch: sabi/cleanup-content-extract
Branch naming: jules/extract-inbox

Risk score: 3
Mode: CLI pull mode

Goal: Extract 345 LOC inbox page (11 useState) into features/dashboard/inbox/. Thin route to <30 LOC.

Touch only: app/dashboard/inbox/page.tsx → Create: features/dashboard/inbox/{inbox-page,conversation-list,chat-thread,ai-suggestion,use-inbox-state}.tsx + content.ts

Rules: Route shell imports InboxPage. Hook owns all 11 useState + filter/search. AI suggestion, conversation panel, chat thread each in own component. Content owns Arabic labels. Same visual output. Keep importing demo-clinic (shim refactors later).
Build/test/lint green. Route <30 LOC.
