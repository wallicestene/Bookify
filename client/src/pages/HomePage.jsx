/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import PropertyContainer from "../components/PropertyContainer";
import useFetch from "../hooks/useFetch";
import Filter from "../components/Filter";
import { toast } from "sonner";
import useServer from "../hooks/ServerUrl";
import AdvanceFilter from "../components/AdvanceFilter";
import RecommendedProperties from "../components/RecommendedProperties";
import { useUserContext } from "../hooks/Usercontext";
const HomePage = () => {
  const isFirstRender = useRef(true);
  const [searchInput, setSearchInput] = useState({
    location: "",
    minPrice: null,
    maxPrice: null,
    amenities: "",
    tags: "",
    guests: null,
    bedrooms: null,
    // beds: 1,
    checkIn: null,
    checkOut: null,
    // page: 1,
    // limit: 10,
  });

  const [searchData, setSearchData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState(null);
  const [{ user }] = useUserContext();

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
      setHasSearched(false);
      return;
    }

    const queryString = new URLSearchParams(filteredParams).toString();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    fetch(`${serverUrl}api/search/property/?${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
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
        setHasSearched(true); // Set the flag when search is complete

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
    <section>
      <div>
        {/* <Carousel /> */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
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
            numberOfProperties={hasSearched ? searchData.length : 0}
          />
        </div>

        {/* Only show recommendations when there's no active search */}
        {(!hasSearched || searchData.length === 0) && (
          <div className="recommendations relative max-w-[98vw] mx-auto">
            <RecommendedProperties
              type={user?.token ? "personalized" : "popular"}
            />
          </div>
        )}

        {/* Only when search has been performed AND has results */}
        {hasSearched && searchData.length > 0 && (
          <div className="px-10 pt-6">
            <button
              onClick={() => {
                setSearchData([]);
                setHasSearched(false);
              }}
              className="text-sm text-totem-pole-500 hover:text-totem-pole-600 flex items-center gap-1"
            >
              <span>← Clear filters</span>
            </button>
          </div>
        )}

        <div>
          <PropertyContainer
            loading={loading}
            initialError={initialError}
            searchData={hasSearched ? searchData : []}
            isFirstRender={isFirstRender}
            data={!hasSearched ? data : []}
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
