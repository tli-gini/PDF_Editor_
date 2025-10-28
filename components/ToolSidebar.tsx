// components/ToolSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdContentCut,
  MdOutlineDelete,
  MdFilter3,
  MdMoveUp,
  MdOutlineRotateRight,
  MdOutlineZoomInMap,
  MdOutlineWaterDrop,
  MdOutlineCompare,
  // MdOutlinePhotoLibrary,
  MdManageSearch,
  MdOutlineNumbers,
} from "react-icons/md";
import {
  TbLayoutBoard,
  TbLock,
  TbLockOpen2,
  TbSignature,
} from "react-icons/tb";
import { AiOutlineMergeCells } from "react-icons/ai";
import {
  PiFileDoc,
  PiFileHtml,
  PiFileCsv,
  PiFilePpt,
  PiFileTxt,
} from "react-icons/pi";
import { LuCodeXml } from "react-icons/lu";
import { LiaMarkdown } from "react-icons/lia";
import { useI18n } from "@/lib/i18n-context";

export default function ToolSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navMap: Record<
    string,
    { href: string; key: keyof typeof t.tools; icon: React.ReactNode }[]
  > = {
    "/structure": [
      { href: "/structure/split", key: "split", icon: <MdContentCut /> },
      { href: "/structure/merge", key: "merge", icon: <AiOutlineMergeCells /> },
      {
        href: "/structure/rotate",
        key: "rotate",
        icon: <MdOutlineRotateRight />,
      },
      { href: "/structure/remove", key: "remove", icon: <MdOutlineDelete /> },
      {
        href: "/structure/compress",
        key: "compress",
        icon: <MdOutlineZoomInMap />,
      },

      { href: "/structure/organize", key: "organize", icon: <MdMoveUp /> },

      { href: "/structure/extract", key: "extract", icon: <MdFilter3 /> },
      {
        href: "/structure/multi-page",
        key: "multi-page",
        icon: <TbLayoutBoard />,
      },
    ],
    "/convert": [
      { href: "/convert/word", key: "word", icon: <PiFileDoc /> },
      { href: "/convert/ppt", key: "ppt", icon: <PiFilePpt /> },
      { href: "/convert/text", key: "text", icon: <PiFileTxt /> },
      { href: "/convert/html", key: "html", icon: <PiFileHtml /> },
      { href: "/convert/csv", key: "csv", icon: <PiFileCsv /> },
      { href: "/convert/xml", key: "xml", icon: <LuCodeXml /> },
      { href: "/convert/markdown", key: "markdown", icon: <LiaMarkdown /> },
    ],
    "/security": [
      { href: "/security/sign", key: "sign", icon: <TbSignature /> },
      {
        href: "/security/add-password",
        key: "add-password",
        icon: <TbLock />,
      },
      {
        href: "/security/remove-password",
        key: "remove-password",
        icon: <TbLockOpen2 />,
      },
      {
        href: "/security/add-watermark",
        key: "add-watermark",
        icon: <MdOutlineWaterDrop />,
      },
    ],
    "/editor": [
      {
        href: "/editor/compare",
        key: "compare",
        icon: <MdOutlineCompare />,
      },
      // {
      //   href: "/editor/extract-images",
      //   key: "extract-images",
      //   icon: <MdOutlinePhotoLibrary />,
      // },
      {
        href: "/editor/ocr-pdf",
        key: "ocr-pdf",
        icon: <MdManageSearch />,
      },
      {
        href: "/editor/add-page-numbers",
        key: "add-page-numbers",
        icon: <MdOutlineNumbers />,
      },
    ],
  };

  const currentSection = Object.keys(navMap).find((section) =>
    pathname.startsWith(section)
  );
  const navItems = currentSection ? navMap[currentSection] : [];

  const sectionTitleMap: Record<string, string> = {
    "/structure": t.home.structure,
    "/convert": t.home.convert,
    "/security": t.home.security,
    "/editor": t.home.editor,
  };

  const sectionTitle = currentSection ? sectionTitleMap[currentSection] : "";

  return (
    <div className="flex flex-col gap-4 px-0">
      {sectionTitle && (
        <h2 className="text-left text-primary text-[16px] lg:text-[18px] font-bold px-[16px] pb-2">
          {sectionTitle}
        </h2>
      )}
      <ul className="flex overflow-x-auto lg:gap-3.5 lg:flex-col whitespace-nowrap scrollbar-hide pb-2">
        {navItems.map(({ href, key, icon }) => {
          const isActive = pathname === href;
          return (
            <li
              key={href}
              className={`w-max ${isActive ? "mx-3 lg:mx-0" : "mx-0"}`}
            >
              <Link
                href={href}
                className={`group flex flex-row items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-primary bg-transparent lg:hover:bg-primary lg:hover:text-white"
                  }`}
              >
                <span
                  className={`text-2xl p-2 rounded-full transition-all duration-300 transform
                    ${
                      isActive
                        ? "bg-white text-primary group-hover:scale-100"
                        : "bg-primary text-white lg:group-hover:bg-white lg:group-hover:text-primary"
                    }
                    scale-100 lg:group-hover:scale-100 group-hover:scale-110`}
                >
                  {icon}
                </span>

                <span
                  className={`text-[14px] lg:text-[16px] font-semibold transition-all duration-300 transform
                    ${
                      isActive
                        ? "scale-100"
                        : "group-hover:scale-110 lg:group-hover:scale-100"
                    }`}
                >
                  {t.tools[key].label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
