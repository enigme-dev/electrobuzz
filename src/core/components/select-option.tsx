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
import { useParams, usePathname, useRouter } from "next/navigation";

interface SelectProps {
  selectLabel: string;
  defaultSelectValue: string;
  categoryList: { item: string; value: string }[];
}

export function SelectOption({
  selectLabel,
  defaultSelectValue,
  categoryList,
}: SelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const onSelect = (categoryValue: any) => {
    if (params.categoryValue) {
      router.push(pathname.replace(pathname, categoryValue));
    } else {
      router.push(`/merchant-list/${categoryValue}`);
    }
  };

  return (
    <Select
      defaultValue={defaultSelectValue}
      onValueChange={(e) => onSelect(e)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{selectLabel}</SelectLabel>
          {categoryList.map((value, index) => (
            <SelectItem key={index} value={value.value}>
              {value.item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
