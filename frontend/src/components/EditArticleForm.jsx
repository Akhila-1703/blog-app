import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
} from "../styles/common";

function EditArticle() {

  const location = useLocation();

  const navigate = useNavigate();

  const article = location.state;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // prefill form
  useEffect(() => {

    if (!article) return;

    setValue("title", article.title);
    setValue("category", article.category);
    setValue("content", article.content);

  }, [article]);

  const updateArticle = async (data) => {

    if (loading) return;

    setLoading(true);

    try {

      data.articleId = article._id;

      let res = await axios.put(
        "http://localhost:4000/author-api/articles",
        data,
        {
          withCredentials: true
        }
      );

      toast.success("Article updated successfully");

      navigate(`/article/${article._id}`, {
        state: res.data.payload,
      });

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to update article"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${formCard} mt-10`}>

      <h2 className={formTitle}>
        Edit Article
      </h2>

      <form onSubmit={handleSubmit(updateArticle)}>

        {/* Title */}
        <div className={formGroup}>

          <label className={labelClass}>
            Title
          </label>

          <input
            className={inputClass}
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title should contain atleast 3 characters"
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
              required: "Category is required"
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
            rows="14"
            className={inputClass}
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 20,
                message: "Content should contain atleast 20 characters"
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
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Article"}
        </button>

      </form>
    </div>
  );
}

export default EditArticle;