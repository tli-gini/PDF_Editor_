// app/(tools)/editor/page.tsx
export default function EditorHome() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
      <h1 className="mb-2 text-2xl font-bold text-primary">
        View, Annotate, and Edit Your PDF
      </h1>
      <p className="max-w-md text-secondary">
        Add images or page numbers, extract content, change metadata, or compare
        files. Use the sidebar tools to edit your PDF just the way you need.
      </p>
    </div>
  );
}
