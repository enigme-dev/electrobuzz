"use client";

import Loader from "@/core/components/loader/loader";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { z } from "zod";
import { MerchantIdentitiesSchema } from "@/merchants/types";
import Image from "next/image";
import StatusBadge from "@/users/components/admin/StatusBadge";
import {
  BookOpen,
  CheckCircle,
  Hammer,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  ShieldX,
  Star,
  Store,
  Truck,
} from "lucide-react";
import TabButton from "@/users/components/admin/TabButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { Separator } from "@/core/components/ui/separator";
import { Button } from "@/core/components/ui/button";
import { getRoundedRating } from "@/core/lib/utils";
import Modal from "@/core/components/modal";
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
} from "@/core/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import CategoryBadge from "@/core/components/categoryBadge";
import DOMPurify from "dompurify";
import { useToast } from "@/core/components/ui/use-toast";
import ButtonWithLoader from "@/core/components/buttonWithLoader";

const MerchantIdentityResponse = z.object({ data: MerchantIdentitiesSchema });
type MerchantIdentityResponse = z.infer<typeof MerchantIdentityResponse>;

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const [activeTab, setActiveTab] = useState("profile");
  const [showModal, setShowModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [status, setStatus] = useState("");

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const [identity, merchant, user] = useQueries({
    queries: [
      {
        queryKey: ["merchantIdentity", params.id],
        queryFn: async () => {
          const { data } = await axios.get<MerchantIdentityResponse>(
            `/api/admin/merchant/${params.id}/identity`,
            { withCredentials: true }
          );
          return data;
        },
      },
      {
        queryKey: ["merchant", params.id],
        queryFn: async () => {
          const { data } = await axios.get(`/api/merchant/${params.id}`, {
            withCredentials: true,
          });
          return data;
        },
      },
      {
        queryKey: ["merchantUserProfile", params.id],
        queryFn: async () => {
          const { data } = await axios.get(
            `/api/admin/merchant/${params.id}/user`,
            { withCredentials: true }
          );
          return data;
        },
      },
    ],
  });

  const handleTabChange = (target: string) => {
    setActiveTab(target);
  };

  const { mutate: handleStatusChange, isPending: handleStatusLoading } =
    useMutation({
      mutationFn: async (status: string) =>
        await axios.patch(
          `/api/admin/merchant/${params.id}/identity`,
          { identityStatus: status },
          { withCredentials: true }
        ),
      onSuccess: () => {
        toast({ variant: "default", title: "Edit status mitra berhasil!" });
        queryClient.invalidateQueries({
          queryKey: [
            "merchantIdentity",
            "merchant",
            "merchantUserProfile",
            params.id,
          ],
        });
      },
      onError: () => {
        toast({ variant: "default", title: "Edit status mitra gagal!" });
      },
    });

  const handleImageClick = (imageUrl: string) => {
    setCurrentImageUrl(imageUrl);
    setShowModal(true);
  };

  if (identity.isLoading || merchant.isLoading || user.isLoading) {
    return <Loader />;
  }

  return (
    <TooltipProvider>
      <div className="wrapper py-10">
        <div className="border rounded-lg">
          <div>
            <div
              style={
                {
                  "--image-url": `url(${merchant.data?.data.merchantBanner})`,
                } as React.CSSProperties
              }
              className="h-[240px] w-full rounded-t-lg bg-[image:var(--image-url)] bg-no-repeat bg-cover bg-center"
            ></div>
            <div className="flex items-end ml-16 -mt-10 px-2">
              <Image
                src={merchant.data?.data.merchantPhotoUrl}
                width={120}
                height={120}
                alt={merchant.data?.data.merchantName}
                className="h-[120px] w-[120px] object-cover rounded-lg bg-slate-500 border-[3px] border-white dark:border-slate-900"
              />
              <div className="grid p-4">
                <span className="text-lg font-semibold">
                  {merchant.data?.data.merchantName}
                </span>
                <div className="flex">
                  <StatusBadge
                    status={identity?.data?.data.identityStatus || ""}
                  />
                </div>
              </div>
              <div className="ml-auto mr-1 py-6 flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <button className="inline-flex items-center justify-center h-10 px-4 py-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border-slate-400 disabled:text-slate-400 bg-transparent border border-destructive text-destructive hover:bg-destructive/20 dark:border-red-700 dark:text-red-700 dark:hover:bg-destructive/40">
                      Suspend
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Apakah ingin melanjutkan penangguhan akun ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Dengan menangguhkan akun, Mitra tidak dapat melakukan
                        transaksi dan profilnya tidak akan tampil di hasil
                        pencarian.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStatusChange("suspended")}
                      >
                        Lanjutkan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-black">
                      <Pencil size={15} className="mr-2" />
                      Edit status
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Status Mitra</DialogTitle>
                    </DialogHeader>
                    <div>
                      <Select
                        onValueChange={(e) => {
                          setStatus(e);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                      </DialogClose>
                      <ButtonWithLoader
                        onClick={() => handleStatusChange(status)}
                        buttonText="Ubah status"
                        isLoading={handleStatusLoading}
                        variant={"default"}
                        className="text-black"
                      />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mr-[72px] mt-2">
            <TabButton
              onClick={() => handleTabChange("profile")}
              isActive={activeTab === "profile"}
            >
              <Store size={16} className="mr-2" />
              Profil Mitra
            </TabButton>
            <TabButton
              onClick={() => handleTabChange("identity")}
              isActive={activeTab === "identity"}
            >
              <BookOpen size={16} className="mr-2" />
              Identitas
            </TabButton>
          </div>
        </div>
        {activeTab === "profile" && (
          <main className="flex gap-6 mt-6">
            <section className="shrink-0 w-[360px]">
              <div className="mb-6 p-4 rounded-lg border">
                <span className="font-semibold flex items-center gap-1">
                  Rincian
                </span>
                <Separator className="mt-2 mb-4" />
                <div className="grid gap-2">
                  <span className="flex gap-2 items-center">
                    <Star
                      size={18}
                      fill="orange"
                      strokeWidth={0}
                      className="text-yellow-400"
                    />
                    {merchant.data?.data.merchantRating ? (
                      <span className="text-sm">
                        {getRoundedRating(
                          merchant.data?.data.merchantRating || 0
                        )}{" "}
                        (
                        {merchant.data?.data.merchantReviewCt > 99
                          ? "99+"
                          : merchant.data?.data.merchantReviewCt}{" "}
                        ulasan)
                      </span>
                    ) : (
                      <span className="text-sm">-</span>
                    )}
                  </span>
                  {merchant.data?.data.benefits?.map(
                    (value: any, index: number) => (
                      <span
                        key={index}
                        className="flex items-center gap-[10px]"
                      >
                        {value.benefitType === "experience" && (
                          <>
                            <Hammer size={16} />
                            <p className="text-sm font-semibold">
                              Pengalaman:{" "}
                              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                {value.benefitBody}
                              </span>
                            </p>
                          </>
                        )}
                        {value.benefitType === "warranty" && (
                          <>
                            <CheckCircle size={16} />
                            <p className="text-sm font-semibold">
                              Garansi:{" "}
                              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                {value.benefitBody}
                              </span>
                            </p>
                          </>
                        )}
                        {value.benefitType === "service_type" && (
                          <div className="flex items-center gap-2">
                            <Truck size={15} className="shrink-0" />
                            <p className=" text-sm font-semibold">
                              Tipe Layanan:{" "}
                              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                {value.benefitBody}
                              </span>
                            </p>
                          </div>
                        )}
                      </span>
                    )
                  )}
                  {(merchant.data?.data.merchantCategory.length || 0) > 0 && (
                    <ul className="flex flex-wrap gap-1">
                      {merchant.data?.data.merchantCategory.map(
                        (category: any) => (
                          <CategoryBadge
                            key={category}
                            categoryName={category}
                          />
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <span className="font-semibold flex items-center gap-1">
                  Profil Pengguna
                </span>
                <Separator className="mt-2 mb-4" />
                <div className="grid justify-center justify-items-center gap-2">
                  <Image
                    src={user.data?.data.image || ""}
                    height={72}
                    width={72}
                    alt="user photo"
                    className="h-[72px] w-[72px] object-cover rounded-full"
                  />
                  <span className="font-semibold">{user.data?.data.name}</span>
                  <span className="text-sm flex gap-2 items-center">
                    <Mail size={16} />
                    {user.data?.data.email}
                  </span>
                  <span className="text-sm flex gap-2 items-center">
                    <Phone size={16} />
                    {user.data?.data.phone}{" "}
                    {user.data?.data.phoneVerified ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ShieldCheck
                            size={16}
                            className="text-green-500 dark:text-green-600"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Nomor ini telah terverifikasi</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ShieldX
                            size={16}
                            className="text-red-500 dark:text-red-600"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Nomor ini belum terverifikasi</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </div>
              </div>
            </section>
            <section className="grow">
              <div className="p-4 rounded-lg border">
                <span className="font-semibold flex items-center gap-1">
                  Deskripsi
                </span>
                <Separator className="mt-2 mb-4" />
                <div
                  className="description"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      merchant?.data?.data.merchantDesc || ""
                    ),
                  }}
                />
              </div>
            </section>
          </main>
        )}

        {activeTab === "identity" && (
          <section className="grid grid-cols-2 justify-items-center gap-6 mt-6">
            <div className="p-4 w-full border rounded-lg">
              <span className="font-semibold flex items-center gap-1">
                Foto KTP
              </span>
              <Separator className="mt-2 mb-4" />
              <Button
                className="p-0 bg-transparent rounded-none cursor-zoom-in hover:bg-transparent"
                onClick={() =>
                  handleImageClick(identity.data?.data.identityKTP || "")
                }
                asChild
              >
                <Image
                  src={identity.data?.data.identityKTP || ""}
                  alt="ktp"
                  width={512}
                  height={512}
                  className="w-full h-auto object-contain"
                />
              </Button>
            </div>
            <div className="p-4 w-full border rounded-lg">
              <span className="font-semibold flex items-center gap-1">
                Foto SKCK
              </span>
              <Separator className="mt-2 mb-4" />
              <Button
                className="p-0 bg-transparent rounded-none cursor-zoom-in hover:bg-transparent"
                onClick={() =>
                  handleImageClick(identity.data?.data.identitySKCK || "")
                }
                asChild
              >
                <Image
                  src={identity.data?.data.identitySKCK || ""}
                  alt="skck"
                  width={512}
                  height={512}
                  className="w-full h-auto object-contain"
                />
              </Button>
            </div>
            {identity.data?.data.identityDocs && (
              <div className="p-4 w-full border rounded-lg">
                <span className="font-semibold flex items-center gap-1">
                  Foto Sertifikasi
                </span>
                <Separator className="mt-2 mb-4" />
                <Button
                  className="p-0 bg-transparent rounded-none cursor-zoom-in hover:bg-transparent"
                  onClick={() =>
                    handleImageClick(identity.data?.data.identityDocs || "")
                  }
                  asChild
                >
                  <Image
                    src={identity.data?.data.identityDocs || ""}
                    alt="skck"
                    width={512}
                    height={512}
                    className="w-full h-auto object-contain"
                  />
                </Button>
              </div>
            )}
          </section>
        )}
      </div>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        imageUrl={currentImageUrl}
      />
    </TooltipProvider>
  );
}
