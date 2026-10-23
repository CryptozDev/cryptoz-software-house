---
description: เปิด Real-time Dashboard ดูทีมทำงานสด → http://localhost:5175
allowed-tools: Bash, Glob, Read
---

# 🖥️ เปิด CryptozDev Dashboard

เป้าหมาย: start dashboard server แบบ background แล้วบอก URL ให้ผู้ใช้เปิดเบราว์เซอร์

## ขั้นที่ 1 — เช็กว่ารันอยู่แล้วหรือยัง

```bash
curl -s --max-time 2 http://localhost:5175/api/health
```

- ถ้าตอบ JSON กลับมา → server รันอยู่แล้ว ข้ามไปขั้นที่ 3 ทันที
- ถ้าเงียบ/error → ไปขั้นที่ 2

## ขั้นที่ 2 — หาไฟล์ server แล้ว start แบบ background

หาไฟล์ `dashboard/server/index.mjs` ตามลำดับ ใช้ตัวแรกที่เจอ:

1. ตัวแปรแวดล้อม `CRYPTOZ_DASHBOARD_SERVER` (ถ้าผู้ใช้ตั้งไว้)
2. ค้นใน plugin cache ของ Claude Code: ใช้ Glob หา `~/.claude/plugins/cache/**/dashboard/server/index.mjs`
3. ถ้าเซสชันนี้ถูกเมาท์ผ่าน `--plugin-dir` / `CLAUDE_PLUGIN_DIRS`: ลอง `${CLAUDE_PLUGIN_ROOT}/dashboard/server/index.mjs`
4. ถ้ายังไม่เจอ: ถามผู้ใช้ว่า clone repo ไว้ที่ไหน

แล้ว start **แบบ background (อย่ารอจบ process)**:

```bash
node "<path ที่เจอ>/dashboard/server/index.mjs" --project "<cwd ปัจจุบันของเซสชันนี้>"
```

⚠️ สำคัญ: `--project` ต้องเป็น**โฟลเดอร์โปรเจกต์ที่ทีมทำงาน** (cwd ปัจจุบัน — ที่ที่จะมี `.cryptoz/`) **ไม่ใช่**โฟลเดอร์ plugin

ถ้าพอร์ตชน (EADDRINUSE) ให้รันใหม่ด้วย `PORT=5176` และใช้ URL ตามพอร์ตนั้น

## ขั้นที่ 3 — ยืนยันและแจ้งผู้ใช้

1. `curl -s --max-time 3 http://localhost:5175/api/health` (หรือพอร์ตที่ใช้) — ต้องได้ JSON
2. แจ้งผู้ใช้แบบสั้น ๆ:

   > 🖥️ **Dashboard พร้อมแล้ว: http://localhost:5175**
   > 👥 Agent Status · 💬 Group Chat · 📋 Task Board · 📜 Decision Log — อัปเดตสดขณะทีมทำงาน ไม่ต้อง refresh
   > โจทย์ที่รออยู่ใน dashboard นี้คือของโปรเจกต์: `<cwd>`

3. ถ้ายังไม่มี `.cryptoz/` ในโปรเจกต์ dashboard จะขึ้นหน้าว่าง — แนะนำผู้ใช้เริ่ม `/cryptoz:team <โจทย์>` แล้วหน้าจอจะเริ่มไหลเอง

หมายเหตุ: ถ้าเครื่องไม่มี Node.js 18+ ให้แจ้งผู้ใช้ติดตั้งก่อน (https://nodejs.org)
