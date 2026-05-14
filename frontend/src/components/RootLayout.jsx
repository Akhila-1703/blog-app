import React, { useEffect } from "react";

import Header from "./Header";

import Footer from "./Footer";

import { Outlet } from "react-router";

import { useAuth } from "../store/authStore";

function RootLayout() {

  const checkAuth = useAuth(
    (state) => state.checkAuth
  );

  const loading = useAuth(
    (state) => state.loading
  );

  // ============================================
  // CHECK AUTH ON APP LOAD
  // ============================================

  useEffect(() => {

    checkAuth();

  }, [checkAuth]);

  // ============================================
  // GLOBAL LOADING SCREEN
  // ============================================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-white">

        <div className="flex flex-col items-center gap-4">

          {/* LOADER */}
          <div className="w-10 h-10 border-4 border-[#ececec] border-t-black rounded-full animate-spin"></div>

          <p className="text-sm text-gray-500 tracking-wide">
            Checking authentication...
          </p>

        </div>

      </div>

    );
  }

  // ============================================
  // APP LAYOUT
  // ============================================

  return (

    <div className="min-h-screen flex flex-col bg-white">

      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-1">

        <Outlet />

      </main>

      {/* FOOTER */}
      <Footer />

    </div>

  );
}

export default RootLayout;