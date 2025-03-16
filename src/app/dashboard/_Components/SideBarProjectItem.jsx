"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { cn } from "../../../lib/utils";

const inter = Inter({ subsets: ["latin"] });

function SideBarProjectItem({ icon, href, label }) {
  const pathname = usePathname();
  const isActive = pathname === `/projects/${href}/` || pathname.startsWith(`/projects/${href}/`);
  return (
    <Link
      href={`/projects/${href}/`}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200",
        isActive
          ? "bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-500"
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
      )}
    >
      {icon}
      <span className={`${inter.className} text-sm font-medium`}>{label}</span>
    </Link>
  );
}

export default SideBarProjectItem;
