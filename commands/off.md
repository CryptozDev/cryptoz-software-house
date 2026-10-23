---
description: ปิด AUTO MODE — ทีมทำงานเฉพาะเมื่อเรียก /cryptoz:* เอง
allowed-tools: Bash, Read
---

# 🔴 ปิด CryptozDev AUTO MODE

1. ปิดโหมดโดยลบไฟล์ flag: `rm -f ~/.claude/cryptoz-auto-mode.flag`
   (ถ้า shell ปัจจุบันไม่มี rm ให้ใช้ cmd: `del "%USERPROFILE%\.claude\cryptoz-auto-mode.flag"`)
2. ตรวจสอบว่าไฟล์ถูกลบจริง แล้วยืนยันกับผู้ใช้แบบสั้น ๆ:

   > 🔴 **AUTO MODE: OFF** — ทีม CryptozDev จะทำงานเฉพาะเมื่อเรียกด้วยตนเอง เช่น `/cryptoz:team`, `/cryptoz:analyze`, `/cryptoz:review`
