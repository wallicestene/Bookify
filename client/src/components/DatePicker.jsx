/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar1Icon, Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ className, onDateChange, initialDate }) {
  const [date, setDate] = useState(initialDate);
  const [activeInput, setActiveInput] = useState("checkIn");

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };
  const handleInputClick = (inputName) => {
    setActiveInput(inputName);
  };
  return (
    <div className={cn("grid lg:p-2 p-1", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex text-sm items-center lg:justify-between justify-start divide-x-[1.5px] divide-solid space-x-1">
            <div className="">
              <label htmlFor="checkIn" className="block text-sm text-gray-500">
                Check In
              </label>
              <div className="flex items-center space-x-1">
                <Calendar1Icon />
                <input
                  id="checkIn"
                  type="text"
                  value={date?.from ? format(date.from, "LLL dd") : ""}
                  onClick={() => handleInputClick("checkIn")}
                  readOnly
                  className="w-full border outline-none bg-none rounded-md lg:lg:p-2 p-1 cursor-pointer"
                />
              </div>
            </div>
            <div className="lg:p-2 p-1">
              <label htmlFor="checkOut" className="block text-sm text-gray-500">
                Check Out
              </label>
              <div className="flex items-center space-x-1">
                <Calendar1Icon />
                <input
                  id="checkOut"
                  type="text"
                  value={date?.to ? format(date.to, "LLL dd") : ""}
                  onClick={() => handleInputClick("checkOut")}
                  readOnly
                  className="w-full border outline-none bg-none rounded-md lg:lg:p-2 p-1  cursor-pointer"
                />
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
