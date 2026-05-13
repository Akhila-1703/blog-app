import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  divider,
  loadingClass,
} from "../styles/common";
import { NavLink } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function Register() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);       // for image preview
  const [selectedFile, setSelectedFile] = useState(null); // for FormData
  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);

    try {
      const { role, ...userObj } = newUser;

      // Create FormData and append text fields
      const formData = new FormData();
      Object.keys(userObj).forEach((key) => formData.append(key, userObj[key]));

      // Append the actual file if selected
      if (selectedFile) {
        formData.append("profileImageUrl", selectedFile); // must match backend multer
      }

      // Determine URL based on role
      const url =
        role === "author"
          ? "http://localhost:4000/author-api/users"
          : "http://localhost:4000/user-api/users";

      const resObj = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (resObj.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (loading) return <p className={loadingClass}>Creating account...</p>;

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create an Account</h2>
        {error && <p className={errorClass}>{error}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>
          {/* Role Selection */}
          <div className="mb-5">
            <p className={labelClass}>Register as</p>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  value="user"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  value="author"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">Author</span>
              </label>
            </div>
          </div>

          <div className={divider} />

          {/* Name Fields */}
          <div className="sm:flex gap-4 mb-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                {...register("firstName")}
                placeholder="First name"
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                {...register("lastName")}
                placeholder="Last name"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Min. 8 characters"
              className={inputClass}
            />
          </div>

          {/* Profile Image Upload */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Image</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (!["image/jpeg", "image/png"].includes(file.type)) {
                  setError("Only JPG/PNG allowed");
                  return;
                }

                if (file.size > 2 * 1024 * 1024) {
                  setError("Max size 2MB");
                  return;
                }

                setPreview(URL.createObjectURL(file));
                setSelectedFile(file);
                setError(null);
              }}
              className={inputClass}
            />
            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className={submitBtn}>
            Create Account
          </button>
        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-violet-600 hover:text-violet-500 font-medium"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;