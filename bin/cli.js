#!/usr/bin/env node

const readline = require("readline");
const { install, SETTINGS_PATH } = require("../lib/install");
const { uninstall } = require("../lib/uninstall");
const { THEMES, NAMED_COLORS, getAllThemes, setTheme, getTheme, saveCustomTheme, primary, accent, success, highlight, bold, dim } = require("../lib/colors");

const pkg = require("../package.json");

const args = process.argv.slice(2);
const flag = args[0];

// --- Version ---

if (flag === "--version" || flag === "-v" || flag === "-V") {
  console.log(`claude-chan v${pkg.version}`);
  process.exit(0);
}

// --- Help ---

if (flag === "--help" || flag === "-h") {
  console.log(`
  ${accent("(*^_^*)")} ${bold("claude-chan")} ${dim(`v${pkg.version}`)} - Weeb-ify your Claude Code

  ${bold("Usage:")}
    npx claude-chan                 ${accent("\\(^o^)/")} Interactive install wizard
    npx claude-chan --all           ${accent("(*_*)")}   Install everything, no questions
    npx claude-chan --theme         ${accent("(o_o)")}   Change color theme
    npx claude-chan --theme create  ${accent("(*_*)")}   Create your own theme
    npx claude-chan --uninstall     ${accent("(;_;)")}   Remove theme (keeps color config)
    npx claude-chan --purge         ${accent("(x_x)")}   Remove everything including config
    npx claude-chan --preview       ${accent("(o_o)")}   Preview changes without applying
    npx claude-chan --version       ${accent("(~_^)")}   Show version
    npx claude-chan --help          ${accent("(~_^)")}   Show this help
  `);
  process.exit(0);
}

// --- Uninstall ---

if (flag === "--uninstall" || flag === "--remove" || flag === "--purge") {
  const purge = flag === "--purge";
  const result = uninstall({ purge });

  if (!result.restored) {
    console.log(`\n  ${accent("(T_T)")} ${result.reason}. Nothing to uninstall.\n`);
    process.exit(1);
  }

  console.log(`
  ${accent("(;_;)")} ${primary("Sayonara, weeb mode...")}

  Your Claude Code settings have been restored.
  ${result.hadBackup ? `  ${success("(^_^)")} Original settings recovered from backup.` : `  ${accent("(o_o)")} Theme keys removed (no backup found, using defaults).`}
  ${result.purged ? `  ${accent("(x_x)")} Color config and custom themes removed.` : `  ${dim("(~_^) Color config kept. Use --purge to remove everything.")}`}

  Settings: ${dim(SETTINGS_PATH)}
  ${accent("\\(^o^)/")} To re-activate: ${highlight("npx claude-chan")}
  `);
  process.exit(0);
}

// --- Preview ---

if (flag === "--preview" || flag === "--dry-run") {
  const { before, installed } = install({ dryRun: true, features: { verbs: true, tips: true, statusLine: true } });

  console.log(`\n  ${accent("(o_o)")} ${bold("Preview")} - these changes would be applied:\n`);

  const labels = {
    spinnerVerbs: ["\\(^o^)/", "Anime spinner verbs"],
    spinnerTipsOverride: ["(*^_^*)", "Otaku tips"],
    statusLine: ["(o_o)", "Kaomoji status line"],
  };
  for (const key of installed) {
    const [icon, label] = labels[key];
    const had = key in before;
    console.log(`  ${accent(icon)} ${primary(label)}: ${had ? "would overwrite existing" : "would add"}`);
  }

  console.log(`\n  Settings: ${dim(SETTINGS_PATH)}`);
  console.log(`  ${accent("(~_^)")} Run without --preview to apply.\n`);
  process.exit(0);
}

// --- Theme picker ---

if (flag === "--theme" || flag === "--colors") {
  const themeArg = args[1];

  // Create custom theme: npx claude-chan --theme create
  if (themeArg === "create" || themeArg === "new") {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askLine = (q) => new Promise((r) => rl.question(q, r));

    const colorNames = Object.keys(NAMED_COLORS);

    console.log(`
  ${accent("(*^_^*)")} ${bold("Create a Custom Theme")}

  ${bold("Available colors:")}
  ${colorNames.map((c) => `${NAMED_COLORS[c]}${c}\x1b[0m`).join(", ")}
`);

    (async () => {
      const name = await askLine("  Theme name: ");
      const key = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const description = await askLine("  Description (one line): ");

      console.log(`\n  Pick a color for each role (press Enter for default):\n`);

      const pickColor = async (role, defaultColor) => {
        const answer = (await askLine(`  ${role} [${defaultColor}]: `)).trim().toLowerCase();
        return answer || defaultColor;
      };

      const p = await pickColor("primary   (main text, headings)", "cyan");
      const a = await pickColor("accent    (kaomoji, emphasis)", "magenta");
      const s = await pickColor("success   (confirmations)", "green");
      const h = await pickColor("highlight (commands, paths)", "bright-cyan");

      rl.close();

      const theme = { name, description, primary: p, accent: a, success: s, highlight: h };
      saveCustomTheme(key, theme);

      const resolved = getAllThemes()[key];
      console.log(`
  ${resolved.primary || ""}(*^_^*)\x1b[0m Custom theme ${resolved.primary || ""}${name}\x1b[0m created and activated!

  Stored in: ${dim("~/.claude/.claude-chan-config.json")}
  Switch back anytime: ${highlight("npx claude-chan --theme")}
`);
    })();

    return;
  }

  const allThemes = getAllThemes();

  // Direct set: npx claude-chan --theme miku
  if (themeArg) {
    if (!allThemes[themeArg]) {
      console.log(`\n  ${accent("(o_O)")} Unknown theme: ${themeArg}`);
      console.log(`  Available: ${Object.keys(allThemes).join(", ")}\n`);
      process.exit(1);
    }
    setTheme(themeArg);
    const t = allThemes[themeArg];
    console.log(`\n  ${t.primary}(*^_^*)\x1b[0m Color theme set to ${t.primary}${t.name}\x1b[0m!\n`);
    process.exit(0);
  }

  // Interactive picker
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const current = getTheme();
  console.log(`\n  ${accent("(*^_^*)")} ${bold("Color Theme Picker")}\n`);

  const themeKeys = Object.keys(allThemes);
  themeKeys.forEach((key, i) => {
    const t = allThemes[key];
    const marker = t.name === current.name ? " <-- current" : "";
    const custom = t.isCustom ? " (custom)" : "";
    console.log(`  ${t.primary || "\x1b[0m"}${i + 1}. ${t.name}${custom}\x1b[0m — ${t.description}${dim(marker)}`);
  });

  console.log(`\n  ${dim(`Or run: npx claude-chan --theme create`)}\n`);

  rl.question(`  Pick a theme [1-${themeKeys.length}]: `, (answer) => {
    rl.close();
    const idx = parseInt(answer, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= themeKeys.length) {
      console.log(`\n  ${accent("(o_O)")} Invalid choice. No changes made.\n`);
      process.exit(1);
    }

    const chosen = themeKeys[idx];
    setTheme(chosen);
    const t = allThemes[chosen];
    console.log(`\n  ${t.primary || ""}(*^_^*)\x1b[0m Color theme set to ${t.primary || ""}${t.name}\x1b[0m!\n`);
  });

  return;
}

// --- Unknown flag ---

if (flag && flag.startsWith("-") && !["--all"].includes(flag)) {
  console.error(`\n  ${accent("(o_O)")} Unknown option: ${flag}\n  Run with --help for usage.\n`);
  process.exit(1);
}

// --- Wizard ---

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const a = answer.trim().toLowerCase();
      resolve(a === "" || a === "y" || a === "yes");
    });
  });
}

function askChoice(rl, question, max) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const idx = parseInt(answer.trim(), 10) - 1;
      resolve(isNaN(idx) || idx < 0 || idx >= max ? 0 : idx);
    });
  });
}

async function wizard() {
  console.log(`
  ${accent("(*^_^*)")} ${bold("claude-chan setup wizard")}
  ${primary("─────────────────────────────────")}
  Choose which features to install.
  Press Enter to accept the default.
  `);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Feature selection
  const verbs = await ask(rl, `  ${accent("\\(^o^)/")} Anime spinner verbs? [Y/n] `);
  const tips = await ask(rl, `  ${accent("(*^_^*)")} Otaku tips? [Y/n] `);
  const statusLine = await ask(rl, `  ${accent("(o_o)")}   Kaomoji status line? [Y/n] `);

  // Color theme selection
  const allThemes = getAllThemes();
  console.log(`\n  ${accent("(*^_^*)")} ${bold("Pick a color theme:")}\n`);
  const themeKeys = Object.keys(allThemes);
  themeKeys.forEach((key, i) => {
    const t = allThemes[key];
    const custom = t.isCustom ? " (custom)" : "";
    console.log(`  ${t.primary || "\x1b[0m"}${i + 1}. ${t.name}${custom}\x1b[0m — ${t.description}`);
  });
  console.log();

  const themeIdx = await askChoice(rl, `  Choice [1-${themeKeys.length}] (default: 1 Miku): `, themeKeys.length);

  rl.close();

  // Apply color theme
  const chosenTheme = themeKeys[themeIdx];
  setTheme(chosenTheme);
  const t = allThemes[chosenTheme];

  if (!verbs && !tips && !statusLine) {
    console.log(`\n  ${t.primary || ""}(T_T)\x1b[0m Nothing selected... maybe next time, senpai.`);
    console.log(`  ${t.primary || ""}(~_^)\x1b[0m At least your color theme is set to ${t.primary || ""}${t.name}\x1b[0m!\n`);
    process.exit(0);
  }

  const { after, installed } = install({ features: { verbs, tips, statusLine } });

  const summary = [];
  if (installed.includes("spinnerVerbs")) {
    summary.push(`    ${t.primary || ""}\\(^o^)/\x1b[0m ${after.spinnerVerbs.verbs.length} anime spinner verbs`);
  }
  if (installed.includes("spinnerTipsOverride")) {
    summary.push(`    ${t.primary || ""}(*^_^*)\x1b[0m ${after.spinnerTipsOverride.tips.length} otaku tips`);
  }
  if (installed.includes("statusLine")) {
    summary.push(`    ${t.primary || ""}(o_o)\x1b[0m   Kaomoji status line`);
  }
  summary.push(`    ${t.primary || ""}(~_^)\x1b[0m   ${t.name} color theme`);

  console.log(`
  ${t.primary || ""}\\(^o^)/\x1b[0m ${t.primary || ""}\x1b[1mWeeb mode: ACTIVATED!\x1b[0m

  Installed:
${summary.join("\n")}

  Settings: ${dim(SETTINGS_PATH)}
  Backup:   ${dim("~/.claude/.weeb-backup.json")}

  ${t.primary || ""}(~_^)\x1b[0m To undo: ${highlight("npx claude-chan --uninstall")}
  ${t.primary || ""}(o_o)\x1b[0m Change colors: ${highlight("npx claude-chan --theme")}
`);
}

// --all skips the wizard
if (flag === "--all") {
  const { after } = install({ features: { verbs: true, tips: true, statusLine: true } });

  console.log(`
  ${accent("(*^_^*)")} ${bold("Weeb mode: ACTIVATED!")} (full install)

  Your Claude Code has been powered up with:
    ${accent("\\(^o^)/")} ${after.spinnerVerbs.verbs.length} anime spinner verbs
    ${accent("(*^_^*)")} ${after.spinnerTipsOverride.tips.length} otaku tips
    ${accent("(o_o)")}   Kaomoji status line

  Settings: ${dim(SETTINGS_PATH)}
  Backup:   ${dim("~/.claude/.weeb-backup.json")}

  ${accent("(~_^)")} To undo: ${highlight("npx claude-chan --uninstall")}
  ${accent("(o_o)")} Change colors: ${highlight("npx claude-chan --theme")}
`);
} else {
  wizard();
}
