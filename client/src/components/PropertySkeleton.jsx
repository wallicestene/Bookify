import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PropertySkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <Skeleton height={200} />
      <div className="p-4">
        <Skeleton height={24} width="70%" className="mb-2" />
        <Skeleton height={16} width="50%" className="mb-2" />
        <Skeleton height={16} width="40%" />
      </div>
    </div>
  );
};

export const PropertyListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <PropertySkeleton key={index} />
      ))}
    </div>
  );
};

export default PropertySkeleton;
