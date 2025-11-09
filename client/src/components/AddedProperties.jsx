/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */

import { Circle, LocationOn } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";

const AddedProperties = ({ property }) => {
  return (
    <div className="relative h-64 w-full rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white">
      <div className="h-full w-full overflow-hidden rounded-xl">
        <img
          src={property?.images[0]}
          alt={`${property?.name} image 1`}
          className="lg:h-72 h-[360px] w-full object-cover brightness-[0.9] hover:brightness-100 transition-all duration-200"
        />
      </div>
      <div className="p-4 absolute w-11/12 -bottom-20 left-1/2 -translate-x-1/2 rounded-xl shadow-lg bg-white border border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <p className="flex items-center gap-1">
            <Circle
              sx={{
                height: "0.12em",
                width: "0.12em",
              }}
            />
            <span>{property?.guests} Guest(s)</span>
          </p>
          <p className="flex items-center gap-1">
            <Circle
              sx={{
                height: "0.12em",
                width: "0.12em",
              }}
            />
            <span>
              {property?.whereToSleep.length} Bedroom
              {property?.whereToSleep.length != 1 ? "s" : ""}
            </span>
          </p>
        </div>

        <h2 className="font-semibold text-gray-900 truncate mb-2">
          {property?.name}
        </h2>
        
        <div className="mb-2">
          <p className="inline-block font-semibold text-white bg-gray-900 text-sm py-1.5 px-3 rounded-full">
            {property?.price.toLocaleString("en-US", {
              style: "currency",
              currency: "KES",
            })}{" "}
            <span className="font-normal">/ night</span>
          </p>
        </div>
        
        <p className="text-xs flex items-center text-gray-600">
          <LocationOn
            sx={{
              fontSize: "1rem",
            }}
          />
          <span className="truncate leading-4 tracking-tight ml-0.5">
            {property?.address}
          </span>
        </p>
      </div>
      <Link
        to={`/account/myProperties/${property._id}`}
        className="absolute top-5 right-5 flex items-center justify-center p-2.5 text-sm overflow-hidden bg-white/95 hover:bg-orange-500 backdrop-blur-sm rounded-full group transition-all duration-300 shadow-md border border-gray-200"
        title="Edit property"
      >
        <Edit className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors" />
      </Link>
    </div>
  );
};

export default AddedProperties;
