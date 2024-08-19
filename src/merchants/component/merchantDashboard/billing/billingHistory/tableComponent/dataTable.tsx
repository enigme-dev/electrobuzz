"use client";

import { BillingDetailSchema, MerchantModel } from "@/merchants/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";

import { useState, ChangeEvent, useCallback } from "react";
import debounce from "lodash.debounce";
import { Search } from "lucide-react";
import TablePagination from "@/core/components/TablePagination";
import { DataTable } from "@/core/components/DataTable";
import { BillingColumns, BillingData } from "./column";

const MerchantsResponse = z.object({
  data: BillingData.array(),
  total: z.number(),
  page: z.number(),
  length: z.number(),
  perpage: z.number(),
});

type MerchantsResponse = z.infer<typeof MerchantsResponse>;

export default function BillingHistoryDetail() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["billing", page],
    queryFn: async () => {
      const data = axios.get<MerchantsResponse>("/api/merchant/billing", {
        params: { page },
        withCredentials: true,
      });
      return data;
    },
  });

  const handlePageChange = (target: number) => {
    setPage(target);
  };

  return (
    <div className="w-screen lg:w-full pb-10 p-4">
      <h1 className="sm:text-2xl text-lg text-bold py-5">Tagihan</h1>
      <DataTable
        columns={BillingColumns}
        data={data?.data.data || []}
        isLoading={isLoading}
        isError={isError}
      />
      <TablePagination
        length={data?.data.length || 0}
        total={data?.data.total || 0}
        page={data?.data.page || 1}
        onChangePage={handlePageChange}
      />
    </div>
  );
}
