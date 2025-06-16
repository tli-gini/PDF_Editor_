"use client";

import HomepageCard from "@/components/HomepageCard";
import { useI18n } from "@/lib/i18n-context";

export default function Home() {
  const { t } = useI18n();

  return (
    <section className="min-h-screen px-6 pt-32 pb-10 md:px-20 bg-background text-primary">
      <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        <HomepageCard
          title={t.home.structure}
          href="/structure"
          imageSrc="/img/structure.png"
        />
        <HomepageCard
          title={t.home.convert}
          href="/convert"
          imageSrc="/img/from-pdf.png"
        />
        <HomepageCard
          title={t.home.security}
          href="/security"
          imageSrc="/img/security.png"
        />
        <HomepageCard
          title={t.home.editor}
          href="/editor"
          imageSrc="/img/editor.png"
        />
      </div>
    </section>
  );
}
