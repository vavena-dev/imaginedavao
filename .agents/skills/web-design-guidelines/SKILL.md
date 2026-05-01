---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Fetch the latest guidelines from the source URL below
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.

## Codex Tailoring

When used by Codex in this repository:

1. Prefer `rg --files` and `rg -n` to scope and locate frontend files quickly.
2. Review only files relevant to the user request (for example `index.html`, `styles.css`, `script.js`, page-level CSS/JS).
3. Keep findings action-oriented and include precise locations in `file:line` format.
4. Prioritize accessibility, responsive behavior, interaction clarity, and visual consistency issues first.
5. Distinguish severity clearly:
   - High: broken UX/accessibility or behavior regressions
   - Medium: standards/guideline violations with user impact
   - Low: polish inconsistencies
6. If no issues are found, explicitly state that and note any testing gaps.
