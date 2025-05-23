/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import AddOrRemoveContainer from "./AddOrRemoveContainer";
import { ScrollArea } from "@/components/ui/scroll-area";
import Amenities from "./Amenities";

const FiltersDialog = ({
  searchInput,
  setSearchInput,
  searchProperty,
  numberOfProperties,
  setSearchData,
}) => {
  const [open, setOpen] = useState(false);
  const [roomsAndBeds, setRoomsAndBeds] = useState({
    bedrooms: 1,
    // beds: 1,
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const isFirstRender = useRef(true);
  const [priceRange, setPriceRange] = useState([100, 5000]); // Default min and max price

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setSearchInput((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };
  // clear filters
  const clearFilters = () => {
    setPriceRange([100, 5000]);
    setRoomsAndBeds({ bedrooms: 1 });
    setSelectedAmenities([]);

    // reset searchInput
    setSearchInput((prev) => {
      return {
        ...prev,
        location: "",
        minPrice: null,
        maxPrice: null,
        amenities: "",
        tags: "",
        guests: 1,
        bedrooms: null,
        checkIn: null,
        checkOut: null,
      };
    });
    // reset searchData
    setSearchData([]);
  };

  // trigger search whenever price range changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setSearchData([]);
      return;
    }

    searchProperty();
  }, [priceRange, roomsAndBeds.bedrooms, searchInput.amenities]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center space-x-2 text-sm border border-gray-300 px-4 py-2 rounded-lg cursor-pointer">
          <SlidersHorizontal size={"1.14rem"} />
          <p>Filter</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        <div>
          <Tabs defaultValue="price">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="price">Price</TabsTrigger>
              <TabsTrigger value="Rooms and beds">Rooms and beds</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
            </TabsList>
            <TabsContent value="price">
              <Card>
                <CardHeader>
                  <CardTitle>Price range</CardTitle>
                  <CardDescription>
                    KES {priceRange[0]} - KES {priceRange[1]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Slider
                    min={100}
                    max={10000}
                    step={1}
                    value={priceRange} // Controlled component
                    onValueChange={handlePriceChange}
                    className="mt-2"
                  />
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  {
                    // If any filter is applied, show clear filters button
                    priceRange[0] !== 1000 || priceRange[1] !== 5000 ? (
                      <Button
                        onClick={() => {
                          clearFilters();
                        }}
                      >
                        Clear filters
                      </Button>
                    ) : (
                      <DialogDescription>
                        Adjust the price range to filter the properties
                      </DialogDescription>
                    )
                  }

                  <Button onClick={() => setOpen(false)}>
                    Show {numberOfProperties} place
                    {numberOfProperties > 1 && "s"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="Rooms and beds">
              <Card>
                <CardHeader>
                  <CardTitle>Rooms and beds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="  space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <p>Bedrooms</p>
                      <AddOrRemoveContainer
                        add={() => {
                          setRoomsAndBeds((prev) => {
                            const updatedBedrooms = prev.bedrooms + 1;
                            setSearchInput((prevInput) => ({
                              ...prevInput,
                              bedrooms: updatedBedrooms, // Sync with searchInput
                            }));
                            return { ...prev, bedrooms: updatedBedrooms };
                          });
                        }}
                        remove={() => {
                          setRoomsAndBeds((prev) => {
                            const updatedBedrooms =
                              prev.bedrooms <= 1 ? 1 : prev.bedrooms - 1;
                            setSearchInput((prevInput) => ({
                              ...prevInput,
                              bedrooms: updatedBedrooms, // Sync with searchInput
                            }));
                            return { ...prev, bedrooms: updatedBedrooms };
                          });
                        }}
                        value={roomsAndBeds.bedrooms + "+"}
                      />
                    </div>
                    <CardFooter className="flex items-center p-2 justify-between">
                      {roomsAndBeds.bedrooms > 1 ? (
                        <Button
                          onClick={() => {
                            clearFilters();
                          }}
                        >
                          Clear filters
                        </Button>
                      ) : (
                        <DialogDescription>
                          Adjust the number of bedrooms to filter the properties
                        </DialogDescription>
                      )}
                      <Button onClick={() => setOpen(false)}>
                        Show {numberOfProperties} place
                        {numberOfProperties > 1 && "s"}
                      </Button>
                    </CardFooter>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="amenities">
              <ScrollArea className="h-72">
                <Amenities
                  selectedAmenities={selectedAmenities}
                  setSelectedAmenities={setSelectedAmenities}
                  mode="filtering"
                  setSearchInput={setSearchInput}
                />
              </ScrollArea>
              <CardFooter className="flex items-center p-2 justify-between">
                {selectedAmenities.length > 0 ? (
                  <Button
                    onClick={() => {
                      clearFilters();
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <DialogDescription>
                    Select the amenities to filter the properties
                  </DialogDescription>
                )}
                <Button onClick={() => setOpen(false)}>
                  Show {numberOfProperties} place
                  {numberOfProperties > 1 && "s"}
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FiltersDialog;
