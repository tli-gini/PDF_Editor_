// app/(tools)/editor/page.tsx
export default function EditorHome() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
      <h1 className="mb-2 text-2xl font-bold text-primary">
        Sign, Secure, and Redact Your PDF
      </h1>
      <p className="max-w-md text-secondary">
        Add passwords or watermarks, redact sensitive data, sign with
        certificates, or manage document permissions — all from the tools on the
        left.
      </p>
    </div>
  );
}
