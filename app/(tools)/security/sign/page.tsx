/* eslint-disable @typescript-eslint/no-unused-vars */

// app/(tools)/security/sign/page.tsx
"use client";

import { useState } from "react";
import type React from "react";
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
import SignPdfPreview from "@/components/SignPdfPreview";
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

  // Image signature state（for upload）
  const [imageFileName, setImageFileName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Text signature options
  const [fontFamily, setFontFamily] = useState("Helvetica");
  const [fontSize, setFontSize] = useState("16");
  const [textColor, setTextColor] = useState("#000000");

  const active = files[0] ?? null;

  const handleSignClick = async () => {
    if (!active) {
      toast.warn(t.toast.missingFile);
      return;
    }
    toast.info(
      "Signing preview UI ready. The actual PDF signing API is not wired yet."
    );
  };

  const handleUndo = () => {
    toast.info("Undo is not implemented yet.");
  };

  const handleRedo = () => {
    toast.info("Redo is not implemented yet.");
  };

  // const currentHowTo =
  //   mode === "draw"
  //     ? tool.howTo?.canvasBody
  //     : mode === "image"
  //     ? tool.howTo?.imageBody
  // : tool.howTo?.textBody;

  return (
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
              <div className="flex flex-col gap-3 p-4 text-sm rounded-md bg-white/80 text-secondary dark:text-background">
                {/* Tabs：Canvas / Image / Text */}
                <div className="flex flex-col gap-1">
                  <div className="grid w-full grid-cols-3 text-base font-semibold text-center">
                    <TabButton
                      label={tool.tabs?.canvas ?? "Canvas"}
                      active={mode === "draw"}
                      onClick={() => setMode("draw")}
                    />
                    <TabButton
                      label={tool.tabs?.image ?? "Image"}
                      active={mode === "image"}
                      onClick={() => setMode("image")}
                    />
                    <TabButton
                      label={tool.tabs?.text ?? "Text"}
                      active={mode === "text"}
                      onClick={() => setMode("text")}
                    />
                  </div>

                  <div className="h-0.5 w-full bg-white">
                    <div
                      className="h-0.5 bg-primary transition-all"
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

                {/* Undo / Redo */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="flex-1 px-4 py-2 text-base font-semibold transition bg-white border rounded-lg text-primary border-primary hover:bg-primary/5"
                  >
                    {tool.actions?.undo ?? "Undo"}
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    className="flex-1 px-4 py-2 text-base font-semibold transition bg-white border rounded-lg text-primary border-primary hover:bg-primary/5"
                  >
                    {tool.actions?.redo ?? "Redo"}
                  </button>
                </div>

                {/* Canvas */}
                {mode === "draw" && (
                  <div className="flex flex-col gap-3 pt-1">
                    <div className="text-base font-semibold text-left text-secondary">
                      {tool.sections?.canvasTitle ?? "Draw your signature"}
                    </div>
                    <button
                      type="button"
                      className="flex flex-col items-center justify-center w-full h-32 text-xs border rounded-md border-primary-light bg-white/60 text-secondary hover:bg-primary/5"
                      // canvas
                      onClick={() =>
                        toast.info("Drawing canvas is not implemented yet.")
                      }
                    >
                      <div className="w-full h-full border border-dashed rounded-md border-primary-light bg-white/80" />
                      <span className="my-1 text-sm text-secondary/80">
                        {tool.sections?.canvasHint ??
                          "Click to open drawing canvas"}
                      </span>
                    </button>
                  </div>
                )}

                {/* Image */}
                {mode === "image" && (
                  <div className="flex flex-col gap-3 pt-1">
                    <div className="text-base font-semibold text-secondary">
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
                            {tool.sections?.imageSelect ?? "Select image file"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Text */}
                {mode === "text" && (
                  <div className="w-full max-w-lg pt-2 text-left">
                    {/* Signer Name + Font Size */}
                    <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2">
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

                      {/* Font Size */}
                      <div>
                        <label className="block mb-2 text-base font-semibold text-secondary">
                          {tool.sections?.fontSizeLabel ?? "Font Size"}
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={fontSize}
                          onChange={(e) => setFontSize(e.target.value)}
                          className="w-full px-4 py-2 text-base font-semibold bg-white border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary"
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

                {/* Hints */}
                {/* {currentHowTo && (
                  <div className="mt-2 text-xs rounded-md bg-primary/5">
                    <div className="px-3 pt-3 pb-2">
                      <div className="mb-1 text-sm font-semibold text-primary">
                        {tool.howTo?.title ?? "How to add signature"}
                      </div>
                      <p className="leading-relaxed text-secondary">
                        {currentHowTo}
                      </p>
                    </div>
                  </div>
                )} */}
              </div>

              {/* Signature Preview */}
              <div className="p-0 rounded-md">
                <SignPdfPreview
                  file={first ? first.file : null}
                  signatureUrl={signatureUrl}
                />
              </div>
            </div>
          );
        }}
      />

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {tool.info}
      </InfoToggle>

      <SendButton onClick={handleSignClick} loading={loading} />
    </ToolPageWrapper>
  );
}

type ModeButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function TabButton({ label, active, onClick }: ModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pb-1 border-b-2 ${
        active
          ? "border-transparent text-primary"
          : "border-transparent text-secondary/70 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}
