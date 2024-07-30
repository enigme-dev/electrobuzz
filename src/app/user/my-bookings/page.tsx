"use client";

import BookingCard from "@/bookings/component/bookingCard";
import { TGetUserBooking } from "@/bookings/types";

import { DatePickerWithRange } from "@/core/components/dateRangePicker";
import Loader from "@/core/components/loader/loader";
import { SelectOption } from "@/core/components/select-option";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useInView } from "react-intersection-observer";

import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

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
  const { data: session, status } = useSession();
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
  const initialFilterValue = statusQueryParam || "all";
  const [selectedRange, setSelectedRange] = useState(initialValue);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageFromQueryParams) || 1
  );

  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const params = {
    page: pageFromQueryParams,
    "start-date": fromDateQueryParam,
    "end-date": toDateQueryParam,
    status: statusQueryParam,
  };

  const { ref, inView } = useInView();

  const {
    data: bookingData,
    status: bookingDataStatus,
    error,
    isLoading: bookingListLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getBookingData", params],
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
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
      `${pathname}?page=${currentPage}&start-date=${
        formatDateString(range.from) || ""
      }&end-date=${formatDateString(range.to) || ""}&status=${
        statusQueryParam ? statusQueryParam : ""
      }`
    );
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY - 1 < lastScrollY;

      setIsFilterVisible(isScrollingUp);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (bookingListLoading) {
    return <Loader />;
  }

  return (
    <main className="wrapper px-4">
      <div
        className={`sticky top-0  w-full transition-transform duration-300 ${
          isFilterVisible ? "translate-y-0" : "-translate-y-48"
        }  z-50 bg-white dark:bg-slate-950 pt-10 pb-5`}
      >
        <h1 className="text-xl sm:text-2xl font-bold mb-5">Riwayat Pesanan</h1>
        <div className="flex items-center justify-between sm:justify-start gap-8 mb-5 sm:w-[500px]">
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
      <div className="grid gap-5 pb-24">
        {bookingData?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.length !== 0 && page.perpage === 10 ? (
              page.data.map((value: TGetUserBooking) => (
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
                    bookingComplaintImg={
                      value.bookingPhotoUrl ? value.bookingPhotoUrl : ""
                    }
                    bookingComplaintDesc={
                      value.bookingComplain ? value.bookingComplain : ""
                    }
                    imgSource={
                      value.merchant.merchantPhotoUrl
                        ? value.merchant.merchantPhotoUrl
                        : ""
                    }
                    imgAlt={value.merchant.merchantName}
                    orderId={value.bookingId ? value.bookingId : ""}
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

export default BookingPage;
