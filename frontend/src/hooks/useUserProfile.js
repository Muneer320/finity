import { useState, useEffect } from "react";
import { userAPI } from "../utils/api";

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getProfile();
      setProfile(data);
      // Store locally for offline access
      localStorage.setItem("userProfile", JSON.stringify(data));
      return data;
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.message);
      // Try to load from localStorage as fallback
      const cached = localStorage.getItem("userProfile");
      if (cached) {
        setProfile(JSON.parse(cached));
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshProfile = () => {
    return fetchProfile();
  };

  return {
    profile,
    loading,
    error,
    refreshProfile,
  };
};
