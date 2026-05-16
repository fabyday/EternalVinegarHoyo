import { mkdir, readFile, writeFile } from "fs/promises";
import os from "os";
import path from "path";

const USER_SETTINGS_PATH = path.join(os.homedir(), ".bdih-launcher", "settings.json");

async function ensure_parent_directory(filePath: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
}

export async function readConfigFile(filePath: string): Promise<string> {
  return readFile(filePath, "utf-8");
}

export async function writeConfigFile(filePath: string, data: string): Promise<void> {
  await ensure_parent_directory(filePath);
  await writeFile(filePath, data, "utf-8");
}

export async function readUserSettings(): Promise<string> {
  return readConfigFile(USER_SETTINGS_PATH);
}

export async function writeUserSettings(data: string): Promise<void> {
  await writeConfigFile(USER_SETTINGS_PATH, data);
}
