// Test harness สำหรับ guard.js — รันเคสทั้ง allow และ deny
const { spawnSync } = require("child_process");
const path = require("path");

const cases = [
  ["format C:", 2],
  ["del /s /q C:\\", 2],
  ["rd /s /q C:\\", 2],
  ["rm -rf /", 2],
  ["rm -rf ./build", 0],
  ["npm test", 0],
  ["docker compose up -d", 0],
  ["git add .", 0],
  ["shutdown /s", 2],
  ["git push --force origin main", 2],
  ["DROP DATABASE hotel_db;", 2],
  ["SELECT * FROM users WHERE id = ?", 0],
];

let failed = 0;
for (const [cmd, expected] of cases) {
  const p = spawnSync(
    process.execPath,
    [path.join(__dirname, "guard.js")],
    { input: JSON.stringify({ tool_name: "Bash", tool_input: { command: cmd } }), encoding: "utf8" }
  );
  const ok = p.status === expected;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${p.status === 2 ? "BLOCKED" : "ALLOWED"}  <-  ${cmd}`);
}
console.log(failed === 0 ? "\nAll guard tests passed" : `\n${failed} test(s) FAILED`);
process.exit(failed === 0 ? 0 : 1);
