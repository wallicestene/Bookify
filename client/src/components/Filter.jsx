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
    <section className="p-4">
      <div className="font-mulish mt-6">
        <form className="flex items-center justify-center">
          <div className="lg:divide-x-[1.5px] border-2 border-orange-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-fit lg:w-9/12 w-11/12 flex lg:flex-row flex-col items-center justify-between gap-1 rounded-3xl bg-white backdrop-blur-sm">
            <div className="w-full p-4">
              <label htmlFor="location" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Where do you want to go?
              </label>
              <br />
              <input
                id="location"
                type="text"
                name="location"
                placeholder="Search destinations..."
                value={searchInput.location}
                onChange={handleChange}
                className="w-full border-none outline-none bg-none rounded-md text-gray-900 font-medium placeholder:text-gray-400 mt-1"
              />
            </div>
            <hr className="border border-gray-200 w-full lg:hidden" />
            <div className="text-sm p-1 flex lg:flex-row flex-col lg:items-center items-start justify-between gap-2 h-full w-full lg:divide-x-[1.5px]">
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
              <hr className="border border-gray-200 w-full lg:hidden" />
              <div className="p-3 h-full flex items-center justify-between space-x-3 w-full">
                <label
                  htmlFor="guests"
                  className="text-sm w-full text-gray-500"
                >
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Guests</span>
                  <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <input
                        id="guests"
                        type="text"
                        name="guests"
                        value={searchInput.guests === null ? "1" : searchInput.guests}
                        placeholder="Guests"
                        readOnly={true}
                        className="h-full w-full border-none outline-none bg-none rounded-md cursor-pointer text-gray-900 font-medium mt-1"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="rounded-2xl p-5 shadow-xl border-2 border-orange-100">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <PeopleOutlined className="text-orange-500" />
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
                  className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl w-full text-white text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                  onClick={searchProperty}
                >
                  <span>Let's go</span>
                  <ArrowForward />
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
