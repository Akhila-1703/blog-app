import { useState, useEffect } from "react";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

import {
  pageWrapper,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleBody,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common.js";

function UserProfile() {

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const navigateToArticleById = (articleObj) => {

    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  useEffect(() => {

    const getAllArticles = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `${API_BASE_URL}/user-api/articles`,
          {
            withCredentials: true,
          }
        );

        setArticles(res.data.payload);

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.error ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

    getAllArticles();

  }, []);

  const formatDateIST = (date) => {

    return new Date(date).toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  if (loading) {

    return (
      <p className={loadingClass}>
        Loading articles...
      </p>
    );
  }

  return (

    <div className={pageWrapper}>

      {error && (
        <p className={errorClass}>
          {error}
        </p>
      )}

      {/* PROFILE CARD */}
      {currentUser && (

        <div className="border border-[#ececec] rounded-3xl p-8 mb-14 bg-[#fafafa]">

          <div className="flex items-center gap-5">

            <img
              src={
                currentUser.profileImageUrl ||
                "https://via.placeholder.com/100"
              }
              alt="profile"
              className="w-20 h-20 rounded-full object-cover border border-gray-300"
            />

            <div>

              <h2 className="text-3xl font-bold tracking-tight text-black">
                Welcome, {currentUser.firstName}
              </h2>

              <p className="text-gray-500 mt-2">
                Explore the latest stories and
                articles from the community.
              </p>

            </div>

          </div>

        </div>

      )}

      {/* ARTICLES HEADER */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">

        <div>

          <p className="uppercase tracking-[0.2em] text-xs text-gray-400 mb-3">
            Dashboard
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-black">
            Latest Articles
          </h2>

        </div>

        <p className="text-sm text-gray-500">
          {articles.length} Articles Available
        </p>

      </div>

      {/* ARTICLES */}
      {articles?.length > 0 ? (

        <div className={articleGrid}>

          {articles.map((articleObj) => (

            <div
              key={articleObj._id}
              className={articleCardClass}
            >

              <div className="flex flex-col h-full">

                <div className="flex-1">

                  <h3 className={articleTitle}>
                    {articleObj.title}
                  </h3>

                  <p className={articleBody}>
                    {articleObj.content.slice(
                      0,
                      120
                    )}...
                  </p>

                  <p className={timestampClass}>
                    {formatDateIST(
                      articleObj.createdAt
                    )}
                  </p>

                </div>

                <button
                  className={`${ghostBtn} mt-6 self-start`}
                  onClick={() =>
                    navigateToArticleById(
                      articleObj
                    )
                  }
                >
                  Read Article →
                </button>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="text-center py-20">

          <h3 className="text-2xl font-semibold text-black mb-3">
            No Articles Found
          </h3>

          <p className="text-gray-500">
            Articles will appear here once
            published.
          </p>

        </div>

      )}


    </div>
  );
}

export default UserProfile;