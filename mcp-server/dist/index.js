#!/usr/bin/env node
// CryptozDev Software House — MCP Server
// Shared Memory tools ของทีม: Group Chat Log · Task Board · Decision Log · Shared Context
// ทำงานแบบ stdio — เชื่อมโดย Claude Code ผ่าน .mcp.json ที่ plugin root
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGroupChatTools } from "./tools/group-chat.js";
import { registerTaskBoardTools } from "./tools/task-board.js";
import { registerDecisionLogTools } from "./tools/decision-log.js";
import { registerContextTools } from "./memory/shared-context.js";
const server = new McpServer({
    name: "cryptoz",
    version: "0.1.0",
});
registerGroupChatTools(server);
registerTaskBoardTools(server);
registerDecisionLogTools(server);
registerContextTools(server);
await server.connect(new StdioServerTransport());
console.error("[cryptoz-mcp] ready — tools: cryptoz_chat, cryptoz_task_add, cryptoz_task_update, cryptoz_tasks_list, cryptoz_decision, cryptoz_init, cryptoz_context");
