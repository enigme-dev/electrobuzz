import { ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface DialogGeneralProps {
  dialogTrigger: ReactNode;
  dialogTitle: string;
  dialogDescription: ReactNode;
  dialogFooterContent?: ReactNode;
}

export function DialogGeneral({
  dialogTrigger,
  dialogTitle,
  dialogDescription,
  dialogFooterContent,
}: DialogGeneralProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter>{dialogFooterContent}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
