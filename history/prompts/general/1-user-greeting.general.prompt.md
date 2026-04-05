---
id: 1
title: User Greeting
stage: general
date: 2026-02-14
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: hii
labels: ["greeting"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - history/prompts/general/1-user-greeting.general.prompt.md
tests:

---

## Prompt

hii

## Response snapshot

Hi there! How can I help you today?

## Outcome

- ✅ Impact: User greeted.
- 🧪 Tests: None
- 📁 Files: history/prompts/general/1-user-greeting.general.prompt.md created.
- 🔁 Next prompts: Continue conversation.
- 🧠 Reflection: User provided directory structure.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
