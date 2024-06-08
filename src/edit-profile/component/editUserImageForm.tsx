// import ButtonWithLoader from "@/core/components/buttonWithLoader";
// import { DialogGeneral } from "@/core/components/general-dialog";
// import Loader from "@/core/components/loader/loader";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/core/components/ui/form";
// import { Input } from "@/core/components/ui/input";
// import { toast } from "@/core/components/ui/use-toast";
// import { fileInputToDataURL } from "@/core/lib/utils";
// import {
//   TUserModel,
//   UpdateProfileModel,
//   UpdateProfileSchema,
//   UserModel,
// } from "@/users/types";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { Upload, UploadIcon } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";

// interface EditUserImageProps {
//   userId: string;
//   image?: string;
// }

// const EditUserImageForm = ({ userId, image }: EditUserImageProps) => {
//   const { data: session, update } = useSession();
//   const form = useForm<UpdateProfileModel>({
//     resolver: zodResolver(UpdateProfileSchema),
//     defaultValues: {
//       image: image,
//     },
//   });

//   const queryClient = useQueryClient();

//   const {
//     mutate: updateUserImageProfile,
//     isPending: updateUserImageProfileLoading,
//   } = useMutation({
//     mutationFn: async (value: UpdateProfileModel) =>
//       await axios.patch(`/api/user/${userId}`, value).then((response) => {
//         return response.data.data;
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["user", session?.user?.id] });
//       toast({
//         description: "Update Image Berhasil",
//       });
//       update({
//         image: form.getValues("image"),
//       });
//     },
//   });

//   function onSubmit(value: UpdateProfileModel) {
//     updateUserImageProfile(value);
//   }
//   const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     const fileToDataUrl = await fileInputToDataURL(file);
//     form.setValue("image", fileToDataUrl);
//   };

//   form.getValues("image");
//   if (updateUserImageProfileLoading) {
//     return <Loader />;
//   }

//   return (
//     <div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <div className="flex items-center justify-center">
//             <FormField
//               control={form.control}
//               name="image"
//               render={({ field }) => (
//                 <FormItem>
//                   <div className="flex items-center gap-4">
//                     <div className="border-2 border-dashed border-gray-200 rounded-lg h-[120px] w-[100px] grid place-items-center text-gray-400">
//                       <FormLabel
//                         className="flex flex-col items-center gap-1 hover:cursor-pointer"
//                         htmlFor="images"
//                       >
//                         <UploadIcon className="h-6 w-6" />
//                         <span className="underline text-xs underline-offset-2 underline-offset-white-0.5 transition-none p-1">
//                           Click to upload
//                         </span>
//                         <Input
//                           className="hidden"
//                           id="images"
//                           multiple
//                           type="file"
//                           onChange={(e) => {
//                             onFileChange(e);
//                             field.onChange(e);
//                           }}
//                           onBlur={field.onBlur}
//                           ref={field.ref}
//                         />
//                       </FormLabel>
//                     </div>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="flex justify-end pt-10">
//             <ButtonWithLoader
//               buttonText="Save Changes"
//               isLoading={updateUserImageProfileLoading}
//               type="submit"
//               className=" bg-yellow-400 hover:bg-yellow-300 text-black dark:text-black transition duration-500 flex gap-4 items-center"
//             />
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default EditUserImageForm;
