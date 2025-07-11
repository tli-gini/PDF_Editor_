"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdClose } from "react-icons/md";
import { useI18n } from "@/lib/i18n-context";
import dynamic from "next/dynamic";

const PdfPreviewClient = dynamic(() => import("./PdfPreviewClient"), {
  ssr: false,
});

export default function DropzonePdfPreview() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find((f) => f.type === "application/pdf");
    if (pdfFile) {
      setFile(pdfFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    maxSize: 50 * 1024 * 1024,
  });

  const removeFile = () => setFile(null);

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

      {file && (
        <div className="p-4 mt-4 space-y-4 text-sm text-left text-black bg-white border rounded-md border-primary-light">
          <div className="flex items-center justify-between">
            <div className="flex-1 truncate max-w-[70%] text-primary font-normal">
              {file.name}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary dark:text-background">
                {(file.size / 1024).toFixed(1)} KB
              </span>
              <button
                onClick={removeFile}
                className="text-gray-400 transition-colors hover:text-red-500"
                aria-label="Remove file"
              >
                <MdClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          <PdfPreviewClient file={file} />
        </div>
      )}
    </div>
  );
}
