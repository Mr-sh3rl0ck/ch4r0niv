import React from 'react';

function Footer() {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-left">
        <p>&copy; {new Date().getFullYear()} CH4R0N IV — Security Research</p>
      </div>
      <div className="footer-right">
        <a href="https://github.com/axlcs" target="_blank" rel="noopener noreferrer">Github</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://app.hackthebox.com" target="_blank" rel="noopener noreferrer">HTB</a>
      </div>
    </footer>
  );
}

export default Footer;
