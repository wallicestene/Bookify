/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LocationOn,
  Star,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

const Property = ({ property }) => {
  const [images, setImages] = useState(property?.images || []);

  return (
    <div className="group flex flex-col gap-y-2 h-full rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 ease-out font-Mulish transform hover:-translate-y-1">
      <div className="relative">
        <Carousel
          showStatus={false}
          showThumbs={false}
          emulateTouch
          stopOnHover
          interval={5000}
          transitionTime={650}
          preventMovementUntilSwipeScrollTolerance
          swipeScrollTolerance={10}
          useKeyboardArrows={true}
          className="overflow-hidden object-cover rounded-t-2xl"
          renderArrowPrev={(onClickHandler, hasPrev) =>
            hasPrev && (
              <span
                onClick={onClickHandler}
                className="h-8 w-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full cursor-pointer absolute top-1/2 left-3 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out shadow-lg hover:scale-110"
              >
                <KeyboardArrowLeft />
              </span>
            )
          }
          renderArrowNext={(onClickHandler, hasNext) =>
            hasNext && (
              <span
                onClick={onClickHandler}
                className="h-8 w-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full cursor-pointer absolute top-1/2 right-3 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out shadow-lg hover:scale-110"
              >
                <KeyboardArrowRight />
              </span>
            )
          }
        >
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <Link key={index} to={`/Property/${property._id}`}>
                <div className="h-full w-full overflow-hidden">
                  <img
                    src={image}
                    alt={`${property?.name} - image ${index + 1}`}
                    className="lg:h-72 h-[360px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
            ))
          ) : (
            <Link to={`/Property/${property._id}`}>
              <div className="h-full w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center lg:h-72 h-[360px]">
                <p className="text-gray-400 text-sm">No images available</p>
              </div>
            </Link>
          )}
        </Carousel>
        
        {/* Rating badge */}
        {property?.rating && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
            <Star className="text-yellow-500" sx={{ fontSize: "1rem" }} />
            <span className="text-sm font-semibold">{property.rating}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between text-start p-3 gap-2">
        <Link to={`/Property/${property._id}`} className="hover:opacity-80 transition">
          <div className="flex items-center gap-1 text-[0.95rem]">
            <LocationOn
              className="text-orange-600"
              sx={{
                fontSize: "1.1rem",
              }}
            />
            <h1 className="font-semibold text-gray-800 line-clamp-1">
              {property.address}
            </h1>
          </div>
        </Link>

        <div className="flex flex-col gap-2 justify-between h-full text-sm">
          {/* Tags */}
          {property?.tags && Array.isArray(property.tags) && property.tags.length > 0 && (
            <div className="flex flex-row gap-2 flex-wrap">
              {property.tags.slice(0, 3).map((tag, index) => (
                <div
                  key={index}
                  className="bg-orange-50 text-orange-700 border border-orange-200 py-1 px-3 rounded-full text-xs font-medium hover:bg-orange-100 transition"
                >
                  {tag}
                </div>
              ))}
              {property.tags.length > 3 && (
                <div className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-medium">
                  +{property.tags.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Price */}
          <div className="text-base pt-1 border-t border-gray-100">
            <p className="flex items-baseline gap-1">
              <span className="font-bold text-gray-900 text-lg">
                {(property?.price || 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "KES",
                })}{" "}
              </span>
              <span className="text-gray-500 text-sm">/ night</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;
