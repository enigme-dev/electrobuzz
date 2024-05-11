import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
import EditProfile from "@/edit-profile/component/editProfile";

import React from "react";

const EditProfilePage = () => {
  return (
    <div className="wrapper px-10 pt-5 pb-20 sm:py-20 w-screen">
      <EditProfile />
    </div>
  );
};

export default EditProfilePage;
