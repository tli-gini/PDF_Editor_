// app/(tools)/structure/page.tsx
export default function StructureHome() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
      <h1 className="mb-2 text-2xl font-bold text-primary">
        Start Structuring Your PDF
      </h1>
      <p className="max-w-md text-secondary">
        Select a tool from the left sidebar to split, merge, organize or rotate
        pages in your PDF file.
      </p>
    </div>
  );
}
