/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Add,
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Remove,
} from "@mui/icons-material";
import { Plus, Minus, ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const WhereToSleepItems = ({
  bedroom,
  setBedroom,
  sleepingPosition,
  setSleepingPosition,
  formData,
  setFormData,
}) => {
  const [showPosition, setShowPosition] = useState(false);

  const addwhereToSleep = (e) => {
    e.preventDefault();
    if (bedroom) {
      setFormData((prevData) => {
        return {
          ...prevData,
          whereToSleep: [
            ...prevData.whereToSleep,
            {
              bedroom,
              sleepingPosition: {
                ...sleepingPosition,
              },
            },
          ],
        };
      });
      setBedroom("");
      setSleepingPosition("");
    } else {
      alert("You need to add a bedroom and the sleeping position");
    }

    setSleepingPosition({
      kingBed: 0,
      queenBed: 0,
      sofa: 0,
      singleBed: 0,
    });
    setShowPosition(false);
  };
  return (
    <div className="space-y-6">
      {/* Display Added Bedrooms */}
      {formData.whereToSleep.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Added Bedrooms</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {formData.whereToSleep.map((whereToSleepItem, index) => (
              <div
                key={index}
                className="relative p-4 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">
                    Bedroom {whereToSleepItem.bedroom}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {whereToSleepItem.sleepingPosition.kingBed > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {whereToSleepItem.sleepingPosition.kingBed} King
                      </Badge>
                    )}
                    {whereToSleepItem.sleepingPosition.queenBed > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {whereToSleepItem.sleepingPosition.queenBed} Queen
                      </Badge>
                    )}
                    {whereToSleepItem.sleepingPosition.singleBed > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {whereToSleepItem.sleepingPosition.singleBed} Single
                      </Badge>
                    )}
                    {whereToSleepItem.sleepingPosition.sofa > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {whereToSleepItem.sleepingPosition.sofa} Sofa
                      </Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFormData((prevData) => {
                      return {
                        ...prevData,
                        whereToSleep: [
                          ...prevData.whereToSleep.filter(
                            (item) => item.bedroom !== whereToSleepItem.bedroom
                          ),
                        ],
                      };
                    });
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-50 transition-colors"
                  type="button"
                >
                  <X className="h-3.5 w-3.5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Bedroom Section */}
      <div className="space-y-4 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="text-sm font-medium text-gray-900">Add Bedroom</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bedroom Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Bedroom Number</label>
            <Input
              type="number"
              placeholder="e.g., 1"
              name="bedroom"
              value={bedroom}
              min={1}
              onChange={(e) => setBedroom(e.target.value)}
              className="text-lg h-12 text-center border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* Sleeping Positions Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sleeping Positions</label>
            <div className="relative">
              <button
                onClick={() => setShowPosition(!showPosition)}
                className="w-full h-12 px-4 flex items-center justify-between border border-gray-300 rounded-md hover:border-gray-400 bg-white transition-colors"
                type="button"
              >
                <span className="text-sm text-gray-700">Configure beds</span>
                {showPosition ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              
              {showPosition && (
                <div className="absolute top-14 left-0 right-0 z-10 p-4 bg-white border border-gray-200 rounded-lg shadow-lg space-y-4">
                  {/* King Bed */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">King bed</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSleepingPosition((prevValue) => ({
                            ...prevValue,
                            kingBed: prevValue.kingBed <= 0 ? 0 : prevValue.kingBed - 1,
                          }));
                        }}
                        className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        type="button"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{sleepingPosition.kingBed}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSleepingPosition((prevValue) => ({
                            ...prevValue,
                            kingBed: prevValue.kingBed + 1,
                          }));
                        }}
                        className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        type="button"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Queen Bed */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Queen bed</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSleepingPosition((prevValue) => ({
                            ...prevValue,
                            queenBed: prevValue.queenBed <= 0 ? 0 : prevValue.queenBed - 1,
                          }));
                        }}
                        className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        type="button"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{sleepingPosition.queenBed}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSleepingPosition((prevValue) => ({
                            ...prevValue,
                            queenBed: prevValue.queenBed + 1,
                          }));
                        }}
                        className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        type="button"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Single Bed */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Single bed</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSleepingPosition((prevValue) => ({
                            ...prevValue,
                            singleBed: prevValue.singleBed <= 0 ? 0 : prevValue.singleBed - 1,
                          }));
                        }}
                        className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        type="button"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{sleepingPosition.singleBed}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSleepingPosition((prevValue) => ({
                            ...prevValue,
                            singleBed: prevValue.singleBed + 1,
                          }));
                        }}
                        className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        type="button"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Sofa */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Sofa</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSleepingPosition((prevValue) => ({
                            ...prevValue,
                            sofa: prevValue.sofa <= 0 ? 0 : prevValue.sofa - 1,
                          }));
                        }}
                        className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        type="button"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{sleepingPosition.sofa}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSleepingPosition((prevValue) => ({
                            ...prevValue,
                            sofa: prevValue.sofa + 1,
                          }));
                        }}
                        className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        type="button"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Button */}
        <Button
          onClick={addwhereToSleep}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          type="button"
        >
          Add Bedroom
        </Button>
      </div>
    </div>
  );
};

export default WhereToSleepItems;
