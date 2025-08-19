// components/DropzonePreview.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useI18n } from "@/lib/i18n-context";
import { MdOutlineDelete } from "react-icons/md";

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
  /** Render custom right panel per tool */
  renderRightPanel?: (args: RightPanelRenderArgs) => React.ReactNode;
  /** Optional: override the “default” label; by default we use i18n */
  dropLabel?: React.ReactNode;
  clearLabel?: React.ReactNode;
};

export default function DropzonePreview({
  accept = { "application/pdf": [".pdf"] },
  multiple = false,
  maxSizeMB = 50,
  className,
  onFilesChange,
  renderRightPanel,
  dropLabel,
  clearLabel,
}: DropzonePreviewProps) {
  const { t } = useI18n();
  const [files, setFiles] = useState<DropzonePreviewFile[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const acceptedTyped = accepted.filter(
        (f) => f.type === "application/pdf"
      );
      setFiles((prev) => {
        if (!multiple) {
          return acceptedTyped.length
            ? [{ file: acceptedTyped[0], id: crypto.randomUUID() }]
            : [];
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
      <div className="flex flex-col w-full max-w-md">
        <div
          {...getRootProps()}
          className="min-h-56 transition-all duration-200 transform shadow-[0_4px_20px_rgba(255,255,255,0.4)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98] rounded-xl border-2 border-dashed border-white p-6 w-full cursor-pointer focus:border-solid focus:border-primary-light focus:dark:border-primary flex items-center justify-center"
        >
          <input {...getInputProps()} />
          <p className="text-base font-semibold text-white">
            {isDragActive
              ? t.components.dropzone.active
              : dropLabel ?? t.components.dropzone.default}
          </p>
        </div>

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
                <span className="text-xs text-secondary dark:text-background">
                  {(f.file.size / 1024).toFixed(1)} KB
                </span>
              </button>
            ))}

            <div className="flex items-center justify-between px-2 py-1 pt-1">
              <div className="text-xs text-secondary dark:text-background">
                {t.components.dropzone.maxSizeNote}
              </div>
              <button
                onClick={clearFiles}
                className="p-1.5  text-primary rounded-md hover:bg-primary hover:text-white"
                aria-label="Clear"
              >
                <MdOutlineDelete className="text-base" />
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
    clearLabel,
    t.components.dropzone.active,
    t.components.dropzone.default,
    t.components.dropzone.maxSizeNote,
  ]);

  return (
    <div className={`w-full max-w-md flex flex-col gap-4 ${className || ""}`}>
      {left}
      <div className="w-full max-w-md">
        {renderRightPanel?.({ files, activeIndex, setActiveIndex, clearFiles })}
      </div>
    </div>
  );
}
