import { NavLink, Outlet } from "react-router";

import { pageWrapper } from "../styles/common";

function UserDashboard() {

  return (

    <div className={pageWrapper}>

      {/* HEADER */}
      <div className="mb-12">

        <p className="uppercase tracking-[0.25em] text-[11px] text-gray-400 mb-4">
          Dashboard
        </p>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

          <div>

            <h1 className="text-4xl font-bold tracking-tight text-black">
              User Dashboard
            </h1>

            <p className="text-gray-500 mt-4 text-[15px] leading-7 max-w-2xl">
              Explore articles and manage your account.
            </p>

          </div>

          {/* NAVIGATION */}
          <div className="flex items-center gap-3 flex-wrap">

            <NavLink
              to="/user-dashboard"
              end
              className={({ isActive }) =>
                isActive
                  ? "px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium transition"
                  : "px-5 py-2.5 rounded-full border border-[#e5e5e5] text-sm text-gray-600 hover:border-black hover:text-black transition"
              }
            >
              Articles
            </NavLink>

            <NavLink
              to="/user-dashboard/profile"
              className={({ isActive }) =>
                isActive
                  ? "px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium transition"
                  : "px-5 py-2.5 rounded-full border border-[#e5e5e5] text-sm text-gray-600 hover:border-black hover:text-black transition"
              }
            >
              Profile
            </NavLink>

          </div>

        </div>

      </div>

      {/* NESTED ROUTES */}
      <Outlet />

    </div>
  );
}

export default UserDashboard;