// API Configuration and utility functions

export const API_BASE_URL = "https://finity.onrender.com";

// Helper function for API requests
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Request failed: ${endpoint}`, error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  signup: async (email, password) => {
    return apiRequest("/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email, password) => {
    return apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};

// Storage helpers
export const storage = {
  setAuth: (data) => {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("user_email", data.user_email);
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
  },

  getToken: () => localStorage.getItem("token"),
  getUserId: () => localStorage.getItem("user_id"),
  getUserEmail: () => localStorage.getItem("user_email"),
};
