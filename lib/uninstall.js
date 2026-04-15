const fs = require("fs");
const { THEME_KEYS } = require("./theme");
const { SETTINGS_PATH, BACKUP_PATH, STATUSLINE_PATH } = require("./install");
const { CONFIG_PATH } = require("./colors");

function readBackup() {
  try {
    return JSON.parse(fs.readFileSync(BACKUP_PATH, "utf8"));
  } catch {
    return null;
  }
}

function uninstall({ purge = false } = {}) {
  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  } catch {
    return { restored: false, reason: "No settings file found" };
  }

  const backup = readBackup();

  // Remove all theme keys
  for (const key of THEME_KEYS) {
    delete settings[key];
  }

  // Restore backed-up values if they existed
  if (backup) {
    Object.assign(settings, backup);
  }

  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");

  // Clean up backup and statusline script
  try { fs.unlinkSync(BACKUP_PATH); } catch {}
  try { fs.unlinkSync(STATUSLINE_PATH); } catch {}

  // Purge removes color config too
  if (purge) {
    try { fs.unlinkSync(CONFIG_PATH); } catch {}
  }

  return { restored: true, hadBackup: !!backup, purged: purge };
}

module.exports = { uninstall };
