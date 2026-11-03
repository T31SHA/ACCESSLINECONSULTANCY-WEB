/** Usage: npm run admin:hash -- 'your-strong-password'  → paste output into ADMIN_PASSWORD_HASH */
import { randomBytes, scryptSync } from "node:crypto";

const pw = process.argv[2];
if (!pw || pw.length < 12) {
  console.error("Provide a password of at least 12 characters.");
  process.exit(1);
}
const salt = randomBytes(16);
console.log(`scrypt:${salt.toString("hex")}:${scryptSync(pw, salt, 64).toString("hex")}`);
