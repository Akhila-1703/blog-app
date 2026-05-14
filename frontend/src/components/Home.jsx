import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

import {
  heroWrapper,
  heroTitle,
  heroSubtitle,
  secondaryBtn,
  pageWrapper,
  sectionSpacing,
  articleGrid,
  articleCardClass,
  articleCategory,
  articleTitle,
  articleExcerpt,
  articleMeta,
} from "../styles/common";

function Home() {

  const navigate = useNavigate();

  const isAuthenticated = useAuth(
    (state) => state.isAuthenticated
  );

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const categories = [
    "Technology",
    "Programming",
    "AI",
    "Web Development"
  ];

  const demoArticles = [
    {
      id: 1,
      category: "Technology",
      title: "The Future of Modern Blogging Platforms",
      excerpt:
        "Explore how modern publishing platforms are changing the way creators write and share content online.",
      author: "Akhila",
    },
    {
      id: 2,
      category: "Programming",
      title: "Why Developers Love Minimal UI Design",
      excerpt:
        "Minimal interfaces improve readability, focus and overall user experience in content-driven applications.",
      author: "John",
    },
    {
      id: 3,
      category: "AI",
      title: "Artificial Intelligence in Content Creation",
      excerpt:
        "AI tools are transforming blogging, writing workflows and digital publishing ecosystems rapidly.",
      author: "David",
    },
  ];

  const handleViewArticles = () => {

    // not logged in
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // USER
    if (currentUser?.role === "USER") {
      navigate("/user-profile");
      return;
    }

    // AUTHOR
    if (currentUser?.role === "AUTHOR") {
      navigate("/author-profile/articles");
      return;
    }
  };

  return (
    <div>

      {/* HERO SECTION */}
      <section className={heroWrapper}>

        <h1 className={heroTitle}>
          Discover Modern Stories & Ideas
        </h1>

        <p className={heroSubtitle}>
          Read premium articles on technology, programming,
          artificial intelligence and modern web development.
          Discover ideas from creators around the world.
        </p>

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">

          {categories.map((category, index) => (

            <button
              key={index}
              className={secondaryBtn}
            >
              {category}
            </button>

          ))}

        </div>

      </section>

      {/* STATS */}
      <section className={`${pageWrapper} pb-8`}>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          <div>

            <h2 className="text-4xl font-bold text-black">
              100+
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              Articles
            </p>

          </div>

          <div>

            <h2 className="text-4xl font-bold text-black">
              50+
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              Writers
            </p>

          </div>

          <div>

            <h2 className="text-4xl font-bold text-black">
              10K+
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              Readers
            </p>

          </div>

          <div>

            <h2 className="text-4xl font-bold text-black">
              4
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              Categories
            </p>

          </div>

        </div>

      </section>

      {/* ARTICLES SECTION */}
      <section className={`${pageWrapper} ${sectionSpacing}`}>

        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">

          <div>

            <p className="uppercase tracking-[0.25em] text-xs text-gray-400 mb-4">
              Latest Articles
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-black">
              Trending Stories
            </h2>

          </div>

          <button
            onClick={handleViewArticles}
            className="text-sm text-black hover:underline"
          >
            View All Articles
          </button>

        </div>

        <div className={articleGrid}>

          {demoArticles.map((article) => (

            <div
              key={article.id}
              className={articleCardClass}
            >

              <p className={articleCategory}>
                {article.category}
              </p>

              <h3 className={articleTitle}>
                {article.title}
              </h3>

              <p className={articleExcerpt}>
                {article.excerpt}
              </p>

              <p className={articleMeta}>
                By {article.author}
              </p>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Home;