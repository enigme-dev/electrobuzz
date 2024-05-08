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

interface DialogGeneralProps {
  dialogTrigger?: ReactNode;
  dialogTitle: string;
  dialogContent: ReactNode;
  dialogFooterContent?: ReactNode;
}

export function DialogGeneral({
  dialogTrigger,
  dialogTitle,
  dialogContent,
  dialogFooterContent,
}: DialogGeneralProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{dialogContent}</DialogDescription>
        <DialogFooter>{dialogFooterContent}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
