#!/usr/bin/env node
/**
 * Cryptoz Safety Guard — PreToolUse Hook
 * บล็อกคำสั่ง Bash ที่สร้างความเสียหายรุนแรง (Destructive Ops)
 * ทำงานที่ระดับ Engine: อ่าน JSON จาก stdin → ถ้าพบ pattern ต้องห้าม
 * ให้เขียนเหตุผลลง stderr แล้ว exit 2 (Claude Code จะบล็อก tool call นั้น)
 */
let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(raw || "{}");
    if (input.tool_name !== "Bash") process.exit(0);
    const cmd = String((input.tool_input && input.tool_input.command) || "");

    const rules = [
      { re: /rm\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*[rfRF]{2,}|rm\s+-[a-zA-Z]*r[^ ]*f|rm\s+-[a-zA-Z]*f[^ ]*r/i,
        only: /(^|\s)(\/|~|\/\*|\$HOME|\/home|\/etc|\/usr|\/var|C:\/?(\s|$)|W:\/?(\s|$))/i,
        msg: "ลบไฟล์แบบ recursive/force ที่ root/home หรือไดรฟ์ราก — ห้ามทำ" },
      { re: /\bgit\s+push\b[^|]*\s(--force|-f)\b/i,
        msg: "git push --force ต้องได้รับอนุมัติจากผู้ใช้ก่อนเสมอ" },
      { re: /\b(drop\s+database|drop\s+schema)\b/i,
        msg: "การ DROP DATABASE ทำลายข้อมูลทั้งหมด — ห้ามรัน ให้เสนอแผนยืนยันกับผู้ใช้แทน" },
      { re: /\b(mkfs(\.\w+)?|dd\s+[^|]*of=\/dev\/(sd|nvme|disk))\b/i,
        msg: "การ format/dump ลง block device โดยตรง — ห้ามทำ" },
      { re: /\b(shutdown|reboot|halt|poweroff)\b/i,
        msg: "คำสั่งปิด/รีสตาร์ทเครื่อง — ห้ามทำ" },
      { re: /:\(\)\s*\{.*\};\s*:/,
        msg: "Fork bomb — ห้ามทำ" },
      { re: /\bformat\s+[a-zA-Z]:\\?(\s|$)/i,
        msg: "format ไดรฟ์ — ห้ามทำ" },
      { re: /\bdel\s+(\/[sq]+\s+)+[a-zA-Z]:\\?(\s|$)/i,
        msg: "del แบบ recursive ที่รากไดรฟ์ Windows — ห้ามทำ" },
      { re: /\brd\s+\/s\s+\/q\s+[a-zA-Z]:\\?(\s|$)/i,
        msg: "ลบไดเรกทอรีรากไดรฟ์ Windows — ห้ามทำ" },
      { re: />\s*\/dev\/sd[a-z]/i,
        msg: "เขียนทับ block device โดยตรง — ห้ามทำ" },
      { re: /\bchmod\s+-R\s+0{3}\s+\//i,
        msg: "chmod 000 แบบ recursive ที่ root — ห้ามทำ" },
    ];

    for (const rule of rules) {
      if (rule.re.test(cmd) && (!rule.only || rule.only.test(cmd))) {
        process.stderr.write(
          `[Cryptoz Safety Guard] ⛔ บล็อกคำสั่ง: ${cmd.slice(0, 200)}\n` +
          `เหตุผล: ${rule.msg}\n` +
          `หากจำเป็นจริง ให้อธิบายผู้ใช้และขออนุมัติก่อนเสมอ\n`
        );
        process.exit(2);
      }
    }
    process.exit(0);
  } catch (e) {
    // hook ต้องไม่เป็นสาเหตุให้ workflow ล้ม — ปล่อยผ่านเสมอเมื่อ parse ไม่ได้
    process.exit(0);
  }
});
