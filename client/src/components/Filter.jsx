/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { ArrowForward, PeopleOutlined } from "@mui/icons-material";
import { DatePicker } from "./DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Minus, Plus } from "lucide-react";

// eslint-disable-next-line react/prop-types
const Filter = ({ searchInput, setSearchInput, searchProperty }) => {
  console.log(searchInput);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setSearchInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  };
  return (
    <section className="p-1">
      <div className=" font-mulish mt-20">
        <form className=" flex items-center justify-center gap-3 ">
          <div className=" lg:divide-x-[1.5px] border-[1px] border-gray-300 shadow-lg h-fit lg:w-9/12 w-10/12 flex lg:flex-row flex-col items-center justify-between gap-1 rounded-3xl">
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
                  from: searchInput.checkIn,
                  to: searchInput.checkOut,
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
                        type="number"
                        name="guests"
                        value={searchInput.guests}
                        min={1}
                        readOnly={true}
                        className="h-full w-full border-none outline-none bg-none rounded-md p-2 cursor-pointer text-black "
                      />
                    </PopoverTrigger>
                    <PopoverContent className=" rounded-2xl p-5 ">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <PeopleOutlined />
                          <p>Guests</p>
                        </div>
                        <div className="flex items-center justify-between gap-3 space-x-2">
                          <button
                            onClick={() => {
                              setSearchInput((prev) => {
                                return {
                                  ...prev,
                                  guests:
                                    prev.guests <= 1 ? 1 : prev.guests - 1,
                                };
                              });
                            }}
                            className="minus border border-gray-300 rounded-full p-1"
                          >
                            <Minus />
                          </button>
                          <div>
                            <p>{searchInput.guests}</p>
                          </div>
                          <button
                            onClick={() => {
                              setSearchInput((prev) => {
                                return {
                                  ...prev,
                                  guests: prev.guests + 1,
                                };
                              });
                            }}
                            className="add border border-gray-300 rounded-full p-1"
                          >
                            <Plus />
                          </button>
                        </div>
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
