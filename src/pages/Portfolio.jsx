import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

import { portfolioData } from '../data/projects';

const categories = [
  { key: 'development', label: 'Desarrollo' },
  { key: 'cybersecurity', label: 'Ciberseguridad' },
  { key: 'personal', label: 'Personales' },
];

function Portfolio() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('development');
  const [selectedProject, setSelectedProject] = useState(null);
  const cardsRef = useRef([]);

  // Check URL hash for deep linking (e.g. /portfolio#netrecon)
  // Also check query param ?tab=cybersecurity from dropdown
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');

    if (hash) {
      for (const [cat, projects] of Object.entries(portfolioData)) {
        const found = projects.find((p) => p.id === hash);
        if (found) {
          setActiveTab(cat);
          setSelectedProject(found);
          break;
        }
      }
    } else if (tabParam && portfolioData[tabParam]) {
      setActiveTab(tabParam);
      setSelectedProject(null);
    }

    window.scrollTo(0, 0);
  }, [location]);

  // Animate cards on tab change or when returning from detail view
  useEffect(() => {
    if (selectedProject) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('portfolio-card-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Reset array to only contain current elements to avoid memory leaks
    const currentCards = cardsRef.current.filter(Boolean);

    currentCards.forEach((el) => {
      el.classList.remove('portfolio-card-visible');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTab, selectedProject]);

  const currentProjects = portfolioData[activeTab] || [];

  // Project Detail View
  if (selectedProject) {
    return (
      <div className="portfolio-page">
        <div className="page-banner">
          <h1>Portafolio</h1>
        </div>

        <div className="portfolio-detail">
          <button className="portfolio-back" onClick={() => setSelectedProject(null)}>
            ← Volver a Portafolio
          </button>

          <div className="portfolio-detail-hero">
            <img src={selectedProject.image} alt={selectedProject.title} />
          </div>

          <div className="portfolio-detail-content">
            <span className="portfolio-detail-subtitle">{selectedProject.subtitle}</span>
            <h2>{selectedProject.title}</h2>
            <div className="showcase-divider" style={{ width: '50px', opacity: 1 }}></div>
            <p>{selectedProject.description}</p>

            <div className="portfolio-detail-tags">
              {selectedProject.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            {selectedProject.link && (
              <div style={{ marginTop: '30px' }}>
                <RouterLink to={selectedProject.link} className="showcase-btn">
                  Leer Artículo Completo
                </RouterLink>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Portfolio List View
  return (
    <div className="portfolio-page">
      <div className="page-banner">
        <h1>Portafolio</h1>
      </div>

      {/* Category Tabs */}
      <div className="portfolio-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`portfolio-tab ${activeTab === cat.key ? 'active' : ''}`}
            onClick={() => setActiveTab(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="portfolio-grid">
        {currentProjects.map((project, i) => (
          <div
            key={project.id}
            className="portfolio-card"
            ref={(el) => (cardsRef.current[i] = el)}
            onClick={() => setSelectedProject(project)}
            style={{ cursor: 'pointer' }}
          >
            <div className="portfolio-card-image">
              <img src={project.image} alt={project.title} />
              <div className="portfolio-card-overlay">
                <span>Ver Detalles</span>
              </div>
            </div>
            <div className="portfolio-card-body">
              <span className="portfolio-card-subtitle">{project.subtitle}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Portfolio;
