// components/HomepageCard.tsx
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FaChevronRight } from "react-icons/fa6";
interface HomepageCardProps {
  icon?: React.ReactNode;
  title: string;
  href: string;
  imageSrc: string;
}

export default function HomepageCard({
  title,
  href,
  imageSrc,
}: HomepageCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-between p-6 rounded-xl bg-primary-light shadow hover:shadow-md transition-all w-full max-w-md text-secondary hover:text-white hover:bg-primary hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {/* Title + arrow */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{title}</span>
        <FaChevronRight className="transition-transform text-s group-hover:translate-x-1" />
      </div>

      {/* Image with spacing */}
      <div className="p-4 mt-6">
        <Image
          src={imageSrc}
          alt={title}
          width={160}
          height={160}
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
