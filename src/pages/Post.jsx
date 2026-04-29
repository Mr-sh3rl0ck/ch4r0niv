import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/markdown';
import rehypeSlug from 'rehype-slug';

const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchedPost = getPostBySlug(slug);
    setPost(fetchedPost);
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="post-single" style={{ marginTop: 'var(--header-height)', textAlign: 'center', padding: '120px 50px' }}>
        <h2>Post No Encontrado</h2>
        <p style={{ marginTop: '15px' }}>El post que buscas no pudo ser localizado.</p>
        <Link to="/blog" className="back-link" style={{ marginTop: '25px' }}>← Volver al Blog</Link>
      </div>
    );
  }

  const handleScrollToHeading = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Update URL hash without causing a page jump
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const isPortfolio = ['desarrollo', 'ciberseguridad', 'proyectos personales'].includes(
    (post.frontmatter.category || '').toLowerCase()
  );

  const headings = [];
  if (post && post.content) {
    // Note: capturing only ## and ### (level 2 and 3) usually makes for a cleaner TOC
    const regex = /^(#{2,3})\s+(.+)$/gm;
    let match;
    while ((match = regex.exec(post.content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text);
      headings.push({ level, text, id });
    }
  }

  return (
    <div className="blog-layout" style={{ marginTop: 'var(--header-height)' }}>
      <div className="post-single" style={{ flex: 1, margin: 0, padding: 0, maxWidth: '100%' }}>
        <Link to={isPortfolio ? "/portfolio" : "/blog"} className="back-link">
          ← Volver al {isPortfolio ? "Portafolio" : "Blog"}
        </Link>

        <div className="post-single-header">
          <h1>{post.frontmatter.title}</h1>

          <div className="post-single-meta">
            <span>{post.frontmatter.date}</span>
            <span>·</span>
            <span className="category">{post.frontmatter.category || 'General'}</span>
          </div>

          {post.frontmatter.tags && (
            <div className="post-single-tags">
              {post.frontmatter.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="markdown-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeSlug]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>

      {headings.length > 0 && (
        <aside className="blog-sidebar">
          <div className="sidebar-widget toc-widget" style={{ position: 'sticky', top: 'calc(var(--header-height) + 40px)', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <h3 className="sidebar-widget-title">Tabla de Contenidos</h3>
            <ul className="toc-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
              {headings.map((heading, index) => (
                <li 
                  key={`${heading.id}-${index}`} 
                  style={{ 
                    marginLeft: heading.level === 3 ? '15px' : '0',
                    marginBottom: '10px',
                    fontSize: '0.85rem'
                  }}
                >
                  <a 
                    href={`#${heading.id}`}
                    onClick={(e) => handleScrollToHeading(e, heading.id)}
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseOver={e => e.target.style.color = 'var(--accent)'}
                    onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}

export default Post;
