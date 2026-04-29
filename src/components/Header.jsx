import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getPostBySlug } from '../utils/markdown';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const portfolioSections = [
    { label: 'Desarrollo', hash: 'development' },
    { label: 'Ciberseguridad', hash: 'cybersecurity' },
    { label: 'Proyectos Personales', hash: 'personal' },
  ];

  const handlePortfolioClick = (hash) => {
    navigate(`/portfolio?tab=${hash}`);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  let isPortfolioActive = location.pathname === '/portfolio';
  let isBlogActive = location.pathname === '/blog' || location.pathname.startsWith('/blog');

  // Dynamically determine if the current post is a portfolio project
  // We can check local storage or we can just read the markdown if we have to. 
  // For the header, an easier heuristic: if the user came from portfolio, or we parse the post category.
  // We don't want to load all posts in the header if we don't have to, but since we use Vite glob, it's fast.
  if (location.pathname.startsWith('/post/')) {
    const slug = location.pathname.replace('/post/', '');
    const post = getPostBySlug(slug);
    if (post) {
      const cat = (post.frontmatter.category || '').toLowerCase();
      if (['desarrollo', 'ciberseguridad', 'proyectos personales'].includes(cat)) {
        isPortfolioActive = true;
      } else {
        isBlogActive = true;
      }
    } else {
      isBlogActive = true;
    }
  }

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="header-logo">
          <Link to="/">CH4R0N IV</Link>
        </div>

        <div className="header-nav">
          <div className="nav-desktop">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Inicio</Link>

            {/* Portfolio Dropdown */}
            <div
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                to="/portfolio"
                className={`nav-dropdown-trigger ${isPortfolioActive ? 'active' : ''}`}
              >
                Portafolio
              </Link>
              <div className={`nav-dropdown ${dropdownOpen ? 'open' : ''}`}>
                <div className="nav-dropdown-inner">
                  {portfolioSections.map((sec) => (
                    <button
                      key={sec.hash}
                      className="nav-dropdown-item"
                      onClick={() => handlePortfolioClick(sec.hash)}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/blog" className={isBlogActive ? 'active' : ''}>Blog</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>Sobre Mí</Link>
          </div>

          <div
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            role="button"
            tabIndex={0}
            aria-label="Toggle menu"
            id="menu-toggle-btn"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`side-menu-overlay ${menuOpen ? 'visible' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Side Menu */}
      <nav className={`side-menu ${menuOpen ? 'open' : ''}`} id="side-menu">
        <div className="side-menu-header">
          <h2>CH4R0N IV</h2>
          <div className="accent-line"></div>
        </div>

        <div className="side-menu-nav">
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>

          {/* Portfolio accordion in side menu */}
          <div className="side-menu-accordion">
            <button
              className="side-menu-accordion-trigger"
              onClick={() => setMobilePortfolioOpen(!mobilePortfolioOpen)}
            >
              Portafolio
              <span className={`accordion-arrow ${mobilePortfolioOpen ? 'open' : ''}`}>›</span>
            </button>
            <div className={`side-menu-accordion-content ${mobilePortfolioOpen ? 'open' : ''}`}>
              {portfolioSections.map((sec) => (
                <button
                  key={sec.hash}
                  className="side-menu-sub-link"
                  onClick={() => handlePortfolioClick(sec.hash)}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          <Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>Sobre Mí</Link>
          <a href="https://github.com/ch4r0niv" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://app.hackthebox.com" target="_blank" rel="noopener noreferrer">HackTheBox</a>
        </div>

        <div className="side-menu-footer">
          <p>&copy; {new Date().getFullYear()} AXL CASTILLO</p>
          <p>Security Research & Development</p>
          <div className="side-menu-socials">
            <a href="https://github.com/ch4r0niv" target="_blank" rel="noopener noreferrer">GH</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LI</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TW</a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
