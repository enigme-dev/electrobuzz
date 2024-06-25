import { Button } from "@/core/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function TablePagination({
  length,
  total,
  page,
  onChangePage,
  className,
  rowsPerPage = 10,
}: {
  length: number;
  total: number;
  page: number;
  onChangePage: (value: number) => void;
  className?: string;
  rowsPerPage?: number;
}) {
  const low = (page - 1) * rowsPerPage + 1;
  const high = low + length - 1;
  return (
    <div
      className={twMerge(
        "flex justify-end items-center gap-4 p-3 border-x border-b rounded-b-md",
        className
      )}
    >
      {length > 0 && (
        <span className="text-sm">
          Menampilkan {low}-{high} dari {total}
        </span>
      )}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="p-1 h-10 w-10"
          onClick={() => onChangePage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          variant="ghost"
          className="p-1 h-10 w-10"
          onClick={() => onChangePage(page + 1)}
          disabled={page * rowsPerPage >= total}
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
