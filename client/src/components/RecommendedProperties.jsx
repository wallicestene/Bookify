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
      <section className="recommendations my-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="bg-gray-200 h-56 rounded-xl"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <section className="recommendations my-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <Alert severity="error" className="rounded-lg">
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
    <section className="recommendations my-8 px-4 md:px-6 bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {titles[type]}
          </h2>
          <div className="text-xs text-gray-500">
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
              <CarouselPrevious className="h-10 w-10 rounded-full border bg-white/95 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200" />
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
              <CarouselNext className="h-10 w-10 rounded-full border bg-white/95 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProperties;
