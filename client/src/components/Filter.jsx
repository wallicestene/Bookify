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
    <section className="p-1">
      <div className=" font-mulish mt-16">
        <form className=" flex items-center justify-center gap-3 ">
          <div className=" lg:divide-x-[1.5px] border-[1px] border-gray-300 shadow-lg h-fit lg:w-9/12 w-10/12 flex lg:flex-row flex-col items-center justify-between gap-1 rounded-2xl">
            <div className="w-full p-2">
              <label htmlFor="location" className=" text-sm text-gray-500">
                Where do you want to go?
              </label>
              <br />
              <input
                id="location"
                type="text"
                name="location"
                placeholder="Location"
                value={searchInput.location}
                onChange={handleChange}
                className="w-full border-none outline-none bg-none  rounded-md "
              />
            </div>
            <hr className=" border w-full lg:hidden" />
            <div className=" text-sm p-1 flex lg:flex-row flex-col lg:items-center items-start justify-between gap-2 h-full w-full lg:divide-x-[1.5px]">
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
              />{" "}
              <hr className=" border w-full lg:hidden" />
              <div className=" p-2  h-full flex items-center justify-between space-x-2 w-full">
                <label
                  htmlFor="guests"
                  className="text-sm w-full text-gray-500"
                >
                  Guests <br />
                  <Popover>
                    <PopoverTrigger asChild>
                      <input
                        id="guests"
                        type="text" // Changed from number to text for better display of empty/placeholder
                        name="guests"
                        value={searchInput.guests === null ? "1" : searchInput.guests}
                        placeholder="Guests"
                        readOnly={true}
                        className="h-full w-full border-none outline-none bg-none rounded-md p-2 cursor-pointer text-black"
                      />
                    </PopoverTrigger>
                    <PopoverContent className=" rounded-2xl p-5 ">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <PeopleOutlined />
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
                  className=" p-3 bg-totem-pole-500 rounded-2xl w-full text-orange-50 text-sm hover:bg-totem-pole-600 transition-all delay-100 duration-150 hover:transform hover:scale-105 ease-linear flex items-center justify-center space-x-2"
                  onClick={searchProperty}
                >
                  <span>Let's go</span>
                  <ArrowForward />
                </button>
              </div>
            </div>
          </div>
          {/* <button
            className="p-3 bg-totem-pole-500 rounded-full text-orange-50 text-sm hover:bg-totem-pole-600 transition-all delay-100 duration-150 hover:transform hover:scale-105 ease-linear"
            onClick={searchProperty}
          >
            <Search />
          </button> */}
        </form>
      </div>
    </section>
  );
};

export default Filter;
