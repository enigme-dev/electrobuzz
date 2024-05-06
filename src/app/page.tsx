"use client";

import { Banner } from "@/dashboard/banner";
import Category from "@/category/container/category";
import StepByStep from "@/step-by-step/container/stepBystep";
import PopularMerchants from "@/popular-merchants/container/popularMerchants";

export default function Home() {
  return (
    <main className="px-4 pb-20 sm:py-20 ">
      <section className="wrapper flex justify-center">
        <Banner />
      </section>
      <section className="wrapper pt-10 sm:pt-20">
        <StepByStep />
      </section>
      <section className="wrapper pt-10 sm:pt-20">
        <Category />
      </section>
      <section className="wrapper pt-10 sm:pt-20">
        <PopularMerchants />
      </section>
    </main>
  );
}
