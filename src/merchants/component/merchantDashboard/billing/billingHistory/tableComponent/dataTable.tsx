"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { endOfDay, startOfDay, subDays } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BillingData, BillingColumns } from "./column";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import Loader from "@/core/components/loader/loader";
import { DatePickerWithRange } from "@/core/components/dateRangePicker";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Billing } from "@prisma/client";

export function BillingHistoryDataTable({
  data,
  isLoading,
}: {
  data: BillingData[];
  isLoading: boolean;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageFromQueryParams = searchParams.get("page");
  const fromDateQueryParam = searchParams.get("from");
  const toDateQueryParam = searchParams.get("to");

  const initialValue = {
    from: fromDateQueryParam ? new Date() : undefined,
    to: toDateQueryParam ? new Date() : undefined,
  };

  const [selectedRange, setSelectedRange] = useState(initialValue);

  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageFromQueryParams) || 1
  );
  const [totalPages, setTotalPages] = useState<number>(1);

  const columns = BillingColumns();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const limit = 10;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    router.push(
      `${pathname}?page=${currentPage - 1}&from=${selectedRange.from}&to=${
        selectedRange.to
      }`
    );
  };

  const handleNextPage = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
    router.push(
      `${pathname}?page=${currentPage + 1}&from=${selectedRange.from}&to=${
        selectedRange.to
      }`
    );
  };

  const handleReset = () => {
    setSelectedRange({ from: undefined, to: undefined });
    setCurrentPage(1);
    router.push(`${pathname}`);
  };

  const handleDateRangeSelection = (range: { from: Date; to: Date }) => {
    setSelectedRange(range);
    setCurrentPage(1);
    router.push(
      `${pathname}?page=${currentPage}&from=${range.from}&to=${range.to}`
    );
  };

  return (
    <div className="w-screen lg:w-full px-10 ">
      <h1 className=" font-bold text-xl py-10">Tagihan</h1>
      <div className="flex justify-between pb-10">
        <DatePickerWithRange
          onSelect={handleDateRangeSelection}
          selected={selectedRange}
          handleReset={handleReset}
        />
      </div>
      <div className="rounded-md border shadow-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground pt-5">
          {currentPage} of {totalPages} Page
        </div>
        {/* <PreviousNextButton
          onPrev={handlePreviousPage}
          page={currentPage}
          onNext={handleNextPage}
          totalPages={totalPages}
        /> */}
      </div>
    </div>
  );
}
