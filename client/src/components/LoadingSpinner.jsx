/* eslint-disable react/prop-types */
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <Loader2
        className={`animate-spin text-orange-600 ${sizeClasses[size]} ${className}`}
      />
    </div>
  );
};

export default LoadingSpinner;
