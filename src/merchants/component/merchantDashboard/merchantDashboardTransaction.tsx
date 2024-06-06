import BookingCard from "@/bookings/component/bookingCard";
import {
  TBookingModel,
  TGetMerchantBookingDone,
  TGetMerchantBookings,
} from "@/bookings/types";
import { CalendarPicker } from "@/core/components/calendarPicker";
import { DatePickerWithRange } from "@/core/components/dateRangePicker";
import Loader from "@/core/components/loader/loader";
import { SelectOption } from "@/core/components/select-option";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
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
  data: TGetMerchantBookings;
  page: number;
  total: number;
  perpage: number;
}

const MerchantDashboardTransaction = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageFromQueryParams = searchParams.get("page");
  const fromDateQueryParam = searchParams.get("start-date");
  const toDateQueryParam = searchParams.get("end-date");
  const statusQueryParam = searchParams.get("status");

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
    data: bookingDataAsMerchant,
    error,
    isLoading: bookingListLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getBookingData", session?.user?.id, params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get<BookingDataResponse>(
        "/api/merchant/booking",
        {
          params: {
            ...params,
            page: pageParam,
          },
        }
      );
      return response.data;
    },
    enabled: !!session?.user?.id,
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
    return format(date ? date : "", "yyyy-MM-dd");
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
    return (
      <div className="w-screen sm:w-[80vw] ">
        <Loader />
      </div>
    );
  }

  return (
    <main className="px-4 w-screen lg:w-full">
      <div className="sticky top-0 bg-white dark:bg-slate-950 w-full py-5">
        <h1 className="text-xl sm:text-2xl font-bold pb-5 pl-16 sm:pl-0">
          Transaksi
        </h1>
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
      </div>
      <div className=" grid gap-5 pb-20 sm:pb-5">
        {bookingDataAsMerchant?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.total !== 0 && page.perpage === 10 ? (
              page.data.map((value: any) => (
                <div key={value}>
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
                    imgSource={value.user ? value.user.image : ""}
                    imgAlt={value.user ? value.user.name : ""}
                    orderId={
                      value.bookingId
                        ? value.bookingId
                        : ""
                        ? value.bookingId
                        : ""
                    }
                    merchName={value.user.name ? value.user.name : ""}
                    bookingSchedule={value.bookingSchedule.toString()}
                    bookingCreatedAt={
                      value.bookingCreatedAt
                        ? value.bookingCreatedAt.toString()
                        : ""
                    }
                    status={value.bookingStatus}
                    isMerchant={true}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">Hasil tidak ditemukan</div>
              </div>
            )}
          </React.Fragment>
        ))}
        <div ref={ref}>{isFetchingNextPage && <Loader />}</div>
      </div>
    </main>
  );
};
export default MerchantDashboardTransaction;
