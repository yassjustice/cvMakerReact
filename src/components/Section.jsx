import React from 'react';
import '../styles/Section.css';

const Section = ({ title, content, theme }) => {
  return (
    <section className={`cv-section ${theme}`}>
      <h2 className="section-title">{title}</h2>
      <div className="section-content">
        {content}
      </div>
    </section>
  );
};

export default Section;