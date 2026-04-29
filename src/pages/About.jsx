import React, { useEffect, useRef } from 'react';

const stats = [
  { number: '20+', label: 'Proyectos' },
  { number: '+100', label: 'CTFs Resueltos' },
  { number: 'X', label: 'Certificaciones' },
  { number: 'X', label: 'Años de Exp' },
];

const skills = [
  {
    icon: '',
    title: 'Desarrollo Web',
    description: 'Aplicaciones Full-stack con React, Node.js y frameworks modernos. Enfoque en rendimiento y arquitectura limpia.',
  },
  {
    icon: '',
    title: 'Seguridad Ofensiva',
    description: 'Pruebas de penetración, evaluación de vulnerabilidades y explotación. Jugador activo en HackTheBox y TryHackMe.',
  },
  {
    icon: '',
    title: 'Investigación de Seguridad',
    description: 'Investigación profunda en CVEs, SSTI, XSS, SQLi y explotación de binarios. Publicando hallazgos y writeups.',
  },
];

function About() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('about-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* Hero Banner with Background Image */}
      <div className="about-hero" id="about-hero">
        <img src="/about-hero.png" alt="Fondo de la sección Sobre mí" className="about-hero-bg" />
        <div className="about-hero-overlay"></div>
        <h1 className="about-hero-title">Sobre Mí</h1>
      </div>

      {/* Intro Section */}
      <section
        className="about-intro"
        ref={(el) => (sectionsRef.current[0] = el)}
      >
        <div className="about-intro-inner">
          <div className="about-intro-left">
            <h2>Investigador de Seguridad &<br />Desarrollador</h2>
          </div>
          <div className="about-intro-right">
            <p>
              Soy un desarrollador y entusiasta de la ciberseguridad apasionado por romper y construir sistemas digitales. 
              Mi trabajo abarca desde la creación de aplicaciones web modernas hasta la búsqueda de vulnerabilidades.
            </p>
            <p>
              Creo que entender cómo se rompen las cosas es la clave para construirlas mejor.
            </p>
            <a href="mailto:axlc4st@proton.me" className="about-cta-btn">Trabaja Conmigo</a>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section
        className="about-stats"
        ref={(el) => (sectionsRef.current[1] = el)}
      >
        <div className="about-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Skills / Services Section */}
      <section
        className="about-skills"
        ref={(el) => (sectionsRef.current[2] = el)}
      >
        <div className="about-skills-grid">
          {skills.map((skill, i) => (
            <div key={i} className="skill-card">
              <div className="skill-icon">{skill.icon}</div>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="about-cta"
        ref={(el) => (sectionsRef.current[3] = el)}
      >
        <div className="about-cta-inner">
          <h2>¿Interesado en trabajar juntos?</h2>
          <a href="mailto:axlc4st@proton.me" className="about-cta-btn">Ponerse en Contacto</a>
        </div>
      </section>
    </div>
  );
}

export default About;
