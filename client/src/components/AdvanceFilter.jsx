/* eslint-disable react/prop-types */
import { SlidersHorizontal } from "lucide-react";

const AdvanceFilter = ({ searchInput, setSearchInput }) => {
  const propertyTags = [
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

  return (
    <div className="grid  place-items-center gap-2 my-2 w-full px-5">
      <div className="flex items-center justify-between w-full">
        <div>
          <ul className="flex flex-wrap gap-2 ">
            {propertyTags.map((tag, index) => (
              <li
                key={index}
                onClick={() => handleOnclick(tag)}
                className={`p-2 border rounded-2xl text-sm first-letter:uppercase leading-4 cursor-pointer hover:bg-totem-pole-200 ${
                  searchInput.tags.includes(tag) ? "border-totem-pole-500 " : ""
                } `}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <SlidersHorizontal size={"1.205rem"} />
          <p>Filter</p>
        </div>
      </div>
    </div>
  );
};

export default AdvanceFilter;
