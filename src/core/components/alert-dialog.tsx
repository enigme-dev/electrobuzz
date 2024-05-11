import { useRouter } from "next/navigation";
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
  alerDialogAction: ReactNode;
}

export function AlertDialogComponent({
  dialogDescription,
  dialogTrigger,
  dialogTitle,
  alerDialogAction,
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
          {alerDialogAction}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
