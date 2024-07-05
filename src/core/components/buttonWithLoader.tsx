import React from "react";
import { Button } from "./ui/button";
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
    | null;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
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
