import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
  billingId: string;
}

const BillingTableAction: React.FC<Props> = ({ billingId }) => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className=" h-8 w-8 p-0"
          onClick={() => setIsOpen(true)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      {isOpen ? (
        <DropdownMenuContent className="text-center" align="end">
          <div className="grid">
            <Link href={`/merchant/dashboard/billing/${billingId}`}>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Lihat Detail
              </Button>
            </Link>
          </div>
        </DropdownMenuContent>
      ) : (
        ""
      )}
    </DropdownMenu>
  );
};

export default BillingTableAction;
