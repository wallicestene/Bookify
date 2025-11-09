/* eslint-disable react/prop-types */

const AmenitiesOption = ({ Icon, title, handleAmenities, selectedAmenities }) => {
  const isSelected = selectedAmenities.includes(title);
  
  return (
    <div
      onClick={() => handleAmenities(title)}
      className={`
        flex flex-col gap-2 py-4 px-4 rounded-lg 
        cursor-pointer transition-all duration-200
        ${isSelected 
          ? "border-2 border-orange-500 bg-orange-50 shadow-sm" 
          : "border border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm"
        }
      `}
    >
      <div className={`${isSelected ? "text-orange-600" : "text-gray-600"}`}>
        {Icon}
      </div>
      <p className={`text-sm font-medium ${isSelected ? "text-orange-700" : "text-gray-700"}`}>
        {title}
      </p>
    </div>
  );
};

export default AmenitiesOption;
