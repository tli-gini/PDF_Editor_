"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
interface Props {
  file: File;
}

export default function PdfPreviewClient({ file }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onLoadSuccess = (pdf: any) => {
    setNumPages(pdf.numPages);
  };

  return (
    <Document
      file={file}
      onLoadSuccess={onLoadSuccess}
      loading={<p>Loading PDF...</p>}
      error={<p>Failed to load PDF file.</p>}
      className="mt-4"
    >
      {Array.from(new Array(numPages || 0), (_, i) => (
        <Page
          key={`page_${i + 1}`}
          pageNumber={i + 1}
          width={300}
          className="my-2 border"
        />
      ))}
    </Document>
  );
}
