"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

export type DropzonePreviewFile = {
  file: File;
  id: string; // stable id for rendering keys
};

type RightPanelRenderArgs = {
  files: DropzonePreviewFile[];
  activeIndex: number | null;
  setActiveIndex: (i: number | null) => void;
  clearFiles: () => void;
};

type DropzonePreviewProps = {
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSizeMB?: number;
  className?: string;
  onFilesChange?: (files: DropzonePreviewFile[]) => void;

  /* Render custom right panel content per tool */
  renderRightPanel?: (args: RightPanelRenderArgs) => React.ReactNode;
  dropLabel?: React.ReactNode;
};

export default function DropzonePreview({
  accept = { "application/pdf": [".pdf"] },
  multiple = false,
  maxSizeMB = 50,
  className,
  onFilesChange,
  renderRightPanel,
  dropLabel,
}: DropzonePreviewProps) {
  const [files, setFiles] = useState<DropzonePreviewFile[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const acceptedTyped = accepted.filter(
        (f) => f.type === "application/pdf"
      );
      setFiles((prev) => {
        if (!multiple) {
          const next = acceptedTyped.length
            ? [{ file: acceptedTyped[0], id: crypto.randomUUID() }]
            : [];
          return next;
        }
        const merged = [
          ...prev,
          ...acceptedTyped.map((f) => ({ file: f, id: crypto.randomUUID() })),
        ];
        // dedupe by name + size to avoid obvious dupes
        const map = new Map<string, DropzonePreviewFile>();
        merged.forEach((f) => map.set(`${f.file.name}_${f.file.size}`, f));
        return Array.from(map.values());
      });
      setActiveIndex(0);
    },
    [multiple]
  );

  useEffect(() => {
    onFilesChange?.(files);
  }, [files, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize: maxSizeMB * 1024 * 1024,
  });

  const clearFiles = useCallback(() => {
    setFiles([]);
    setActiveIndex(null);
  }, []);

  const left = useMemo(() => {
    return (
      <div className="flex flex-col w-full">
        <div
          {...getRootProps()}
          className="min-h-56 transition-all duration-200 transform rounded-xl border-2 border-dashed border-white p-6 w-full cursor-pointer hover:scale-[1.01] hover:shadow-[0_6px_24px_rgba(255,255,255,0.5)]"
        >
          <input {...getInputProps()} />
          <p className="text-base font-semibold text-white">
            {isDragActive
              ? "Drop the PDF here"
              : dropLabel || "Click or drag a PDF to upload"}
          </p>
        </div>

        {/* file list */}
        {files.length > 0 && (
          <div className="p-4 mt-4 space-y-2 text-sm text-left text-black bg-white border rounded-md border-primary-light">
            {files.map((f, i) => (
              <button
                key={f.id}
                className={`flex w-full items-center justify-between px-2 py-1 rounded ${
                  i === activeIndex ? "bg-primary/10" : ""
                }`}
                onClick={() => setActiveIndex(i)}
              >
                <div className="flex-1 truncate max-w-[70%] text-primary font-normal text-left">
                  {f.file.name}
                </div>
                <span className="text-xs text-secondary">
                  {(f.file.size / 1024).toFixed(1)} KB
                </span>
              </button>
            ))}
            <div className="flex justify-end">
              <button
                onClick={clearFiles}
                className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }, [
    getRootProps,
    getInputProps,
    isDragActive,
    files,
    activeIndex,
    clearFiles,
    dropLabel,
  ]);

  return (
    <div className={`w-full flex flex-col gap-6 ${className || ""}`}>
      {left}
      <div className="w-full">
        {renderRightPanel?.({ files, activeIndex, setActiveIndex, clearFiles })}
      </div>
    </div>
  );
}
