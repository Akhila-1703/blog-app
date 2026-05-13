import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config/apiConfig";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  commentForm,
  commentInput,
  commentAuthor,
  commentHeader,
  commentList,
  commentItem,
  commentSubmitBtn,
  commentSection,
  commentText,
} from "../styles/common.js";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || { comments: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (article && article._id) return; // already loaded from location.state

    const getArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/user-api/article/${id}`, {
          withCredentials: true,
        });

        // populate comments array safely
        setArticle({
          ...res.data.payload,
          comments: res.data.payload.comments || [],
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch article");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

  // AUTHOR actions
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;
    if (!window.confirm(newStatus ? "Restore this article?" : "Delete this article?")) return;

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true }
      );

      setArticle(res.data.payload);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const editArticle = (articleObj) => {
    navigate("/edit-article", { state: articleObj });
  };

  // USER: add comment
  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.put(
        `${API_BASE_URL}/user-api/articles`,
        { articleId: article._id, comment: newComment, user: user.userId },
        { withCredentials: true }
      );

      setArticle((prev) => ({
        ...prev,
        comments: res.data.payload.comments || [],
      }));

      setNewComment("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>
        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>
        <div className={articleAuthorRow}>
          <div className={authorInfo}>✍️ {article.author?.firstName || "Author"}</div>
          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>
          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}

      {/* COMMENTS */}
      <div className={commentSection}>
        <h3 className={commentHeader}>Comments ({article.comments?.length || 0})</h3>
        <div className={commentList}>
          {article.comments?.map((c) => (
            <div key={c._id} className={commentItem}>
              <span className={commentAuthor}>{c.user?.firstName || "User"}:</span>
              <span className={commentText}>{c.comment}</span>
            </div>
          ))}
        </div>

        {/* USER add comment */}
        {user?.role === "USER" && (
          <form className={commentForm} onSubmit={submitComment}>
            <input
              type="text"
              placeholder="Write a comment..."
              className={commentInput}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className={commentSubmitBtn}>
              Submit
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
    </div>
  );
}

export default ArticleByID;

// {
//   "user":"6989799b7013502767d3f82b",
//   "articleId":"6989750220ce5bf826ec4f7e",
//   "comment":"good article"

// }