/* eslint-disable react/prop-types */

import Property from "./Property";
import { Alert, Skeleton } from "@mui/material";

const PropertyContainer = ({
  loading,
  initialError,
  searchData,
  isFirstRender,
  data,
}) => {
  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:gap-x-5 md:gap-x-10 gap-x-5 gap-y-10 py-[50px] px-5 lg:px-10 ">
        {loading &&
          skeleton.map((skeleton, index) => (
            <div
              key={index}
              className=" shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]  rounded-xl overflow-hidden transition-shadow"
            >
              <Skeleton variant="rounded" width="100%" height={285} />
              <div className=" p-2">
                <Skeleton width="90%" height="35px" />
                <div className=" flex flex-row gap-x-2">
                  <Skeleton width="100%" height="50px" />
                  <Skeleton width="100%" height="50px" />
                  <Skeleton width="100%" height="50px" />
                </div>
                <Skeleton width="60%" height="35px" />
              </div>
            </div>
          ))}
        {initialError && <Alert severity="error">{initialError}</Alert>}
        {!loading &&
          (searchData.length > 0 ? (
            searchData.map((property) => (
              <Property key={property._id} property={property} />
            ))
          ) : !isFirstRender.current && searchData.length === 0 ? (
            <p>No properties found</p>
          ) : (
            data.map((property) => (
              <Property key={property._id} property={property} />
            ))
          ))}
      </div>
    </div>
  );
};

export default PropertyContainer;
