"use client";

import { TMerchantModel } from "@/merchants/types";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "./StatusBadge";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/core/components/ui/button";
import { PencilIcon } from "lucide-react";

export const columns: ColumnDef<TMerchantModel>[] = [
  {
    accessorKey: "merchantName",
    header: "Nama",
    cell: ({ row }) => {
      const photoUrl = row.original.merchantPhotoUrl;
      const name = row.original.merchantName;

      return (
        <div className="flex gap-4 items-center">
          <Image
            src={photoUrl}
            alt={name}
            width={40}
            height={40}
            className="w-[40px] h-[40px] object-cover rounded-full"
          />
          <span className="font-semibold">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "merchantCity",
    header: "Kota",
  },
  {
    accessorKey: "merchantCreatedAt",
    header: "Tanggal Dibuat",
    cell: ({ row }) => {
      const createdAt = dayjs(
        row.original.merchantCreatedAt as unknown as string
      ).format("DD/MM/YYYY");
      return (
        <div className="inline-block">
          <span>{createdAt}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "merchantIdentity",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.merchantIdentity?.identityStatus || "";
      return (
        <div className="inline-block">
          <StatusBadge status={status} />
        </div>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const merchantId = row.original.merchantId || "";
      return (
        <div className="inline-block">
          <Button variant="ghost" className="h-10 w-10 p-1" asChild>
            <Link href={`/admin/merchant/${merchantId}`}>
              <PencilIcon size={16} />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
