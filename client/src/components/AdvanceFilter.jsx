/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FiltersDialog from "./FiltersDialog";
const AdvanceFilter = ({
  searchInput,
  setSearchInput,
  searchProperty,
  numberOfProperties,
  setSearchData,
  setHasSearched,
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isFirstRender = useRef(true); // Prevent first render search
  const debounceTimeout = useRef(null); // Store debounce timeout

  const propertyTags = [
    "All",
    "Rooms",
    "Beach",
    "Bed and breakfast",
    "Cabins",
    "Camping",
    "Pools",
    "Field",
    "Countryside",
    "Skiing",
    "Boats",
    "Castle",
    "Cities",
    "Houseboats",
    "Lake",
  ];

  const handleOnclick = (tag) => {
    setSearchInput((prevInput) => {
      // Split the tags string into an array, removing empty values
      if (tag === "All") {
        return { ...prevInput, tags: "" }; // Reset to all properties
      }

      const tagsArray = prevInput.tags
        ? prevInput.tags.split(",").filter(Boolean)
        : [];
      const isTagPresent = tagsArray.includes(tag);
      // If the tag is present, remove it from the array, otherwise add it
      const updatedTags = isTagPresent
        ? tagsArray.filter((item) => item !== tag).join(",")
        : [...tagsArray, tag].join(",");
      return {
        ...prevInput,
        tags: updatedTags,
      };
    });
  };
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (searchInput.tags !== "") {
        searchProperty({ preventDefault: () => {} });
      } else {
        // Reset to show all properties when tags are cleared
        setSearchData([]);
        setHasSearched(false);
      }
    }, 500); // Adjust debounce time

    return () => clearTimeout(debounceTimeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput.tags]);

  //   scroll function
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -200 : 200;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Check scroll position to enable/disable buttons
  const checkScrollPosition = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  // Listen for scroll events to update button visibility
  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, []);
  return (
    <div className="flex items-center gap-2 px-4 md:px-6">
      <div className="relative overflow-hidden w-full py-3">
        {/* Left Scroll Button */}
        <button
          className={`absolute top-1/2 left-0 -translate-y-1/2 bg-white h-8 w-8 grid place-items-center rounded-full shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow transition-all hidden md:block lg:block z-[2] ${
            !canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex items-center overflow-x-auto gap-3 no-scrollbar scroll-smooth px-1 w-full"
        >
          {propertyTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleOnclick(tag)}
              className={`whitespace-nowrap shrink-0 px-4 py-2 border rounded-lg text-sm font-medium leading-4 cursor-pointer transition-all
                ${
                  searchInput.tags.includes(tag) ||
                  (!searchInput.tags && tag === "All")
                    ? "border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <button
          className={`absolute top-1/2 right-0 -translate-y-1/2 bg-white h-8 w-8 grid place-items-center rounded-full shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow transition-all hidden md:block lg:block z-[2] ${
            !canScrollRight ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
      <div className="shrink-0">
        <FiltersDialog
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setSearchData={setSearchData}
          searchProperty={searchProperty}
          numberOfProperties={numberOfProperties}
        />
      </div>
    </div>
  );
};

export default AdvanceFilter;
