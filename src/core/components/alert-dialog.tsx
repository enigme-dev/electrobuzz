import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { ReactNode } from "react";

interface AlertDialogProps {
  dialogDescription: ReactNode;
  dialogTrigger: ReactNode;
  dialogTitle: string;
  alertDialogSubmitTitle: string;
  submitAction: Function;
  ActionButtonClassName?: string;
}

export function AlertDialogComponent({
  dialogDescription,
  dialogTrigger,
  dialogTitle,
  alertDialogSubmitTitle,
  submitAction,
  ActionButtonClassName,
}: AlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{dialogTrigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Kembali</AlertDialogCancel>
          <AlertDialogAction
            className={ActionButtonClassName}
            onClick={() => submitAction()}
          >
            {alertDialogSubmitTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
