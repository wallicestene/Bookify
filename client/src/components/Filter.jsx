/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { ArrowForward, PeopleOutlined } from "@mui/icons-material";
import { DatePicker } from "./DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { Minus, Plus } from "lucide-react";
import AddOrRemoveContainer from "./AddOrRemoveContainer";
import { addDays } from "date-fns";
// import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const Filter = ({ searchInput, setSearchInput, searchProperty }) => {
  // const [hasInteracted, setHasInteracted] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    // setHasInteracted(true);
    setSearchInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const addGuests = () => {
    // setHasInteracted(true);
    setSearchInput((prev) => ({
      ...prev,
      guests: prev.guests === null ? 1 : prev.guests + 1,
    }));
  };

  const removeGuests = () => {
    // setHasInteracted(true);
    setSearchInput((prev) => {
      if (prev.guests === null || prev.guests <= 1) {
        return {
          ...prev,
          guests: null,
        };
      }
      return {
        ...prev,
        guests: prev.guests - 1,
      };
    });
  };


  return (
    <section className="py-4 px-4 md:px-6">
      <div className="font-mulish">
        <form className="flex items-center justify-center">
          <div className="lg:divide-x border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-fit lg:w-10/12 w-full flex lg:flex-row flex-col items-center justify-between rounded-xl bg-white">
            <div className="w-full p-3 lg:p-4">
              <label htmlFor="location" className="text-xs font-medium text-gray-600 mb-1.5 block uppercase tracking-wide">
                Where
              </label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="Search destinations"
                value={searchInput.location}
                onChange={handleChange}
                className="w-full border-none outline-none bg-transparent text-gray-900 text-sm placeholder:text-gray-400 focus:placeholder:text-gray-500"
              />
            </div>
            <hr className="border-gray-100 w-full lg:hidden" />
            <div className="text-sm flex lg:flex-row flex-col lg:items-center items-start justify-between h-full w-full lg:divide-x">
              <DatePicker
                className="w-full"
                onDateChange={(selectedDate) => {
                  setSearchInput((prevInput) => ({
                    ...prevInput,
                    checkIn: selectedDate?.from,
                    checkOut: selectedDate?.to,
                  }));
                }}
                initialDate={{
                  from: new Date(),
                  to: addDays(new Date(), 1),
                }}
              />
              <hr className="border-gray-100 w-full lg:hidden" />
              <div className="p-3 lg:p-4 h-full flex items-center justify-between gap-3 w-full">
                <label
                  htmlFor="guests"
                  className="text-sm w-full text-gray-500 flex-1"
                >
                  <span className="text-xs font-medium text-gray-600 mb-1.5 block uppercase tracking-wide">Guests</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <input
                        id="guests"
                        type="text"
                        name="guests"
                        value={searchInput.guests === null ? "1" : searchInput.guests}
                        placeholder="Add guests"
                        readOnly={true}
                        className="h-full w-full border-none outline-none bg-transparent cursor-pointer text-gray-900 text-sm"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="rounded-xl p-4 shadow-lg border border-gray-200">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <PeopleOutlined className="text-gray-500" sx={{ fontSize: '18px' }} />
                          <p>Guests</p>
                        </div>
                        <AddOrRemoveContainer
                          add={addGuests}
                          remove={removeGuests}
                          value={searchInput.guests === null ? 1 : searchInput.guests}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </label>
                <button
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
                  onClick={searchProperty}
                >
                  <span>Search</span>
                  <ArrowForward sx={{ fontSize: '18px' }} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Filter;
