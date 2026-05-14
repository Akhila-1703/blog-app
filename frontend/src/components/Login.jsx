import { useForm } from "react-hook-form";

import {
  pageBackground,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
} from "../styles/common";

import { NavLink, useNavigate, useLocation } from "react-router";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

function Login() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = useAuth((state) => state.login);

  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  const currentUser = useAuth((state) => state.currentUser);

  const error = useAuth((state) => state.error);

  const navigate = useNavigate();

  const location = useLocation();

  const onUserLogin = async (userCredObj) => {

    await login(userCredObj);
  };

  useEffect(() => {

    if (isAuthenticated) {

      if (location.pathname === "/login") {

        toast.success("Logged in successfully");

        if (currentUser.role === "USER") {

          navigate("/user-profile");

        } else if (currentUser.role === "AUTHOR") {

          navigate("/author-profile");
        }
      }
    }

  }, [isAuthenticated, currentUser]);

  return (

    <div className={`${pageBackground} flex items-center justify-center px-5 py-16`}>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 border border-[#ececec] rounded-3xl overflow-hidden bg-white">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center bg-[#fafafa] px-12 py-14 border-r border-[#ececec]">

          <div className="max-w-md">

            <p className="uppercase tracking-[0.25em] text-[11px] text-gray-400 mb-5">
              Welcome Back
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-black leading-tight">
              Continue your reading journey.
            </h1>

            <p className="text-gray-500 text-[15px] leading-8 mt-6">
              Discover premium stories on technology,
              programming, AI and modern web development.
            </p>

            {/* STATS */}
            <div className="flex items-center gap-8 mt-12">

              <div>

                <h2 className="text-2xl font-bold text-black">
                  100+
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Articles
                </p>

              </div>

              <div>

                <h2 className="text-2xl font-bold text-black">
                  50+
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Writers
                </p>

              </div>

              <div>

                <h2 className="text-2xl font-bold text-black">
                  10K+
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Readers
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12 flex items-center justify-center">

          <div className="w-full max-w-md">

            {/* HEADER */}
            <div className="mb-10">

              <p className="uppercase tracking-[0.25em] text-[11px] text-gray-400 mb-4 text-center lg:text-left">
                Account
              </p>

              <h2 className={`${formTitle} !text-4xl !mb-3 text-center lg:text-left`}>
                Sign In
              </h2>

              <p className={`${mutedText} text-center lg:text-left`}>
                Enter your credentials to continue.
              </p>

            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5">

                <p className={errorClass}>
                  {error}
                </p>

              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit(onUserLogin)}>

              {/* EMAIL */}
              <div className={formGroup}>

                <label className={labelClass}>
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className={inputClass}
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* PASSWORD */}
              <div className={formGroup}>

                <label className={labelClass}>
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  className={inputClass}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />

                {errors.password && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* FORGOT PASSWORD */}
              <div className="flex justify-end mb-6">

                <a
                  href="/forgot-password"
                  className={`${linkClass} text-sm`}
                >
                  Forgot password?
                </a>

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className={submitBtn}
              >
                Sign In
              </button>

            </form>

            {/* FOOTER */}
            <p className={`${mutedText} text-center mt-8`}>

              Don&apos;t have an account?{" "}

              <NavLink
                to="/register"
                className={linkClass}
              >
                Create one
              </NavLink>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;