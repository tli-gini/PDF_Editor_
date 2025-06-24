export default function ToolPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center lg:w-9/12 md:w-9/12 rounded-2xl bg-primary-light">
      {children}
    </div>
  );
}
