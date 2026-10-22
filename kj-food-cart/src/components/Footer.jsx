import React from 'react';
import { SOCIALS } from '../data/constants';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p>© Kenneth Jay's Fun Food Carts · Roxas Night Market, Davao City</p>
        <div className="social-links">
          {SOCIALS.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}>
              <i className={s.icon}></i>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}