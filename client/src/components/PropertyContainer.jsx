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
  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8];

  // Ensure data is always an array - handle null, undefined, or non-array values
  const safeData = Array.isArray(data) ? data : (data ? [] : []);
  const safeSearchData = Array.isArray(searchData) ? searchData : [];

  return (
    <div className="py-8">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 px-6 max-w-7xl mx-auto">
        {/* Loading Skeletons */}
        {loading &&
          skeleton.map((_, index) => (
            <div
              key={index}
              className="shadow-md rounded-2xl overflow-hidden transition-all animate-pulse"
            >
              <Skeleton variant="rounded" width="100%" height={285} />
              <div className="p-3 space-y-3">
                <Skeleton width="90%" height={28} />
                <div className="flex gap-2">
                  <Skeleton width="30%" height={32} className="rounded-full" />
                  <Skeleton width="30%" height={32} className="rounded-full" />
                  <Skeleton width="30%" height={32} className="rounded-full" />
                </div>
                <Skeleton width="60%" height={28} />
              </div>
            </div>
          ))}

        {/* Error State */}
        {initialError && (
          <div className="col-span-full">
            <Alert severity="error" className="rounded-xl">
              {initialError}
            </Alert>
          </div>
        )}

        {/* Properties Grid */}
        {!loading &&
          (safeSearchData.length > 0 ? (
            safeSearchData.map((property) => (
              <Property key={property._id} property={property} />
            ))
          ) : !isFirstRender.current && safeSearchData.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-6xl">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900">
                  No properties found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria to find more properties.
                </p>
              </div>
            </div>
          ) : (
            safeData.map((property) => (
              <Property key={property._id} property={property} />
            ))
          ))}
      </div>

      {/* Empty State for no data at all */}
      {!loading && !initialError && safeData.length === 0 && safeSearchData.length === 0 && (
        <div className="col-span-full text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl">🌍</div>
            <h3 className="text-2xl font-bold text-gray-900">
              Start exploring
            </h3>
            <p className="text-gray-600">
              Use the search filters above to find your perfect accommodation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyContainer;
