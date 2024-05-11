import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getData, updateData } from "@/core/lib/service";
import { UpdateProfileModel } from "@/users/types";

const useEditProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditPhone, setIsEditPhone] = useState(false);
  const [onOpenDialog, setOnOpenDialog] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const startEditName = () => {
    setIsEditPhone(false);
    setIsEditName(true);
  };

  const startEditPhone = () => {
    setIsEditName(false);
    setIsEditPhone(true);
  };

  return {
    isEditing,
    isEditName,
    isEditPhone,
    startEditing,
    startEditName,
    startEditPhone,
    cancelEditing,
    setOnOpenDialog,
    onOpenDialog,
    isEditAddress,
    setIsEditAddress,
  };
};

export default useEditProfile;
