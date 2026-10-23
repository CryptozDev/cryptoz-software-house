---
description: สร้างและรัน Test Suite ด้วย CryptozTest — Evidence-Based (ผลจากการรันจริงเท่านั้น)
argument-hint: [ขอบเขต เช่น backend / frontend / ไฟล์ที่ต้องการ]
allowed-tools: Agent, Read, Write, Bash, Glob, Grep
---

# 🧪 สร้างและรัน Test Suite

**ขอบเขต:** $ARGUMENTS (ถ้าว่าง → ครอบคลุมโค้ดหลักของโปรเจกต์)

1. ตรวจก่อนว่าโปรเจกต์มี test runner อะไร และ Acceptance Criteria อยู่ที่ไหน (`docs/requirements.md`)
2. เรียก subagent `cryptoz-test` พร้อมขอบเขต + ชี้แหล่ง Acceptance Criteria
3. แสดงผลเป็น Group Chat `🧪 Test Result`:
   - คำสั่งที่รัน (ครบ ตามที่รันจริง)
   - จำนวนผ่าน/ล้มเหลว จาก output จริง
   - รายชื่อ failing tests + Bug Reports ถ้ามี
4. หากรันไม่ได้ → รายงานเหตุผลตรง ๆ **ห้ามสรุปแทนการรัน**

**ห้าม:** แก้ source code เพื่อให้ test ผ่าน — ให้รายงาน Lead/ผู้ใช้แทน
