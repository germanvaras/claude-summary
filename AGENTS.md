# Agent System — Claude Resources

This project uses two Claude Code skills to keep documentation accurate and up-to-date. Both agents work directly inside Claude Code using the skills system.

---

## Setup

Make sure you have [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) installed:

```bash
npm install -g @anthropic-ai/claude-code
```

Open a Claude Code session inside this project:

```bash
cd claude-summary
claude
```

The skills in `.claude/skills/` are automatically available. Type `/skills` to confirm they loaded.

---

## Guardian Agent

**Purpose:** Validates documentation sections against official Anthropic sources. Detects outdated CLI flags, wrong model names, incorrect behavior descriptions, and missing content.

### Basic usage

```bash
# Validate all sections (full audit)
/guardian

# Validate a single section
/guardian hooks

# Validate multiple sections
/guardian models tokens mcp

# Validate AND apply corrections (asks confirmation)
/guardian --fix hooks
```

### What it checks

For each section, Guardian:

1. Fetches the relevant page from `docs.anthropic.com`
2. Reads the section HTML (`en/` and `es/` versions)
3. Compares every factual claim — CLI flags, model names, context windows, event names, config keys
4. Produces a report with three categories:
   - ✅ **Correct** — matches official docs
   - ⚠️ **Outdated / Inaccurate** — needs updating
   - ❌ **Missing** — in official docs but absent from the section

### Report format example

```
## Guardian Report: hooks
Validated: 2026-03-28
Official source: https://docs.anthropic.com/en/docs/claude-code/hooks

### ✅ Correct
- PostToolUse event name — matches official docs
- Hook timeout default (60s) — correct

### ⚠️ Outdated / Inaccurate
- "stdin" payload field listed as "input" → official docs use "stdin"
  File: en/sections/hooks.html (look for: "input")

### ❌ Missing
- PreCompact hook event not documented (added in recent release)

| Section | Status | Issues |
|---------|--------|--------|
| hooks   | ⚠️     | 1 outdated, 1 missing |
```

### When to use Guardian

| Situation | Command |
|---|---|
| Before merging a PR that touches section content | `/guardian SLUG` |
| After an Anthropic release announcement | `/guardian` (full audit) |
| When a contributor reports incorrect content | `/guardian SLUG` |
| Regular maintenance (monthly) | `/guardian` |
| Fix detected issues immediately | `/guardian --fix SLUG` |

---

## Content Writer Agent

**Purpose:** Creates new bilingual sections or updates existing ones, always sourced from official Anthropic documentation.

### Basic usage

```bash
# Add a completely new section
/content-writer add rate-limits

# Rewrite an existing section from scratch
/content-writer update hooks

# Add a specific piece of info to a section
/content-writer patch hooks --add "PreCompact event"

# Sync the Spanish version with the English version (or vice versa)
/content-writer translate hooks
```

### What it does

**For `add` (new section):**
1. Fetches official docs for the topic
2. Asks you to confirm: slug, emoji, subtitle, nav group
3. Creates `en/sections/SLUG.html` with full English content
4. Creates `es/sections/SLUG.html` with full Spanish translation
5. Updates the nav in both `en/index.html` and `es/index.html`
6. Reports the official source URL and any content gaps

**For `update` (rewrite):**
1. Reads the current section
2. Fetches current official docs
3. Shows you what changed vs official docs
4. Asks confirmation before rewriting
5. Rewrites both EN and ES files

**For `patch` (targeted addition):**
1. Reads the current section
2. Fetches official docs
3. Inserts the new content in the right place
4. Updates both language versions

**For `translate` (sync):**
1. Reads both EN and ES versions
2. Identifies what's in one but missing in the other
3. Translates the missing content
4. Reports what was synced

### Section naming conventions

| Thing | Convention | Example |
|---|---|---|
| Slug | lowercase, hyphenated | `rate-limits` |
| File name | slug + `.html` | `rate-limits.html` |
| Section id | `section-` + slug | `section-rate-limits` |
| Nav `data-section` | slug | `rate-limits` |

### Translation rules

| Translate | Keep in English |
|---|---|
| Prose, headings, callout text | CLI commands, flags |
| Table headers | Config keys, file paths |
| Step descriptions | Model names, URLs |
| Error messages (prose) | Code blocks |

### When to use Content Writer

| Situation | Command |
|---|---|
| New feature announced in Anthropic release notes | `/content-writer add SLUG` |
| A section is completely outdated (deep change) | `/content-writer update SLUG` |
| One fact or flag needs adding | `/content-writer patch SLUG` |
| EN and ES versions have drifted apart | `/content-writer translate SLUG` |

---

## Combined workflows

### Adding a new section (after an Anthropic release)

```bash
# 1. Start a Claude Code session in this project
cd claude-summary
claude

# 2. Create the new section
/content-writer add memory-management

# 3. Validate it immediately — Guardian will also propose quiz questions if needed
/guardian memory-management

# 4. If Guardian finds issues or proposes quiz questions, apply them
/guardian --fix memory-management

# 5. Exit and commit (Guardian will suggest the exact git add line)
/exit
git add en/sections/memory-management.html es/sections/memory-management.html en/index.html es/index.html en/sections/quiz.html es/sections/quiz.html
git commit -m "feat: add memory-management section"
```

### Fixing outdated content in an existing section

```bash
claude

# Rewrite the section from official docs
/content-writer update hooks

# Validate the result
/guardian --fix hooks

/exit
git add en/sections/hooks.html es/sections/hooks.html
git commit -m "fix(hooks): update to match current official docs"
```

### Adding a specific piece of info (patch)

```bash
claude

/content-writer patch hooks --add "PreCompact event"
/guardian --fix hooks

/exit
git add en/sections/hooks.html es/sections/hooks.html
git commit -m "fix(hooks): add PreCompact event documentation"
```

### Syncing translations

```bash
claude

/content-writer translate hooks
/guardian hooks   # optional: verify the synced version

/exit
git add es/sections/hooks.html
git commit -m "fix(hooks): sync Spanish translation with English"
```

### Fixing content found by Guardian (no content-writer needed)

```bash
claude

/guardian --fix models

/exit
# Guardian will show you the exact files to add
git commit -m "fix(models): correct outdated model names and context windows"
```

---

## Troubleshooting agents

**Skills don't appear in `/skills`**
Close the session with `/exit` and reopen — skills load at startup.

**WebFetch fails for docs.anthropic.com**
The site may be temporarily unavailable. Try again in a few minutes, or use `/guardian` with `WebSearch` fallback (the agent will try this automatically).

**Content Writer creates malformed HTML**
Run the guardian immediately after: `/guardian SLUG`. It will identify structural issues. You can also validate HTML manually with a browser dev-tools check.

**Agent edits the wrong file**
Check that the slug you passed matches the filename exactly. Slugs are case-sensitive on Linux/Mac file systems.

---

## Skill files location

```
claude-summary/
└── .claude/
    └── skills/
        ├── guardian/
        │   └── SKILL.md      ← Guardian agent instructions
        └── content-writer/
            └── SKILL.md      ← Content Writer agent instructions
```

To modify agent behavior, edit the corresponding `SKILL.md` file. Changes take effect the next time you start a Claude Code session.
