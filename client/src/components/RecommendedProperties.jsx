import { useEffect, useState } from "react";
import useServer from "../hooks/ServerUrl";
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
// eslint-disable-next-line react/prop-types
const RecommendedProperties = ({ type = "popular" }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const serverUrl = useServer();
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

        let endpoint = "";
        if (type === "personalized" && user?.token) {
          endpoint = "api/personalized/recommendations";
        } else if (type === "popular") {
          endpoint = "api/popular-properties";
        } else {
          endpoint = "api/recommendations";
        }

        const headers = {
          "Content-Type": "application/json",
          ...(user?.token && { Authorization: `Bearer ${user.token}` }),
        };

        const response = await fetch(`${serverUrl}${endpoint}`, { headers });

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setRecommendations(data);
        } else {
          // If no personalized recommendations, fallback to popular
          if (type === "personalized") {
            await fetchPopularProperties();
          }
        }
      } catch (err) {
        setError(err.message);
        if (type === "personalized") {
          await fetchPopularProperties();
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchPopularProperties = async () => {
      try {
        const response = await fetch(`${serverUrl}api/popular-properties`);
        const data = await response.json();
        if (data && data.length > 0) {
          setRecommendations(data);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecommendations();
  }, [serverUrl, type, user?.token]);

  if (loading) {
    return (
      <section className="recommendations my-8 px-4 md:px-8 lg:px-10">
        <h2 className="text-md font-semibold mb-3 font-poppins leading-3">
          {titles[type]}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-64 rounded-lg"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <section className="recommendations my-8 px-4 md:px-8 lg:px-10">
        <Alert severity="error">{error}</Alert>
      </section>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="recommendations my-8 px-4 md:px-8 lg:px-10">
      <h2 className="text-md font-semibold mb-3 font-poppins leading-3">
        {titles[type]}
      </h2>
      <div className="relative w-full bg-none ">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full bg-white"
        >
          <CarouselContent className="-ml-2 md:-ml-4 ">
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
          <div className="absolute -left-4 top-1/2 -translate-y-1/2">
            <CarouselPrevious className="h-12 w-12 rounded-full border-2 opacity-70 hover:opacity-100" />
          </div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2">
            <CarouselNext className="h-12 w-12 rounded-full border-2 opacity-70 hover:opacity-100" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default RecommendedProperties;
