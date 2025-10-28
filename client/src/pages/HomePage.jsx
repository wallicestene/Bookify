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
    <section className="min-h-screen bg-white">
      <div>
        {/* Hero Section */}
        {!hasSearched && (
          <div className="relative pt-20 pb-8 px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight leading-tight">
                Find Your Perfect{" "}
                <span className="text-orange-500">
                  Getaway
                </span>
              </h1>
              <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
                Discover unique places to stay around the world
              </p>
            </div>
          </div>
        )}

        {/* Search Filters  */}
        <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
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
            setHasSearched={setHasSearched}
            numberOfProperties={hasSearched ? searchData.length : 0}
          />
        </div>

        {/* Search Results Header */}
        {hasSearched && searchData.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-700">
                {searchData.length} {searchData.length === 1 ? 'property' : 'properties'}
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
                className="text-sm px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow"
              >
                <span className="text-base">✕</span>
                <span className="font-medium">Clear filters</span>
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {(!hasSearched || searchData.length === 0) && (
          <div className="recommendations max-w-7xl mx-auto py-6">
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
            data={!hasSearched ? data : []}
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
