"use client";

import { useState } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  AlertCircle 
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

  const handleNextPage = () => {
    if (currentPage < pageCount) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 150) setZoomLevel(zoomLevel + 10);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) setZoomLevel(zoomLevel - 10);
  };

  return (
    <div className="flex flex-col rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs dark:border-stone-800 dark:bg-stone-900">
      {/* Top Viewer Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-stone-200 bg-stone-100/70 px-4 py-2.5 dark:border-stone-800 dark:bg-stone-950/70 gap-2">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className="rounded p-1 text-stone-600 hover:bg-stone-200 disabled:opacity-40 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-medium text-stone-700 dark:text-stone-300">
            Page {currentPage} of {pageCount}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === pageCount}
            aria-label="Next Page"
            className="rounded p-1 text-stone-600 hover:bg-stone-200 disabled:opacity-40 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Zoom & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-stone-300 rounded-lg bg-white dark:border-stone-700 dark:bg-stone-900 text-xs px-1">
            <button
              onClick={handleZoomOut}
              aria-label="Zoom Out"
              className="p-1 hover:text-amber-600 dark:hover:text-amber-400"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-1.5 font-medium text-stone-600 dark:text-stone-400">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              aria-label="Zoom In"
              className="p-1 hover:text-amber-600 dark:hover:text-amber-400"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {downloadAllowed ? (
            <button
              onClick={() => alert("Downloading document securely via signed authorization link...")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-amber-500 transition"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
          ) : (
            <span className="text-xs text-stone-400 italic">Preview Only</span>
          )}
        </div>
      </div>

      {/* Document View Canvas */}
      <div className="relative min-h-[500px] max-h-[750px] overflow-auto bg-stone-200/50 p-6 flex flex-col items-center justify-center dark:bg-stone-950/40">
        <div 
          className="bg-white text-stone-900 shadow-md rounded-lg p-8 sm:p-12 w-full max-w-2xl min-h-[600px] flex flex-col justify-between border border-stone-200 dark:bg-stone-900 dark:text-stone-100 dark:border-stone-800 transition-transform duration-150"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
        >
          {/* Simulated In-Page Document Preview Header */}
          <div className="border-b border-stone-200 pb-4 dark:border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
              <span>Student_Repo Verified Academic Material</span>
              <span>Kerala State Board</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              {title}
            </h2>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
              Section: Academic Notes & Question Analysis (Page {currentPage})
            </p>
          </div>

          {/* Sample Academic Content Render */}
          <div className="py-6 space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
            <p>
              <strong>1. Fundamental Principles:</strong> This document outlines essential concepts, definitions, formulae, and step-by-step scoring insights aligned directly with SCERT / DHSE curriculum guidelines.
            </p>
            <div className="rounded-lg bg-amber-50/60 p-4 border border-amber-200/60 text-xs font-sans text-stone-800 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-stone-200">
              <strong>Key Examination Pointer:</strong> Questions from this chapter carry up to 8 marks in public board exams. Focus on diagram labeling, derivations, and sequence definitions.
            </div>
            <p>
              <strong>2. Chapter Core Derivations & Diagrams:</strong> Refer to standardized notation as recommended in the official textbook. Step-wise scoring marks are awarded for formula citation, substitution, and units.
            </p>
            <div className="p-3 border border-dashed border-stone-300 rounded text-center text-xs text-stone-400 font-sans dark:border-stone-700">
              [ High Resolution Diagram & Notation Schematics Rendered on Page {currentPage} ]
            </div>
          </div>

          {/* Page Footer */}
          <div className="border-t border-stone-200 pt-3 flex justify-between text-2xs text-stone-400 dark:border-stone-800">
            <span>Student_Repo Academic Repository</span>
            <span>Page {currentPage} of {pageCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
