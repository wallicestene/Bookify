/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */

import { Circle, LocationOn } from "@mui/icons-material";
import { Link } from "react-router-dom";

const AddedProperties = ({ property }) => {
  return (
    <>
      <div className=" relative h-64 w-full  shadow-xl shadow-gray-400 rounded-xl inline-block ">
        <div className=" h-full w-full overflow-hidden shadow-xl shadow-gray-400 rounded-xl inline-block ">
          <img
            src={property?.images[0]}
            alt={`${property?.name} image 1 `}
            className=" lg:h-72 h-[360px] w-full object-cover  brightness-[0.9]"
          />
        </div>
        <div className=" p-[18px] absolute w-11/12 -bottom-20 left-1/2 -translate-x-1/2 rounded-xl shadow-gray-400 shadow-lg bg-white">
          <div className=" flex items-center gap-1 text-[0.8rem] text-gray-700">
            <p>
              <Circle
                sx={{
                  height: "0.12em",
                  width: "0.12em",
                }}
              />{" "}
              {property?.guests} Guest(s)
            </p>
            <p>
              <Circle
                sx={{
                  height: "0.12em",
                  width: "0.12em",
                }}
              />{" "}
              {property?.whereToSleep.length} Bedroom
              {property?.whereToSleep.length != 1 ? "s" : ""}
            </p>
          </div>

          <h2 className=" font-semibold truncate  ">{property?.name}</h2>
          <div>
            <p className=" mx-1 inline-block font-light text-gray-100 bg-gray-900 text-sm lg:py-[6px] py-[4px] px-[10px] rounded-full">
              {(property?.price).toLocaleString("en-US", {
                style: "currency",
                currency: "KES",
              })}{" "}
              <span>night</span>
            </p>
          </div>
          <p className="text-xs mt-2 flex items-center">
            <LocationOn
              sx={{
                fontSize: "1rem",
              }}
            />
            <span className=" truncate leading-4 text-gray-600 tracking-tight">{property?.address}</span>
          </p>
        </div>
        <Link
          to={`/account/myProperties/${property._id}`}
          className="absolute top-5 right-5 items-center justify-start inline-block px-4 py-2 text-sm overflow-hidden bg-white rounded-full group"
        >
          <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
          <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-red-600 opacity-100 group-hover:-translate-x-8"></span>
          <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-gray-100">
            Edit
          </span>
          <span className="absolute inset-0 border-2 rounded-full"></span>
        </Link>
      </div>
    </>
  );
};

export default AddedProperties;
