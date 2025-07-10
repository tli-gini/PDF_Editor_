"use client";

import React, { useCallback, useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { useDropzone } from "react-dropzone";
import { MdArrowUpward, MdArrowDownward, MdClose } from "react-icons/md";

interface DropzoneSortableProps {
  onFilesChange?: (files: File[]) => void;
}

export default function DropzoneSortable({
  onFilesChange,
}: DropzoneSortableProps) {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === "application/pdf"
      );
      setFiles((prev) => {
        const all = [...prev, ...pdfFiles];
        const deduped = Array.from(
          new Map(all.map((f) => [f.name, f])).values()
        );
        onFilesChange?.(deduped);
        return deduped;
      });
    },
    [onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 50 * 1024 * 1024,
    multiple: true,
  });

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      onFilesChange?.(copy);
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index >= files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
      onFilesChange?.(copy);
      return copy;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onFilesChange?.(updated);
      return updated;
    });
  };

  return (
    <div className="w-full max-w-md">
      <div
        {...getRootProps()}
        className="min-h-56 transition-all duration-200 transform shadow-[0_4px_20px_rgba(255,255,255,0.4)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98] rounded-xl border-2 border-dashed border-white p-6 w-full cursor-pointer focus:border-solid focus:border-primary-light focus:dark:border-primary flex items-center justify-center"
      >
        <input {...getInputProps()} />
        <p className="text-base font-semibold text-white">
          {isDragActive
            ? t.components.dropzone.active
            : t.components.dropzone.default}
        </p>
      </div>

      {files.length > 0 && (
        <div className="p-4 mt-4 space-y-2 text-sm text-left text-black bg-white border rounded-md border-primary-light">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 truncate max-w-[60%] text-primary font-normal">
                {file.name}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveUp(index)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <MdArrowUpward className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <MdArrowDownward className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <MdClose className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="text-xs text-right text-secondary dark:text-background">
            {t.components.dropzone.maxSizeNote}
          </div>
        </div>
      )}
    </div>
  );
}
