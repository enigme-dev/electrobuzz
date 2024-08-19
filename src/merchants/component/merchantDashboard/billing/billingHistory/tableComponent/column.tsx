import CustomBadge from "@/core/components/CustomBadge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import BillingTableAction from "../billingTableAction";
import { z } from "zod";
import { BillingDetailData } from "../../billingPaymentDetailData/billingPaymentDetail";

export const BillingData = z.object({
  billingId: z.string(),
  billingQty: z.string(),
  billingAmount: z.number(),
  billingCreatedAt: z.date(),
  billingPaid: z.boolean(),
});

export type TBillingData = z.infer<typeof BillingData>;

export const BillingColumns: ColumnDef<TBillingData>[] = [
  {
    accessorKey: "billingQty",
    header: "Jumlah Transaksi Selesai",
  },
  {
    accessorKey: "billingAmount",
    header: "Total Pembayaran",
  },
  {
    accessorKey: "billingCreatedAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const formattedDate = format(
        new Date(row.getValue("billingCreatedAt")),
        "dd MMMM yyyy, HH:mm"
      );
      return <div className="text-left">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "billingPaid",
    header: "Status",
    cell: ({ row }: any) => {
      const billingStatus = row.original.billingPaid;
      switch (billingStatus) {
        case false: {
          return <CustomBadge title="Belum Bayar" status={"failed"} />;
        }
        case true: {
          return <CustomBadge title="Sudah Bayar" status={"success"} />;
        }
        default: {
          return (
            <CustomBadge title="Belum Ada Transaksi" status={"no status"} />
          );
        }
      }
    },
  },
  {
    header: "Action",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div>
          <BillingTableAction billingId={String(row.original.billingId)} />
        </div>
      );
    },
  },
];
