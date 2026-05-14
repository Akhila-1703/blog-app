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
  divider,
  loadingClass,
  linkClass,
} from "../styles/common";

import { NavLink } from "react-router";

import { useState, useEffect } from "react";

import axios from "axios";

import { useNavigate } from "react-router";

import API_BASE_URL from "../config/apiConfig";

function Register() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [preview, setPreview] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {

    setLoading(true);

    setError(null);

    try {

      const { role, ...userObj } = newUser;

      const formData = new FormData();

      Object.keys(userObj).forEach((key) =>
        formData.append(key, userObj[key].trim())
      );

      if (selectedFile) {

        formData.append("profileImageUrl", selectedFile);
      }

      const url =
        role === "author"
          ? `${API_BASE_URL}/author-api/users`
          : `${API_BASE_URL}/user-api/users`;

      const resObj = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (resObj.status === 201) {

        navigate("/login");
      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    return () => {

      if (preview) {

        URL.revokeObjectURL(preview);
      }
    };

  }, [preview]);

  if (loading) {

    return (
      <p className={loadingClass}>
        Creating account...
      </p>
    );
  }

  return (

    <div className={`${pageBackground} flex items-center justify-center px-5 py-16`}>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 border border-[#ececec] rounded-3xl overflow-hidden bg-white">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center bg-[#fafafa] px-12 py-14 border-r border-[#ececec]">

          <div className="max-w-md">

            <p className="uppercase tracking-[0.25em] text-[11px] text-gray-400 mb-5">
              Join bloggr
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-black leading-tight">
              Start sharing your ideas with the world.
            </h1>

            <p className="text-gray-500 text-[15px] leading-8 mt-6">
              Create your account to read articles,
              publish stories and connect with creators
              across technology, AI and programming.
            </p>

            {/* FEATURES */}
            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3">

                <div className="w-2 h-2 rounded-full bg-black"></div>

                <p className="text-sm text-gray-600">
                  Publish modern articles
                </p>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-2 h-2 rounded-full bg-black"></div>

                <p className="text-sm text-gray-600">
                  Explore premium content
                </p>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-2 h-2 rounded-full bg-black"></div>

                <p className="text-sm text-gray-600">
                  Connect with creators
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
                Create Account
              </h2>

              <p className={`${mutedText} text-center lg:text-left`}>
                Enter your details to get started.
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
            <form onSubmit={handleSubmit(onUserRegister)}>

              {/* ROLE */}
              <div className={formGroup}>

                <label className={labelClass}>
                  Register As
                </label>

                <div className="flex gap-6 mt-3">

                  <label className="flex items-center gap-2 cursor-pointer">

                    <input
                      type="radio"
                      value="user"
                      className="accent-black w-4 h-4"
                      {...register("role", {
                        required: "Role is required",
                      })}
                    />

                    <span className="text-sm text-gray-700">
                      User
                    </span>

                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">

                    <input
                      type="radio"
                      value="author"
                      className="accent-black w-4 h-4"
                      {...register("role", {
                        required: "Role is required",
                      })}
                    />

                    <span className="text-sm text-gray-700">
                      Author
                    </span>

                  </label>

                </div>

                {errors.role && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.role.message}
                  </p>
                )}

              </div>

              <div className={divider}></div>

              {/* NAMES */}
              <div className="grid sm:grid-cols-2 gap-4">

                <div className={formGroup}>

                  <label className={labelClass}>
                    First Name
                  </label>

                  <input
                    type="text"
                    placeholder="First name"
                    className={inputClass}
                    {...register("firstName", {
                      required: "First name is required",
                      validate: (value) =>
                        value.trim() !== "" ||
                        "First name cannot be empty",
                    })}
                  />

                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.firstName.message}
                    </p>
                  )}

                </div>

                <div className={formGroup}>

                  <label className={labelClass}>
                    Last Name
                  </label>

                  <input
                    type="text"
                    placeholder="Last name"
                    className={inputClass}
                    {...register("lastName", {
                      required: "Last name is required",
                      validate: (value) =>
                        value.trim() !== "" ||
                        "Last name cannot be empty",
                    })}
                  />

                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.lastName.message}
                    </p>
                  )}

                </div>

              </div>

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
                    pattern: {
                      value:
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
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
                  placeholder="Min. 6 characters"
                  className={inputClass}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message:
                        "Password must be at least 6 characters",
                    },
                    validate: (value) =>
                      value.trim() !== "" ||
                      "Password cannot be empty",
                  })}
                />

                {errors.password && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* IMAGE */}
              <div className={formGroup}>

                <label className={labelClass}>
                  Profile Image
                </label>

                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className={inputClass}
                  onChange={(e) => {

                    const file = e.target.files[0];

                    if (!file) return;

                    if (
                      ![
                        "image/jpeg",
                        "image/png",
                      ].includes(file.type)
                    ) {

                      setError(
                        "Only JPG/PNG images allowed"
                      );

                      return;
                    }

                    if (
                      file.size >
                      2 * 1024 * 1024
                    ) {

                      setError(
                        "Max image size is 2MB"
                      );

                      return;
                    }

                    setPreview(
                      URL.createObjectURL(file)
                    );

                    setSelectedFile(file);

                    setError(null);
                  }}
                />

                {preview && (

                  <div className="mt-5 flex items-center gap-4">

                    <img
                      src={preview}
                      alt="preview"
                      className="w-20 h-20 rounded-full object-cover border border-[#ececec]"
                    />

                    <div>

                      <p className="text-sm font-medium text-black">
                        Image Selected
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Preview of your profile image
                      </p>

                    </div>

                  </div>

                )}

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className={submitBtn}
              >
                Create Account
              </button>

            </form>

            {/* FOOTER */}
            <p className={`${mutedText} text-center mt-8`}>

              Already have an account?{" "}

              <NavLink
                to="/login"
                className={linkClass}
              >
                Sign in
              </NavLink>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;