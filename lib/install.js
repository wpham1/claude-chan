const fs = require("fs");
const path = require("path");
const { SPINNER_VERBS, SPINNER_TIPS, STATUS_LINE_SCRIPT, THEME_KEYS } = require("./theme");

const CLAUDE_DIR = path.join(require("os").homedir(), ".claude");
const SETTINGS_PATH = path.join(CLAUDE_DIR, "settings.json");
const BACKUP_PATH = path.join(CLAUDE_DIR, ".weeb-backup.json");
const STATUSLINE_PATH = path.join(CLAUDE_DIR, "weeb-statusline.sh");

function readSettings() {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  } catch {
    return {};
  }
}

function writeSettings(settings) {
  fs.mkdirSync(CLAUDE_DIR, { recursive: true });
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");
}

function backupExists() {
  try {
    fs.accessSync(BACKUP_PATH);
    return true;
  } catch {
    return false;
  }
}

function backup(settings) {
  // Don't overwrite an existing backup — it contains the original pre-weeb settings
  if (backupExists()) return;

  const existing = {};
  for (const key of THEME_KEYS) {
    if (key in settings) {
      existing[key] = settings[key];
    }
  }
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(existing, null, 2) + "\n");
}

function install({ dryRun = false, features = {} } = {}) {
  const { verbs = true, tips = true, statusLine = false } = features;
  const settings = readSettings();

  const themed = { ...settings };
  const installed = [];

  if (verbs) {
    themed.spinnerVerbs = SPINNER_VERBS;
    installed.push("spinnerVerbs");
  }
  if (tips) {
    themed.spinnerTipsOverride = SPINNER_TIPS;
    installed.push("spinnerTipsOverride");
  }
  if (statusLine) {
    themed.statusLine = {
      type: "command",
      command: STATUSLINE_PATH,
      refreshInterval: 5,
    };
    installed.push("statusLine");
  }

  if (dryRun) {
    return { before: settings, after: themed, installed };
  }

  backup(settings);

  if (statusLine) {
    fs.writeFileSync(STATUSLINE_PATH, STATUS_LINE_SCRIPT, { mode: 0o755 });
  }

  writeSettings(themed);

  return { before: settings, after: themed, installed };
}

module.exports = { install, SETTINGS_PATH, BACKUP_PATH, STATUSLINE_PATH };
