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
    <div className="wrapper">
      <Input
        type="text"
        placeholder="Search merchant name"
        onChange={handleChange}
      />
      <div>
        {data?.data.data.map((merchant) => (
          <a
            key={merchant.merchantId}
            href={`/admin/merchants/${merchant.merchantId}`}
          >
            <div className="flex items-center gap-4">
              <img
                src={merchant.merchantPhotoUrl}
                alt={merchant.merchantName}
                className="w-8 h-8"
              />
              <div className="grid grow">
                <span>{merchant.merchantName}</span>
                <span>{merchant.merchantCity}</span>
              </div>
              <span>{merchant.merchantIdentity?.identityStatus}</span>
            </div>
          </a>
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
