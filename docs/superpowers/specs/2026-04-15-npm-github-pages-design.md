# claude-chan: npm package + GitHub Pages design

Date: 2026-04-15

## Goal

Publish `claude-chan` as a public npm package and create a GitHub Pages landing page for it.

## Repo setup

- Inner `claude-chan/claude-chan/` becomes the repo root (discard outer wrapper and `__MACOSX/`)
- New GitHub repo: `github.com/wpham1/claude-chan`
- GitHub Pages served from the `docs/` folder on the `main` branch
- Public repo, MIT license (already present)

## Directory structure

```
claude-chan/
├── bin/cli.js
├── lib/
│   ├── colors.js
│   ├── install.js
│   ├── theme.js
│   └── uninstall.js
├── docs/
│   └── index.html
├── package.json
├── README.md
├── LICENSE
└── .gitignore
```

## Landing page (`docs/index.html`)

- Single self-contained HTML file, no external dependencies
- Content: hero kaomoji banner, one-line install (`npx claude-chan`) with copy button, feature table, spinner verb examples, color theme swatches, link to GitHub repo
- Styled inline with Miku cyan/teal palette — should feel like the CLI printed a webpage
- No build step, no CI

## npm publishing

- Package name: `claude-chan` (unscoped, confirmed available)
- Version: `1.0.0`
- `package.json` is already correctly structured (`name`, `bin`, `files`, `engines`)
- User will: create npmjs.com account, run `npm login`, run `npm publish`
- No build step required

## What is NOT in scope

- CI/CD pipeline
- Automated npm publish on git tag
- Multiple HTML pages
- Any change to the CLI code itself
