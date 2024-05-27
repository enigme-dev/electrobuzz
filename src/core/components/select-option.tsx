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

interface SelectProps {
  selectLabel?: string;
  selectList: { item: string; value: string; id?: string }[];
  defaultValue?: string;
  onValueChange: (value: any) => void;
  placeholder: React.ReactNode;
}

export function SelectOption({
  selectLabel,
  selectList,
  defaultValue,
  onValueChange,
  placeholder,
}: SelectProps) {
  return (
    <div
      onChange={(e) => {
        e.stopPropagation();
      }}
    >
      <Select defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger className="w-full z-10">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{selectLabel}</SelectLabel>
            {selectList?.map((value, index) => (
              <SelectItem key={index} value={value.value}>
                {value.item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
