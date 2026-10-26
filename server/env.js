import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const fileName of [".env.local", ".env"]) {
  const filePath = path.join(root, fileName);
  if (fs.existsSync(filePath)) process.loadEnvFile(filePath);
}
