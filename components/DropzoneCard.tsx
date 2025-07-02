// components/DropzoneCard.tsx
"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n-context";
import { useDropzone } from "react-dropzone";
import { MdClose } from "react-icons/md";

interface DropzoneCardProps {
  onFilesUpload?: (files: File[]) => void;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function DropzoneCard({
  onClick,
  children,
  onFilesUpload,
}: DropzoneCardProps) {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    setFiles((prev) => {
      const all = [...prev, ...pdfFiles];
      const unique = Array.from(new Map(all.map((f) => [f.name, f])).values());
      if (onFilesUpload) {
        onFilesUpload(unique);
      }
      return unique; // remove duplicates
    });
  }, []);

  useEffect(() => {
    if (onFilesUpload) {
      onFilesUpload(files);
    }
  }, [files, onFilesUpload]); // Update parent on files change

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 50 * 1024 * 1024,
    multiple: true, // enable multi-file
  });

  return (
    <div className="w-full max-w-md">
      <div
        {...getRootProps({ onClick })}
        className="min-h-56 transition-all duration-200 transform shadow-[0_4px_20px_rgba(255,255,255,0.4)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98] rounded-xl border-2 border-dashed border-white p-6 w-full cursor-pointer focus:border-solid focus:border-primary-light focus:dark:border-primary flex items-center justify-center"
      >
        <input {...getInputProps()} />
        {children || (
          <p className="text-base font-semibold text-white">
            {isDragActive
              ? t.components.dropzone.active
              : t.components.dropzone.default}
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div className="p-4 mt-4 space-y-2 text-sm text-left text-black bg-white border rounded-md border-primary-light">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 truncate max-w-[70%] text-primary font-normal">
                {file.name}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary dark:text-background">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 transition-colors hover:text-red-500"
                  aria-label="Remove file"
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
