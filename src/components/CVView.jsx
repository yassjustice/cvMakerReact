import React from 'react';
import Header from './Header';
import Section from './Section';
import '../styles/CVView.css';

const CVView = ({ data, theme }) => {
  return (
    <div className={`cv-view ${theme}`} id="cv-content">
      <Header 
        personalInfo={data.personalInfo} 
        theme={theme}
      />
      
      <div className="cv-body">
        <Section 
          title="Summary" 
          theme={theme}
          content={<p className="summary-text">{data.summary}</p>}
        />
        
        <Section 
          title="Skills" 
          theme={theme}
          content={
            <div className="skills-container">
              {Object.entries(data.skills).map(([category, skillList]) => (
                <div key={category} className="skill-category">
                  <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                  <div className="skill-list">
                    {skillList.map(skill => (
                      <span key={skill} className="skill-item">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          }
        />
        
        {/* Added spacing div between Skills and Experience */}
        <div className="section-spacer"></div>
        
        {/* Experience section with page-break-inside: avoid */}
        <div className="experience-section-wrapper">
          <Section 
            title="Experience" 
            theme={theme}
            content={
              <div className="experience-list">
                {data.experience.map((job, index) => (
                  <div key={index} className="experience-item">
                    <div className="experience-header">
                      <h3>{job.title}</h3>
                      <span className="company">{job.company}</span>
                      <span className="period">{job.period}</span>
                    </div>
                    <ul className="responsibilities">
                      {job.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            }
          />
        </div>
        
        <Section 
          title="Education" 
          theme={theme}
          content={
            <div className="education-list">
              {data.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <h3>{edu.degree}</h3>
                  <div className="education-details">
                    <span className="institution">{edu.institution}</span>
                    <span className="period">{edu.period}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        />
        
        <Section 
          title="Certifications" 
          theme={theme}
          content={
            <ul className="certifications-list">
              {data.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          }
        />
        
        <Section 
          title="Additional Experience" 
          theme={theme}
          content={
            <div className="additional-experience">
              {data.additionalExperience.map((exp, index) => (
                <div key={index} className="additional-exp-item">
                  <div className="additional-exp-header">
                    <h3>{exp.organization}</h3>
                    <span className="period">{exp.period}</span>
                  </div>
                  <p>{exp.details}</p>
                </div>
              ))}
            </div>
          }
        />
        
        <Section 
          title="Languages" 
          theme={theme}
          content={
            <div className="languages-list">
              {data.languages.map((lang, index) => (
                <div key={index} className="language-item">
                  <span className="language-name">{lang.language}</span>
                  <span className="language-level">{lang.level}</span>
                </div>
              ))}
            </div>
          }
        />
        
        <Section 
          title="Interests" 
          theme={theme}
          content={
            <div className="interests-list">
              {data.interests.map((interest, index) => (
                <span key={index} className="interest-item">{interest}</span>
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CVView;