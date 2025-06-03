import HomepageCard from "@/components/HomepageCard";

export default function Home() {
  return (
    <section className="min-h-screen px-6 pt-32 pb-10 md:px-20 bg-background text-primary">
      <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        <HomepageCard
          title="Split / Merge / Organize"
          href="/(tools)/structure"
          imageSrc="/img/structure.png"
        />
        <HomepageCard
          title="Convert from PDF"
          href="/(tools)/convert"
          imageSrc="/img/from-pdf.png"
        />
        <HomepageCard
          title="Sign & Security"
          href="/(tools)/security"
          imageSrc="/img/security.png"
        />
        <HomepageCard
          title="View & Edit"
          href="/(tools)/editor"
          imageSrc="/img/editor.png"
        />
      </div>
    </section>
  );
}
