---
description: เปิด AUTO MODE — ทุก prompt ถูกจัดการผ่านทีม CryptozDev อัตโนมัติ (persist ข้ามเซสชัน)
allowed-tools: Write, Read
---

# 🟢 เปิด CryptozDev AUTO MODE

1. เปิดโหมดโดยสร้างไฟล์ flag: เขียนข้อความ `on` ลงไฟล์ `~/.claude/cryptoz-auto-mode.flag`
   (Windows ใช้ path เต็ม เช่น `C:\Users\<ชื่อผู้ใช้>\.claude\cryptoz-auto-mode.flag` — ถ้าโฟลเดอร์ `.claude` ยังไม่มีให้สร้างก่อน)
2. ยืนยันกับผู้ใช้แบบสั้น ๆ:

   > 🟢 **AUTO MODE: ON** — ตั้งแต่ตอนนี้ ทุกโจทย์ที่คุณพิมพ์จะถูกจัดการผ่านทีม CryptozDev (วิเคราะห์ → subagents → review/test → รายงาน) อัตโนมัติ ทั้งเซสชันนี้และทุกเซสชันถัดไป
   > ปิดได้ทุกเมื่อ: `/cryptoz:off`

หมายเหตุ: hook `UserPromptSubmit` ของ plugin จะอ่านไฟล์ flag นี้เองทุกครั้งที่ผู้ใช้ส่งข้อความ — ไม่ต้องตั้งค่าอื่นเพิ่ม และการเปิดค้างไว้จะยังผลกับทุกโปรเจกต์จนกว่าจะสั่งปิด
