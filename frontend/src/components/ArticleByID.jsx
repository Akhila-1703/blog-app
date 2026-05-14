import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config/apiConfig";

import {
  articlePageWrapper,
  loadingClass,
  errorClass,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,

  // NEW ADVANCED STYLES
  articleHeroSection,
  articleHeroCategory,
  articleHeroTitle,
  articleHeroDescription,
  articleMetaRow,
  articleAuthorCard,
  articleAuthorImage,
  articleContentWrapper,
  articleContentText,
  articleBottomActions,

  modernCommentCard,
  modernCommentInput,
  modernCommentButton,
  articleEmptyComments,

  commentSection,
  commentHeader,
  commentList,
  commentAuthor,
  commentText,
} from "../styles/common.js";

function ArticleByID() {

  const { id } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const user = useAuth(
    (state) => state.currentUser
  );

  const [article, setArticle] = useState(
    location.state || { comments: [] }
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [newComment, setNewComment] =
    useState("");

  useEffect(() => {

    if (article && article._id) return;

    const getArticle = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `${API_BASE_URL}/user-api/article/${id}`,
          {
            withCredentials: true,
          }
        );

        setArticle({
          ...res.data.payload,
          comments:
            res.data.payload.comments || [],
        });

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to fetch article"
        );

      } finally {

        setLoading(false);
      }
    };

    getArticle();

  }, [id]);

  const formatDate = (date) =>
    new Date(date).toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  // AUTHOR ACTIONS
  const toggleArticleStatus =
    async () => {

      const newStatus =
        !article.isArticleActive;

      if (
        !window.confirm(
          newStatus
            ? "Restore this article?"
            : "Delete this article?"
        )
      )
        return;

      try {

        const res = await axios.patch(
          `${API_BASE_URL}/author-api/articles/${id}/status`,
          {
            isArticleActive: newStatus,
          },
          {
            withCredentials: true,
          }
        );

        setArticle(res.data.payload);

        toast.success(res.data.message);

      } catch (err) {

        toast.error(
          err.response?.data?.message ||
          "Operation failed"
        );
      }
    };

  const editArticle = (
    articleObj
  ) => {

    navigate("/edit-article", {
      state: articleObj,
    });
  };

  // USER COMMENT
  const submitComment =
    async (e) => {

      e.preventDefault();

      if (!newComment.trim()) return;

      try {

        const res = await axios.put(
          `${API_BASE_URL}/user-api/articles`,
          {
            articleId: article._id,
            comment: newComment,
            user: user.userId,
          },
          {
            withCredentials: true,
          }
        );

        setArticle((prev) => ({
          ...prev,
          comments:
            res.data.payload.comments ||
            [],
        }));

        setNewComment("");

        toast.success("Comment added!");

      } catch (err) {

        toast.error(
          err.response?.data?.message ||
          "Failed to add comment"
        );
      }
    };

  if (loading) {

    return (
      <p className={loadingClass}>
        Loading article...
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

  if (!article) return null;

  return (

    <div className={articlePageWrapper}>

      {/* HERO SECTION */}
      <div className={articleHeroSection}>

        <div className={articleHeroCategory}>
          {article.category}
        </div>

        <h1 className={articleHeroTitle}>
          {article.title}
        </h1>

        <p className={articleHeroDescription}>
          Read this article shared by our
          community author and explore
          insights, ideas, and knowledge.
        </p>

        {/* META */}
        <div className={articleMetaRow}>

          <div className={articleAuthorCard}>

            <img
              src={
                article.author
                  ?.profileImageUrl ||
                "https://via.placeholder.com/100"
              }
              alt="author"
              className={articleAuthorImage}
            />

            <div className="flex flex-col items-start">

              <span className="text-sm font-semibold text-black">
                {article.author
                  ?.firstName || "Author"}
              </span>

              <span className="text-xs text-gray-500">
                Blog Author
              </span>

            </div>

          </div>

          <div>
            {formatDate(
              article.createdAt
            )}
          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className={articleContentWrapper}>

        <div className={articleContentText}>
          {article.content}
        </div>

        {/* AUTHOR ACTIONS */}
        {user?.role === "AUTHOR" && (

          <div className={articleBottomActions}>

            <button
              className={editBtn}
              onClick={() =>
                editArticle(article)
              }
            >
              Edit Article
            </button>

            <button
              className={deleteBtn}
              onClick={
                toggleArticleStatus
              }
            >
              {article.isArticleActive
                ? "Delete Article"
                : "Restore Article"}
            </button>

          </div>

        )}

      </div>

      {/* COMMENTS */}
      <div className={commentSection}>

        <h3 className={commentHeader}>
          Comments (
          {article.comments?.length || 0}
          )
        </h3>

        {/* COMMENT LIST */}
        <div className={commentList}>

          {article.comments?.length >
          0 ? (

            article.comments.map((c) => (

              <div
                key={c._id}
                className={modernCommentCard}
              >

                <div className="flex items-center justify-between mb-2">

                  <span
                    className={
                      commentAuthor
                    }
                  >
                    {c.user
                      ?.firstName ||
                      "User"}
                  </span>

                  <span className="text-xs text-gray-400">
                    {formatDate(
                      c.createdAt
                    )}
                  </span>

                </div>

                <p className={commentText}>
                  {c.comment}
                </p>

              </div>

            ))

          ) : (

            <div
              className={
                articleEmptyComments
              }
            >
              No comments yet.
            </div>

          )}

        </div>

        {/* ADD COMMENT */}
        {user?.role === "USER" && (

          <form
            onSubmit={submitComment}
            className="mt-6"
          >

            <textarea
              rows="4"
              placeholder="Write your thoughts about this article..."
              className={
                modernCommentInput
              }
              value={newComment}
              onChange={(e) =>
                setNewComment(
                  e.target.value
                )
              }
            />

            <button
              type="submit"
              className={
                modernCommentButton
              }
            >
              Submit Comment
            </button>

          </form>

        )}

      </div>

      {/* FOOTER */}
      <div className={articleFooter}>

        Last updated:{" "}
        {formatDate(article.updatedAt)}

      </div>

    </div>
  );
}

export default ArticleByID;