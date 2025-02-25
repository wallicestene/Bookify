/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import Property from "./Property";
import useFetch from "../hooks/useFetch";
import { Alert, Skeleton } from "@mui/material";
import Filter from "./Filter";
import { toast } from "sonner";
import useServer from "../hooks/ServerUrl";
import AdvanceFilter from "./AdvanceFilter";

const PropertyContainer = () => {
  const isFirstRender = useRef(true);

  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [searchInput, setSearchInput] = useState({
    location: "",
    minPrice: null,
    maxPrice: null,
    amenities: "",
    tags: "",
    guests: 1,
    bedrooms: null,
    // beds: 1,
    checkIn: null,
    checkOut: null,
    // page: 1,
    // limit: 10,
  });

  const [searchData, setSearchData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState(null);
  const {
    data,
    isLoading: initialLoading,
    error: initialError,
  } = useFetch(`${useServer()}api/property`);
  useEffect(() => {
    setLoading(initialLoading);
    setSearchError(initialError);
  }, [initialLoading, initialError]);

  const serverUrl = useServer();

  const searchProperty = (e = { preventDefault: () => {} }) => {
    e.preventDefault();
    // Remove null or empty values from the query
    const filteredParams = Object.fromEntries(
      Object.entries(searchInput).filter(([_, v]) => v !== null && v !== "")
    );

    // If no filters are applied, reset search data
    if (Object.keys(filteredParams).length === 0) {
      setSearchData([]);
      return;
    }

    const queryString = new URLSearchParams(filteredParams).toString();

    fetch(`${serverUrl}api/search/property/?${queryString}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((result) => {
        setSearchData(result);
        setLoading(false);
        setSearchError(null);

        if (result.length === 0) {
          setSearchError("No place found!");
          toast.error("No place found!");
        }
      })
      .catch((error) => {
        setSearchError(error.message);
        setLoading(false);
      });
  };

  return (
    <div>
      <Filter
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchProperty={searchProperty}
      />
      <AdvanceFilter
        setSearchData={setSearchData}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchProperty={searchProperty}
        numberOfProperties={searchData.length}
      />
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
