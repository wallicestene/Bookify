import axiosInstance from "../lib/axios";

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const { data } = await axiosInstance.post("/user/login", credentials);
    return data.data || data;
  },

  signup: async (userData) => {
    const { data } = await axiosInstance.post("/user/signup", userData);
    return data.data || data;
  },
};

// Property API
export const propertyAPI = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/api/property");
    return data.data || data;
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/api/property/${id}`);
    return data.data || data;
  },

  getByOwner: async (ownerId) => {
    const { data } = await axiosInstance.get(`/api/properties/owner/${ownerId}`);
    return data.data || data;
  },

  create: async (propertyData) => {
    const { data } = await axiosInstance.post("/api/property", propertyData);
    return data.data || data;
  },

  update: async (id, propertyData) => {
    const { data } = await axiosInstance.put(`/api/property/${id}`, propertyData);
    return data.data || data;
  },

  delete: async (id) => {
    const { data } = await axiosInstance.delete(`/api/property/${id}`);
    return data.data || data;
  },

  search: async (filters) => {
    const { data } = await axiosInstance.get("/api/search/property/", {
      params: filters,
    });
    return data.data || data;
  },

  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const { data } = await axiosInstance.post("/api/upload-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data || data;
  },

  uploadImageByLink: async (link) => {
    const { data } = await axiosInstance.post("/api/upload-by-link", { link });
    return data.data || data;
  },
};

// Booking API
export const bookingAPI = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/api/bookings");
    return data.data || data;
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/api/property/booking/${id}`);
    return data.data || data;
  },

  getUserBookings: async (userId) => {
    const { data } = await axiosInstance.get(`/api/bookings?userId=${userId}`);
    return data.data || data;
  },

  create: async (bookingData) => {
    const { data} = await axiosInstance.post("/api/property/booking", bookingData);
    return data.data || data;
  },

  delete: async (id) => {
    const { data } = await axiosInstance.delete(`/api/property/booking/${id}`);
    return data.data || data;
  },
};

// Analytics API
export const analyticsAPI = {
  getOwnerStats: async () => {
    const { data } = await axiosInstance.get("/api/analytics/owner");
    return data.data || data;
  },
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: async () => {
    const { data } = await axiosInstance.get("/api/recommendations");
    return data.data || data;
  },

  getPersonalized: async () => {
    const { data } = await axiosInstance.get("/api/personalized/recommendations");
    return data.data || data;
  },

  getPopular: async () => {
    const { data } = await axiosInstance.get("/api/popular-properties");
    return data.data || data;
  },
};

export default {
  auth: authAPI,
  property: propertyAPI,
  booking: bookingAPI,
  analytics: analyticsAPI,
  recommendations: recommendationsAPI,
};
