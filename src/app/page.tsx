"use client";

import { Banner } from "@/core/components/dashboard/banner";
import Category from "@/core/components/dashboard/category";

export default function Home() {
  return (
    <main className="wrapper py-4">
      <section className=" pt-20 flex justify-center">
        <Banner />
      </section>
      <section className="pt-20">
        <Category />
      </section>
    </main>
  );
}
