import axios from "axios";
import { create } from "zustand";

export const useAuth = create((set) => ({
  currentUser: null,
  articles: [],
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCredWithRole) => {
    const { role, ...userCredObj } = userCredWithRole;

    try {
      set({ loading: true, error: null });

      const res = await axios.post(
        "http://localhost:4000/common-api/login",
        userCredObj,
        { withCredentials: true }
      );

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
      });

    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.error || "Login failed",
        isAuthenticated: false,
        currentUser: null,
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });

      await axios.get(
        "http://localhost:4000/common-api/logout",
        { withCredentials: true }
      );

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("http://localhost:4000/common-api/check-auth", { withCredentials: true });

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      // If user is not logged in → do nothing
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      // other errors
      console.error("Auth check failed:", err);
      set({ loading: false });
    }
  }
}));

/*import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: true,
  isAuthenticated: false,
  error: null,

  // LOGIN
  login: async (userCredWithRole) => {
    const { role, ...userCredObj } = userCredWithRole;

    try {
      // loading start
      set({
        loading: true,
        error: null,
      });

      // API call
      const res = await axios.post(
        "http://localhost:4000/common-api/login",
        userCredObj,
        {
          withCredentials: true,
        }
      );

      // success state
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
        error: null,
      });
    } catch (err) {
      console.log("Login error:", err);

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      // loading start
      set({
        loading: true,
        error: null,
      });

      // API call
      await axios.get(
        "http://localhost:4000/common-api/logout",
        {
          withCredentials: true,
        }
      );

      // clear auth state
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: null,
      });
    } catch (err) {
      console.log("Logout error:", err);

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },

  // RESTORE LOGIN AFTER REFRESH
  checkAuth: async () => {
    try {
      set({
        loading: true,
      });

      const res = await axios.get(
        "http://localhost:4000/common-api/check-auth",
        {
          withCredentials: true,

          // prevent axios from throwing error for 401
          validateStatus: (status) =>
            status === 200 || status === 401,
        }
      );

      // user authenticated
      if (res.status === 200) {
        set({
          currentUser: res.data.payload,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      }

      // user not logged in
      else if (res.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      console.error("Auth check failed:", err);

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: "Authentication failed",
      });
    }
  },
}));*/