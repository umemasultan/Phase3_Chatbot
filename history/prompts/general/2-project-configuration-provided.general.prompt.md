---
id: 2
title: Project Configuration Provided
stage: general
date: 2026-02-14
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: name: hackathon-todo
version: "1.0"

structure:
  specs_dir: specs
  features_dir: specs/features
  api_dir: specs/api
  database_dir: specs/database
  ui_dir: specs/ui

phases:
  - name: phase1-console
    features: [task-crud]
  - name: phase2-web
    features: [task-crud, authentication]
  - name: phase3-chatbot
    features: [task-crud, authentication, chatbot]
labels: ["configuration"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - history/prompts/general/2-project-configuration-provided.general.prompt.md
tests:

---

## Prompt

name: hackathon-todo
version: "1.0"

structure:
  specs_dir: specs
  features_dir: specs/features
  api_dir: specs/api
  database_dir: specs/database
  ui_dir: specs/ui

phases:
  - name: phase1-console
    features: [task-crud]
  - name: phase2-web
    features: [task-crud, authentication]
  - name: phase3-chatbot
    features: [task-crud, authentication, chatbot]

## Response snapshot

This `config.yaml` file provides a clear overview of your project's structure and development phases. It outlines where different specification documents are located and how features are grouped into distinct phases, which is very helpful for understanding the project's roadmap.

How can I assist you further with this project configuration or any other aspect of your hackathon-todo application? For example, we could:

1.  **Generate a detailed specification** for one of the features (e.g., `task-crud` or `authentication`).
2.  **Plan the implementation** of a specific phase.
3.  **Explore the existing codebase** based on this structure.

Please let me know what you'd like to do next!

## Outcome

- ✅ Impact: User provided project configuration, acknowledged and understood.
- 🧪 Tests: None
- 📁 Files: history/prompts/general/2-project-configuration-provided.general.prompt.md created.
- 🔁 Next prompts: Awaiting user's next instruction.
- 🧠 Reflection: The user provided a configuration, and I acknowledged it and offered next steps based on the structure and phases defined. I'm ready to proceed with a specific task related to the project.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
