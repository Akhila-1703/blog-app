import React, { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router'
import { useAuth } from "../store/authStore"

function RootLayout() {

  const checkAuth = useAuth((state) => state.checkAuth);

  const loading = useAuth((state) => state.loading);

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">
          Checking authentication...
        </p>
      </div>
    );
  }

  return (
    <div>

      <Header />

      <div className="min-h-screen">
        <Outlet />
      </div>

      <Footer />

    </div>
  );
}

export default RootLayout;