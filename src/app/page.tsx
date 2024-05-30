"use client";

import { Banner } from "@/dashboard/banner";
import Category from "@/category/container/category";
import StepByStep from "@/step-by-step/container/stepBystep";

export default function Home() {
  return (
    <main className="px-4 pb-20 sm:py-16">
      <section className="wrapper flex justify-center">
        <Banner />
      </section>
      <section className="wrapper pt-10 sm:pt-20">
        <StepByStep />
      </section>
      <section className="wrapper pt-10 sm:pt-20">
        <Category />
      </section>
      {/* <section className="wrapper pt-10 sm:pt-20">
        <NearestMerchants />
      </section> */}
    </main>
  );
}
