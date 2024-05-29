"use client";

import { format, subDays } from "date-fns";
import { useState } from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "../lib/shadcn";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

interface DatePickerWithRangeProps {
  onSelect: (range: { from: Date; to: Date }) => void;
  selected: DateRange;
  handleReset: () => void;
}
export function DatePickerWithRange({
  onSelect,
  selected,
  handleReset,
}: DatePickerWithRangeProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>(selected);

  const handleOnSelect: SelectRangeEventHandler = (range) => {
    if (!range) {
      return;
    }
    setSelectedRange(range);
  };

  const handleDateSubmit = () => {
    if (!selectedRange) {
      return;
    }
    const { from, to } = selectedRange;
    if (!from || !to) {
      return;
    }
    onSelect({ from, to });
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "md:w-[300px] w-[200px] justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected.from ? (
              selected.to ? (
                <div className="text-xs max-w-fit overflow-hidden md:w-full">
                  {format(selected.from, "LLL dd, y")} -{" "}
                  {format(selected.to, "LLL dd, y")}
                </div>
              ) : (
                format(selected.from, "LLL dd, y")
              )
            ) : (
              <span>Masukan Tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selected.from}
            selected={selectedRange}
            onSelect={handleOnSelect}
            numberOfMonths={1}
          />
          <div className="flex justify-end gap-3 p-5">
            <Button
              onClick={() => {
                setSelectedRange({
                  from: undefined,
                  to: undefined,
                });
                handleReset();
              }}
            >
              Reset
            </Button>
            <Button onClick={handleDateSubmit}>Submit</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
