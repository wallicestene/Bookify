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
import { propertyAPI } from "../services/api";

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
    checkIn: null,
    checkOut: null,
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

  const searchProperty = async (e = { preventDefault: () => {} }) => {
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

    setLoading(true);
    setSearchError(null);

    try {
      const properties = await propertyAPI.search(filteredParams);
      const safeProperties = Array.isArray(properties) ? properties : [];
      setSearchData(safeProperties);
      setHasSearched(true);
      setLoading(false);
    } catch (error) {
      setSearchError(error.message || "Failed to search properties");
      setLoading(false);
      toast.error("Failed to search properties");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <div>
        {/* Hero Section */}
        {!hasSearched && (
          <div className="relative pt-24 pb-12 px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                Find Your Perfect{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                  Getaway
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Discover amazing places to stay around the world. Book unique homes and experiences.
              </p>
            </div>
          </div>
        )}

        {/* Search Filters - Sticky */}
        <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
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

        {/* Search Results Header */}
        {hasSearched && searchData.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchData.length} {searchData.length === 1 ? 'property' : 'properties'} found
              </h2>
              <button
                onClick={() => {
                  setSearchData([]);
                  setHasSearched(false);
                  setSearchInput({
                    location: "",
                    minPrice: null,
                    maxPrice: null,
                    amenities: "",
                    tags: "",
                    guests: null,
                    bedrooms: null,
                    checkIn: null,
                    checkOut: null,
                  });
                }}
                className="text-sm px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <span>✕</span>
                <span>Clear all filters</span>
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {(!hasSearched || searchData.length === 0) && (
          <div className="recommendations relative max-w-[98vw] mx-auto py-8">
            <RecommendedProperties
              type={user?.token ? "personalized" : "popular"}
            />
          </div>
        )}

        {/* Properties Grid */}
        <div className="max-w-7xl mx-auto">
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
