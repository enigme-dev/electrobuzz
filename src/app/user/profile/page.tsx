import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
import EditProfileForm from "@/edit-profile/component/editProfileForm";
import React from "react";

const EditProfilePage = () => {
  return (
    <div className="wrapper px-10 pt-5 pb-20 sm:py-20 w-screen">
      <EditProfileForm />
    </div>
  );
};

export default EditProfilePage;
