import CustomBadge from "@/core/components/CustomBadge";
import { TCreateBillingSchema, TCreateBillingsSchema } from "@/merchants/types";
import { Billing } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import BillingTableAction from "../../billingHistory/billingTableAction";
import { BillingDetailData } from "../billingPaymentDetail";
import { TGetMerchantBookingDone } from "@/bookings/types";

export const TransactionDoneColumns: () => ColumnDef<TGetMerchantBookingDone>[] =
  () => [
    {
      accessorKey: "bookingComplain",
      header: "Keluhan",
      cell: ({ row }) => {
        const bookingComplains = row.getValue("bookingComplain") as string;
        return (
          <div className="text-left max-w-[500px]">
            <p className="truncate">{bookingComplains}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "user.name",
      header: "Nama",
    },
    {
      accessorKey: "bookingCreatedAt",
      header: "Tanggal",
      cell: ({ row }) => {
        const formattedDate = format(
          new Date(row.getValue("bookingCreatedAt")),
          "dd MMMM yyyy, HH:mm"
        );
        return <div className="text-left">{formattedDate}</div>;
      },
    },
    // {
    //   accessorKey: "bookingStatus",
    //   header: "Status",
    //   cell: ({ row }: any) => {
    //     const bookingStatus = row.original.bookingStatus;
    //     switch (bookingStatus) {
    //       case "done": {
    //         return <CustomBadge title="Done" status={"success"} />;
    //       }
    //       default: {
    //         return <CustomBadge title="Done" status={"success"} />;
    //       }
    //     }
    //   },
    // },
  ];
