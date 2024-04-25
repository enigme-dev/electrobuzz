"use client";

import { AlertDialogComponent } from "@/core/components/alertDialog";
import { DialogGeneral } from "@/core/components/generalDialog";
import { RadioGroupForm } from "@/core/components/radioGroup";
import { Button } from "@/core/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const BookingDetail = () => {
  const status = "Accepted";
  const pathname = usePathname();
  const radioOptionsForCancelReason = [
    { option: "Budjet tidak cukup" },
    { option: "Mau cari teknisi lain" },
    { option: "Mau ubah jadwal" },
    { option: "Other" },
  ];

  return (
    <main className="wrapper py-10">
      {/* {status == "Awaiting" && (
        <>
          <div className="flex items-center justify-center">
            <Image
              src="/Conversation-cuate.svg"
              alt="bookDetailBanner"
              className=" w-96 "
              width={900}
              height={500}
            />
          </div>
          <div className="grid place-content-center text-center gap-5">
            <h1 className="pt-10 text-2xl font-bold">Sabar...</h1>
            <p>Mohon menunggu konfirmasi Merchant</p>
            <Link href={"/bookings"}>
              <Button>Kembali</Button>
            </Link>
          </div>
        </>
      )}
      {status == "Denied" && (
        <>
          <div className="flex items-center justify-center">
            <Image
              src="/Feeling sorry-cuate.svg"
              alt="Feeling sorry-cuate"
              className=" w-96 "
              width={900}
              height={500}
            />
          </div>
          <div className="grid place-content-center text-center gap-5">
            <div>
              <h1 className="pt-10 text-2xl font-bold">Maaf...</h1>
              <p className="pt-2">Permintaan anda telah ditolak oleh Mitra</p>
              <h1 className="pt-2 text-left text-md">Alasan:</h1>
              <p className="font-bold">Tidak dapat diservis</p>
            </div>
            <Link href={"/bookings"}>
              <Button>Kembali</Button>
            </Link>
          </div>
        </>
      )} */}
      {status == "Accepted" && (
        <>
          <div className="flex items-center justify-center">
            <Image
              src="/Light bulb-cuate.svg"
              alt="bookDetailBanner"
              className=" w-96 "
              width={900}
              height={500}
            />
          </div>
          <div className="grid place-content-center text-center gap-5">
            <h1 className="pt-10 text-2xl font-bold">Selamat...</h1>
            <p className="text-md text-left">
              Sepertinya Mitra telah menerima permintaanmu, berikut merupakan
              estimasi harga servismu:
            </p>
            <p className="font-bold">Rp.700.000 - Rp.1000.000</p>
            <h1 className="pt-2 text-left text-md">Alasan:</h1>
            <p className="font-bold text-left">
              Perlu ganti kapasitor sekitar 700.000
            </p>
            <div className="flex gap-10 justify-end items-center">
              <DialogGeneral
                dialogTitle="Alasan Penolakan"
                dialogDescription={
                  <RadioGroupForm options={radioOptionsForCancelReason} />
                }
                buttonTitle={"Tolak"}
                buttonFooterTitle={"Submit"}
              />
              <AlertDialogComponent
                dialogTitle="Apakah kamu yakin?"
                buttonVariant={"outline"}
                buttonContinueLink={`${pathname}/booking-detail`}
                dialogDescription={
                  "Pastikan budgetmu cukup untuk membayar teknisi ya.."
                }
                buttonTitle={"Terima"}
              />
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default BookingDetail;
