import { useEffect, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router";

import { useAuth } from "../store/authStore";

import API_BASE_URL from "../config/apiConfig";

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleStatusActive,
  articleStatusDeleted,
} from "../styles/common";

function AuthorArticles() {

  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {

    const authorId = user?._id || user?.userId;

    if (!authorId) return;

    const getAuthorArticles = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `${API_BASE_URL}/author-api/articles`,
          {
            withCredentials: true,
          }
        );

        setArticles(res.data.payload);

      } catch (err) {

        setError(
          err.response?.data?.error ||
          "Failed to fetch articles"
        );

      } finally {

        setLoading(false);
      }
    };

    getAuthorArticles();

  }, [user]);

  const openArticle = (article) => {

    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  if (loading) {

    return (
      <p className={loadingClass}>
        Loading articles...
      </p>
    );
  }

  if (error) {

    return (
      <p className={errorClass}>
        {error}
      </p>
    );
  }

  if (articles.length === 0) {

    return (

      <div className="border border-[#ececec] rounded-3xl p-14 text-center bg-[#fafafa]">

        <h2 className="text-2xl font-bold text-black mb-4">
          No Articles Yet
        </h2>

        <p className="text-gray-500 text-[15px] leading-7 max-w-md mx-auto">
          Start writing your first article and share
          your ideas with the community.
        </p>

      </div>
    );
  }

  return (

    <div>

      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">

        <div>

          <p className="uppercase tracking-[0.25em] text-[11px] text-gray-400 mb-3">
            Published Articles
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-black">
            Your Stories
          </h2>

        </div>

        <div className="px-5 py-2 rounded-full border border-[#ececec] text-sm text-gray-600 bg-white">
          {articles.length} Articles
        </div>

      </div>

      {/* GRID */}
      <div className={articleGrid}>

        {articles.map((article) => (

          <div
            key={article._id}
            className={`${articleCardClass} relative`}
          >

            {/* STATUS */}
            <span
              className={
                article.isArticleActive
                  ? articleStatusActive
                  : articleStatusDeleted
              }
            >
              {article.isArticleActive
                ? "ACTIVE"
                : "DELETED"}
            </span>

            {/* CATEGORY */}
            <p className="uppercase tracking-[0.2em] text-[10px] text-gray-400 mb-4">
              {article.category}
            </p>

            {/* TITLE */}
            <h3 className={articleTitle}>
              {article.title}
            </h3>

            {/* CONTENT */}
            <p className={articleExcerpt}>
              {article.content.slice(0, 100)}...
            </p>

            {/* ACTION */}
            <button
              className={`${ghostBtn} mt-6 self-start`}
              onClick={() => openArticle(article)}
            >
              Read Article →
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AuthorArticles;