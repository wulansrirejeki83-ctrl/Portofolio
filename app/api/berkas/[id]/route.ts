import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { getWorkFileById } from "@/lib/store";
import { readUpload } from "@/lib/uploads";

export const dynamic = "force-dynamic";

interface FileRouteProps {
  params: Promise<{ id: string }>;
}

function asciiFileName(name: string): string {
  return name.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_") || "berkas";
}

export async function GET(request: Request, { params }: FileRouteProps) {
  const { id } = await params;
  const found = await getWorkFileById(id);

  if (!found) {
    return new NextResponse("Berkas tidak ditemukan.", { status: 404 });
  }

  if (found.work.status !== "published") {
    const session = await getAdminSession();
    if (!session) {
      return new NextResponse("Berkas tidak ditemukan.", { status: 404 });
    }
  }

  let data: Buffer;

  try {
    data = await readUpload(found.file);
  } catch {
    return new NextResponse("Berkas tidak ditemukan.", { status: 404 });
  }

  const url = new URL(request.url);
  const download = url.searchParams.get("unduh") === "1";
  const inline =
    found.file.mime.startsWith("image/") || found.file.mime === "application/pdf";
  const disposition = download || !inline ? "attachment" : "inline";
  const bytes = new Uint8Array(data.byteLength);
  bytes.set(data);

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": found.file.mime,
      "Content-Length": String(found.file.size),
      "Content-Disposition": `${disposition}; filename="${asciiFileName(
        found.file.name,
      )}"; filename*=UTF-8''${encodeURIComponent(found.file.name)}`,
      "Cache-Control": "private, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
