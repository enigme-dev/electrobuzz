"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { format, subDays } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { TransactionDoneColumns } from "./column";
import { TGetMerchantBookingDone } from "@/bookings/types";
import dayjs from "dayjs";

interface BookingDataResponse {
  data: TGetMerchantBookingDone[];
  page: number;
  total: number;
  perpage: number;
}

export function TransactionDoneDataTable({
  billingCreatedAt,
}: {
  billingCreatedAt?: Date;
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

  const params = {
    page: 1,
    "start-date": dayjs(billingCreatedAt)
      .subtract(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD"),
    "end-date": dayjs(billingCreatedAt)
      .subtract(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD"),
    status: "done",
  };

  const {
    data: getBookingsDataDone,
    status: bookingDataStatus,
    error,
    isLoading: getBookingsDataDoneLoading,
  } = useQuery({
    queryKey: ["getBookingData", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get<BookingDataResponse>(
        "/api/merchant/booking",
        {
          params: params,
        }
      );
      return response.data;
    },
  });

  const data = getBookingsDataDone ? getBookingsDataDone.data : [];

  const columns = TransactionDoneColumns();

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
    <div>
      <h1 className="font-bold text-lg mb-5">Transaksi Selesai</h1>
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
            {getBookingsDataDoneLoading ? (
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
