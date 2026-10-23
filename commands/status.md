---
description: ดูสถานะ Task Board, กิจกรรมทีม และ Decision ล่าสุดของทีม CryptozDev
---

# 📊 สถานะทีม CryptozDev Software House

อ่านไฟล์ใน `.cryptoz/` ของโปรเจกต์ปัจจุบัน (อย่าเรียก subagent — ข้อมูลอยู่ในไฟล์ทั้งหมด):

1. `.cryptoz/tasks.md` → แสดง Task Board เป็นตาราง: Task ID · Owner · Description สั้น · Status
2. `.cryptoz/chat/` → ข้อความล่าสุด 5-10 รายการ (ใครพูดอะไร เมื่อไร)
3. `.cryptoz/decisions/` → Decision ล่าสุด 3-5 รายการ (ชื่อ + สาระหนึ่งบรรทัด)
4. `.cryptoz/plan.md` → Milestone ถัดไปที่ยังไม่เสร็จ
5. `reports/security/` → Security findings ที่ยังไม่ได้แก้ (ถ้ามีรายงาน)

**ถ้าไม่พบ `.cryptoz/`** → แจ้งว่าทีมยังไม่เคยเริ่มงานในโปรเจกต์นี้ และแนะนำใช้ `/cryptoz:team <requirement>`

จบด้วยสรุปหนึ่งบรรทัด: ตอนนี้ทีมอยู่ขั้นไหน และสิ่งที่รอการตัดสินใจจากผู้ใช้คืออะไร
