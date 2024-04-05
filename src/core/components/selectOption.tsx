"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface SelectProps {
  selectLabel: string;
  defaultSelectValue: string;
  categoryList: { item: string; value: string }[];
  params: { slug: string };
}

export function SelectOption({
  selectLabel,
  defaultSelectValue,
  categoryList,
  params,
}: SelectProps) {
  const searchParams = useSearchParams();

  const handleCategorySelect = (selectedValue: string) => {
    const onParams = new URLSearchParams(searchParams.toString());
    onParams.set(params.slug, selectedValue);
    console.log(onParams);
    window.history.pushState(null, "", `?${onParams.toString()}`);
  };

  return (
    <Select defaultValue={defaultSelectValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          {categoryList.map((value, index) => (
            <Link key={index} href={`/merchant/`}>
              <SelectItem value={value.value}>{value.item}</SelectItem>
            </Link>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
