import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          } else {
            return response.json();
          }
        })
        .then((result) => {
          // Handle new API response format { success, data, message }
          const actualData = result.data || result;
          // Keep the original data structure (array or object)
          setData(actualData);
          setIsLoading(false);
          setError(null);
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
          setData(null);
        });
    };
    fetchData();
  }, [url]);

  return { data, isLoading, error };
};

export default useFetch;
