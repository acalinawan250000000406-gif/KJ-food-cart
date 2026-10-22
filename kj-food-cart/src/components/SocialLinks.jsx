import React from 'react';
import { SOCIALS } from '../data/constants';

export default function SocialLinks() {
  return (
    <section className="socials-container">
      <h3 className="socials-heading">Follow the fun</h3>
      <div className="socials-pill-stack">
        {SOCIALS.map((s, idx) => (
          <a
            key={idx}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-pill-item"
            style={{ '--pill-bg': s.color }}
          >
            <span className="pill-icon-wrap">
              <i className={s.icon}></i>
            </span>
            <div className="pill-text-wrap">
              <span className="pill-platform">{s.platform}</span>
              <span className="pill-handle">{s.name}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}