#!/usr/bin/env node
/**
 * Start Android emulator without opening Android Studio.
 * Uses ANDROID_HOME or default Windows SDK path.
 *
 * Usage:
 *   npm run emulator              -- start first available AVD
 *   npm run emulator -- <AVD_NAME> -- start specific AVD
 */

const { execSync, spawn } = require("child_process");
const path = require("path");
const os = require("os");

function getEmulatorPath() {
  const isWindows = os.platform() === "win32";
  const exe = isWindows ? "emulator.exe" : "emulator";
  const env = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (env) {
    return path.join(env, "emulator", exe);
  }
  if (isWindows) {
    const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || "", "AppData", "Local");
    return path.join(localAppData, "Android", "Sdk", "emulator", exe);
  }
  return "emulator";
}

function listAvds(emulatorPath) {
  try {
    const out = execSync(emulatorPath, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
    // execSync with array form for safe path handling
    const out2 = execSync(`"${emulatorPath}" -list-avds`, { encoding: "utf8" });
    return out
      .trim()
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch (e) {
    console.error("Could not list AVDs. Is Android SDK installed and ANDROID_HOME set?");
    console.error(e.message);
    process.exit(1);
  }
}

const emulatorPath = getEmulatorPath();
const avdArg = process.argv[2];

let avdToStart = avdArg;
if (!avdToStart) {
  const avds = listAvds(emulatorPath);
  if (avds.length === 0) {
    console.error("No AVDs found. Create one in Android Studio: Device Manager → Create Device.");
    process.exit(1);
  }
  avdToStart = avds[0];
  console.log("Starting AVD:", avdToStart);
  if (avds.length > 1) {
    console.log("Other AVDs:", avds.slice(1).join(", "));
    console.log("To start a specific AVD: npm run emulator -- <AVD_NAME>");
  }
}

const child = spawn(emulatorPath, ["-avd", avdToStart], {
  stdio: "inherit",
  detached: os.platform() !== "win32",
});
if (child.unref) child.unref();
