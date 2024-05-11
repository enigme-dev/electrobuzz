"use client";

import Loader from "@/core/components/loader";
import {useQueries} from "@tanstack/react-query";
import axios from "axios";
import {ChangeEvent} from "react";
import {z} from "zod";
import {MerchantIdentitiesSchema} from "@/merchants/types";

const MerchantIdentityResponse = z.object({data: MerchantIdentitiesSchema});
type MerchantIdentityResponse = z.infer<typeof MerchantIdentityResponse>;

export default function Page({params}: Readonly<{ params: { id: string } }>) {
  const handleSelect = (option: ChangeEvent<HTMLSelectElement>) => {
    axios.patch(
      `/api/admin/merchants/${params.id}`,
      {identityStatus: option.target.value},
      {withCredentials: true}
    );
  };

  const merchant = useQueries({
    queries: [
      {
        queryKey: ["merchantIdentity", params.id],
        queryFn: async () => {
          const {data} = await axios.get<MerchantIdentityResponse>(
            `/api/admin/merchants/${params.id}`,
            {withCredentials: true}
          );
          return data;
        },
      },
      {
        queryKey: ["merchant", params.id],
        queryFn: async () => {
          const {data} = await axios.get(`/api/merchant/${params.id}`, {
            withCredentials: true,
          });
          return data;
        },
      },
    ],
  });

  const isLoading = merchant.some((query) => query.isLoading);
  if (isLoading) {
    return <Loader/>;
  }

  return (
    <div className="wrapper">
      <div className="flex px-4">
        <span className="grid grow">
          <span>{merchant[1]?.data.data.merchantName}</span>
          <span>{merchant[1]?.data.data.merchantCity}</span>
        </span>
        <div>
          <select
            onChange={handleSelect}
            defaultValue={merchant[0]?.data?.data.identityStatus}
          >
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 justify-items-center">
        <img src={merchant[0]?.data?.data.identityKTP} alt="ktp"/>
        <img src={merchant[0]?.data?.data.identitySKCK} alt="skck"/>
        {merchant[0]?.data?.data.identityDocs && (
          <img src={merchant[0]?.data.data.identityDocs} alt="docs"/>
        )}
      </div>
    </div>
  );
}
