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
  buttonTitle: string;
  dialogTitle: string;
  dialogDescription: ReactNode;
  buttonFooterTitle: String;
}

export function DialogGeneral({
  buttonTitle,
  dialogTitle,
  dialogDescription,
  buttonFooterTitle,
}: DialogGeneralProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">{buttonTitle}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
