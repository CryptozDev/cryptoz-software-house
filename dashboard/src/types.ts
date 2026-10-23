// ชนิดข้อมูลที่ server ส่งผ่าน Socket.IO — ต้องตรงกับ parser ใน server/index.mjs
export interface Task {
  id: string;
  agent: string;
  description: string;
  dependencies: string;
  criteria: string;
  status: string;
  artifacts: string;
  verification: string;
}

export interface ChatMessage {
  emoji: string;
  agent: string;
  role: string;
  time: string;
  type: string;
  task?: string;
  status?: string;
  text: string;
}

export interface ChatDay {
  day: string;
  messages: ChatMessage[];
}

export interface Decision {
  file: string;
  title: string;
}

export interface AgentInfo {
  id: string;
  emoji: string;
  name: string;
  title: string;
  lastType?: string;
  lastTime?: string;
  lastStatus?: string;
}

export interface Snapshot {
  hasCryptoz: boolean;
  project: string;
  agents: AgentInfo[];
  tasks: Task[];
  chats: ChatDay[];
  decisions: Decision[];
}
