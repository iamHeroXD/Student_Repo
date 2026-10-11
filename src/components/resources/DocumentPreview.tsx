"use client";

import { useState } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  Share2,
  Maximize2
} from "lucide-react";

interface DocumentPreviewProps {
  title: string;
  pageCount: number;
  downloadAllowed: boolean;
  samplePath?: string;
}

export function DocumentPreview({ title, pageCount, downloadAllowed, samplePath }: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [downloading, setDownloading] = useState(false);
  const [downloadNote, setDownloadNote] = useState<string | null>(null);

  const handleNextPage = () => {
    if (currentPage < pageCount) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 140) setZoomLevel(zoomLevel + 10);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 80) setZoomLevel(zoomLevel - 10);
  };

  const handleDownload = () => {
    setDownloading(true);
    setDownloadNote(null);
    setTimeout(() => {
      setDownloading(false);
      setDownloadNote("Sample preview mode active. Connect Supabase Storage to stream full PDF files.");
      setTimeout(() => setDownloadNote(null), 4500);
    }, 500);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310] transition">
      {downloadNote && (
        <div className="border-b border-[#10B981]/20 bg-[#10B981]/10 px-4 py-2 text-xs font-medium text-[#059669] dark:text-[#10B981] flex items-center justify-between">
          <span>{downloadNote}</span>
          <button onClick={() => setDownloadNote(null)} className="text-2xs underline ml-3">Dismiss</button>
        </div>
      )}
      {/* Top Viewer Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 dark:border-[#1E2922] dark:bg-[#121713] gap-2">
        {/* Navigation */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#090A0B] disabled:opacity-30 dark:text-[#94A3B8] dark:hover:bg-[#1E2922] dark:hover:text-[#F8FAFC] transition active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-[#090A0B] dark:text-[#F8FAFC] px-1">
            {currentPage} <span className="font-normal text-[#94A3B8]">/ {pageCount}</span>
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === pageCount}
            aria-label="Next Page"
            className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#090A0B] disabled:opacity-30 dark:text-[#94A3B8] dark:hover:bg-[#1E2922] dark:hover:text-[#F8FAFC] transition active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Zoom & Download Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center border border-[#E2E8F0] rounded-xl bg-white dark:border-[#1E2922] dark:bg-[#0A0D0B] text-xs px-1">
            <button
              onClick={handleZoomOut}
              aria-label="Zoom Out"
              className="p-1.5 text-[#64748B] hover:text-[#10B981] dark:text-[#94A3B8] transition"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-1.5 font-medium text-[#090A0B] dark:text-[#F8FAFC] text-2xs">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              aria-label="Zoom In"
              className="p-1.5 text-[#64748B] hover:text-[#10B981] dark:text-[#94A3B8] transition"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {downloadAllowed ? (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] active:scale-95 transition"
            >
              <Download className="h-3.5 w-3.5" />
              {downloading ? "Preparing..." : "Download PDF"}
            </button>
          ) : (
            <span className="text-xs text-[#94A3B8] italic">Preview Only</span>
          )}
        </div>
      </div>

      {/* Document View Canvas */}
      <div className="relative min-h-[480px] max-h-[720px] overflow-auto bg-[#F1F5F9]/70 p-4 sm:p-8 flex flex-col items-center justify-center dark:bg-[#0A0D0B]/60">
        <div 
          className="bg-white text-[#090A0B] shadow-md rounded-2xl p-8 sm:p-12 w-full max-w-2xl min-h-[580px] flex flex-col justify-between border border-[#E2E8F0] dark:bg-[#0F1310] dark:text-[#F8FAFC] dark:border-[#1E2922] transition-transform duration-150"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
        >
          {/* Document Header Bar */}
          <div className="border-b border-[#E2E8F0] pb-4 dark:border-[#1E2922]">
            <div className="flex items-center justify-between text-2xs text-[#94A3B8] mb-2 uppercase tracking-wider font-semibold">
              <span>Student_Repo Academic Library</span>
              <span>Kerala State Board</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#090A0B] dark:text-[#F8FAFC]">
              {title}
            </h2>
            <p className="text-xs text-[#10B981] mt-1 font-medium">
              Academic Notes & Chapter Analysis (Sheet {currentPage})
            </p>
          </div>

          {/* Academic Content Presentation */}
          <div className="py-6 space-y-4 text-xs sm:text-sm text-[#090A0B] dark:text-[#F8FAFC] leading-relaxed font-serif">
            <p>
              <strong>1. Core Concept Overview:</strong> This document summarizes fundamental principles, definitions, derivations, and step-wise scoring insights aligned with SCERT / DHSE curriculum standards.
            </p>
            <div className="rounded-xl bg-emerald-50/70 p-4 border border-emerald-500/20 text-xs font-sans text-emerald-950 dark:bg-emerald-950/25 dark:border-emerald-500/20 dark:text-emerald-200">
              <strong>Scoring Pointer:</strong> Key questions from this topic carry high weightage in annual board examinations. Focus on labeled sketches, mathematical substitutions, and accurate units.
            </div>
            <p>
              <strong>2. Derivations & Diagrams:</strong> Standard nomenclature and labeling conventions must follow the authorized state textbooks.
            </p>
            <div className="p-4 border border-dashed border-[#E2E8F0] rounded-xl text-center text-xs text-[#94A3B8] font-sans dark:border-[#1E2922]">
              [ High Resolution Vector Diagrams & Detailed Calculations on Sheet {currentPage} ]
            </div>
          </div>

          {/* Page Footer */}
          <div className="border-t border-[#E2E8F0] pt-3 flex justify-between text-2xs text-[#94A3B8] dark:border-[#1E2922]">
            <span>Student_Repo Verification Registry</span>
            <span>Page {currentPage} of {pageCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
