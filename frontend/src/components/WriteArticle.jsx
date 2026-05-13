import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import API_BASE_URL from "../config/apiConfig";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common";

function WriteArticle() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitArticle = async (articleObj) => {

    if (loading) return;

    setLoading(true);

    try {

      await axios.post(
        `${API_BASE_URL}/author-api/articles`,
        articleObj,
        { withCredentials: true }
      );

      toast.success("Article published successfully!");

      reset();

      navigate("/author-profile/articles");

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to publish article"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={formCard}>

      <h2 className={formTitle}>
        Write New Article
      </h2>

      <form onSubmit={handleSubmit(submitArticle)}>

        {/* Title */}
        <div className={formGroup}>

          <label className={labelClass}>
            Title
          </label>

          <input
            type="text"
            className={inputClass}
            placeholder="Enter article title"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title should contain atleast 3 characters",
              },
              validate: (value) =>
                value.trim().length > 0 || "Title cannot be empty"
            })}
          />

          {errors.title && (
            <p className={errorClass}>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className={formGroup}>

          <label className={labelClass}>
            Category
          </label>

          <select
            className={inputClass}
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="AI">AI</option>
            <option value="web development">Web Development</option>
          </select>

          {errors.category && (
            <p className={errorClass}>
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div className={formGroup}>

          <label className={labelClass}>
            Content
          </label>

          <textarea
            rows="8"
            className={inputClass}
            placeholder="Write your article content..."
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 20,
                message: "Content should contain atleast 20 characters",
              },
              validate: (value) =>
                value.trim().length > 0 || "Content cannot be empty"
            })}
          />

          {errors.content && (
            <p className={errorClass}>
              {errors.content.message}
            </p>
          )}
        </div>

        <button
          className={submitBtn}
          type="submit"
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish Article"}
        </button>

        {loading && (
          <p className={loadingClass}>
            Publishing article...
          </p>
        )}

      </form>
    </div>
  );
}

export default WriteArticle;