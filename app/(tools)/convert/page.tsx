// app/(tools)/convert/page.tsx
export default function ConvertHome() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
      <h1 className="mb-2 text-2xl font-bold text-primary">
        Convert PDF to Another Format
      </h1>
      <p className="max-w-md text-secondary">
        Choose from the sidebar whether you&apos;d like to convert your PDF to
        Word, Image, HTML, and more.
      </p>
    </div>
  );
}
