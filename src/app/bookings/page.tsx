import BookingCard from "@/booking-history/component/bookingCard";
import React from "react";

const BookingPage = () => {
  return (
    <main className="wrapper px-4 pt-10 pb-20">
      <h1 className="text-xl sm:text-2xl font-bold pb-10">Booking History</h1>
      <div className=" grid gap-5 max-h-[70vh] overflow-auto">
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
        <BookingCard
          imgSource={"/service-ac-ELOBANA.jpeg"}
          imgAlt={"service-ac-ELOBANA"}
          orderId={"asd-124-qwqsd"}
          merchName={"Service AC ELOBANA"}
          location={"Bogor"}
          status={"Denied"}
        />
        <BookingCard
          imgSource={"/service-ac-ELOBANA.jpeg"}
          imgAlt={"service-ac-ELOBANA"}
          orderId={"asd-124-qwqsd"}
          merchName={"Service AC ELOBANA"}
          location={"Bogor"}
          status={"Denied"}
        />
        <BookingCard
          imgSource={"/service-ac-ELOBANA.jpeg"}
          imgAlt={"service-ac-ELOBANA"}
          orderId={"asd-124-qwqsd"}
          merchName={"Service AC ELOBANA"}
          location={"Bogor"}
          status={"Denied"}
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
