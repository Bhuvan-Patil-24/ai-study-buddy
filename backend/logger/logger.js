import fs from "fs";
import path from "path";

const logPath = path.resolve("logs");
if (!fs.existsSync(logPath)) fs.mkdirSync(logPath);

const logFile = fs.createWriteStream(path.join(logPath, "app.log"), {
  flags: "a",
});

export const logger = {
  info: (msg) => logFile.write(`[INFO] ${new Date().toISOString()} - ${msg}\n`),
  error: (msg) =>
    logFile.write(`[ERROR] ${new Date().toISOString()} - ${msg}\n`),
};
