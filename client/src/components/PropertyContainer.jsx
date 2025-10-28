/* eslint-disable react/prop-types */

import { Earth } from "lucide-react";
import Property from "./Property";
import { Alert } from "@mui/material";

const PropertyContainer = ({ loading, initialError, searchData, data }) => {
  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8];

  // Ensure data is always an array - handle null, undefined, or non-array values
  const safeData = Array.isArray(data) ? data : data ? [] : [];
  const safeSearchData = Array.isArray(searchData) ? searchData : [];

  return (
    <div className="py-6 pb-32">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Loading Skeletons */}
        {loading &&
          skeleton.map((_, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden animate-pulse border border-gray-100"
            >
              <div className="bg-gray-200 w-full h-56"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex gap-1.5">
                  <div className="h-6 bg-gray-200 rounded-md w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-md w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-md w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}

        {/* Error State */}
        {initialError && (
          <div className="col-span-full">
            <Alert severity="error" className="rounded-lg">
              {initialError}
            </Alert>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !initialError && (
          <>
            {safeSearchData.length > 0 ? (
              // Show search results
              safeSearchData.map((property) => (
                <Property key={property._id} property={property} />
              ))
            ) : safeData.length > 0 ? (
              // Show default properties
              safeData.map((property) => (
                <Property key={property._id} property={property} />
              ))
            ) : (
              // Show empty state only when both are truly empty
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto space-y-3">
                  <Earth size={100} className="mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    No properties found
                  </h3>
                  <p className="text-sm text-gray-500">
                    Try adjusting your filters to find more properties
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyContainer;
