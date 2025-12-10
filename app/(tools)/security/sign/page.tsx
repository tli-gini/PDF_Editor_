// app/(tools)/security/sign/page.tsx
"use client";

import { useState, useCallback } from "react";
import { TbSignature } from "react-icons/tb";
import { BiImageAdd, BiSolidImageAlt } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { useI18n } from "@/lib/i18n-context";
import DropzonePreview, {
  type DropzonePreviewFile,
} from "@/components/DropzonePreview";
import ToolTitle from "@/components/ToolTitle";
import InfoToggle from "@/components/InfoToggle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import SignPdfPreview, {
  type SignaturePlacement,
} from "@/components/Sign/SignPdfPreview";
import SignatureCanvasInline from "@/components/Sign/SignatureCanvasInline";
import SignatureCanvasModal from "@/components/Sign/SignatureCanvasModal";
import { SignatureTextRenderer } from "@/components/Sign/SignatureTextRenderer";
import { SignTabButton } from "@/components/Sign/SignTabButton";
import { toast } from "react-toastify";

type SignatureMode = "draw" | "text" | "image";

export default function SignPDF() {
  const { t } = useI18n();
  const tool = t.tools.sign;

  const [files, setFiles] = useState<DropzonePreviewFile[]>([]);
  const [mode, setMode] = useState<SignatureMode>("draw");
  const [signatureText, setSignatureText] = useState("");
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Canvas signature state
  const [openCanvasModal, setOpenCanvasModal] = useState(false);

  // inline canvas clear signal
  const [inlineClearSignal, setInlineClearSignal] = useState(0);

  // Signature scale for Canvas and Image modes
  const [signatureScale, setSignatureScale] = useState(1);

  // Image signature state (for upload)
  const [imageFileName, setImageFileName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Placement of the signature box on the preview (reported by SignPdfPreview)
  const [signaturePlacement, setSignaturePlacement] =
    useState<SignaturePlacement | null>(null);

  // Text signature options
  const [fontFamily, setFontFamily] = useState("Helvetica");
  const [textColor, setTextColor] = useState("#000000");

  const active = files[0] ?? null;

  const handleSubmit = async () => {
    if (!active) {
      toast.error(t.toast.missingFile);
      return;
    }

    if (!signatureUrl) {
      toast.error(
        tool.toast?.needSignature ?? "Please create a signature first."
      );
      return;
    }

    if (!signaturePlacement) {
      toast.error(
        tool.toast?.placementRequired ??
          "Please place the signature on the PDF."
      );
      return;
    }

    setLoading(true);

    const pendingId = toast.info(
      tool.toast?.processing ?? "Processing signature...",
      { autoClose: false }
    );

    try {
      const { PDFDocument } = await import("pdf-lib");

      // 1) Load PDF bytes
      const pdfBytes = new Uint8Array(await active.file.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // 2) Load signature image bytes (data: or blob:)
      const { bytes: sigBytes, mime: sigMime } = await readImageBytes(
        signatureUrl
      );

      // 3) Embed image (png/jpg). If other types, convert to png first.
      let embedded;
      if (sigMime === "image/jpeg" || sigMime === "image/jpg") {
        embedded = await pdfDoc.embedJpg(sigBytes);
      } else if (sigMime === "image/png") {
        embedded = await pdfDoc.embedPng(sigBytes);
      } else {
        const pngBytes = await convertAnyImageToPngBytes(sigBytes, sigMime);
        embedded = await pdfDoc.embedPng(pngBytes);
      }

      // 4) Pick the exact page
      const pages = pdfDoc.getPages();
      const pageIdx0 = Math.max(
        0,
        Math.min(pages.length - 1, signaturePlacement.pageIndex - 1)
      );
      const page = pages[pageIdx0];

      // 5) Convert preview(px) -> PDF coords using ratios (WYSIWYG, ignores viewport scale)
      const { width: pdfW, height: pdfH } = page.getSize();

      const { xPx, yPx, widthPx, heightPx, pageWidthPx, pageHeightPx } =
        signaturePlacement;

      // x/yPx are measured from TOP-LEFT in the preview.
      // pdf-lib uses BOTTOM-LEFT origin.
      const x = (xPx / pageWidthPx) * pdfW;
      const w = (widthPx / pageWidthPx) * pdfW;
      const h = (heightPx / pageHeightPx) * pdfH;

      const yTop = (yPx / pageHeightPx) * pdfH;
      const y = pdfH - yTop - h;

      page.drawImage(embedded, { x, y, width: w, height: h });

      // 6) Save and download
      const outBytes = await pdfDoc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      const originalName = active.file.name ?? "file.pdf";
      const baseName = originalName.replace(/\.pdf$/i, "");
      a.href = url;
      a.download = `${baseName}_signed.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success(tool.toast?.done ?? t.toast.success);
    } catch (err) {
      console.error(err);
      toast.error(tool.toast?.failed ?? t.toast.fail);
    } finally {
      setLoading(false);
      toast.dismiss(pendingId);
    }
  };

  // --- helpers ---

  async function readImageBytes(
    url: string
  ): Promise<{ bytes: Uint8Array; mime: string }> {
    if (url.startsWith("data:")) {
      const [header, base64] = url.split(",");
      const mimeMatch = header.match(/data:(.*?);base64/);
      const mime = mimeMatch?.[1] ?? "image/png";

      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i += 1) bytes[i] = binary.charCodeAt(i);
      return { bytes, mime };
    }

    const res = await fetch(url);
    const blob = await res.blob();
    const bytes = new Uint8Array(await blob.arrayBuffer());
    return { bytes, mime: blob.type || "image/png" };
  }

  // If user uploads webp/heic/etc, convert to png in browser
  async function convertAnyImageToPngBytes(
    bytes: Uint8Array,
    mime: string
  ): Promise<Uint8Array> {
    const blob = new Blob([bytes], {
      type: mime || "application/octet-stream",
    });
    const bitmap = await createImageBitmap(blob);

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");
    ctx.drawImage(bitmap, 0, 0);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        "image/png"
      );
    });

    return new Uint8Array(await pngBlob.arrayBuffer());
  }

  const handleClear = () => {
    // clear current signatureUrl / text / image
    setSignatureUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });

    setSignatureText("");
    setImageFileName("");
    setImageFile(null);

    // inline canvas
    setInlineClearSignal((v) => v + 1);

    setSignaturePlacement(null);
  };

  const handleApply = () => {
    if (!signatureUrl) {
      toast.info(
        tool.toast?.needSignature ?? "Please create a signature first."
      );
      return;
    }
    toast.success(tool.toast?.applied ?? "Signature applied.");
  };

  // useCallback to keep onRendered stable for SignatureTextRenderer
  const handleSignatureTextRendered = useCallback((url: string | null) => {
    setSignatureUrl(url);
  }, []);

  return (
    <>
      <ToolPageWrapper>
        <ToolTitle
          icon={<TbSignature className="text-3xl" />}
          label={tool.label}
        />

        <DropzonePreview
          multiple={false}
          onFilesChange={setFiles}
          renderRightPanel={({ files: f }) => {
            const first = f[0] ?? null;

            return (
              <div className="flex flex-col w-full gap-3">
                {/* Configure Signature */}
                <div className="flex flex-col gap-3 pt-2 text-sm rounded-md bg-white/80 text-secondary dark:text-background">
                  {/* Tabs: Canvas / Image / Text */}
                  <div className="flex flex-col gap-1">
                    <div className="grid w-full grid-cols-3 text-base font-semibold text-center">
                      <SignTabButton
                        label={tool.tabs?.canvas ?? "Canvas"}
                        active={mode === "draw"}
                        onClick={() => setMode("draw")}
                      />
                      <SignTabButton
                        label={tool.tabs?.image ?? "Image"}
                        active={mode === "image"}
                        onClick={() => setMode("image")}
                      />
                      <SignTabButton
                        label={tool.tabs?.text ?? "Text"}
                        active={mode === "text"}
                        onClick={() => setMode("text")}
                      />
                    </div>

                    <div className="h-0.5 w-full bg-white dark:bg-background">
                      <div
                        className="h-0.5 bg-primary transition-all dark:bg-white"
                        style={{
                          width: "33.3333%",
                          transform:
                            mode === "draw"
                              ? "translateX(0%)"
                              : mode === "image"
                              ? "translateX(100%)"
                              : "translateX(200%)",
                        }}
                      />
                    </div>
                  </div>
                  {/* Clear / Apply (draw mode only) */}
                  {mode === "draw" && (
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleClear}
                        className="flex-1 px-4 py-2 text-base font-semibold transition-all duration-150 ease-in-out bg-white border rounded-xl border-primary text-primary hover:bg-primary/5 hover:shadow-box hover:ring-1 hover:ring-primary active:scale-95 active:bg-primary/10"
                      >
                        {tool.actions?.clear ?? "Clear"}
                      </button>

                      <button
                        type="button"
                        onClick={handleApply}
                        className="flex-1 px-4 py-2 text-base font-semibold transition-all duration-150 ease-in-out bg-white border rounded-xl border-primary text-primary hover:bg-primary/5 hover:shadow-box hover:ring-1 hover:ring-primary active:scale-95 active:bg-primary/10"
                      >
                        {tool.actions?.apply ?? "Apply"}
                      </button>
                    </div>
                  )}
                  {/* Canvas mode */}
                  {mode === "draw" && (
                    <div className="flex flex-col gap-3 pt-2 mt-2">
                      <div className="text-base font-semibold text-left text-secondary">
                        {tool.sections?.canvasTitle ?? "Draw your signature"}
                      </div>

                      {/* Inline Canvas */}
                      <div className="flex flex-col items-center justify-center w-full text-xs border rounded-md border-primary-light dark:border-indigo-300 bg-white/60 text-secondary">
                        <div className="w-full h-32">
                          <SignatureCanvasInline
                            onChange={(url) => setSignatureUrl(url)}
                            clearSignal={inlineClearSignal}
                          />
                        </div>

                        {/* Canvas launch button */}
                        <button
                          type="button"
                          className="self-center my-1 text-sm font-normal text-secondary/80 hover:text-primary dark:hover:text-indigo-300"
                          onClick={() => setOpenCanvasModal(true)}
                        >
                          {tool.sections?.canvasHint ??
                            "Click to open drawing canvas"}
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Image mode */}
                  {mode === "image" && (
                    <div className="flex flex-col gap-3 pt-2 mt-2">
                      <div className="text-base font-semibold text-left text-secondary">
                        {tool.sections?.imageTitle ?? "Upload signature image"}
                      </div>

                      <input
                        id="signature-image-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setImageFile(f);
                          setImageFileName(f ? f.name : "");
                          if (f) {
                            const url = URL.createObjectURL(f);
                            setSignatureUrl((prev) => {
                              if (prev) URL.revokeObjectURL(prev);
                              return url;
                            });
                          } else {
                            setSignatureUrl((prev) => {
                              if (prev) URL.revokeObjectURL(prev);
                              return null;
                            });
                          }
                        }}
                      />

                      <div className="flex flex-col gap-2">
                        {imageFileName ? (
                          <div className="flex items-center justify-between w-full px-4 py-2 bg-white border shadow-inner rounded-xl border-primary-light">
                            <div className="flex items-center min-w-0 gap-2">
                              <BiSolidImageAlt className="w-5 h-5 text-primary" />
                              <span className="text-sm truncate text-primary">
                                {imageFileName}
                              </span>
                            </div>
                            <MdClose
                              className="w-4 h-4 text-gray-400 transition cursor-pointer hover:text-red-500"
                              onClick={() => {
                                setImageFileName("");
                                setImageFile(null);
                                setSignatureUrl((prev) => {
                                  if (prev) URL.revokeObjectURL(prev);
                                  return null;
                                });
                                const input = document.getElementById(
                                  "signature-image-input"
                                ) as HTMLInputElement | null;
                                if (input) input.value = "";
                              }}
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              (
                                document.getElementById(
                                  "signature-image-input"
                                ) as HTMLInputElement | null
                              )?.click()
                            }
                            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-base font-semibold transition bg-white border shadow-inner rounded-xl border-primary-light text-primary hover:ring-2 hover:ring-primary"
                          >
                            <BiImageAdd className="w-6 h-6" />
                            <span>
                              {tool.sections?.imageSelect ??
                                "Select image file"}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Text mode */}
                  {mode === "text" && (
                    <div className="w-full max-w-lg pt-2 text-left">
                      {/* Signer Name only */}
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        {/* Signer Name */}
                        <div>
                          <label className="block mb-2 text-base font-semibold text-secondary">
                            {tool.sections?.textTitle ?? "Signer Name"}
                          </label>
                          <input
                            type="text"
                            value={signatureText}
                            onChange={(e) => setSignatureText(e.target.value)}
                            placeholder={
                              tool.sections?.textPlaceholder ?? "John Doe"
                            }
                            className="w-full px-4 py-2 text-base font-semibold bg-white border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary placeholder:text-primary-light dark:text-background"
                          />
                        </div>
                      </div>

                      {/* Font + Text Color */}
                      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                        {/* Font */}
                        <div>
                          <label className="block mb-2 text-base font-semibold text-secondary">
                            {tool.sections?.fontLabel ?? "Font"}
                          </label>
                          <select
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            className="w-full px-4 py-2 text-base font-semibold bg-white border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary"
                          >
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">
                              Times New Roman
                            </option>
                            <option value="Courier New">Courier New</option>
                          </select>
                        </div>

                        {/* Text Color */}
                        <div>
                          <label className="block mb-2 text-base font-semibold text-secondary">
                            {tool.sections?.textColorLabel ?? "Text Color"}
                          </label>

                          <div className="flex items-center w-full gap-1">
                            <div className="flex-none">
                              <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="color-circle"
                              />
                            </div>

                            <div className="flex-1">
                              <input
                                type="text"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="w-full px-4 py-2 text-base font-semibold bg-white border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hidden canvas renderer for text mode */}
                  {mode === "text" && (
                    <SignatureTextRenderer
                      text={signatureText}
                      fontFamily={fontFamily}
                      color={textColor}
                      onRendered={handleSignatureTextRendered}
                    />
                  )}
                  {/* Signature size slider (all modes) */}
                  {(mode === "draw" || mode === "image" || mode === "text") && (
                    <div className="flex flex-col gap-1 pt-2">
                      <label className="mb-1 text-base font-semibold text-left text-secondary">
                        {tool.sections?.sizeLabel ?? "Signature size"}
                      </label>
                      <input
                        type="range"
                        min={0.3}
                        max={2}
                        step={0.05}
                        value={signatureScale}
                        onChange={(e) =>
                          setSignatureScale(parseFloat(e.target.value))
                        }
                        className="w-full cursor-pointer accent-primary range-primary"
                      />
                    </div>
                  )}
                </div>

                {/* Signature Preview */}
                <div className="p-0 rounded-md">
                  <SignPdfPreview
                    file={first ? first.file : null}
                    signatureUrl={signatureUrl}
                    scale={signatureScale}
                    onPlacementChange={setSignaturePlacement}
                  />
                </div>
              </div>
            );
          }}
        />

        <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
          {tool.info}
        </InfoToggle>

        <SendButton onClick={handleSubmit} loading={loading} />
      </ToolPageWrapper>

      <SignatureCanvasModal
        open={openCanvasModal}
        onClose={() => setOpenCanvasModal(false)}
        onComplete={(url) => setSignatureUrl(url)}
      />
    </>
  );
}
