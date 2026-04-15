const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(require("os").homedir(), ".claude", ".claude-chan-config.json");

// ANSI escape helpers
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

const THEMES = {
  miku: {
    name: "Miku",
    description: "Cyan & teal — Hatsune Miku vibes",
    primary: "\x1b[36m",    // cyan
    accent: "\x1b[35m",     // magenta
    success: "\x1b[32m",    // green
    highlight: "\x1b[96m",  // bright cyan
  },
  sakura: {
    name: "Sakura",
    description: "Pink & soft magenta — cherry blossom energy",
    primary: "\x1b[35m",    // magenta
    accent: "\x1b[91m",     // bright red
    success: "\x1b[95m",    // bright magenta
    highlight: "\x1b[37m",  // white
  },
  naruto: {
    name: "Naruto",
    description: "Orange & yellow — believe it!",
    primary: "\x1b[33m",    // yellow
    accent: "\x1b[91m",     // bright red
    success: "\x1b[32m",    // green
    highlight: "\x1b[93m",  // bright yellow
  },
  eva: {
    name: "Eva",
    description: "Purple & green — Evangelion palette",
    primary: "\x1b[35m",    // magenta/purple
    accent: "\x1b[32m",     // green
    success: "\x1b[92m",    // bright green
    highlight: "\x1b[95m",  // bright magenta
  },
  demon: {
    name: "Demon Slayer",
    description: "Red & dark — breathe of the flame",
    primary: "\x1b[31m",    // red
    accent: "\x1b[33m",     // yellow
    success: "\x1b[91m",    // bright red
    highlight: "\x1b[93m",  // bright yellow
  },
  jujutsu: {
    name: "Jujutsu Kaisen",
    description: "Blue & purple — cursed energy",
    primary: "\x1b[34m",    // blue
    accent: "\x1b[35m",     // magenta
    success: "\x1b[94m",    // bright blue
    highlight: "\x1b[95m",  // bright magenta
  },
  none: {
    name: "None",
    description: "No colors — plain terminal output",
    primary: "",
    accent: "",
    success: "",
    highlight: "",
  },
};

// Named ANSI colors users can reference by name
const NAMED_COLORS = {
  black:          "\x1b[30m",
  red:            "\x1b[31m",
  green:          "\x1b[32m",
  yellow:         "\x1b[33m",
  blue:           "\x1b[34m",
  magenta:        "\x1b[35m",
  cyan:           "\x1b[36m",
  white:          "\x1b[37m",
  "bright-black":   "\x1b[90m",
  "bright-red":     "\x1b[91m",
  "bright-green":   "\x1b[92m",
  "bright-yellow":  "\x1b[93m",
  "bright-blue":    "\x1b[94m",
  "bright-magenta": "\x1b[95m",
  "bright-cyan":    "\x1b[96m",
  "bright-white":   "\x1b[97m",
};

function resolveColor(value) {
  if (!value) return "";
  return NAMED_COLORS[value] || value;
}

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveConfig(config) {
  const dir = path.dirname(CONFIG_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");
}

function getCustomThemes() {
  const config = loadConfig();
  const custom = {};
  if (config.customThemes) {
    for (const [key, t] of Object.entries(config.customThemes)) {
      custom[key] = {
        name: t.name || key,
        description: t.description || "Custom theme",
        primary: resolveColor(t.primary),
        accent: resolveColor(t.accent),
        success: resolveColor(t.success),
        highlight: resolveColor(t.highlight),
        isCustom: true,
      };
    }
  }
  return custom;
}

function getAllThemes() {
  return { ...THEMES, ...getCustomThemes() };
}

function getTheme() {
  const config = loadConfig();
  const themeName = config.theme || "miku";
  const all = getAllThemes();
  return all[themeName] || THEMES.miku;
}

function setTheme(themeName) {
  const all = getAllThemes();
  if (!all[themeName]) return false;
  const config = loadConfig();
  config.theme = themeName;
  saveConfig(config);
  return true;
}

function saveCustomTheme(key, theme) {
  const config = loadConfig();
  if (!config.customThemes) config.customThemes = {};
  config.customThemes[key] = {
    name: theme.name,
    description: theme.description,
    primary: theme.primary,
    accent: theme.accent,
    success: theme.success,
    highlight: theme.highlight,
  };
  config.theme = key;
  saveConfig(config);
}

// Color helper functions that use the active theme
function c(type, text) {
  const theme = getTheme();
  const color = theme[type];
  if (!color) return text;
  return `${color}${text}${RESET}`;
}

function primary(text) { return c("primary", text); }
function accent(text) { return c("accent", text); }
function success(text) { return c("success", text); }
function highlight(text) { return c("highlight", text); }
function bold(text) { return `${BOLD}${text}${RESET}`; }
function dim(text) { return `${DIM}${text}${RESET}`; }

module.exports = {
  THEMES,
  NAMED_COLORS,
  CONFIG_PATH,
  getAllThemes,
  getTheme,
  setTheme,
  saveCustomTheme,
  loadConfig,
  saveConfig,
  primary,
  accent,
  success,
  highlight,
  bold,
  dim,
};
