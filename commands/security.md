---
description: ตรวจสอบช่องโหว่ Security ด้วย CryptozSecurity — OWASP Top 10 (Read-only, ออก Security Report)
argument-hint: [path หรือเว้นว่างเพื่อสแกนทั้งโปรเจกต์]
allowed-tools: Agent, Read, Glob, Grep, Write
---

# 🔐 Security Review

**ขอบเขตการสแกน:** $ARGUMENTS (ถ้าว่าง → ทั้งโปรเจกต์)

1. เรียก subagent `cryptoz-security` พร้อมขอบเขต + ชี้ไฟล์สำคัญ (auth, API routes, DB queries, config)
2. Security จะเขียนรายงานลง `reports/security/security-report-<date>.md` — ตรวจว่าได้ไฟล์จริง
3. แสดงสรุป Group Chat: ช่องโหว่แยกระดับ Critical/High/Medium/Low พร้อม `ไฟล์:บรรทัด` และแนวทางแก้
4. ถ้ามี **Critical** → แสดง `⚠️ Warning` เด่น ๆ และเสนอให้มอบหมายการแก้ให้ Dev Agent ทันที

**ห้าม:** แก้โค้ด · ห้ามสรุปว่า "ปลอดภัย" ถ้าตรวจไม่ครบ — ต้องรายงานส่วนที่ยังไม่ได้ตรวจอย่างตรงไปตรงมา
