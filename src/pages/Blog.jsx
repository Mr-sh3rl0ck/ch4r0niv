import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../utils/markdown';
import Sidebar from '../components/Sidebar';

function Blog() {
  const [allPosts, setAllPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const postsPerPage = 4; // Cambia este valor para ajustar cuántos posts por página

  useEffect(() => {
    const portfolioCategories = ['desarrollo', 'ciberseguridad', 'proyectos personales'];
    const fetchedPosts = getAllPosts().filter(
      post => !portfolioCategories.includes((post.frontmatter.category || '').toLowerCase())
    );
    setAllPosts(fetchedPosts);
    setPosts(fetchedPosts);
  }, []);

  useEffect(() => {
    let filtered = allPosts;
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.frontmatter.category === selectedCategory);
    }
    
    if (selectedTag) {
      filtered = filtered.filter(p => p.frontmatter.tags && p.frontmatter.tags.includes(selectedTag));
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const title = (p.frontmatter.title || '').toLowerCase();
        const excerpt = (p.frontmatter.excerpt || '').toLowerCase();
        return title.includes(q) || excerpt.includes(q);
      });
    }
    
    setPosts(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [allPosts, selectedCategory, selectedTag, searchQuery]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Page Title Banner */}
      <div className="page-banner">
        <h1>Blog</h1>
      </div>

      {/* Blog Layout: Main + Sidebar */}
      <div className="blog-layout">
        <div className="blog-main" id="blog-main">
          {currentPosts.map(post => (
            <article key={post.slug} className="post-card" id={`post-${post.slug}`}>
              {/* Post Image */}
              {post.frontmatter.image && (
                <Link to={`/post/${post.slug}`} className="post-card-image">
                  <img src={post.frontmatter.image} alt={post.frontmatter.title} />
                </Link>
              )}

              {/* Post Body */}
              <div className="post-card-body">
                <h2 className="post-card-title">
                  <Link to={`/post/${post.slug}`}>{post.frontmatter.title}</Link>
                </h2>
                <p className="post-card-excerpt">{post.frontmatter.excerpt}</p>

                {/* Meta Row */}
                <div className="post-card-meta">
                  <div className="post-card-info">
                    <span>{post.frontmatter.date}</span>
                    <span className="separator">·</span>
                    <span className="category">{post.frontmatter.category || 'General'}</span>
                  </div>
                  <Link to={`/post/${post.slug}`} className="read-more-btn">Leer Más</Link>
                </div>
              </div>
            </article>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="page-btn"
              >
                &laquo; Anterior
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Siguiente &raquo;
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <Sidebar 
          posts={allPosts} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
      </div>
    </>
  );
}

export default Blog;
