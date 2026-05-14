import { useEffect, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import API_BASE_URL from "../config/apiConfig";

import {
  pageWrapper,
  loadingClass,
  errorClass,
} from "../styles/common";

function AdminHome() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuthors: 0,
    totalArticles: 0,
    activeArticles: 0,
  });

  const [users, setUsers] = useState([]);

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH ADMIN DATA
  // =====================================================

  useEffect(() => {

    const fetchAdminData = async () => {

      try {

        setLoading(true);

        // =========================================
        // FETCH STATS
        // =========================================

        const statsRes = await axios.get(
          `${API_BASE_URL}/admin-api/stats`,
          {
            withCredentials: true,
          }
        );

        setStats(statsRes.data.payload);

        // =========================================
        // FETCH USERS
        // =========================================

        const usersRes = await axios.get(
          `${API_BASE_URL}/admin-api/users`,
          {
            withCredentials: true,
          }
        );

        setUsers(usersRes.data.payload);

        // =========================================
        // FETCH ARTICLES
        // =========================================

        const articlesRes = await axios.get(
          `${API_BASE_URL}/admin-api/articles`,
          {
            withCredentials: true,
          }
        );

        setArticles(articlesRes.data.payload);

      } catch (err) {

        console.log(err);

        setError(
          err.response?.data?.message ||
          "Failed to load admin dashboard"
        );

      } finally {

        setLoading(false);
      }
    };

    fetchAdminData();

  }, []);

  // =====================================================
  // BLOCK / UNBLOCK USER
  // =====================================================

  const toggleUserStatus = async (userObj) => {

    try {

      const endpoint = userObj.isActive
        ? "block-user"
        : "unblock-user";

      const res = await axios.put(
        `${API_BASE_URL}/admin-api/${endpoint}`,
        {
          userId: userObj._id,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userObj._id
            ? {
                ...u,
                isActive: !u.isActive,
              }
            : u
        )
      );

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Operation failed"
      );
    }
  };

  // =====================================================
  // DELETE / RESTORE ARTICLE
  // =====================================================

  const toggleArticleStatus = async (articleObj) => {

    try {

      const updatedStatus =
        !articleObj.isArticleActive;

      const res = await axios.put(
        `${API_BASE_URL}/admin-api/article-status`,
        {
          articleId: articleObj._id,
          isArticleActive: updatedStatus,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      setArticles((prevArticles) =>
        prevArticles.map((a) =>
          a._id === articleObj._id
            ? {
                ...a,
                isArticleActive: updatedStatus,
              }
            : a
        )
      );

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Operation failed"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <p className={loadingClass}>
        Loading admin dashboard...
      </p>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <p className={errorClass}>
        {error}
      </p>
    );
  }

  return (

    <div>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">

        {/* USERS */}
        <div className="border border-[#ececec] rounded-3xl p-6 bg-white">

          <h2 className="text-3xl font-bold text-black">
            {stats.totalUsers}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Total Users
          </p>

        </div>

        {/* AUTHORS */}
        <div className="border border-[#ececec] rounded-3xl p-6 bg-white">

          <h2 className="text-3xl font-bold text-black">
            {stats.totalAuthors}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Total Authors
          </p>

        </div>

        {/* ARTICLES */}
        <div className="border border-[#ececec] rounded-3xl p-6 bg-white">

          <h2 className="text-3xl font-bold text-black">
            {stats.totalArticles}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Total Articles
          </p>

        </div>

        {/* ACTIVE ARTICLES */}
        <div className="border border-[#ececec] rounded-3xl p-6 bg-white">

          <h2 className="text-3xl font-bold text-black">
            {stats.activeArticles}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Active Articles
          </p>

        </div>

      </div>

      {/* ================================================= */}
      {/* USERS SECTION */}
      {/* ================================================= */}

      <div className="border border-[#ececec] rounded-3xl p-7 bg-white mb-10">

        <div className="mb-7">

          <h2 className="text-2xl font-bold text-black">
            Manage Users
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Block or unblock users and authors.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-[#ececec]">

                <th className="text-left py-4 text-sm font-semibold text-black">
                  Name
                </th>

                <th className="text-left py-4 text-sm font-semibold text-black">
                  Email
                </th>

                <th className="text-left py-4 text-sm font-semibold text-black">
                  Role
                </th>

                <th className="text-left py-4 text-sm font-semibold text-black">
                  Status
                </th>

                <th className="text-left py-4 text-sm font-semibold text-black">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((userObj) => (

                <tr
                  key={userObj._id}
                  className="border-b border-[#f5f5f5]"
                >

                  <td className="py-5 text-sm text-black">
                    {userObj.firstName}{" "}
                    {userObj.lastName}
                  </td>

                  <td className="py-5 text-sm text-gray-500">
                    {userObj.email}
                  </td>

                  <td className="py-5">

                    <span className="text-xs uppercase tracking-[0.15em] text-black">
                      {userObj.role}
                    </span>

                  </td>

                  <td className="py-5">

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        userObj.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {userObj.isActive
                        ? "Active"
                        : "Blocked"}
                    </span>

                  </td>

                  <td className="py-5">

                    {userObj.role !== "ADMIN" && (

                      <button
                        onClick={() =>
                          toggleUserStatus(userObj)
                        }
                        className={`px-4 py-2 rounded-full text-xs transition ${
                          userObj.isActive
                            ? "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            : "border border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                        }`}
                      >
                        {userObj.isActive
                          ? "Block"
                          : "Unblock"}
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================================= */}
      {/* ARTICLES SECTION */}
      {/* ================================================= */}

      <div className="border border-[#ececec] rounded-3xl p-7 bg-white">

        <div className="mb-7">

          <h2 className="text-2xl font-bold text-black">
            Manage Articles
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Delete or restore articles.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-[#ececec]">

                <th className="text-left py-4 text-sm font-semibold text-black">
                  Title
                </th>

                <th className="text-left py-4 text-sm font-semibold text-black">
                  Category
                </th>

                <th className="text-left py-4 text-sm font-semibold text-black">
                  Status
                </th>

                <th className="text-left py-4 text-sm font-semibold text-black">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {articles.map((articleObj) => (

                <tr
                  key={articleObj._id}
                  className="border-b border-[#f5f5f5]"
                >

                  <td className="py-5 text-sm text-black max-w-[320px]">
                    {articleObj.title}
                  </td>

                  <td className="py-5 text-sm text-gray-500 capitalize">
                    {articleObj.category}
                  </td>

                  <td className="py-5">

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        articleObj.isArticleActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {articleObj.isArticleActive
                        ? "Active"
                        : "Deleted"}
                    </span>

                  </td>

                  <td className="py-5">

                    <button
                      onClick={() =>
                        toggleArticleStatus(
                          articleObj
                        )
                      }
                      className={`px-4 py-2 rounded-full text-xs transition ${
                        articleObj.isArticleActive
                          ? "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          : "border border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                      }`}
                    >
                      {articleObj.isArticleActive
                        ? "Delete"
                        : "Restore"}
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminHome;