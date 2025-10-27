/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {
  AcUnitRounded,
  Deck,
  FireExtinguisherOutlined,
  Fireplace,
  HotTub,
  KeyboardArrowLeft,
  Kitchen,
  LocalLaundryServiceOutlined,
  MedicalServicesOutlined,
  OutdoorGrill,
  PaidOutlined,
  Pool,
  TimeToLeave,
  Tv,
  Wifi,
  Work,
} from "@mui/icons-material";
import {
  Add,
  BedOutlined,
  Circle,
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardBackspace,
  LocationOn,
  Remove,
} from "@mui/icons-material";
import Datepicker from "react-tailwindcss-datepicker";
import { Alert, CircularProgress } from "@mui/material";
import { useUserContext } from "../hooks/Usercontext";
import { toast } from "sonner";
import BookingPage from "../components/BookingPage";
import BeatLoader from "react-spinners/BeatLoader";
import useServer from "../hooks/ServerUrl";
import { bookingAPI } from "../services/api";
import moment from "moment";
const PropertyDetailsPage = () => {
  const [value, setValue] = useState(0);
  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [showBookingMobile, setShowBookingMobile] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [allAmenities, setAllAmenities] = useState(8);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [allGuests, setAllGuests] = useState(adults);
  const [disableGuests, setDisableGuests] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [{ user }, dispatch] = useUserContext();

  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useFetch(
    `${useServer()}api/property/${id}`
  );
  useEffect(() => {
    // Don't run if data is not yet loaded
    if (!data || !data.guests) return;
    
    const numberOfGuests = () => {
      const guestsNumber = adults + children;
      setAllGuests(guestsNumber >= data.guests ? data.guests : guestsNumber);
      if (data.guests <= guestsNumber) {
        setDisableGuests(true);
      } else {
        setDisableGuests(false);
      }
    };
    numberOfGuests();
  }, [adults, allGuests, children, data?.guests, data]);

  const startDate = moment(date?.startDate);
  const endDate = moment(date?.endDate);
  const days = moment.duration(endDate.diff(startDate)).asDays();
  const duration = days == 1 ? days : days - 1;
  const totalPrice = duration * (data?.price || 0);

  const handleBooking = async () => {
    if (user && date.startDate && date.endDate && data?._id) {
      try {
        const bookingData = {
          userId: user.userId,
          propertyId: data._id,
          checkIn: date.startDate,
          checkOut: date.endDate,
          guests: {
            adults,
            children,
            infants,
          },
          duration: duration,
          totalPrice: totalPrice,
        };

        await bookingAPI.create(bookingData);

        const promise = () =>
          new Promise((resolve) => setTimeout(resolve, 2000));
        toast.promise(promise, {
          loading: "Loading...",
          success: "Booking Successful!",
          error: "Error",
        });
        setTimeout(() => navigate("/account/myBookings"), 2000);
      } catch (err) {
        toast.error(err.message || "Booking failed. Please try again.");
      }
    } else {
      toast.error("Please select check in and check out to book!");
    }
  };
  
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  const showAllAmenities = (amenitiesArray) => {
    setAllAmenities((preAmenities) => {
      return preAmenities == amenitiesArray.length ? 8 : amenitiesArray.length;
    });
  };
  return (
    <>
      {isLoading && (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
          <div className="text-center space-y-4">
            <BeatLoader color="#f97316" size={20} speedMultiplier={0.8} />
            <p className="text-gray-600 font-medium">Loading property details...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
          <div className="max-w-md w-full">
            <Alert severity="error" className="rounded-xl shadow-lg">
              {error}
            </Alert>
          </div>
        </div>
      )}
      {!isLoading && !error && !data && (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="text-6xl">🏠</div>
            <Alert severity="info" className="rounded-xl shadow-lg">
              Property not found
            </Alert>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
      {!isLoading && !error && data && (
        <div className="pt-20 pb-6 w-full mx-auto font-Mulish relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-4">
            <button
              className="flex items-center gap-2 text-sm hover:bg-gray-50 w-fit px-3 py-2 rounded-lg transition-colors border border-gray-200"
              onClick={() => navigate(-1)}
            >
              <KeyboardBackspace fontSize="small" />
              <span>Back</span>
            </button>
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <div>
              <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                  {data?.name}
                </h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <LocationOn style={{ fontSize: '16px' }} className="text-gray-400" />
                  <span>{data?.address}</span>
                </div>
              </div>
            </div>
            <div
              className={`top hidden lg:grid gap-2 h-96 overflow-hidden rounded-xl ${
                data?.images && data.images.length == 1 && "grid-cols-1 h-64 w-7/12 mx-auto"
              }
            ${
              data?.images && data.images.slice(1).length == 2 && "grid-cols-1 w-7/12 mx-auto"
            }
            ${
              data?.images && data.images.slice(1).length == 1 && "grid-cols-1 w-7/12 mx-auto"
            }
            ${data?.images && data.images.length > 1 && "grid-cols-2"}
            `}
            >
              <div className="imgLeft overflow-hidden">
                <img
                  src={data?.images?.[0] || ''}
                  className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  alt=""
                />
              </div>
              <div
                className={`imgright grid gap-2 h-96 w-full overflow-hidden ${
                  data?.images && data.images.slice(1).length <= 2 && "grid-cols-1"
                }
              ${data?.images && data.images.slice(1).length >= 3 && "grid-cols-2"}
              `}
              >
                {data?.images && data.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={data?.name}
                      className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
            {data?.images && data.images.length > 5 && (
              <div>
                <Link
                  to={`/imageGallery/${id}`}
                  className="hidden absolute bottom-3 right-6 bg-white/95 backdrop-blur-sm text-xs lg:flex items-center gap-2 font-medium py-2 px-4 rounded-lg hover:cursor-pointer shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <img
                    className="h-4 w-4"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAQ0lEQVR4nO2TwQkAIAzEMp7S/RdQ91AKnUA4ELlAXznoK/ATASxgAl3gSbHrhsAjf9BrlLIJvHmAcAe4AxPuAHfABQd26G3wlQ9gxwAAAABJRU5ErkJggg=="
                    alt="gallery"
                  />
                  <span>Show all photos</span>
                </Link>
              </div>
            )}
            {data && !isLoading && (
              <div>
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  autoPlay
                  preventMovementUntilSwipeScrollTolerance
                  swipeScrollTolerance={10}
                  emulateTouch
                  transitionTime={650}
                  infiniteLoop
                  stopOnHover
                  interval={5000}
                  showArrows={false}
                  useKeyboardArrows={true}
                  className="relative lg:hidden w-full overflow-hidden rounded-xl"
                >
                  {data?.images.map((image, index) => (
                    <div key={index} className="overflow-hidden h-64 w-full">
                      <img
                        src={image}
                        alt={data.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 py-6 px-4 md:px-6">
            <div className="lg:col-span-2 space-y-6">
              {data && !isLoading && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <p className="flex items-center gap-1">
                      <Circle
                        sx={{
                          height: "0.25rem",
                          width: "0.25rem",
                        }}
                      />
                      {data?.guests} Guest{data?.guests !== 1 ? 's' : ''}
                    </p>
                    <p className="flex items-center gap-1">
                      <Circle
                        sx={{
                          height: "0.25rem",
                          width: "0.25rem",
                        }}
                      />
                      {data?.whereToSleep.length} Bedroom{data?.whereToSleep.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="h-px bg-gray-200 my-4" />
                </div>
              )}
              {data && !isLoading && (
                <div className="space-y-2">
                  <h2 className="text-base font-semibold text-gray-900">
                    About this place
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {data?.description}
                  </p>
                  <div className="h-px bg-gray-200 my-4" />
                </div>
              )}
              {data && !isLoading && data?.amenities && Array.isArray(data.amenities) && data.amenities.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-gray-900">
                    What this place offers
                  </h2>
                  <ul className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                    {data.amenities
                      .slice(0, allAmenities)
                      .map((amenity, index) => (
                        <li
                          className="first-letter:uppercase py-2 flex items-center gap-2 text-sm text-gray-700"
                          key={index}
                        >
                          <div className="text-gray-500">
                            {(amenity === "Wifi" && <Wifi fontSize="small" />) ||
                              (amenity === "Outdoor dining" && <Deck fontSize="small" />) ||
                              (amenity === "TV" && <Tv fontSize="small" />) ||
                              (amenity === "Kitchen" && <Kitchen fontSize="small" />) ||
                              (amenity === "Washer" && (
                                <LocalLaundryServiceOutlined fontSize="small" />
                              )) ||
                              (amenity === "Free parking" && <TimeToLeave fontSize="small" />) ||
                              (amenity === "Paid parking" && (
                                <PaidOutlined fontSize="small" />
                              )) ||
                              (amenity === "Air conditioning" && (
                                <AcUnitRounded fontSize="small" />
                              )) ||
                              (amenity === "Workspace" && <Work fontSize="small" />) ||
                              (amenity === "Hot tub" && <HotTub fontSize="small" />) ||
                              (amenity === "Pool" && <Pool fontSize="small" />) ||
                              (amenity === "Outdoor grill" && (
                                <OutdoorGrill fontSize="small" />
                              )) ||
                              (amenity === "Fire place" && <Fireplace fontSize="small" />) ||
                              (amenity === "Fire extinguisher" && (
                                <FireExtinguisherOutlined fontSize="small" />
                              )) ||
                              (amenity === "First aid kit" && (
                                <MedicalServicesOutlined fontSize="small" />
                              )) ||
                              (amenity === "Smoke detector" && (
                                <img className="w-4 h-4" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAgElEQVR4nGNgGAUkgP9UxgNnAT6x/wT4uMTwS5AIcJrzFCphxUA+sIaa8QSbZDsVw78VmwVsUEtgPiEHP4EaDjILL1gO1ZBBRLBkQNWC9BANSNG0nATHwIEGGcGjwUAiICUunjMwMDAyjEjwn4yiYtQCBqoGETqguoEM9LZg8AEAeEuZ96V4tvUAAAAASUVORK5CYII=" alt="Smoke detector" />
                              ))}
                          </div>
                          <p>{amenity}</p>
                        </li>
                      ))}{" "}
                  </ul>
                  {data?.amenities && data.amenities.length > 8 && (
                    <button
                      onClick={() => showAllAmenities(data.amenities)}
                      className="mt-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      {allAmenities === data.amenities.length
                        ? "Show less"
                        : `Show all ${data.amenities.length} amenities`}
                    </button>
                  )}
                  <div className="h-px bg-gray-200 my-4" />
                </div>
              )}
              {data && !isLoading && data?.whereToSleep && Array.isArray(data.whereToSleep) && data.whereToSleep.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-gray-900">
                    Where you&apos;ll sleep
                  </h2>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
                    {data?.whereToSleep && data.whereToSleep.map((place, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 py-4 px-4 rounded-lg space-y-2 hover:border-gray-300 transition-colors"
                      >
                        <BedOutlined className="text-gray-500" fontSize="small" />
                        <div className="space-y-1">
                          <p className="font-medium text-sm text-gray-900">Bedroom {place?.bedroom}</p>
                          {place?.sleepingPosition?.kingBed > 0 && (
                            <p className="text-xs text-gray-600">
                              {place?.sleepingPosition?.kingBed} King bed
                              {`${
                                place?.sleepingPosition?.kingBed > 1 ? "s" : ""
                              }`}
                            </p>
                          )}
                          {place?.sleepingPosition?.queenBedBed > 0 && (
                            <p className="text-xs text-gray-600">
                              {place?.sleepingPosition?.queenBed} Queen bed
                              {`${
                                place?.sleepingPosition?.queenBed > 1 ? "s" : ""
                              }`}
                            </p>
                          )}
                          {place?.sleepingPosition?.singleBed > 0 && (
                            <p className="text-xs text-gray-600">
                              {place?.sleepingPosition?.singleBed} Single bed
                              {`${
                                place?.sleepingPosition?.singleBed > 1
                                  ? "s"
                                  : ""
                              }`}
                            </p>
                          )}
                          {place?.sleepingPosition?.sofa > 0 && (
                            <p className="text-xs text-gray-600">
                              {place?.sleepingPosition?.sofa} Sofa
                              {`${
                                place?.sleepingPosition?.sofa > 1 ? "s" : ""
                              }`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-1 flex flex-col items-center">
              <div className="lg:hidden fixed bottom-6 right-4 z-20">
                <button
                  className="py-2.5 px-6 inline-flex items-center justify-center font-medium text-white transition-all duration-200 bg-orange-500 hover:bg-orange-600 rounded-lg shadow-lg text-sm"
                  onClick={() => setShowBookingMobile(true)}
                >
                  Reserve
                </button>
              </div>
              {data && !isLoading && (
                <div
                  className={`lg:sticky lg:top-20 w-full rounded-xl lg:flex flex-col gap-y-3 font-mulish ${
                    showBookingMobile
                      ? "fixed inset-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4"
                      : "hidden"
                  }`}
                >
                  <div className="bg-white flex flex-col gap-4 p-5 rounded-xl border border-gray-200 shadow-md max-w-md mx-auto w-full">
                    <div className="flex w-full justify-between items-start">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {data.price.toLocaleString("en-KE", {
                            style: "currency",
                            currency: "KES",
                          })}{" "}
                          <span className="text-sm font-normal text-gray-600">/ night</span>
                        </p>
                      </div>
                      <div className="lg:hidden">
                        <button
                          onClick={() => setShowBookingMobile(false)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Close fontSize="small" />
                        </button>
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 flex flex-col divide-y divide-gray-200">
                      <div className="p-3">
                        <h3 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                          Dates
                        </h3>
                        <Datepicker
                          inputClassName={
                            "placeholder:text-sm border-none outline-none text-sm text-gray-700"
                          }
                          containerClassName={
                            "relative h-10 border border-gray-300 hover:border-gray-400 flex items-center rounded-lg px-3 transition-colors"
                          }
                          useRange={true}
                          value={date}
                          readOnly={true}
                          separator={"to"}
                          minDate={new Date()}
                          onChange={handleDateChange}
                          primaryColor={"orange"}
                          popoverDirection="left"
                        />
                      </div>

                      <div className="relative p-3">
                        <div>
                          <h3 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Guests</h3>
                          <div
                            className="flex items-center justify-between py-2 h-10 rounded-lg border border-gray-300 hover:border-gray-400 px-3 cursor-pointer transition-colors"
                            onClick={() => setShowGuests(!showGuests)}
                          >
                            <div className="text-sm text-gray-700">
                              {allGuests >= 1 && (
                                <span>{`${allGuests} ${
                                  allGuests !== 1 ? "guests" : "guest"
                                }`}</span>
                              )}
                              {infants >= 1 && (
                                <span>{`, ${infants} ${
                                  infants !== 1 ? "infants" : "infant"
                                }`}</span>
                              )}
                            </div>
                            {showGuests ? (
                              <KeyboardArrowUp fontSize="small" />
                            ) : (
                              <KeyboardArrowDown fontSize="small" />
                            )}
                          </div>
                        </div>
                        {showGuests && (
                          <div
                            className={`absolute top-[90px] left-3 right-3 bg-white shadow-xl border border-gray-200 px-4 py-4 flex flex-col gap-4 rounded-xl z-50`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm text-gray-900">Adult</p>
                                <span className="text-xs text-gray-500">
                                  Age 15+
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  disabled={adults == 1}
                                  className={`border border-gray-300 rounded-full flex items-center justify-center h-7 w-7 hover:bg-gray-50 transition-colors text-sm ${
                                    adults == 1 &&
                                    "text-gray-300 border-gray-200 cursor-not-allowed"
                                  }`}
                                  onClick={() => {
                                    setAdults((prevValue) => {
                                      return prevValue <= 1 ? 1 : prevValue - 1;
                                    });
                                  }}
                                >
                                  <Remove
                                    sx={{ height: "0.875rem", width: "0.875rem" }}
                                  />
                                </button>
                                <span className="w-6 text-center text-sm text-gray-900">{adults}</span>
                                <button
                                  disabled={disableGuests}
                                  className={`border border-gray-300 rounded-full flex items-center justify-center h-7 w-7 hover:bg-gray-50 transition-colors text-sm ${
                                    disableGuests &&
                                    "text-gray-300 border-gray-200 cursor-not-allowed"
                                  }`}
                                  onClick={() =>
                                    setAdults((prevValue) =>
                                      allGuests >= data.guests
                                        ? data.guests
                                        : prevValue + 1
                                    )
                                  }
                                >
                                  <Add
                                    sx={{ height: "0.875rem", width: "0.875rem" }}
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm text-gray-900">Children</p>
                                <span className="text-xs text-gray-500">
                                  Ages 2–14
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  disabled={children == 0}
                                  className={`border border-gray-300 rounded-full flex items-center justify-center h-7 w-7 hover:bg-gray-50 transition-colors text-sm ${
                                    children == 0 &&
                                    "text-gray-300 border-gray-200 cursor-not-allowed"
                                  }`}
                                  onClick={() =>
                                    setChildren((prevValue) => {
                                      return prevValue <= 0 ? 0 : prevValue - 1;
                                    })
                                  }
                                >
                                  <Remove
                                    sx={{ height: "0.875rem", width: "0.875rem" }}
                                  />
                                </button>
                                <span className="w-6 text-center text-sm text-gray-900">{children}</span>
                                <button
                                  disabled={disableGuests}
                                  className={`border border-gray-300 rounded-full flex items-center justify-center h-7 w-7 hover:bg-gray-50 transition-colors text-sm ${
                                    disableGuests &&
                                    "text-gray-300 border-gray-200 cursor-not-allowed"
                                  }`}
                                  onClick={() =>
                                    setChildren((prevValue) =>
                                      allGuests >= data.guests
                                        ? data.guests
                                        : prevValue + 1
                                    )
                                  }
                                >
                                  <Add
                                    sx={{ height: "0.875rem", width: "0.875rem" }}
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm text-gray-900">Infant</p>
                                <span className="text-xs text-gray-500">
                                  Under 2
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  disabled={infants === 0}
                                  className={`border border-gray-300 rounded-full flex items-center justify-center h-7 w-7 hover:bg-gray-50 transition-colors text-sm ${
                                    infants === 0 &&
                                    "text-gray-300 border-gray-200 cursor-not-allowed"
                                  }`}
                                  onClick={() =>
                                    setInfants((prevValue) => {
                                      return prevValue <= 0 ? 0 : prevValue - 1;
                                    })
                                  }
                                >
                                  <Remove
                                    sx={{ height: "0.875rem", width: "0.875rem" }}
                                  />
                                </button>
                                <span className="w-6 text-center text-sm text-gray-900">{infants}</span>
                                <button
                                  className="border border-gray-300 rounded-full flex items-center justify-center h-7 w-7 hover:bg-gray-50 transition-colors text-sm"
                                  onClick={() =>
                                    setInfants((prevValue) => prevValue + 1)
                                  }
                                >
                                  <Add
                                    sx={{ height: "0.875rem", width: "0.875rem" }}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      className="w-full py-2.5 font-medium text-white transition-all duration-200 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm"
                      onClick={
                        user
                          ? () => {
                              if (date.startDate && date.endDate) {
                                setShowDetails(true),
                                  window.scrollTo({
                                    top: 300,
                                    behavior: "smooth",
                                  });
                              } else {
                                toast.error(
                                  "Please select check in and check out to book!"
                                );
                              }
                            }
                          : () => navigate("/login")
                      }
                    >
                      {user ? "Reserve" : "Sign in to book"}
                    </button>
                    {date.startDate && date.endDate && duration > 0 && (
                      <div className="pt-3 border-t border-gray-200 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            KES {data.price.toLocaleString()} × {duration} night{duration !== 1 ? 's' : ''}
                          </span>
                          <span className="text-gray-900">
                            KES {(data.price * duration).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold text-sm pt-2 border-t border-gray-200">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">KES {totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {showDetails && (
            <BookingPage
              handleBooking={handleBooking}
              setShowDetails={setShowDetails}
            />
          )}
        </div>
      )}
    </>
  );
};

export default PropertyDetailsPage;
