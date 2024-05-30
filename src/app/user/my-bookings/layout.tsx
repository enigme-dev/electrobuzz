import Loader from "@/core/components/loader/loader";
import React, { ReactNode, Suspense } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </div>
  );
};

export default layout;
