export default function ToolPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full p-6 text-center h-min lg:w-5/6 md:w-5/6 rounded-2xl bg-primary-light">
      {children}
    </div>
  );
}
