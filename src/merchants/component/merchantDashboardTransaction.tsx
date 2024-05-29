import BookingCard from "@/bookings/component/bookingCard";
import { TBookingModel, TGetMerchantBookings } from "@/bookings/types";
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
    item: "All",
  },
  {
    value: "pending",
    item: "Pending",
  },
  {
    value: "rejected",
    item: "Rejected",
  },
  {
    value: "canceled",
    item: "Canceled",
  },
  {
    value: "accepted",
    item: "Accepted",
  },
  {
    value: "inProgressRequest",
    item: "In Progress",
  },
  {
    value: "inProgressAccepted",
    item: "On Going",
  },
  {
    value: "done",
    item: "Done",
  },
  {
    value: "expired",
    item: "Expired",
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
    status,
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
    return <Loader />;
  }

  return (
    <main className="px-4 pt-10 w-full">
      <h1 className="text-xl sm:text-2xl font-bold pb-5">Transaksi</h1>
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
      <div className=" grid gap-5 max-h-[60vh] sm:max-h-[70vh] overflow-auto no-scrollbar pb-20 sm:pb-5">
        {bookingDataAsMerchant?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.length !== 0 ? (
              page.data.map((value: any) => (
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
                    imgSource={value.user.image}
                    imgAlt={value.user.name}
                    orderId={
                      value.bookingId
                        ? value.bookingId
                        : ""
                        ? value.bookingId
                        : ""
                    }
                    merchName={value.user.name}
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
      </div>
    </main>
  );
};
export default MerchantDashboardTransaction;
