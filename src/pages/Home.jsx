import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { getAllPosts } from '../utils/markdown';


function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('showcase-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Featured projects (hardcoded — edita aquí para cambiar lo que se muestra en el Home)
  const featuredProjects = [
    {
      id: 1,
      title: 'SIEM/XDR HORUS',
      category: 'Desarrollo',
      description: 'Horus no es solo un recolector de logs; es una plataforma de Detección y Respuesta Extendida (XDR). Para nuestro MVP, acotamos estrictamente el alcance a las capacidades defensivas más críticas para aportar valor inmediato.',
      image: '/project-cyberdashboard.png',
      link: '/post/2026-04-29-construyendo-horus',
    },
    {
      id: 2,
      title: 'Cyber.xss',
      category: 'Ciberseguridad',
      description: 'Plataforma de inteligencia de amenazas cibernéticas diseñada para centralizar, analizar y visualizar datos de seguridad en tiempo real. Construida con Vite, React, Node.js y Express.',
      image: '/images/Login.png',
      link: '/portfolio#cyber-xss',
    },
    {
      id: 3,
      title: 'Hack The Box Labs',
      category: 'Proyectos Personales',
      description: 'Más de 80 máquinas resueltas en Hack The Box. Laboratorios de pentesting en Active Directory, explotación de servicios, escalamiento de privilegios y CTFs documentados con writeups técnicos.',
      image: '/project-scanner.png',
      link: '/portfolio#pentest-labs',
    },
  ];

  // Add latest blog post as 4th item
  const allPosts = getAllPosts().sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
  const latestPost = allPosts[0];
  if (latestPost) {
    featuredProjects.push({
      id: 4,
      title: latestPost.frontmatter.title || 'Sin título',
      category: 'Último Post',
      description: latestPost.frontmatter.excerpt || 'Sin descripción disponible.',
      image: latestPost.frontmatter.image || '/images/htb.png',
      link: `/post/${latestPost.slug}`,
    });
  }

  return (
    <div className="showcase-page">
      <div className="home-bg-grid"></div>

      {featuredProjects.map((project, index) => {
        const isEven = index % 2 === 0;
        return (
          <section
            key={project.id}
            className={`showcase-section ${isEven ? 'layout-left' : 'layout-right'}`}
            ref={(el) => (sectionsRef.current[index] = el)}
            id={`project-${project.id}`}
          >
            {/* Image Stack */}
            <div className="showcase-images">
              <div className="showcase-img-main">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="showcase-img-secondary">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="showcase-img-tertiary">
                <img src={project.image} alt={project.title} />
              </div>
            </div>

            {/* Text Content */}
            <div className="showcase-content">
              <span className="showcase-category">{project.category}</span>
              <h2 className="showcase-title">{project.title}</h2>
              <div className="showcase-divider"></div>
              <p className="showcase-description">{project.description}</p>
              <Link to={project.link} className="showcase-btn">
                {project.category === 'Último Post' ? 'Leer Más' : 'Ver Proyecto'}
              </Link>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default Home;
