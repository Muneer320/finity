// API Configuration and utility functions

// Use proxy in development, direct URL in production
export const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "/api"
    : "https://finity.onrender.com";

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
    
    // Try to parse JSON response
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // Handle non-JSON responses (like plain text errors)
      const text = await response.text();
      data = { detail: text, raw: text };
    }

    if (!response.ok) {
      // Handle validation errors (422)
      if (response.status === 422 && data.detail) {
        // Format validation error details
        if (Array.isArray(data.detail)) {
          const errors = data.detail
            .map((err) => `${err.loc.join(" -> ")}: ${err.msg}`)
            .join(", ");
          throw new Error(`Validation Error: ${errors}`);
        }
        throw new Error(JSON.stringify(data.detail));
      }
      
      // Handle server errors (500)
      if (response.status === 500) {
        throw new Error(`Server Error: ${data.detail || data.raw || 'Internal Server Error'}`);
      }
      
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

// User Profile API calls
export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    return apiRequest("/users/me", {
      method: "GET",
    });
  },

  // Submit onboarding data
  onboard: async (onboardingData) => {
    return apiRequest("/onboard", {
      method: "POST",
      body: JSON.stringify(onboardingData),
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
