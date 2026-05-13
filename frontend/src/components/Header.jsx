import React from "react";
import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";

import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass
} from "../styles/common";

function Header() {

  const {
    currentUser,
    isAuthenticated,
    logout
  } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className={navbarClass}>

      <div className={navContainerClass}>

        {/* LOGO + BRAND */}
        <div className="flex items-center gap-3">

          <img
            src="https://visionhospitalgoa.com/wp-content/uploads/2020/09/175-1757329_my-blog-logo-png-transparent-png.png"
            alt="logo"
            className="w-10 h-10 rounded-full object-cover"
          />

          <h2 className={navBrandClass}>
            BlogApp
          </h2>

        </div>

        {/* NAV LINKS */}
        <nav>

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

            {!isAuthenticated ? (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? navLinkActiveClass
                        : navLinkClass
                    }
                  >
                    Login
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      isActive
                        ? navLinkActiveClass
                        : navLinkClass
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className={navLinkClass}>
                  {currentUser?.firstName}
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className={navLinkClass}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;