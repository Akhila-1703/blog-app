import { useAuth } from "../store/authStore";

import {
  pageWrapper,
  inputClass,
  labelClass,
  formGroup,
  submitBtn,
  errorClass,
} from "../styles/common";

import React, { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import API_BASE_URL from "../config/apiConfig";

function AdminProfile() {

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================

  const handleChange = (e) => {

    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================
  // CHANGE PASSWORD
  // ============================================

  const handlePasswordChange = async (e) => {

    e.preventDefault();

    setError("");

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {

      return setError(
        "New password and confirm password do not match"
      );
    }

    if (
      passwordData.newPassword.length < 6
    ) {

      return setError(
        "Password must contain at least 6 characters"
      );
    }

    try {

      setLoading(true);

      const res = await axios.put(
        `${API_BASE_URL}/common-api/change-password`,
        {
          currentPassword:
            passwordData.currentPassword,
          newPassword:
            passwordData.newPassword,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to change password"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className={pageWrapper}>

      {/* HEADER */}
      <div className="mb-8">

        <p className="uppercase tracking-[0.22em] text-[10px] text-gray-400 mb-2">
          Account
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-black">
          Admin Profile
        </h1>

      </div>

      {/* PROFILE CARD */}
      <div className="border border-[#ececec] rounded-3xl p-6 bg-white">

        <div className="flex items-center gap-5">

          {/* IMAGE */}
          <div className="shrink-0">

            <img
              src={
                currentUser?.profileImageUrl ||
                "https://via.placeholder.com/120"
              }
              alt="profile"
              className="w-20 h-20 rounded-3xl object-cover border border-[#ececec]"
            />

          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-center">

            <h2 className="text-lg font-semibold text-black leading-none">
              {currentUser?.firstName}{" "}
              {currentUser?.lastName}
            </h2>

            <p className="text-gray-500 text-sm mt-3">
              {currentUser?.email}
            </p>

            <div className="mt-4">

              <span className="inline-flex items-center px-3 py-1 rounded-full bg-black text-white text-[10px] tracking-[0.15em] uppercase leading-none">
                {currentUser?.role}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* SECURITY */}
      <div className="border border-[#ececec] rounded-3xl p-6 bg-white mt-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <h3 className="text-lg font-semibold text-black leading-none">
              Security
            </h3>

            <p className="text-gray-500 text-sm mt-3 leading-6">
              Update your password regularly to
              keep your account secure.
            </p>

          </div>

          <button
            onClick={() =>
              setShowPasswordForm(
                !showPasswordForm
              )
            }
            className="self-start md:self-center border border-black px-4 py-2 rounded-full text-xs font-medium hover:bg-black hover:text-white transition-all duration-300"
          >
            {showPasswordForm
              ? "Cancel"
              : "Change Password"}
          </button>

        </div>

        {/* PASSWORD FORM */}
        {showPasswordForm && (

          <form
            onSubmit={handlePasswordChange}
            className="border-t border-[#ececec] mt-6 pt-6"
          >

            {error && (
              <div className="mb-5">
                <p className={errorClass}>
                  {error}
                </p>
              </div>
            )}

            {/* CURRENT PASSWORD */}
            <div className={formGroup}>

              <label className={labelClass}>
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={
                  passwordData.currentPassword
                }
                onChange={handleChange}
                placeholder="Enter current password"
                className={inputClass}
                required
              />

            </div>

            {/* NEW PASSWORD */}
            <div className={formGroup}>

              <label className={labelClass}>
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={
                  passwordData.newPassword
                }
                onChange={handleChange}
                placeholder="Enter new password"
                className={inputClass}
                required
              />

            </div>

            {/* CONFIRM PASSWORD */}
            <div className={formGroup}>

              <label className={labelClass}>
                Confirm New Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={
                  passwordData.confirmPassword
                }
                onChange={handleChange}
                placeholder="Confirm new password"
                className={inputClass}
                required
              />

            </div>

            {/* BUTTON */}
            <div className="mt-6">

              <button
                type="submit"
                disabled={loading}
                className={`${submitBtn} text-sm`}
              >
                {loading
                  ? "Updating..."
                  : "Update Password"}
              </button>

            </div>

          </form>

        )}

      </div>

    </div>
  );
}

export default AdminProfile;