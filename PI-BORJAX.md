# pi-borjax — AI Coding Agent

This project is assisted by **pi-borjax** (codename `borjax`), a minimal terminal coding harness forked from [pi](https://github.com/earendil-works/pi-mono).

## About

Pi-borjax is an AI coding agent that lives in the terminal. It equips the LLM with four core tools:

- **`read`** — read files and images
- **`write`** — create or overwrite files
- **`edit`** — make precise file edits
- **`bash`** — execute shell commands

## Capabilities

- Interactive, JSON, RPC, and SDK modes
- Extensible via **Skills**, **Extensions**, **Prompt Templates**, and **Themes**
- Support for many LLM providers (Anthropic, OpenAI, Google, DeepSeek, Groq, and more)
- Session management with branching, forking, cloning, and compaction
- Message queue, file referencing (`@`), image pasting, and inline bash commands

## Extending

Skills, extensions, themes, and prompt templates can be packaged into **Pi Packages** and shared via npm or Git.

For more details, see the [pi-mono repository](https://github.com/earendil-works/pi-mono).
