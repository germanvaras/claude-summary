# Contributing to Claude Resources

> An open-source bilingual reference for Claude Code. All contributions are welcome.

---

## Ways to contribute

| Type | What it means |
|---|---|
| **Fix outdated content** | A CLI flag changed, a model was renamed, a behavior was updated |
| **Add a new section** | A topic covered in official docs but missing here |
| **Improve a translation** | The Spanish or English version is unclear or wrong |
| **Fix the quiz** | A question has the wrong answer or is misleading |
| **Report a gap** | Open an issue describing what's missing — no code required |

---

## Before you start

1. **Check official docs first.** All content must be traceable to [docs.anthropic.com](https://docs.anthropic.com). If you're not sure, open an issue instead of a PR.

2. **Run the Guardian agent** to understand the current state of the section you want to touch:
   ```
   /guardian SECTION_SLUG
   ```
   This validates the section against official sources and tells you what's already wrong.

3. **Use the Content Writer agent** to create or update sections:
   ```
   /content-writer add SECTION_SLUG      # new section
   /content-writer update SECTION_SLUG   # rewrite existing
   /content-writer patch SECTION_SLUG    # targeted addition
   ```

> See [AGENTS.md](./AGENTS.md) for full agent documentation.

---

## Project structure

```
claude-summary/
├── en/sections/     ← English HTML sections (one file per topic)
├── es/sections/     ← Spanish HTML sections (same filenames)
├── en/index.html    ← English navigation (add new sections here)
├── es/index.html    ← Spanish navigation (add new sections here)
├── script.js        ← Section loading and quiz logic
└── styles.css       ← Design system (do not change without discussion)
```

Every section is a standalone HTML fragment. The SPA in `script.js` loads them dynamically.

---

## HTML section format

All sections follow this template. Copy it exactly:

```html
<div class="section" id="section-SLUG">
  <div class="section-header"><h2>EMOJI Title <span class="badge">Short subtitle</span></h2></div>
  <div class="content">
    <!-- source: https://docs.anthropic.com/... -->

    <div class="callout info"><span class="callout-icon">ℹ️</span><div>
      One-line summary of what this section is about.
    </div></div>

    <!-- Your content here -->

  </div>
</div>
```

**Callout types:** `tip` · `warn` · `info` · `ok` · `err`

**Content elements:**
- `<pre><code>` — all CLI commands and config snippets
- `<table>` — comparisons and flag/event lists
- `<ol class="steps">` — step-by-step procedures
- `<ul class="def-list">` — term/definition pairs

---

## Bilingual requirement

Every section **must exist in both languages**:

- `en/sections/SLUG.html` — English
- `es/sections/SLUG.html` — Spanish

**Do not translate:** CLI commands, flags, config keys, code blocks, model names, file paths.
**Do translate:** all prose, headings, callout text, table headers.

If you only speak one language, submit your PR anyway and note which translation is missing — another contributor can add it.

---

## Adding a section to the navigation

Edit **both** `en/index.html` and `es/index.html`. Find the correct group and add:

```html
<!-- en/index.html -->
<li><a class="nav-link" data-section="SLUG" href="#"><span>EMOJI</span> English Title</a></li>

<!-- es/index.html -->
<li><a class="nav-link" data-section="SLUG" href="#"><span>EMOJI</span> Título en Español</a></li>
```

The `data-section` value must match the filename (without `.html`) and the `id="section-SLUG"` in the HTML file.

---

## Pull request checklist

Before opening a PR, confirm:

- [ ] Content verified against official Anthropic docs (include URL in PR description)
- [ ] Section exists in both `en/sections/` and `es/sections/`
- [ ] Nav updated in both `en/index.html` and `es/index.html` (if new section)
- [ ] `id="section-SLUG"` matches filename and nav `data-section`
- [ ] No broken HTML (matching open/close tags)
- [ ] Code examples use `<pre><code>` — not markdown backticks
- [ ] Ran `/guardian SLUG` and addressed reported issues

---

## Updating the quiz

The quiz is in `en/sections/quiz.html` and `es/sections/quiz.html`. Each question uses:

```html
<div class="quiz-q" data-correct="b">
  <div class="q-text">N. Question text?</div>
  <div class="quiz-option" data-val="a">A) ...</div>
  <div class="quiz-option" data-val="b">B) ...</div>
  <div class="quiz-option" data-val="c">C) ...</div>
  <div class="quiz-option" data-val="d">D) ...</div>
  <div class="quiz-feedback"></div>
</div>
```

**Rules for quiz PRs:**
- Every answer must be verifiable against official docs — include the source URL in the PR
- Run `/guardian quiz` to check all existing answers before adding new ones
- Add the question in **both** `en/sections/quiz.html` and `es/sections/quiz.html`
- Update the question count in the callout at the top of the quiz section

---

## Reporting issues

If you find outdated content but don't want to fix it yourself, open an issue with:

- The section name
- What's wrong (the current text)
- What it should say (with the official source URL)

---

## Code of conduct

- Be respectful in reviews
- Cite your sources — no undocumented claims
- Prefer accuracy over completeness — a shorter correct section beats a longer wrong one
