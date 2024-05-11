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
  onOpenChange?: (open: boolean) => void;
  onOpen?: boolean;
}

export function DialogGeneral({
  dialogTrigger,
  dialogTitle,
  dialogContent,
  dialogFooterContent,
  onOpenChange,
  onOpen,
}: DialogGeneralProps) {
  return (
    <Dialog open={onOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-w-[325px] rounded-lg">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{dialogContent}</DialogDescription>
        <DialogFooter>{dialogFooterContent}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
