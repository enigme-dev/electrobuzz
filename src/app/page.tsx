"use client";

import { Banner } from "@/core/components/dashboard/banner";
import Category from "@/core/components/dashboard/category";
import StepByStep from "@/core/components/dashboard/step-by-step/container/stepBystep";
import TeknisiTerdekat from "@/core/components/dashboard/teknisi-terdekat/container/teknisiTerdekat";
import { Separator } from "@/core/components/ui/separator";

export default function Home() {
  return (
    <main className="wrapper py-4">
      <section className=" pt-20 flex justify-center">
        <Banner />
      </section>
      <section className="pt-20">
        <StepByStep />
      </section>
      <section className="pt-20">
        <Category />
      </section>
      <section className="pt-20">
        <TeknisiTerdekat />
      </section>
    </main>
  );
}
