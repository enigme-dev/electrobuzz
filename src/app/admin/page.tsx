"use client";

import { Input } from "@/core/components/ui/input";
import { MerchantModel } from "@/merchants/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, ChangeEvent, useCallback } from "react";
import { z } from "zod";
import debounce from "lodash.debounce";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/core/components/ui/pagination";
import Link from "next/link";
import Image from "next/image";

const MerchantsResponse = z.object({
  data: MerchantModel.array(),
});

type MerchantsResponse = z.infer<typeof MerchantsResponse>;

export default function Page() {
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["merchants", query],
    queryFn: async () => {
      const data = axios.get<MerchantsResponse>("/api/admin/merchants", {
        params: { query },
        withCredentials: true,
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });

  const handleChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    }, 500),
    []
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <div className="wrapper py-10">
      <Input
        type="text"
        placeholder="Search merchant name"
        onChange={handleChange}
        className="px-7 py-5"
      />
      <div className="pt-10" />
      <div className="border border-gray-400 rounded-lg p-7 max-h-[60vh] overflow-auto">
        {data?.data.data.map((merchant) => (
          <div
            key={merchant.merchantId}
            className="border border-gray-200 rounded-lg "
          >
            <Link href={`/admin/merchants/${merchant.merchantId}`}>
              <div className="flex items-center gap-4 p-5">
                <Image
                  src={merchant.merchantPhotoUrl}
                  alt={merchant.merchantName}
                  width={50}
                  height={50}
                  className="w-8 h-8 aspect-square rounded-full"
                />
                <div className="grid grow">
                  <span>{merchant.merchantName}</span>
                  <span>{merchant.merchantCity}</span>
                </div>
                <span className="bg-gray-200 py-2 px-4 rounded-lg ">
                  {merchant.merchantIdentity?.identityStatus}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
