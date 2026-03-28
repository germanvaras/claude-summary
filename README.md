# Claude Resources

A bilingual (English + Spanish) documentation and reference site for **Claude Code** — Anthropic's official CLI tool. Content is community-maintained and verified against official Anthropic sources using an automated two-agent system.

Live site: [github.com/germanvaras/claude-summary](https://github.com/germanvaras/claude-summary)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Setup](#setup)
- [Usage Guide](#usage-guide)
- [Recommended Workflows](#recommended-workflows)
- [Project Structure](#project-structure)
- [Collaboration Guidelines](#collaboration-guidelines)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Project Overview

Claude Resources is a single-page application that provides structured, searchable documentation for Claude Code. It covers topics including model selection, hooks, MCP, permissions, CI/CD, worktrees, skills, slash commands, and more.

**Why it exists:**
- Official Anthropic docs are comprehensive but not structured as a learning path
- Claude Code evolves rapidly — model names, CLI flags, and behaviors change frequently
- A community reference with automated validation catches drift before it misleads users

**Key value:**
- Every section is sourced directly from `docs.anthropic.com`
- Two Claude Code skills (Guardian + Content Writer) automate validation and writing
- All content is maintained in English and Spanish

---

## Architecture

The project uses two Claude Code skills that work as specialized agents.

### Guardian Agent

Validates existing documentation against official Anthropic sources.

| Responsibility | Detail |
|---|---|
| Accuracy check | Compares section content to live official docs |
| Drift detection | Flags outdated CLI flags, wrong model names, stale behavior descriptions |
| Gap detection | Identifies content present in official docs but missing from sections |
| Correction mode | Can apply fixes with `--fix` flag after user confirmation |
| Quiz validation | Verifies quiz questions and answers against official sources |

### Content Writer Agent

Creates new sections or updates existing ones in both languages.

| Responsibility | Detail |
|---|---|
| New sections | Researches and writes from official docs, in both EN and ES |
| Full rewrites | Replaces an entire outdated section with accurate content |
| Targeted patches | Adds specific missing information to an existing section |
| Translation sync | Brings an ES section up to date with its EN counterpart |
| Navigation update | Adds new sections to both `en/index.html` and `es/index.html` |

### How They Interact

The recommended flow is:

```
Guardian (validate) → Content Writer (fix/create) → Guardian (re-validate)
```

Run Guardian first to get a report. If issues are found, use Content Writer to address them. Re-run Guardian to confirm the fix is accurate before committing.

---

## Setup

### 1. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Clone the repository

```bash
git clone https://github.com/germanvaras/claude-summary.git
cd claude-summary
```

### 3. Start a Claude Code session

```bash
claude
```

### 4. Verify skills are available

Once inside a Claude Code session, the following skills should be listed:

- `/guardian` — validation agent
- `/content-writer` — writing agent

Skills are defined in `.claude/skills/` and are loaded automatically when you start a session inside this directory.

---

## Usage Guide

### Guardian Agent

```bash
# Validate all sections
/guardian

# Validate a single section by slug
/guardian hooks

# Validate multiple sections
/guardian models tokens

# Validate and apply corrections
/guardian --fix hooks
```

**Example output:**

```
Section: hooks
Status: OUTDATED
Issues found:
  - --events flag removed in latest release
  - Missing: matchers.cwd configuration
Source: https://docs.anthropic.com/en/docs/claude-code/hooks
```

### Content Writer Agent

```bash
# Add a new section (creates both EN and ES files + updates navigation)
/content-writer add rate-limits

# Fully rewrite an existing section
/content-writer update hooks

# Add specific missing information to a section
/content-writer patch hooks --add-flag

# Sync the Spanish translation with the English version
/content-writer translate hooks
```

### When to Use Each Agent

| Situation | Agent |
|---|---|
| Check if a section is still accurate | Guardian |
| Fix incorrect or missing content | Content Writer |
| Add a section for a newly released feature | Content Writer |
| Bring ES translation up to date | Content Writer |
| Verify a fix was applied correctly | Guardian |
| Validate before opening a PR | Guardian |

---

## Recommended Workflows

### Adding a New Section

```bash
# 1. Write the section in both languages
/content-writer add <slug>

# 2. Validate the new section
/guardian <slug>

# 3. If issues are found, fix them
/content-writer patch <slug>

# 4. Re-validate
/guardian <slug>

# 5. Commit and open a PR
git checkout -b feat/add-<slug>
git add .
git commit -m "feat: add <slug> section"
```

### Updating Outdated Content

```bash
# 1. Identify the problem
/guardian <slug>

# 2. Rewrite the section
/content-writer update <slug>

# 3. Confirm accuracy
/guardian <slug>

# 4. Commit
git checkout -b fix/<slug>-update
git add .
git commit -m "fix: update <slug> to latest docs"
```

### Patching Specific Information

```bash
# Add a specific missing flag or feature to a section
/content-writer patch <slug>

# Re-validate
/guardian <slug>
```

### Syncing Translations

```bash
# Bring Spanish version in sync with English
/content-writer translate <slug>

# Validate both versions
/guardian <slug>
```

### Fixing Issues Detected by Guardian

```bash
# Option 1: Let Guardian apply corrections directly
/guardian --fix <slug>

# Option 2: Use Content Writer for a full rewrite
/content-writer update <slug>
/guardian <slug>
```

---

## Project Structure

```
claude-summary/
├── .claude/
│   └── skills/
│       ├── guardian/
│       │   └── SKILL.md          # Guardian agent definition
│       └── content-writer/
│           └── SKILL.md          # Content Writer agent definition
├── en/
│   ├── index.html                # English SPA entry point + navigation
│   └── sections/                 # 24 English content sections
│       ├── setup.html
│       ├── hooks.html
│       ├── mcp.html
│       └── ...
├── es/
│   ├── index.html                # Spanish SPA entry point + navigation
│   └── sections/                 # 24 Spanish content sections (mirrors en/)
│       └── ...
├── index.html                    # Root redirect (language detection)
├── script.js                     # SPA logic: section loading, search, quiz
├── lang.js                       # Language switcher
├── styles.css                    # Design system (purple #A100FF theme)
├── CLAUDE.md                     # Project context for Claude Code sessions
├── AGENTS.md                     # Agent system reference and workflows
├── CONTRIBUTING.md               # Contribution guidelines
└── README.md                     # This file
```

### Section Slugs

| Slug | Topic |
|---|---|
| `setup` | Installation and initial setup |
| `auth` | Authentication |
| `modelo` | Claude model overview |
| `modelos` | Model comparison |
| `tokens` | Token usage and limits |
| `sesiones` | Session management |
| `claudemd` | CLAUDE.md / memory |
| `scopes` | Permission scopes |
| `directorios` | Directory structure |
| `skills` | Claude Code skills |
| `hooks` | Hooks system |
| `mcp` | Model Context Protocol |
| `slash` | Slash commands |
| `permisos` | Permissions |
| `agente` | Sub-agents |
| `cicd` | GitHub Actions / CI-CD |
| `worktrees` | Git worktrees |
| `glosario` | Glossary |
| `cheatsheet` | Quick reference |
| `update` | Changelog / updates |
| `troubleshoot` | Troubleshooting |
| `impl` | Implementation examples |
| `quiz` | Practice quiz |
| `disclaimer` | Disclaimer |

---

## Collaboration Guidelines

### Branch Naming

| Type | Pattern | Example |
|---|---|---|
| New section | `feat/add-<slug>` | `feat/add-rate-limits` |
| Fix or update | `fix/<slug>-<description>` | `fix/hooks-remove-stale-flag` |
| Meta/docs | `docs/<description>` | `docs/update-contributing` |

### Before Every Commit

1. Run Guardian on any section you touched: `/guardian <slug>`
2. Resolve all reported issues before opening a PR
3. Ensure both EN and ES versions are updated
4. Verify navigation entries exist in `en/index.html` and `es/index.html`

### Pull Request Rules

- Main branch is protected — all changes go through PRs
- Every PR must include both the English and Spanish version of changed sections
- Every section must cite its official source URL in an HTML comment
- Do not submit sections with content not traceable to official Anthropic documentation

---

## Best Practices

**Content accuracy**
- Always source from `docs.anthropic.com` — never from blog posts, YouTube, or third-party summaries
- Model names, CLI flags, and API parameters change frequently; run Guardian before assuming content is current

**Translations**
- Translate: prose, headings, callout text, step descriptions
- Do NOT translate: CLI commands, flags, code blocks, model IDs, configuration keys
- Keep Spanish and English sections structurally identical

**HTML authoring**
- Use `<pre><code>` for all code — never markdown-style backticks
- Use the defined callout classes: `tip`, `warn`, `info`, `ok`, `err`
- Follow the section template defined in `CLAUDE.md`
- Include `<!-- source: https://docs.anthropic.com/... -->` in every section

**Validation cadence**
- Run `/guardian` on any section you're about to edit
- Run `/guardian` again after editing, before committing
- Run `/guardian` without arguments periodically to catch drift across all sections

---

## Troubleshooting

**Skills not appearing in Claude Code session**

Ensure you started the session from inside the `claude-summary/` directory. Skills are resolved relative to the working directory.

```bash
cd claude-summary
claude
```

**Guardian reports false positives**

The Guardian agent fetches live pages from `docs.anthropic.com`. If the site is unavailable or returns an error, results may be unreliable. Re-run the command once the site is accessible.

**Content Writer creates malformed HTML**

Check that `CLAUDE.md` is present and unmodified — it contains the required section template. The agent uses it as a formatting reference during each session.

**Navigation not updating after new section**

The Content Writer's `add` command should update both index files automatically. If it does not, manually add the `<li>` entry to the appropriate nav group in `en/index.html` and `es/index.html`.

**ES and EN sections are out of sync**

Run the translate command for the affected slug:

```bash
/content-writer translate <slug>
/guardian <slug>
```

**Styles not applying to new callout or component**

Check `styles.css` for the relevant class. If a new callout type or component is needed, add it to the CSS and document it in `CLAUDE.md`.

---

## Contributing

### Step-by-Step

1. **Fork and clone** the repository

   ```bash
   git clone https://github.com/germanvaras/claude-summary.git
   cd claude-summary
   ```

2. **Create a branch** following the naming convention

   ```bash
   git checkout -b feat/add-<slug>
   # or
   git checkout -b fix/<slug>-<description>
   ```

3. **Start a Claude Code session** in the project directory

   ```bash
   claude
   ```

4. **Use the agents** to create or validate content

   ```bash
   /content-writer add <slug>     # for new sections
   /content-writer update <slug>  # for updates
   /guardian <slug>               # to validate
   ```

5. **Stage and commit** your changes

   ```bash
   git add en/sections/<slug>.html es/sections/<slug>.html
   git add en/index.html es/index.html
   git commit -m "feat: add <slug> section"
   ```

6. **Push and open a PR**

   ```bash
   git push origin feat/add-<slug>
   ```

   Then open a pull request against `main` on GitHub.

### PR Checklist

- [ ] Both `en/sections/<slug>.html` and `es/sections/<slug>.html` are included
- [ ] Navigation entries added to `en/index.html` and `es/index.html`
- [ ] Official source URL cited in an HTML comment inside each section
- [ ] Guardian reports no issues: `/guardian <slug>`
- [ ] No untranslated prose in the Spanish version
- [ ] No markdown syntax inside HTML section files
- [ ] Quiz updated if the section covers testable knowledge (`es/sections/quiz.html` + `en/sections/quiz.html`)

---

## License

This project is open source. Content is derived from [Anthropic's official documentation](https://docs.anthropic.com), which is © Anthropic. This site is a community reference and is not affiliated with or endorsed by Anthropic.
