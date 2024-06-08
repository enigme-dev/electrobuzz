"use client";

import { usePathname } from "next/navigation";
import { SheetSide } from "@/core/components/sheetBottom"; // Adjust the import path
import { AlignCenter } from "lucide-react";

const ClientSheetSide: React.FC = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/merchant/dashboard")) {
    return (
      <div className="lg:hidden fixed z-50 bottom-20 left-1/2 transform -translate-x-1/2">
        <SheetSide buttonTrigger={<AlignCenter />} />
      </div>
    );
  }

  return null;
};

export default ClientSheetSide;
