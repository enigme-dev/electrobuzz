"use client";

import BookingCard from "@/bookings/component/bookingCard";
import { BookStatusEnum, TGetUserBooking } from "@/bookings/types";
import { CalendarPicker } from "@/core/components/calendarPicker";
import { DatePickerWithRange } from "@/core/components/dateRangePicker";
import Loader from "@/core/components/loader/loader";
import { SelectOption } from "@/core/components/select-option";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios, { ParamsSerializerOptions } from "axios";
import { format, toDate } from "date-fns";
import { useInView } from "react-intersection-observer";

import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const selectStatusFilter = [
  {
    value: "all",
    item: "Semua",
  },
  {
    value: "pending",
    item: "Menunggu konfirmasi",
  },
  {
    value: "rejected",
    item: "Ditolak mitra",
  },
  {
    value: "canceled",
    item: "Dibatalkan pengguna",
  },
  {
    value: "accepted",
    item: "Diterima mitra",
  },
  {
    value: "in_progress_requested",
    item: "Permohonan service",
  },
  {
    value: "in_progress_accepted",
    item: "Proses service",
  },
  {
    value: "done",
    item: "Selesai",
  },
  {
    value: "expired",
    item: "Kadaluwarsa",
  },
];

interface BookingDataResponse {
  data: TGetUserBooking[];
  page: number;
  total: number;
  perpage: number;
}

const BookingPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageFromQueryParams = searchParams.get("page");
  const fromDateQueryParam = searchParams.get("start-date");
  const toDateQueryParam = searchParams.get("end-date");
  const statusQueryParam = searchParams.get("status");
  const allQueryParams = searchParams.getAll("");

  const initialValue = {
    from: fromDateQueryParam ? new Date(fromDateQueryParam) : undefined,
    to: toDateQueryParam ? new Date(toDateQueryParam) : undefined,
  };
  const initialFilterValue = statusQueryParam;
  const [selectedRange, setSelectedRange] = useState(initialValue);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageFromQueryParams) || 1
  );

  const params = {
    page: pageFromQueryParams,
    "start-date": fromDateQueryParam,
    "end-date": toDateQueryParam,
    status: statusQueryParam,
  };

  const { ref, inView } = useInView();

  const {
    status,
    data: bookingData,
    error,
    isLoading: bookingListLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getBookingData", session?.user?.id, params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get<BookingDataResponse>(
        "/api/user/booking",
        {
          params: {
            ...params,
            page: pageParam,
          },
        }
      );
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total, perpage } = lastPage;
      if (page * perpage < total) {
        return page + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  function handleFilterValue(value: string) {
    router.push(
      `${pathname}?page=${currentPage}&start-date=${fromDateQueryParam}&end-date=${toDateQueryParam}&status=${value}`
    );
  }
  const handleReset = () => {
    setSelectedRange({ from: undefined, to: undefined });
    setCurrentPage(1);
    router.push(
      `${pathname}?page=${currentPage}&start-date=&end-date=&status=${initialFilterValue}`
    );
  };
  const formatDateString = (date: Date | undefined) => {
    return format(date ? date : "", "yyyy-MM-dd"); // Convert to "YYYY-MM-DD" format using date-fns
  };
  const handleDateRangeAndFilterSelection = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setSelectedRange(range);
    setCurrentPage(1);
    router.push(
      `${pathname}?page=${currentPage}&start-date=${formatDateString(
        range.from
      )}&end-date=${formatDateString(range.to)}&status=${
        statusQueryParam ? statusQueryParam : "all"
      }`
    );
  };

  if (bookingListLoading) {
    return <Loader />;
  }

  return (
    <main className="wrapper px-4 pt-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-5">Booking History</h1>
      <div className="flex items-center justify-between sm:justify-start gap-8 mb-5 sm:w-[25vw]">
        <DatePickerWithRange
          onSelect={handleDateRangeAndFilterSelection}
          selected={selectedRange}
          handleReset={handleReset}
        />
        <SelectOption
          onValueChange={handleFilterValue}
          defaultValue={initialFilterValue ? initialFilterValue : ""}
          selectList={selectStatusFilter}
          placeholder="Pilih Status"
        />
      </div>
      <div className="relative grid gap-5 max-h-[60vh] sm:max-h-[70vh] overflow-auto no-scrollbar pb-24">
        {bookingData?.pages?.flat().length !== 0 ? (
          bookingData?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.map((value: TGetUserBooking) => (
                <div key={value.bookingId}>
                  <BookingCard
                    bookImgAlt={value.bookingId}
                    estimatePrice={{
                      estimatePriceMax: value.bookingPriceMax
                        ? value.bookingPriceMax.toString()
                        : "",
                      estimatePriceMin: value.bookingPriceMin
                        ? value.bookingPriceMin.toString()
                        : "",
                    }}
                    bookingComplaintImg={value.bookingPhotoUrl}
                    bookingComplaintDesc={value.bookingComplain}
                    imgSource={value.merchant.merchantPhotoUrl}
                    imgAlt={value.merchant.merchantName}
                    orderId={
                      value.bookingId
                        ? value.bookingId
                        : ""
                        ? value.bookingId
                        : ""
                    }
                    merchName={value.merchant.merchantName}
                    bookingSchedule={value.bookingSchedule.toString()}
                    bookingCreatedAt={
                      value.bookingCreatedAt
                        ? value.bookingCreatedAt.toString()
                        : ""
                    }
                    status={value.bookingStatus}
                    merchantId={value.merchant.merchantId}
                  />
                </div>
              ))}
            </React.Fragment>
          ))
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center">Hasil tidak ditemukan</div>
          </div>
        )}
        <div ref={ref}>{isFetchingNextPage && <Loader />}</div>
      </div>
    </main>
  );
};

export default BookingPage;
