import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { loadPlatformState, savePlatformState } from "@/lib/supabase/persistence";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const isDownload = request.nextUrl.searchParams.get("download") === "1";

  try {
    const state = await loadPlatformState();
    const resource = state.customResources.find((r) => r.id === id);

    if (!resource) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Only allow viewing unapproved resources if uploader or admin/moderator
    const effectiveStatus = state.resourceStatusOverrides[resource.id] || resource.status;
    if (effectiveStatus !== "approved") {
      const session = await getCurrentSession();
      const isOwner = session && session.userId === resource.uploader_id;
      const isAdmin = session && (session.role === "admin" || session.role === "moderator");
      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { error: "This document is currently pending moderation." },
          { status: 403 }
        );
      }
    }

    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.storage
      .from("resources")
      .download(resource.storage_path);

    if (error || !data) {
      return NextResponse.json(
        { error: "Unable to stream PDF from storage bucket." },
        { status: 404 }
      );
    }

    // Increment real view/download counters
    if (isDownload) {
      resource.downloads_count = (resource.downloads_count || 0) + 1;
    } else {
      resource.views_count = (resource.views_count || 0) + 1;
    }
    await savePlatformState(state);

    const arrayBuffer = await data.arrayBuffer();
    const safeFilename = `${resource.slug || "document"}.pdf`;

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": isDownload
          ? `attachment; filename="${safeFilename}"`
          : `inline; filename="${safeFilename}"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
