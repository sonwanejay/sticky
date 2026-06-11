import { File, Directory, Paths } from "expo-file-system";
import { updateWidget } from "./widget";

const notesDir = new Directory(Paths.document, "notes");
const indexFile = new File(notesDir, "index.json");

export type NoteMeta = {
  id: string;
  title: string;
  preview?: string;
  createdAt: number;
  updatedAt: number;
  color?: string;
  pinned?: boolean;
};

type Index = Record<string, NoteMeta>;

function ensureDir() {
  if (!notesDir.exists) {
    notesDir.create({ intermediates: true });
  }
}

async function readIndex(): Promise<Index> {
  ensureDir();
  if (!indexFile.exists) return {};
  const raw = await indexFile.text();
  return JSON.parse(raw);
}

function writeIndex(index: Index) {
  ensureDir();
  if (!indexFile.exists) {
    indexFile.create();
  }
  indexFile.write(JSON.stringify(index));
}

export async function listNotes(): Promise<NoteMeta[]> {
  const index = await readIndex();
  return Object.values(index).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });
}

export async function readNote(id: string): Promise<string> {
  const file = new File(notesDir, `${id}.md`);
  if (!file.exists) return "";
  return file.text();
}

export async function getNoteMeta(
  id: string
): Promise<NoteMeta | null> {
  const index = await readIndex();
  return index[id] ?? null;
}

export async function saveNote(
  id: string,
  title: string,
  content: string,
  opts?: { color?: string; pinned?: boolean }
) {
  ensureDir();
  const index = await readIndex();
  const now = Date.now();
  const existing = index[id];
  const bodyText = content
    .split("\n")
    .slice(1)
    .join("\n")
    .trim()
    .slice(0, 120);

  index[id] = {
    id,
    title: title || "Untitled",
    preview: bodyText || undefined,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    color: opts?.color ?? existing?.color,
    pinned: opts?.pinned ?? existing?.pinned,
  };

  const file = new File(notesDir, `${id}.md`);
  if (!file.exists) {
    file.create();
  }
  file.write(content);
  writeIndex(index);
  updateWidget();
}

export async function updateNoteMeta(
  id: string,
  updates: Partial<Pick<NoteMeta, "color" | "pinned" | "title">>
) {
  const index = await readIndex();
  if (!index[id]) return;
  index[id] = { ...index[id], ...updates, updatedAt: Date.now() };
  writeIndex(index);
  updateWidget();
}

export async function deleteNote(id: string) {
  const index = await readIndex();
  delete index[id];
  writeIndex(index);
  const file = new File(notesDir, `${id}.md`);
  if (file.exists) {
    file.delete();
  }
  updateWidget();
}

export async function searchNotes(query: string): Promise<NoteMeta[]> {
  const all = await listNotes();
  if (!query.trim()) return all;
  const lower = query.toLowerCase();
  const results: NoteMeta[] = [];
  for (const meta of all) {
    if (meta.title.toLowerCase().includes(lower)) {
      results.push(meta);
      continue;
    }
    const content = await readNote(meta.id);
    if (content.toLowerCase().includes(lower)) {
      results.push(meta);
    }
  }
  return results;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
