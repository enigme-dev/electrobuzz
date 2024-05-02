"use client";

import { Banner } from "@/dashboard/banner";
import Category from "@/category/container/category";
import StepByStep from "@/step-by-step/container/stepBystep";
import PopularMerchants from "@/popular-merchants/container/popularMerchants";

export default function Home() {
  return (
    <main className="">
      <section className="wrapper pt-20 flex justify-center">
        <Banner />
      </section>
      <section className="wrapper pt-20">
        <StepByStep />
      </section>
      <section className="wrapper pt-20">
        <Category />
      </section>
      <section className="wrapper pt-20">
        <PopularMerchants />
      </section>
    </main>
  );
}
