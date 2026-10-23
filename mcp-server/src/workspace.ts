// ตัวช่วยกลาง: path ของ Shared Memory และการเตรียม workspace ของโปรเจกต์
// MCP server ถูก spawn ด้วย cwd = โฟลเดอร์โปรเจกต์ของเซสชัน จึงอ้าง .cryptoz/ แบบ relative ได้
import fs from "node:fs";
import path from "node:path";

export function cryptozRoot(): string {
  return path.join(process.cwd(), ".cryptoz");
}

export function ensureWorkspace(): void {
  const root = cryptozRoot();
  fs.mkdirSync(path.join(root, "chat"), { recursive: true });
  fs.mkdirSync(path.join(root, "decisions"), { recursive: true });
}

export function localDate(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function nowHM(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, "-") // คงตัวอักษรไทยไว้ได้ แต่ slug เป็นอังกฤษปลอดภัยกว่า
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "untitled";
}

export function safeCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}

export function readIfExists(file: string): string | null {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
}
