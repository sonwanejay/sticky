import { File, Directory, Paths } from "expo-file-system";

const notesDir = new Directory(Paths.document, "notes");
const indexFile = new File(notesDir, "index.json");
const widgetMapFile = new File(Paths.document, "widget-map.json");

type WidgetMap = Record<string, string>;

export interface WidgetNoteData {
  noteId: string;
  title: string;
  preview?: string;
  color?: string;
}

async function readMap(): Promise<WidgetMap> {
  if (!widgetMapFile.exists) return {};
  try {
    const raw = await widgetMapFile.text();
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeMap(map: WidgetMap) {
  if (!widgetMapFile.exists) {
    widgetMapFile.create();
  }
  widgetMapFile.write(JSON.stringify(map));
}

export async function getWidgetMap(): Promise<WidgetMap> {
  return readMap();
}

export async function setWidgetNoteId(
  widgetId: number,
  noteId: string
): Promise<void> {
  const map = await readMap();
  map[String(widgetId)] = noteId;
  writeMap(map);
}

export async function removeWidget(widgetId: number): Promise<void> {
  const map = await readMap();
  delete map[String(widgetId)];
  writeMap(map);
}

export async function removeWidgetsByNoteId(noteId: string): Promise<void> {
  const map = await readMap();
  for (const [wid, nid] of Object.entries(map)) {
    if (nid === noteId) delete map[wid];
  }
  writeMap(map);
}

export async function getWidgetNoteData(
  widgetId: number
): Promise<WidgetNoteData | null> {
  const map = await readMap();
  const noteId = map[String(widgetId)];
  if (!noteId) return null;

  try {
    if (!indexFile.exists) return null;
    const raw = await indexFile.text();
    const index = JSON.parse(raw);
    const meta = index[noteId];
    if (!meta) return null;
    return {
      noteId: meta.id,
      title: meta.title,
      preview: meta.preview,
      color: meta.color,
    };
  } catch {
    return null;
  }
}

export async function listAllNotes(): Promise<WidgetNoteData[]> {
  try {
    if (!indexFile.exists) return [];
    const raw = await indexFile.text();
    const index = JSON.parse(raw);
    return Object.values(index)
      .sort((a: any, b: any) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.updatedAt - a.updatedAt;
      })
      .map((m: any) => ({
        noteId: m.id,
        title: m.title,
        preview: m.preview,
        color: m.color,
      }));
  } catch {
    return [];
  }
}
