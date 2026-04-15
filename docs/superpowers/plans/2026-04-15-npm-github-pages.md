# claude-chan: npm + GitHub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish claude-chan as an npm package and host a landing page at wpham1.github.io/claude-chan

**Architecture:** The repo root is the inner `claude-chan/` folder. A `docs/index.html` is added for GitHub Pages (served from the `docs/` folder on main). npm publish is manual (user has to create account + login first).

**Tech Stack:** Node.js, vanilla HTML/CSS, GitHub Pages, npm

---

### Task 1: Clean up directory structure

**Files:**
- The current working directory is `/home/walter/Code/claude-chan/claude-chan/` (inner folder — this becomes the repo root)
- The outer `/home/walter/Code/claude-chan/` and `__MACOSX/` are junk from the zip and will be left behind

- [ ] **Step 1: Verify the inner folder is self-contained**

```bash
ls /home/walter/Code/claude-chan/claude-chan/
```
Expected output: `bin  lib  docs  package.json  README.md  LICENSE  .gitignore`

- [ ] **Step 2: Check .gitignore contents**

```bash
cat /home/walter/Code/claude-chan/claude-chan/.gitignore
```
Make sure `node_modules` is listed. If not, add it.

- [ ] **Step 3: Init git repo in the inner folder**

```bash
cd /home/walter/Code/claude-chan/claude-chan
git init
git add .
git commit -m "feat: initial commit"
```

---

### Task 2: Create GitHub repo and push

- [ ] **Step 1: Create the repo on GitHub**

```bash
gh repo create wpham1/claude-chan --public --description "Weeb-ify your Claude Code with anime-themed spinner verbs, tips, and kaomoji status line" --source /home/walter/Code/claude-chan/claude-chan --remote origin --push
```

If `gh` isn't authenticated, run `gh auth login` first.

- [ ] **Step 2: Verify push succeeded**

```bash
cd /home/walter/Code/claude-chan/claude-chan
git log --oneline
git remote -v
```
Expected: one commit, origin pointing to github.com/wpham1/claude-chan

---

### Task 3: Build the landing page

**Files:**
- Create: `docs/index.html`

- [ ] **Step 1: Create `docs/index.html`**

Create `/home/walter/Code/claude-chan/claude-chan/docs/index.html` with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>claude-chan (*^_^*)</title>
  <style>
    :root {
      --primary: #00d4ff;
      --accent: #ff79c6;
      --success: #50fa7b;
      --highlight: #80ffff;
      --bg: #0d1117;
      --surface: #161b22;
      --surface2: #21262d;
      --text: #e6edf3;
      --muted: #8b949e;
      --border: #30363d;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Segoe UI', system-ui, sans-serif;
      line-height: 1.6;
    }

    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ── Layout ── */
    .container { max-width: 860px; margin: 0 auto; padding: 0 24px; }

    /* ── Hero ── */
    .hero {
      text-align: center;
      padding: 80px 24px 60px;
      border-bottom: 1px solid var(--border);
    }

    .hero-kaomoji {
      font-size: 2rem;
      color: var(--primary);
      margin-bottom: 16px;
      letter-spacing: 0.1em;
    }

    .hero h1 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      color: var(--primary);
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }

    .hero p {
      font-size: 1.15rem;
      color: var(--muted);
      max-width: 520px;
      margin: 0 auto 40px;
    }

    /* ── Install box ── */
    .install-box {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 20px;
      font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
      font-size: 1.1rem;
    }

    .install-cmd { color: var(--highlight); }

    .copy-btn {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--muted);
      cursor: pointer;
      font-size: 0.8rem;
      padding: 4px 10px;
      transition: all 0.15s;
    }

    .copy-btn:hover { background: var(--primary); color: var(--bg); border-color: var(--primary); }
    .copy-btn.copied { background: var(--success); color: var(--bg); border-color: var(--success); }

    /* ── Sections ── */
    section { padding: 60px 0; border-bottom: 1px solid var(--border); }
    section:last-of-type { border-bottom: none; }

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 24px;
    }

    /* ── Feature table ── */
    .features { width: 100%; border-collapse: collapse; }
    .features th, .features td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); }
    .features th { color: var(--muted); font-weight: 500; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .features td:first-child { color: var(--highlight); font-weight: 600; }
    .features td:last-child { color: var(--success); text-align: center; }

    /* ── Examples ── */
    .examples { display: flex; flex-direction: column; gap: 10px; }

    .example-line {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 16px;
      font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
      font-size: 0.9rem;
      color: var(--muted);
    }

    .example-line .verb { color: var(--primary); font-weight: 600; }
    .example-line .tip-face { color: var(--accent); }

    /* ── Theme swatches ── */
    .themes { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }

    .swatch {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .swatch-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .swatch-name { font-weight: 600; font-size: 0.9rem; }
    .swatch-desc { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }

    /* ── Status demo ── */
    .status-demo {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    }

    .status-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); }
    .status-row:last-child { border-bottom: none; }
    .status-face { color: var(--primary); font-size: 1.1rem; }
    .status-label { color: var(--muted); font-size: 0.85rem; }
    .status-bar { height: 6px; border-radius: 3px; flex: 1; margin: 0 16px; }

    /* ── Nav ── */
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      background: rgba(13,17,23,0.95);
      backdrop-filter: blur(8px);
      z-index: 10;
    }

    .nav-brand { font-weight: 700; color: var(--primary); font-size: 1.1rem; }
    .nav-links { display: flex; gap: 20px; }
    .nav-links a { color: var(--muted); font-size: 0.9rem; }
    .nav-links a:hover { color: var(--text); }

    /* ── Footer ── */
    footer {
      text-align: center;
      padding: 40px 24px;
      color: var(--muted);
      font-size: 0.85rem;
    }

    /* ── CTA button ── */
    .btn {
      display: inline-block;
      background: var(--primary);
      color: var(--bg);
      font-weight: 700;
      padding: 10px 22px;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: opacity 0.15s;
    }
    .btn:hover { opacity: 0.85; text-decoration: none; }
  </style>
</head>
<body>

<nav>
  <span class="nav-brand">(*^_^*) claude-chan</span>
  <div class="nav-links">
    <a href="#features">Features</a>
    <a href="#themes">Themes</a>
    <a href="https://github.com/wpham1/claude-chan">GitHub</a>
  </div>
</nav>

<!-- Hero -->
<div class="hero">
  <div class="hero-kaomoji">\(^o^)/</div>
  <h1>claude-chan</h1>
  <p>Weeb-ify your Claude Code terminal with anime spinner verbs, otaku tips, and a kaomoji status line.</p>

  <div class="install-box">
    <span class="install-cmd">npx claude-chan</span>
    <button class="copy-btn" onclick="copyInstall(this)">copy</button>
  </div>
</div>

<!-- Features -->
<section id="features">
  <div class="container">
    <h2>What it does</h2>
    <p style="color:var(--muted);margin-bottom:24px;">Three cosmetic changes to Claude Code. Nothing functional is touched — your permissions, hooks, and model settings stay exactly as they are.</p>
    <table class="features">
      <thead>
        <tr><th>Feature</th><th>What changes</th><th>Default</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Spinner verbs</td>
          <td>The action text while Claude thinks — <em>"Gathering chakra for 12s"</em></td>
          <td>On</td>
        </tr>
        <tr>
          <td>Otaku tips</td>
          <td>Rotating tips below the spinner — <em>"(^_~) Just according to keikaku."</em></td>
          <td>On</td>
        </tr>
        <tr>
          <td>Status line</td>
          <td>Kaomoji face that reacts to context usage: <code>(^_^) → (o_o) → (&gt;_&lt;) → (x_x)</code></td>
          <td>Off</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<!-- Examples -->
<section>
  <div class="container">
    <h2>\(^o^)/ Spinner verbs</h2>
    <div class="examples">
      <div class="example-line">⠋ <span class="verb">Activating bankai</span> for 3s</div>
      <div class="example-line">⠙ <span class="verb">Going plus ultra</span> for 7s</div>
      <div class="example-line">⠹ <span class="verb">Gathering chakra</span> for 12s</div>
      <div class="example-line">⠸ <span class="verb">Entering sage mode</span> for 2s</div>
      <div class="example-line">⠼ <span class="verb">Believing in the heart of the cards</span> for 5s</div>
      <div class="example-line">⠴ <span class="verb">Training arc in progress</span> for 18s</div>
    </div>

    <h2 style="margin-top:48px;">(*^_^*) Otaku tips</h2>
    <div class="examples">
      <div class="example-line"><span class="tip-face">(^_^)</span> A good senpai always reads the docs before asking.</div>
      <div class="example-line"><span class="tip-face">(*_*)</span> Omae wa mou debugged.</div>
      <div class="example-line"><span class="tip-face">(^_~)</span> Just according to keikaku. (Keikaku means plan.)</div>
      <div class="example-line"><span class="tip-face">(O_O)</span> Nani?! An unhandled exception?!</div>
      <div class="example-line"><span class="tip-face">(@_@)</span> El Psy Kongroo. The timeline where your build succeeds exists.</div>
    </div>
  </div>
</section>

<!-- Themes -->
<section id="themes">
  <div class="container">
    <h2>(o_o) Color themes</h2>
    <div class="themes">
      <div class="swatch">
        <div class="swatch-dot" style="background:#00d4ff;box-shadow:0 0 12px #00d4ff66"></div>
        <div><div class="swatch-name">Miku</div><div class="swatch-desc">Cyan & teal</div></div>
      </div>
      <div class="swatch">
        <div class="swatch-dot" style="background:#ff79c6;box-shadow:0 0 12px #ff79c666"></div>
        <div><div class="swatch-name">Sakura</div><div class="swatch-desc">Pink & magenta</div></div>
      </div>
      <div class="swatch">
        <div class="swatch-dot" style="background:#ffb86c;box-shadow:0 0 12px #ffb86c66"></div>
        <div><div class="swatch-name">Naruto</div><div class="swatch-desc">Orange & yellow</div></div>
      </div>
      <div class="swatch">
        <div class="swatch-dot" style="background:#bd93f9;box-shadow:0 0 12px #bd93f966"></div>
        <div><div class="swatch-name">Eva</div><div class="swatch-desc">Purple & green</div></div>
      </div>
      <div class="swatch">
        <div class="swatch-dot" style="background:#ff5555;box-shadow:0 0 12px #ff555566"></div>
        <div><div class="swatch-name">Demon Slayer</div><div class="swatch-desc">Red & dark</div></div>
      </div>
      <div class="swatch">
        <div class="swatch-dot" style="background:#6272a4;box-shadow:0 0 12px #6272a466"></div>
        <div><div class="swatch-name">Jujutsu Kaisen</div><div class="swatch-desc">Blue & purple</div></div>
      </div>
    </div>
    <p style="color:var(--muted);margin-top:20px;font-size:0.9rem;">Switch anytime: <code style="color:var(--highlight)">npx claude-chan --theme</code> &nbsp;·&nbsp; Create your own: <code style="color:var(--highlight)">npx claude-chan --theme create</code></p>
  </div>
</section>

<!-- Install -->
<section>
  <div class="container" style="text-align:center">
    <h2>Ready to weeb-ify?</h2>
    <p style="color:var(--muted);margin-bottom:32px;">Requires Claude Code + Node.js ≥ 18. No dependencies. No build step.</p>
    <div class="install-box" style="margin-bottom:24px">
      <span class="install-cmd">npx claude-chan</span>
      <button class="copy-btn" onclick="copyInstall(this)">copy</button>
    </div>
    <br><br>
    <a class="btn" href="https://github.com/wpham1/claude-chan">View on GitHub</a>
  </div>
</section>

<footer>
  MIT License · <a href="https://github.com/wpham1/claude-chan">github.com/wpham1/claude-chan</a>
</footer>

<script>
  function copyInstall(btn) {
    navigator.clipboard.writeText('npx claude-chan').then(() => {
      btn.textContent = 'copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 2000);
    });
  }
</script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
cd /home/walter/Code/claude-chan/claude-chan
git add docs/index.html
git commit -m "feat: add GitHub Pages landing page"
git push
```

---

### Task 4: Enable GitHub Pages

- [ ] **Step 1: Enable Pages via gh CLI**

```bash
gh api repos/wpham1/claude-chan/pages \
  --method POST \
  -f source[branch]=main \
  -f source[path]=/docs
```

- [ ] **Step 2: Verify it's live**

After ~60 seconds, open: https://wpham1.github.io/claude-chan

If not live yet, check: `gh api repos/wpham1/claude-chan/pages`

---

### Task 5: Prepare for npm publish

> **Note:** These steps require you to create an account at npmjs.com and run `npm login` first.

- [ ] **Step 1: Add homepage + repository fields to package.json**

Edit `/home/walter/Code/claude-chan/claude-chan/package.json` to:

```json
{
  "name": "claude-chan",
  "version": "1.0.0",
  "description": "Weeb-ify your Claude Code with anime-themed spinner verbs, tips, and status line",
  "homepage": "https://wpham1.github.io/claude-chan",
  "repository": {
    "type": "git",
    "url": "https://github.com/wpham1/claude-chan.git"
  },
  "bin": {
    "claude-chan": "./bin/cli.js"
  },
  "keywords": [
    "claude",
    "claude-code",
    "anime",
    "weeb",
    "otaku",
    "theme",
    "customization"
  ],
  "license": "MIT",
  "engines": {
    "node": ">=18"
  },
  "files": [
    "bin/",
    "lib/"
  ]
}
```

- [ ] **Step 2: Commit the updated package.json**

```bash
cd /home/walter/Code/claude-chan/claude-chan
git add package.json
git commit -m "chore: add homepage and repository fields"
git push
```

- [ ] **Step 3: (You do this) Create npm account and login**

1. Go to https://www.npmjs.com/signup and create an account
2. Run in terminal: `npm login`
3. Follow the prompts (it opens a browser for auth)

- [ ] **Step 4: Dry run to verify package contents**

```bash
cd /home/walter/Code/claude-chan/claude-chan
npm pack --dry-run
```

Expected output should list only: `bin/cli.js`, `lib/colors.js`, `lib/install.js`, `lib/theme.js`, `lib/uninstall.js`, `package.json`, `README.md`, `LICENSE`

The `docs/` folder should NOT appear (it's not in `files`). ✓

- [ ] **Step 5: Publish**

```bash
npm publish
```

Expected output: `+ claude-chan@1.0.0`

Verify: https://www.npmjs.com/package/claude-chan
