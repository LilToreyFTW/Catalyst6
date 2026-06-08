import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { MemoryRecord } from "./types";

const memoryFile = path.join(process.cwd(), "work", "memory-store.json");

async function ensureMemoryFile() {
  await mkdir(path.dirname(memoryFile), { recursive: true });
  try {
    await readFile(memoryFile, "utf8");
  } catch {
    await writeFile(memoryFile, "[]", "utf8");
  }
}

async function readLocalMemory(): Promise<MemoryRecord[]> {
  await ensureMemoryFile();
  const raw = await readFile(memoryFile, "utf8");
  const parsed = JSON.parse(raw) as MemoryRecord[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeLocalMemory(records: MemoryRecord[]) {
  await ensureMemoryFile();
  await writeFile(memoryFile, JSON.stringify(records, null, 2), "utf8");
}

async function proxyToVps(pathname: string, init?: RequestInit) {
  const base = process.env.VPS_MEMORY_API_URL;
  if (!base) {
    return null;
  }

  const headers = new Headers(init?.headers);
  if (process.env.VPS_MEMORY_API_KEY) {
    headers.set("x-api-key", process.env.VPS_MEMORY_API_KEY);
  }

  const response = await fetch(new URL(pathname, base), {
    ...init,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`VPS memory API failed with ${response.status}`);
  }

  return response;
}

export async function listMemoryRecords(): Promise<MemoryRecord[]> {
  const proxied = await proxyToVps("/memory");
  if (proxied) {
    const payload = await proxied.json();
    return Array.isArray(payload) ? payload : payload.records ?? [];
  }

  return readLocalMemory();
}

export async function createMemoryRecord(record: MemoryRecord): Promise<MemoryRecord> {
  const proxied = await proxyToVps("/memory", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(record)
  });

  if (proxied) {
    return await proxied.json();
  }

  const records = await readLocalMemory();
  records.unshift(record);
  await writeLocalMemory(records.slice(0, 500));
  return record;
}
