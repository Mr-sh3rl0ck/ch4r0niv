import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ 
  posts, 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  selectedTag, 
  setSelectedTag 
}) {
  // Build categories with counts
  const categories = {};
  posts.forEach(post => {
    const cat = post.frontmatter.category || 'Sin categoría';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  // Build unique tags and counts, filtering out absurdly long ones
  const tagCounts = {};
  posts.forEach(post => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach(t => {
        const tag = t.trim();
        if (tag.length < 35) { // Filter out sentences disguised as tags
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      });
    }
  });

  // Take top 20 most frequent tags
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(entry => entry[0]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleCategory = (cat, e) => {
    e.preventDefault();
    setSelectedCategory(selectedCategory === cat ? null : cat);
  };

  const toggleTag = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const clearFilters = (e) => {
    e.preventDefault();
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTag(null);
  };
  return (
    <aside className="blog-sidebar" id="blog-sidebar">
      {/* Search Widget */}
      <div className="sidebar-widget" id="widget-search">
        <form className="search-form" onSubmit={e => e.preventDefault()}>
          <input 
            type="text" 
            placeholder="Buscar..." 
            aria-label="Buscar posts" 
            value={searchQuery}
            onChange={handleSearch}
          />
          <button type="submit" aria-label="Enviar búsqueda">⌕</button>
        </form>
      </div>

      {/* Active Filters Clear Button */}
      {(selectedCategory || selectedTag || searchQuery) && (
        <div className="sidebar-widget" style={{ paddingBottom: '20px', borderBottom: 'none', marginBottom: '0' }}>
          <a 
            href="#" 
            onClick={clearFilters} 
            style={{ color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}
          >
            ✕ Limpiar Filtros
          </a>
        </div>
      )}

      {/* Categories Widget */}
      <div className="sidebar-widget" id="widget-categories">
        <h3 className="sidebar-widget-title">Categorías</h3>
        <ul className="category-list">
          {Object.entries(categories).map(([cat, count]) => (
            <li key={cat}>
              <a 
                href="#" 
                onClick={e => toggleCategory(cat, e)}
                style={selectedCategory === cat ? { color: 'var(--accent)', fontWeight: 'bold' } : {}}
              >
                {cat}
                <span className="count">({count})</span>
              </a>
            </li>
          ))}
        </ul>
      </div>


      {/* Tags Widget */}
      <div className="sidebar-widget" id="widget-tags">
        <h3 className="sidebar-widget-title">Tags</h3>
        <div className="tag-cloud">
          {topTags.map(tag => (
            <span 
              key={tag} 
              className={`tag ${selectedTag === tag ? 'active' : ''}`}
              style={selectedTag === tag ? { background: 'rgba(255, 78, 0, 0.1)', borderColor: 'var(--accent)', color: 'var(--text-primary)' } : {}}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
