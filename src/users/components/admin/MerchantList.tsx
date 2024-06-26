"use client";

import { MerchantModel } from "@/merchants/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { DataTable } from "../../../core/components/DataTable";
import { columns } from "./columns";
import { useState, ChangeEvent, useCallback } from "react";
import debounce from "lodash.debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import TablePagination from "../../../core/components/TablePagination";
import { Search } from "lucide-react";

const MerchantsResponse = z.object({
  data: MerchantModel.array(),
  total: z.number(),
  page: z.number(),
  length: z.number(),
  perpage: z.number(),
});

type MerchantsResponse = z.infer<typeof MerchantsResponse>;

export default function MerchantList() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [identityStatus, setIdentityStatus] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin/merchants", query, identityStatus, page],
    queryFn: async () => {
      const data = axios.get<MerchantsResponse>("/api/admin/merchant", {
        params: { query, status: identityStatus, page },
        withCredentials: true,
      });
      return data;
    },
  });

  const handlePageChange = (target: number) => {
    setPage(target);
  };

  const handleQueryChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      handlePageChange(1);
    }, 500),
    []
  );

  const handleStatusChange = (value: string) => {
    setIdentityStatus(value);
    handlePageChange(1);
  };

  return (
    <>
      <div className="flex justify-between gap-8 p-3 border-x border-t rounded-t-md">
        <div className="grow flex items-center gap-2 h-10 max-w-[400px] rounded-md border bg-background px-3 py-2 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Cari Mitra..."
            className="w-full text-sm placeholder:text-muted-foreground focus-visible:outline-none"
            onChange={handleQueryChange}
          />
        </div>
        <Select onValueChange={handleStatusChange} defaultValue="all">
          <SelectTrigger className="grow max-w-[200px]">
            <SelectValue placeholder="Pilih status Mitra" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
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
    </>
  );
}
