import { useEffect, useState } from "react";
import { useUserContext } from "../hooks/Usercontext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Property from "./Property";
import { Alert } from "@mui/material";
import { recommendationsAPI } from "../services/api";

// eslint-disable-next-line react/prop-types
const RecommendedProperties = ({ type = "popular" }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [{ user }] = useUserContext();

  const titles = {
    personalized: "Recommended for You",
    popular: "Most Popular Places to Stay",
    general: "Places You Might Like",
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        let properties = [];
        
        if (type === "personalized" && user?.userId) {
          // Try personalized recommendations first
          try {
            properties = await recommendationsAPI.getPersonalized();
          } catch (err) {
            // If personalized fails, fall back to regular recommendations
            console.log("Personalized recommendations not available, trying general...");
            properties = await recommendationsAPI.getRecommendations();
          }
        } else {
          properties = await recommendationsAPI.getPopular();
        }

        const safeProperties = Array.isArray(properties) ? properties : [];
        
        if (safeProperties.length > 0) {
          setRecommendations(safeProperties);
        } else {
          // If no personalized recommendations, fallback to popular
          if (type === "personalized") {
            const popularProperties = await recommendationsAPI.getPopular();
            setRecommendations(Array.isArray(popularProperties) ? popularProperties : []);
          }
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(err.message);
        
        // Fallback to popular properties on error
        if (type === "personalized") {
          try {
            const popularProperties = await recommendationsAPI.getPopular();
            setRecommendations(Array.isArray(popularProperties) ? popularProperties : []);
          } catch (fallbackErr) {
            console.error("Error fetching popular properties:", fallbackErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [type, user?.userId]);

  if (loading) {
    return (
      <section className="recommendations my-12 px-4 md:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="space-y-3 animate-pulse"
              >
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-64 rounded-2xl"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <section className="recommendations my-12 px-4 md:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <Alert severity="error" className="rounded-xl">
            {error}
          </Alert>
        </div>
      </section>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="recommendations my-12 px-4 md:px-8 lg:px-10 bg-gradient-to-b from-white to-orange-50/30 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            {titles[type]}
          </h2>
          <div className="text-sm text-gray-500">
            {recommendations.length} {recommendations.length === 1 ? 'property' : 'properties'}
          </div>
        </div>
        <div className="relative w-full">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {recommendations.map((recommendation) => (
                <CarouselItem
                  key={recommendation._id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="h-full">
                    <Property property={recommendation} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
              <CarouselPrevious className="h-12 w-12 rounded-full border-2 backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300" />
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
              <CarouselNext className="h-12 w-12 rounded-full border-2 backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProperties;
