/* eslint-disable react/prop-types */
import { Search } from "@mui/icons-material";
import { DatePicker } from "./DatePicker";

// eslint-disable-next-line react/prop-types
const Filter = ({ searchInput, setSearchInput, searchProperty }) => {
  searchInput;

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
                  from: searchInput.checkIn,
                  to: searchInput.checkOut,
                }}
              />{" "}
              <hr className=" border w-full lg:hidden" />
              <div className="  p-2 w-1/4  h-full">
                <label className="text-sm text-gray-500">Guests</label>
                <br />
                <input
                  type="number"
                  onChange={handleChange}
                  name="guests"
                  value={searchInput.guests}
                  min={1}
                  className="h-full w-full border outline-none bg-none rounded-md p-2 "
                />
              </div>
            </div>
          </div>
          <button
            className=" p-3 bg-totem-pole-500 rounded-full text-orange-50 text-sm hover:bg-totem-pole-600 transition-all delay-100 duration-150 hover:transform hover:scale-105 ease-linear"
            onClick={searchProperty}
          >
            <Search />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Filter;
