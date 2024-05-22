import React from "react";
import { Button } from "./ui/button";
import Loader from "./loader/loader";
import ButtonLoader from "./buttonLoader";

interface ButtonWithLoaderProps {
  isLoading: boolean;
  buttonText: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className?: string;
  type: "button" | "submit" | "reset" | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const ButtonWithLoader = ({
  isLoading,
  buttonText,
  variant,
  className,
  type,
  onClick,
}: ButtonWithLoaderProps) => {
  return (
    <Button
      variant={variant}
      disabled={isLoading}
      type={type}
      className={className}
      onClick={onClick}
    >
      {isLoading && <ButtonLoader />}
      {buttonText}
    </Button>
  );
};

export default ButtonWithLoader;
