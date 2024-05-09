import BookingCard from "@/booking-history/component/bookingCard";
import React from "react";

const BookingPage = () => {
  return (
    <main className="wrapper px-4 pt-10 pb-20">
      <h1 className="text-xl sm:text-2xl font-bold pb-10">Booking History</h1>
      <div className=" grid gap-5 max-h-[70vh] overflow-auto no-scrollbar">
        <BookingCard
          imgSource={"/AdamSucipto.svg"}
          imgAlt={"AdamSucipto"}
          orderId={"kasdj-adk-asda"}
          merchName={"Adam Sucipto"}
          time={"9 Desember 2024, 17:00"}
          status={"pending"}
        />
      </div>
    </main>
  );
};

export default BookingPage;
