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

  // Trigger search whenever the tags change
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
        setSearchData([]); // Reset search results when "All" is selected
      }
    }, 500); // Adjust debounce time

    return () => clearTimeout(debounceTimeout.current);
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
    <div className=" flex items-center gap-2 mx-2 ">
      <div className=" relative overflow-hidden w-full p-2">
        {/* Left Scroll Button */}
        <button
          className={` absolute top-1/2 left-0 -translate-y-1/2 bg-white p-2 rounded-full shadow-md  transition hidden md:block lg:block ${
            !canScrollLeft ? "opacity-0" : ""
          }`}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={20} />
        </button>
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex items-center overflow-x-auto gap-4 no-scrollbar scroll-smooth px-4 w-full"
        >
          {propertyTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleOnclick(tag)}
              className={`whitespace-nowrap shrink-0 px-4 py-2 border rounded-2xl text-sm first-letter:uppercase leading-4 cursor-pointer hover:bg-totem-pole-200 transition 
                ${
                  searchInput.tags.includes(tag) ||
                  (!searchInput.tags && tag === "All")
                    ? "border-totem-pole-500 bg-totem-pole-100"
                    : "border-gray-300"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <button
          className={`absolute top-1/2 right-0 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md transition hidden md:block lg:block ${
            !canScrollRight ? "opacity-0" : ""
          }`}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="">
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
