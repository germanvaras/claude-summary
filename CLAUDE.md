# Claude Resources — Project Context

## What this project is

An open-source, bilingual (Spanish + English) documentation and reference site for **Claude Code** (Anthropic's CLI tool). Anyone can contribute new sections, fix outdated content, or improve translations.

## Repository structure

```
claude-summary/
├── index.html                  # Root: language-detection redirect
├── script.js                   # SPA logic: section loading, search, quiz
├── lang.js                     # Language switcher (localStorage)
├── styles.css                  # Design system (purple #A100FF theme)
├── en/
│   ├── index.html              # English entry point (navigation lives here)
│   └── sections/               # 24 English HTML section files
├── es/
│   ├── index.html              # Spanish entry point (navigation lives here)
│   └── sections/               # 24 Spanish HTML section files
├── CONTRIBUTING.md             # How to contribute
├── AGENTS.md                   # How to use the agent system
└── .claude/
    └── skills/
        ├── guardian/           # Guardian agent skill
        └── content-writer/     # Content Writer agent skill
```

## Section HTML format (template)

Every section file follows this exact structure. Never deviate from it:

```html
<div class="section" id="section-SLUG">
  <div class="section-header"><h2>EMOJI TITLE <span class="badge">SUBTITLE</span></h2></div>
  <div class="content">

    <!-- Optional intro callout -->
    <div class="callout tip"><span class="callout-icon">💡</span><div>CONTENT</div></div>

    <!-- Optional table -->
    <table>
      <thead><tr><th>Col A</th><th>Col B</th></tr></thead>
      <tbody>
        <tr><td>val</td><td>val</td></tr>
      </tbody>
    </table>

    <!-- Code block -->
    <pre><code>command --flag</code></pre>

    <!-- Step list -->
    <ol class="steps">
      <li><strong>Step title</strong> — explanation</li>
    </ol>

    <!-- Key-value definition list -->
    <ul class="def-list">
      <li><code>term</code> — definition</li>
    </ul>

  </div>
</div>
```

### Callout types
| Class | Use for |
|---|---|
| `callout tip` | Tips and best practices |
| `callout warn` | Warnings and gotchas |
| `callout info` | Neutral informational notes |
| `callout ok` | Confirmations / success states |
| `callout err` | Errors / danger zones |

## Navigation format (in `en/index.html` and `es/index.html`)

Each nav group has a label `<li>` followed by link `<li>` entries:

```html
<li style="padding: 8px 24px 4px; font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#555;">Group Label</li>
<li><a class="nav-link" data-section="SLUG" href="#"><span>EMOJI</span> Section Title</a></li>
```

The `data-section` attribute must match the section file name (without `.html`) and the `id="section-SLUG"` in the HTML file.

## Language conventions

- All content must exist in **both** `en/sections/` and `es/sections/`
- File names are **identical** in both language folders (e.g. `hooks.html` in both)
- Spanish is the primary language; English is a full translation (not a summary)
- Tone: technical but approachable, direct, no marketing fluff

## Official sources

Always verify content against these official sources before writing or modifying:
- **Claude Code docs**: https://docs.anthropic.com/en/docs/claude-code/overview
- **Claude Code settings**: https://docs.anthropic.com/en/docs/claude-code/settings
- **Claude models**: https://docs.anthropic.com/en/docs/about-claude/models/overview
- **MCP**: https://docs.anthropic.com/en/docs/claude-code/mcp
- **Hooks**: https://docs.anthropic.com/en/docs/claude-code/hooks
- **GitHub Actions / CI**: https://docs.anthropic.com/en/docs/claude-code/github-actions
- **Anthropic API reference**: https://docs.anthropic.com/en/api/

## Agent system

Two skills are available for contributors and maintainers:

| Skill | Trigger phrase | Purpose |
|---|---|---|
| `guardian` | `/guardian` | Validate one or all sections against official docs |
| `content-writer` | `/content-writer` | Add a new section or update an existing one |

See `AGENTS.md` for full usage instructions.

## What NOT to change without agent validation

- Model names, prices, or context window sizes
- CLI flag names and syntax
- Hook event names and payload fields
- MCP transport types and configuration keys
- Permission scope names

These change frequently. Always run `/guardian` before committing updates to these values.
