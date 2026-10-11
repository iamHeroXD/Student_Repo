"use client";

import { Download, ExternalLink, FileText } from "lucide-react";

interface DocumentPreviewProps {
  resourceId: string;
  title: string;
  pageCount: number;
  downloadAllowed: boolean;
}

export function DocumentPreview({
  resourceId,
  title,
  pageCount,
  downloadAllowed,
}: DocumentPreviewProps) {
  const inlinePdfUrl = `/api/resource/${resourceId}/pdf`;
  const downloadPdfUrl = `/api/resource/${resourceId}/pdf?download=1`;

  return (
    <div className="flex flex-col rounded-2xl border border-[#D8CEBE] bg-white overflow-hidden shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
      {/* Top Viewer Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D8CEBE] bg-[#E8DFCE] px-4 py-3 dark:border-[#1E2922] dark:bg-[#121713] gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#090A0B] dark:text-[#F8FAFC] min-w-0">
          <FileText className="h-4 w-4 text-[#10B981] shrink-0" />
          <span className="truncate">{title}</span>
          <span className="shrink-0 rounded-md bg-[#D8CEBE]/70 px-2 py-0.5 text-2xs text-[#64748B] dark:bg-[#1E2922] dark:text-[#94A3B8]">
            {pageCount} {pageCount === 1 ? "Page" : "Pages"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <a
            href={inlinePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-white px-3 py-2 sm:py-1.5 text-xs font-semibold text-[#090A0B] hover:border-[#10B981] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC] transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#10B981]" />
            Open Full Tab
          </a>

          {downloadAllowed && (
            <a
              href={downloadPdfUrl}
              download
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] active:scale-95 transition"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </a>
          )}
        </div>
      </div>

      {/* Real Embedded PDF Viewer (Responsive Height for Phone, Tablet, and Desktop) */}
      <div className="relative w-full h-[420px] sm:h-[540px] lg:h-[680px] bg-[#E5DEC9] dark:bg-[#0A0D0B]">
        <iframe
          src={inlinePdfUrl}
          title={title}
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
