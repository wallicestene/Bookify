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
            numberOfProperties={searchData.length}
          />
        </div>
        {/* recommendations */}
        <div className="recommendations relative max-w-[98vw] mx-auto">
          <RecommendedProperties 
            type={user?.token ? "personalized" : "popular"} 
          />
        </div>
        <div>
          <PropertyContainer
            loading={loading}
            initialError={initialError}
            searchData={searchData}
            isFirstRender={isFirstRender}
            data={data}
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
