// Import Axios for managing HTTP requests
import axios from "axios";

// Import Create method from Zustand library to handle global reactive states
import { create } from "zustand";

// Import the configured API base URL to build endpoint routes
import API_BASE_URL from "../config/apiConfig";

/**
 * Zustand global authentication store.
 * Manages reactive session states and credentials actions for the client app.
 */
export const useAuth = create((set) => ({

  // ============================================
  // REACTIVE STATE PROPERTIES
  // ============================================

  // Stores the authenticated user profile details (null if not logged in)
  currentUser: null,

  // Holds article lists fetched from database (if needed in state context)
  articles: [],

  // Flag showing if an asynchronous request (login/logout/check) is currently running
  loading: false,

  // Flag showing if the client has an active authenticated session
  isAuthenticated: false,

  // Stores error messages thrown during credentials actions
  error: null,

  // ============================================
  // LOGIN ACTION METHOD
  // ============================================

  login: async (userCredObj) => {
    try {
      // Set loading to true and clear any previous authentication error
      set({
        loading: true,
        error: null,
      });

      // Send a POST request to login endpoint passing credentials payload
      const res = await axios.post(
        `${API_BASE_URL}/common-api/login`,
        userCredObj,
        {
          withCredentials: true, // Crucial: Permits Axios to receive HTTP-only cookies
        }
      );

      // Successfully authenticated: save user data to state and authenticate session
      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      // Return true to indicate successful sign in
      return true;

    } catch (err) {
      // Login failed: Clear session properties and populate error state
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error:
          err.response?.data?.message || // Retrieve custom error messages dispatched from backend
          "Login failed",
      });

      // Return false to indicate failed login attempt
      return false;
    }
  },

  // ============================================
  // LOGOUT ACTION METHOD
  // ============================================

  logout: async () => {
    try {
      // Set loading to true and clear error messages
      set({
        loading: true,
        error: null,
      });

      // Call common logout API to clear HTTP-only cookies on the server
      await axios.get(
        `${API_BASE_URL}/common-api/logout`,
        {
          withCredentials: true, // Permits cookie clearance headers
        }
      );

    } catch (err) {
      // Log unexpected error occurrences
      console.log(err);
    }

    // Always clear the frontend authentication states, even if API request failed
    set({
      currentUser: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  },

  // ============================================
  // SESSION REFRESH CHECK ACTION METHOD
  // ============================================

  checkAuth: async () => {
    try {
      // Set loading flag during background verification
      set({
        loading: true,
      });

      // Send checking request to common API endpoint
      const res = await axios.get(
        `${API_BASE_URL}/common-api/check-auth`,
        {
          withCredentials: true, // Transmit the HTTP-only cookie
        }
      );

      // Scenario A: Server verified token successfully and returned user details
      if (res.data.payload) {
        set({
          currentUser: res.data.payload,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      }
      // Scenario B: Session cookie is missing or invalid (user is logged out)
      else {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }

    } catch (err) {
      // Log errors if check auth request fails physically (e.g. network down)
      console.log(
        "Auth check failed:",
        err
      );

      // Clean session state
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

}));