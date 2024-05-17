import { AlertDialogComponent } from "@/core/components/alert-dialog";
import { DialogGeneral } from "@/core/components/general-dialog";
import Loader from "@/core/components/loader/loader";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import { DialogContent } from "@/core/components/ui/dialog";
import { useToast } from "@/core/components/ui/use-toast";
import AddressForm from "@/users/components/addressForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MapPinIcon, Settings, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { ReactNode, useState } from "react";

interface AddressCardProps {
  addressDetail: string;
  addressCity: string;
  addressProvince: string;
  addressZipCode: string;
  addressId: string;
}

const AddressCard = ({
  addressId,
  addressDetail,
  addressCity,
  addressProvince,
  addressZipCode,
}: AddressCardProps) => {
  const [onOpen, setOnOpenDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  function handleChange() {
    setOnOpenDialog(false);
  }

  const initialAddressData = {
    addressId: addressId,
    addressDetail: addressDetail,
    addressProvince: addressProvince,
    addressCity: addressCity,
    addressZipCode: addressZipCode,
  };

  const { mutate: deleteAddress, isPending: deleteAddressLoading } =
    useMutation({
      mutationFn: async () =>
        await axios.delete(`/api/user/address/${initialAddressData.addressId}`),
      onSuccess: () => {
        toast({ title: "Delete alamat berhasil!" });
        queryClient.invalidateQueries({
          queryKey: ["userAddressData", session?.user?.id],
        });
      },
      onError: () => {
        toast({ title: "Delete alamat gagal!", variant: "destructive" });
      },
    });

  if (deleteAddressLoading) {
    return <Loader />;
  }

  return (
    <div className="flex items-center gap-2">
      <Card className="p-5 w-full grid items-center gap-4 sm:gap-10 min-w-[280px]">
        <div className="flex items-center justify-between">
          <MapPinIcon className="text-red-600" />
          <div className="flex gap-2">
            <DialogGeneral
              dialogTitle={"Edit Address"}
              onOpen={onOpen}
              onOpenChange={handleChange}
              dialogTrigger={
                <>
                  <Button
                    variant={"outline"}
                    className="rounded-full p-3"
                    onClick={() => setOnOpenDialog(true)}
                  >
                    <Settings size={15} />
                  </Button>
                </>
              }
              dialogContent={
                <>
                  <AddressForm
                    onPrevious={() => {}}
                    isEditing={true}
                    initialAddressData={initialAddressData}
                    handleOnCloseDialog={() => handleChange()}
                  />
                </>
              }
            />
            <AlertDialogComponent
              alertDialogSubmitTitle="Delete"
              submitAction={() => deleteAddress()}
              ActionButtonClassName=" bg-red-500 hover:bg-red-300 text-white dark:text-white transition duration-500 flex gap-4 items-center"
              dialogDescription={"Apakah kamu yakin akan menghapus alamat ini?"}
              dialogTitle="Delete Address"
              dialogTrigger={
                <Button
                  variant={"outline"}
                  className="rounded-full p-3 hover:bg-red-50 dark:hover:bg-slate-800 "
                >
                  <Trash size={15} className="text-red-800" />
                </Button>
              }
            />
          </div>
        </div>
        <CardContent className="p-0 max-w-[200px] h-[30vh]">
          <div className="grid gap-2 text-sm ">
            <p>{addressProvince}</p>
            <p>{addressCity}</p>
            <p>{addressDetail}</p>
            <p>{addressZipCode}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressCard;
