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
    <div className="group flex flex-col h-full rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 font-Mulish">
      <div className="relative">
        <Carousel
          showStatus={false}
          showThumbs={false}
          emulateTouch
          stopOnHover
          interval={5000}
          transitionTime={500}
          preventMovementUntilSwipeScrollTolerance
          swipeScrollTolerance={10}
          useKeyboardArrows={true}
          className="overflow-hidden object-cover"
          renderArrowPrev={(onClickHandler, hasPrev) =>
            hasPrev && (
              <span
                onClick={onClickHandler}
                className="h-7 w-7 flex items-center justify-center bg-white/90 rounded-full cursor-pointer absolute top-1/2 left-2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-105"
              >
                <KeyboardArrowLeft fontSize="small" />
              </span>
            )
          }
          renderArrowNext={(onClickHandler, hasNext) =>
            hasNext && (
              <span
                onClick={onClickHandler}
                className="h-7 w-7 flex items-center justify-center bg-white/90 rounded-full cursor-pointer absolute top-1/2 right-2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-105"
              >
                <KeyboardArrowRight fontSize="small" />
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
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
            ))
          ) : (
            <Link to={`/Property/${property._id}`}>
              <div className="h-56 w-full bg-gray-50 flex items-center justify-center">
                <p className="text-gray-400 text-xs">No images available</p>
              </div>
            </Link>
          )}
        </Carousel>
        
        {/* Rating badge */}
        {property?.rating && (
          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
            <Star className="text-yellow-500" sx={{ fontSize: "0.875rem" }} />
            <span className="text-xs font-semibold">{property.rating}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between text-start p-3 gap-2">
        <Link to={`/Property/${property._id}`} className="hover:opacity-70 transition-opacity">
          <div className="flex items-center gap-1 text-sm">
            <LocationOn
              className="text-gray-400"
              sx={{
                fontSize: "1rem",
              }}
            />
            <h1 className="font-medium text-gray-900 line-clamp-1">
              {property.address}
            </h1>
          </div>
        </Link>

        <div className="flex flex-col gap-2 justify-between h-full">
          {/* Tags */}
          {property?.tags && Array.isArray(property.tags) && property.tags.length > 0 && (
            <div className="flex flex-row gap-1.5 flex-wrap">
              {property.tags.slice(0, 3).map((tag, index) => (
                <div
                  key={index}
                  className="bg-gray-50 text-gray-600 py-0.5 px-2 rounded-md text-xs"
                >
                  {tag}
                </div>
              ))}
              {property.tags.length > 3 && (
                <div className="bg-gray-50 text-gray-500 py-0.5 px-2 rounded-md text-xs">
                  +{property.tags.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Price */}
          <div className="text-sm pt-1">
            <p className="flex items-baseline gap-1">
              <span className="font-semibold text-gray-900">
                {(property?.price || 0).toLocaleString("en-KE", {
                  style: "currency",
                  currency: "KES",
                })}{" "}
              </span>
              <span className="text-gray-500 text-xs">/ night</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;
