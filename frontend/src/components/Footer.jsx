import React from "react";
import { NavLink } from "react-router";

import {
  footerClass,
  footerText,
  navLinkClass,
} from "../styles/common";

function Footer() {

  return (
    <footer className={footerClass}>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center">

                <div className="w-4 h-4 rounded-full border-2 border-black"></div>

              </div>

              <h2 className="text-2xl font-bold tracking-tight text-black">
                bloggr
              </h2>

            </div>

            <p className="text-sm leading-8 text-gray-500 max-w-xs">
              A modern blogging platform for sharing ideas,
              stories and insights on technology,
              programming, AI and web development.
            </p>

          </div>

          {/* NAVIGATION */}
          <div>

            <h3 className="text-sm font-semibold text-black mb-5">
              Navigation
            </h3>

            <ul className="flex flex-col gap-4">

              <li>
                <NavLink
                  to="/"
                  className={navLinkClass}
                >
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={navLinkClass}
                >
                  Login
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/register"
                  className={navLinkClass}
                >
                  Register
                </NavLink>
              </li>

            </ul>

          </div>

          {/* CATEGORIES */}
          <div>

            <h3 className="text-sm font-semibold text-black mb-5">
              Categories
            </h3>

            <ul className="flex flex-col gap-4 text-sm text-gray-500">

              <li>Technology</li>
              <li>Programming</li>
              <li>AI</li>
              <li>Web Development</li>

            </ul>

          </div>

          {/* CONNECT */}
          <div>

            <h3 className="text-sm font-semibold text-black mb-5">
              Connect
            </h3>

            <ul className="flex flex-col gap-4">

              <li>
                <a
                  href="#"
                  className={navLinkClass}
                >
                  Twitter
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={navLinkClass}
                >
                  LinkedIn
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={navLinkClass}
                >
                  GitHub
                </a>
              </li>

            </ul>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-[#ececec] mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className={footerText}>
            © 2026 bloggr. All rights reserved.
          </p>

          <p className="text-sm text-gray-400 text-center">
            Designed with a modern minimal aesthetic.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;