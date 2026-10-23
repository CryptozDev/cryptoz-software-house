#!/usr/bin/env node
/**
 * Cryptoz Activity Logger — PostToolUse Hook
 * บันทึกกิจกรรมของ Agents ลง .cryptoz/logs/activity.log
 * เงื่อนไข: บันทึกเฉพาะเมื่อโปรเจกต์มี .cryptoz/ อยู่แล้ว (โปรเจกต์ที่ใช้ทีม Cryptoz)
 * Hook นี้ต้องไม่เด้ง error ใด ๆ ออกไป — เงียบ ๆ ทำงานเสมอ
 */
let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  try {
    const fs = require("fs");
    const path = require("path");
    const root = process.cwd();
    const cryptozDir = path.join(root, ".cryptoz");
    if (!fs.existsSync(cryptozDir)) process.exit(0);

    const input = JSON.parse(raw || "{}");
    const ts = new Date().toISOString();
    const tool = input.tool_name || "?";
    let detail = "";
    const ti = input.tool_input || {};
    if (ti.file_path) detail = ti.file_path;
    else if (ti.command) detail = String(ti.command).slice(0, 120);
    else if (ti.pattern) detail = ti.pattern;
    else if (ti.prompt) detail = String(ti.prompt).slice(0, 120);

    const logDir = path.join(cryptozDir, "logs");
    fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(
      path.join(logDir, "activity.log"),
      `${ts}\t${tool}\t${detail}\n`
    );
  } catch (e) {
    // เงียบไว้เสมอ
  }
  process.exit(0);
});
