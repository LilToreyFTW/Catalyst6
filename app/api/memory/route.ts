import { NextResponse } from "next/server";
import { createMemoryRecord, listMemoryRecords } from "../../../lib/memory-store";
import { MemoryRecord } from "../../../lib/types";

async function fetchRealGoogleResult(query: string) {
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("num", "1");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`SerpApi request failed with ${response.status}`);
  }

  const payload = await response.json();
  const result = Array.isArray(payload.organic_results) ? payload.organic_results[0] : null;

  if (!result) {
    return null;
  }

  return {
    source: "Google organic result",
    sourceTitle: String(result.title ?? "Google result"),
    sourceSnippet: String(result.snippet ?? "No snippet returned."),
    sourceUrl: String(result.link ?? "https://www.google.com")
  };
}

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

  const query =
    payload.learningDelta ??
    `Catalyst6 Demon genome ${payload.genomeNumber ?? 0} ${payload.evolved ? "quadruple helix" : "double helix"}`;
  const realResult = await fetchRealGoogleResult(query);

  const record: MemoryRecord = {
    id: payload.id,
    genomeNumber: payload.genomeNumber ?? 0,
    segments: payload.segments,
    learningDelta: payload.learningDelta ?? "search memory, ranking adaptation, transformer reinforcement.",
    evolved: Boolean(payload.evolved),
    source: realResult?.source ?? payload.source ?? "Google search intelligence",
    sourceTitle: realResult?.sourceTitle ?? payload.sourceTitle ?? "Google search result",
    sourceSnippet: realResult?.sourceSnippet ?? payload.sourceSnippet ?? "No snippet saved.",
    sourceUrl:
      realResult?.sourceUrl ??
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
