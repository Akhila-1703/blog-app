import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  NavLink,
  useNavigate,
} from "react-router";

import { useAuth } from "../store/authStore";

import toast from "react-hot-toast";

import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function Header() {

  const navigate = useNavigate();

  const {
    currentUser,
    isAuthenticated,
    logout,
  } = useAuth();

  const [openProfileMenu, setOpenProfileMenu] =
    useState(false);
    
  const [openMobileMenu, setOpenMobileMenu] = 
    useState(false);

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // =================================================
  // DASHBOARD PATH
  // =================================================

  const dashboardPath =
    currentUser?.role === "AUTHOR"
      ? "/author-dashboard"
      : currentUser?.role === "ADMIN"
      ? "/admin-dashboard"
      : "/user-dashboard";

  // =================================================
  // PROFILE PATH
  // =================================================

  const profilePath =
    currentUser?.role === "AUTHOR"
      ? "/author-dashboard/profile"
      : currentUser?.role === "ADMIN"
      ? "/admin-dashboard/profile"
      : "/user-dashboard/profile";

  // =================================================
  // LOGOUT
  // =================================================

  const handleLogout = async () => {

    setOpenProfileMenu(false);
    setOpenMobileMenu(false);

    await logout();

    toast.success(
      "Logged out successfully"
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };

  // =================================================
  // CLOSE DROPDOWN
  // =================================================

  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setOpenProfileMenu(false);
      }
      
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(
          event.target
        )
      ) {
        setOpenMobileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  return (

    <header
      className={`${navbarClass} h-[74px] flex items-center relative z-50`}
    >

      <div
        className={`${navContainerClass} w-full`}
      >

        {/* ================================================= */}
        {/* LEFT */}
        {/* ================================================= */}

        <div className="flex items-center gap-14">

          {/* LOGO */}
          <NavLink
            to="/"
            onClick={() => setOpenMobileMenu(false)}
            className="flex items-center gap-3 group shrink-0"
          >

            <div className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center transition-all duration-300 group-hover:rotate-6">

              <div className="w-4 h-4 rounded-full border-2 border-black"></div>

            </div>

            <h1
              className={`${navBrandClass} text-[1.65rem]`}
            >
              bloggr
            </h1>

          </NavLink>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:block">

            <ul className={navLinksClass}>

              {/* HOME */}
              <li>

                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? navLinkActiveClass
                      : navLinkClass
                  }
                >
                  Home
                </NavLink>

              </li>

              {/* DASHBOARD */}
              {isAuthenticated && (

                <li>

                  <NavLink
                    to={dashboardPath}
                    end
                    className={({ isActive }) =>
                      isActive
                        ? navLinkActiveClass
                        : navLinkClass
                    }
                  >
                    Dashboard
                  </NavLink>

                </li>

              )}

            </ul>

          </nav>

        </div>

        {/* ================================================= */}
        {/* RIGHT */}
        {/* ================================================= */}

        <div className="flex items-center gap-3">

          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (

              <>
                {/* LOGIN */}
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? `${navLinkActiveClass} border border-[#e8e8e8] px-5 py-2 rounded-full`
                      : `${navLinkClass} border border-transparent px-5 py-2 rounded-full hover:border-[#ececec]`
                  }
                >
                  Login
                </NavLink>

                {/* REGISTER */}
                <NavLink
                  to="/register"
                  className="bg-black text-white text-sm px-5 py-2.5 rounded-full hover:bg-[#1d1d1f] transition-all duration-300"
                >
                  Register
                </NavLink>
              </>

            ) : (

              <div
                ref={profileRef}
                className="relative"
              >

                {/* PROFILE BUTTON */}
                <button
                  onClick={() =>
                    setOpenProfileMenu(
                      !openProfileMenu
                    )
                  }
                  className="flex items-center gap-3 border border-[#ececec] rounded-full pl-2 pr-4 py-1.5 bg-white hover:bg-[#fafafa] transition-all duration-300"
                >

                  <img
                    src={
                      currentUser?.profileImageUrl ||
                      "https://via.placeholder.com/40"
                    }
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border border-[#ececec]"
                  />

                  <div className="hidden sm:flex flex-col items-start">

                    <span className="text-sm font-medium text-black leading-none">
                      {currentUser?.firstName}
                    </span>

                    <span className="text-[11px] uppercase tracking-[0.15em] text-gray-400 mt-1">
                      {currentUser?.role}
                    </span>

                  </div>

                </button>

                {/* DROPDOWN */}
                {openProfileMenu && (

                  <div className="absolute right-0 top-16 w-56 bg-white border border-[#ececec] rounded-2xl shadow-sm overflow-hidden z-50">

                    {/* USER INFO */}
                    <div className="px-5 py-4 border-b border-[#f1f1f1]">

                      <p className="text-sm font-semibold text-black">
                        {currentUser?.firstName}{" "}
                        {currentUser?.lastName}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {currentUser?.email}
                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div className="p-2">

                      {/* PROFILE */}
                      <button
                        onClick={() => {

                          navigate(
                            profilePath
                          );

                          setOpenProfileMenu(
                            false
                          );
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-[#f7f7f7] transition"
                      >
                        Profile
                      </button>

                      {/* LOGOUT */}
                      <button
                        onClick={
                          handleLogout
                        }
                        className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>

                    </div>

                  </div>

                )}

              </div>

            )}
          </div>
          
          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 border border-[#ececec] rounded-full hover:bg-[#fafafa] transition-all"
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
          >
            <span className={`bg-black block transition-all duration-300 ease-out h-0.5 w-4 rounded-sm ${openMobileMenu ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
            <span className={`bg-black block transition-all duration-300 ease-out h-0.5 w-4 rounded-sm my-0.5 ${openMobileMenu ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`bg-black block transition-all duration-300 ease-out h-0.5 w-4 rounded-sm ${openMobileMenu ? '-rotate-45 -translate-y-1.5' : 'translate-y-0.5'}`}></span>
          </button>

        </div>

      </div>

      {/* MOBILE DROPDOWN MENU */}
      {openMobileMenu && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden absolute top-[74px] left-0 w-full bg-white border-b border-[#ececec] shadow-lg z-40 py-4 px-5 flex flex-col gap-4"
        >
          <NavLink
            to="/"
            onClick={() => setOpenMobileMenu(false)}
            className={({ isActive }) =>
              isActive
                ? `${navLinkActiveClass} block py-2`
                : `${navLinkClass} block py-2`
            }
          >
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to={dashboardPath}
              end
              onClick={() => setOpenMobileMenu(false)}
              className={({ isActive }) =>
                isActive
                  ? `${navLinkActiveClass} block py-2`
                  : `${navLinkClass} block py-2`
              }
            >
              Dashboard
            </NavLink>
          )}

          <hr className="border-[#ececec] my-2" />

          {!isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <NavLink
                to="/login"
                onClick={() => setOpenMobileMenu(false)}
                className="text-center border border-[#ececec] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#fafafa] transition-all"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setOpenMobileMenu(false)}
                className="text-center bg-black text-white text-sm px-5 py-2.5 rounded-full hover:bg-[#1d1d1f] transition-all"
              >
                Register
              </NavLink>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 py-2">
                <img
                  src={
                    currentUser?.profileImageUrl ||
                    "https://via.placeholder.com/40"
                  }
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border border-[#ececec]"
                />
                <div>
                  <p className="text-sm font-semibold text-black leading-none">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 mt-1">
                    {currentUser?.role}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  navigate(profilePath);
                  setOpenMobileMenu(false);
                }}
                className="w-full text-left py-3 text-sm font-medium hover:text-black transition text-gray-600"
              >
                Profile
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full text-left py-3 text-sm font-medium text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

    </header>
  );
}

export default Header;