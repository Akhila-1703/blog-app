import React, { useState, useRef, useEffect } from "react";

import { NavLink, useNavigate } from "react-router";

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
    logout
  } = useAuth();

  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  const profileRef = useRef(null);

  const handleLogout = async () => {

    await logout();

    toast.success("Logged out successfully");

    navigate("/login");
  };

  const dashboardPath =
    currentUser?.role === "AUTHOR"
      ? "/author-profile"
      : "/user-profile";

  // CLOSE MENU
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpenProfileMenu(false);
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

    <header className={`${navbarClass} h-[74px] flex items-center`}>

      <div className={`${navContainerClass} w-full`}>

        {/* LEFT */}
        <div className="flex items-center gap-14">

          {/* LOGO */}
          <NavLink
            to="/"
            className="flex items-center gap-3 group shrink-0"
          >

            <div className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center transition-all duration-300 group-hover:rotate-6">

              <div className="w-4 h-4 rounded-full border-2 border-black"></div>

            </div>

            <h1 className={`${navBrandClass} text-[1.65rem]`}>
              bloggr
            </h1>

          </NavLink>

          {/* NAVIGATION */}
          <nav className="hidden md:block">

            <ul className={navLinksClass}>

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

              {isAuthenticated && (

                <li>

                  <NavLink
                    to={dashboardPath}
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

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {!isAuthenticated ? (

            <>
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
                  setOpenProfileMenu(!openProfileMenu)
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

                  <div className="px-5 py-4 border-b border-[#f1f1f1]">

                    <p className="text-sm font-semibold text-black">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {currentUser?.email}
                    </p>

                  </div>

                  <div className="p-2">

                    {/* PROFILE */}
                    <button
                      onClick={() => {

                        navigate(`${dashboardPath}/profile`);

                        setOpenProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-[#f7f7f7] transition"
                    >
                      Profile
                    </button>

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
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

      </div>

    </header>
  );
}

export default Header;