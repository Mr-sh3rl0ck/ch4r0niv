import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../components/OptimizedImage';
import { getAllPosts } from '../utils/markdown';


function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Featured projects
  const featuredProjects = [
    {
      id: 1,
      title: 'SIEM/XDR HORUS',
      category: 'Desarrollo',
      description: 'Plataforma de detección y respuesta extendida (XDR). Enfoque en capacidades defensivas críticas.',
      image: '/project-cyberdashboard.png',
      link: '/post/2026-04-29-construyendo-horus',
    },
    {
      id: 2,
      title: 'Cyber.xss',
      category: 'Ciberseguridad',
      description: 'Inteligencia de amenazas diseñada para centralizar y visualizar datos de seguridad en tiempo real.',
      image: '/images/cyberxss_.png',
      link: '/portfolio#cyber-xss',
    },
    {
      id: 3,
      title: 'NetRecon Scanner',
      category: 'Herramientas',
      description: 'Escáner de reconocimiento de red y detección de vulnerabilidades con reportes exportables.',
      image: '/project-scanner.png',
      link: '/portfolio#netrecon',
    },
  ];

  const allPosts = getAllPosts().sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
  const latestPosts = allPosts.slice(0, 3);

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-grid"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="glitch" data-text="AXL">AXL</span>
          </h1>
          <p className="hero-subtitle">
            Security Researcher <span className="accent-slash">//</span> Full-Stack Developer
          </p>
          <div className="hero-description">
            Aquí solo subo mis proyectos y writeups de ctfs, investigaciones y herramientas de ciberseguridad. 
          </div>
          <div className="hero-actions">
            <Link to="/portfolio" className="btn-primary">Explorar Portafolio</Link>
            <Link to="/blog" className="btn-secondary">Blog</Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="featured-projects" ref={(el) => (sectionsRef.current[0] = el)}>
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-number">01</span>
            <h2 className="section-title">Proyectos Destacados</h2>
          </div>
          <Link to="/portfolio" className="section-link">Ver todo el portafolio →</Link>
        </div>
        
        <div className="projects-grid">
          {featuredProjects.map((project) => (
            <div key={project.id} className="project-card-mini">
              <div className="card-image-wrap">
                <OptimizedImage src={project.image} alt={project.title} />
                <div className="card-overlay">
                  <Link to={project.link} className="overlay-btn">Ver Detalles</Link>
                </div>
              </div>
              <div className="card-content">
                <span className="card-category">{project.category}</span>
                <h3 className="card-title">{project.title}</h3>
                <p className="card-text">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST POSTS */}
      <section className="latest-posts" ref={(el) => (sectionsRef.current[1] = el)}>
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-number">02</span>
            <h2 className="section-title">Últimas Publicaciones</h2>
          </div>
          <Link to="/blog" className="section-link">Ir al blog →</Link>
        </div>

        <div className="posts-list">
          {latestPosts.map((post) => (
            <Link to={`/post/${post.slug}`} key={post.slug} className="post-item-row">
              <div className="post-item-meta">
                <span className="post-item-date">{post.frontmatter.date}</span>
                <span className="post-item-cat">{post.frontmatter.category}</span>
              </div>
              <div className="post-item-main">
                <h3 className="post-item-title">{post.frontmatter.title}</h3>
                <p className="post-item-excerpt">{post.frontmatter.excerpt}</p>
              </div>
              <div className="post-item-arrow">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-about-cta" ref={(el) => (sectionsRef.current[2] = el)}>
        <div className="cta-content">
          <h2>¿Tienes un desafío de seguridad o desarrollo?</h2>
          <p>Estoy disponible para colaboraciones en proyectos de ciberseguridad, desarrollo full-stack y auditorías técnicas.</p>
          <Link to="/about" className="btn-primary">Saber más sobre mí</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
