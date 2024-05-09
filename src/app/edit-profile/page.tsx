import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
import EditProfileForm from "@/edit-profile/component/editProfileForm";
import React from "react";

const EditProfilePage = () => {
  return (
    <div className="wrapper px-10 py-5 sm:py-20 w-screen">
      <EditProfileForm />
    </div>
  );
};

export default EditProfilePage;
