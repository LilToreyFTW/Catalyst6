import { NextResponse } from "next/server";
import { createMemoryRecord, listMemoryRecords } from "../../../lib/memory-store";
import { MemoryRecord } from "../../../lib/types";

export async function GET() {
  try {
    const records = await listMemoryRecords();
    return NextResponse.json({ records });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to fetch memory records.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<MemoryRecord>;

  if (!payload.id || !payload.createdAt || !payload.segments?.length) {
    return NextResponse.json(
      { error: "Missing required memory fields." },
      { status: 400 }
    );
  }

  const record: MemoryRecord = {
    id: payload.id,
    genomeNumber: payload.genomeNumber ?? 0,
    segments: payload.segments,
    learningDelta: payload.learningDelta ?? "search memory, ranking adaptation, transformer reinforcement.",
    evolved: Boolean(payload.evolved),
    source: payload.source ?? "Google search intelligence",
    sourceUrl:
      payload.sourceUrl ??
      "https://www.google.com/search?q=Catalyst6+Demon+memory+source",
    mediaTypes: payload.mediaTypes ?? ["image", "video", "mp4", "mp3"],
    createdAt: payload.createdAt
  };

  try {
    const saved = await createMemoryRecord(record);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to save memory record.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
