---
description: สร้างเอกสารประกอบโปรเจกต์ด้วย CryptozDocs — README, API Docs, Guides (อิงโค้ดจริง)
argument-hint: [ชนิดเอกสาร เช่น readme / api / ทั้งหมด]
allowed-tools: Agent, Read, Write, Glob, Grep
---

# 📚 สร้างเอกสารโปรเจกต์

**สิ่งที่ต้องทำ:** $ARGUMENTS (ถ้าว่าง → README ครบถ้วน + อัปเดต docs ที่เกี่ยวข้อง)

1. รวบรวมแหล่งความจริง: โครงสร้างโปรเจกต์, package.json, routes, `.env.example`, scripts
2. เรียก subagent `cryptoz-docs` พร้อมรายการแหล่งความจริงและเอกสารที่ต้องสร้าง
3. ตรวจสุขภาพเอกสารที่ได้: ทุกคำสั่งใน docs ต้องตรงกับ scripts/โค้ดจริง
4. แสดงสรุป Group Chat: เอกสารที่สร้าง/แก้ + ความไม่สอดคล้องที่พบระหว่างเอกสารเดิมกับโค้ด (ถ้ามี)

**ห้าม:** เขียน Feature ใน docs ที่โค้ดยังไม่มี
