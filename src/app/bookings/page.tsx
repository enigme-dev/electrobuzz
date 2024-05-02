import BookingCard from "@/booking-history/component/bookingCard";
import React from "react";

const BookingPage = () => {
  return (
    <main className="wrapper py-20">
      <h1 className="text-2xl font-bold">Booking History</h1>
      <div className="pt-10 grid gap-9">
        <BookingCard
          imgSource={"/AdamSucipto.svg"}
          imgAlt={"AdamSucipto"}
          orderId={"kasdj-adk-asda"}
          merchName={"Adam Sucipto"}
          location={"Bogor"}
          status={"Awaiting"}
        />
        <BookingCard
          imgSource={"/service-ac-ELOBANA.jpeg"}
          imgAlt={"service-ac-ELOBANA"}
          orderId={"asd-124-qwqsd"}
          merchName={"Service AC ELOBANA"}
          location={"Bogor"}
          status={"Denied"}
        />
      </div>
    </main>
  );
};

export default BookingPage;
