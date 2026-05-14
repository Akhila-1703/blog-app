import axios from "axios";

import { create } from "zustand";

import API_BASE_URL from "../config/apiConfig";

export const useAuth = create((set) => ({

  // ============================================
  // STATES
  // ============================================

  currentUser: null,

  articles: [],

  loading: false,

  isAuthenticated: false,

  error: null,

  // ============================================
  // LOGIN
  // ============================================

  login: async (userCredObj) => {

    try {

      set({
        loading: true,
        error: null,
      });

      const res = await axios.post(
        `${API_BASE_URL}/common-api/login`,
        userCredObj,
        {
          withCredentials: true,
        }
      );

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return true;

    } catch (err) {

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error:
          err.response?.data?.message ||
          "Login failed",
      });

      return false;
    }
  },

  // ============================================
  // LOGOUT
  // ============================================

  logout: async () => {

    try {

      set({
        loading: true,
        error: null,
      });

      await axios.get(
        `${API_BASE_URL}/common-api/logout`,
        {
          withCredentials: true,
        }
      );

    } catch (err) {

      console.log(err);
    }

    // ALWAYS CLEAR STATE
    set({
      currentUser: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  },

  // ============================================
  // CHECK AUTH
  // ============================================

  checkAuth: async () => {

    try {

      set({
        loading: true,
      });

      const res = await axios.get(
        `${API_BASE_URL}/common-api/check-auth`,
        {
          withCredentials: true,
        }
      );

      // AUTHENTICATED
      if (res.data.payload) {

        set({
          currentUser: res.data.payload,
          isAuthenticated: true,
          loading: false,
          error: null,
        });

      }

      // NOT AUTHENTICATED
      else {

        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }

    } catch (err) {

      console.log(
        "Auth check failed:",
        err
      );

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

}));