import React, { ReactNode } from "react";

interface RegisterAsMerchantLayoutProps {
  children: ReactNode;
}
const RegisterAsMerchantLayout = ({
  children,
}: RegisterAsMerchantLayoutProps) => {
  return <div>{children}</div>;
};

export default RegisterAsMerchantLayout;
