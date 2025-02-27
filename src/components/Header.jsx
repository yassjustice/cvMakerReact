import React from 'react';
import '../styles/Header.css';
import profilePic from '../assets/profile-pic.jpg'; // You'll need to add your image to the assets folder

const Header = ({ personalInfo, theme }) => {
  const { name, title, contact } = personalInfo;
  
  return (
    <header className={`cv-header ${theme}`}>
      <div className="profile-container">
        <div className="profile-image-container">
          <img src={profilePic} alt={name} className="profile-image" />
        </div>
        <div className="profile-details">
          <h1 className="profile-name">{name}</h1>
          <h2 className="profile-title">{title}</h2>
        </div>
      </div>
      
      <div className="contact-container">
        <div className="contact-item">
          <i className="contact-icon phone-icon"></i>
          <span>{contact.phone}</span>
        </div>
        <div className="contact-item">
          <i className="contact-icon email-icon"></i>
          <span>{contact.email}</span>
        </div>
        <div className="contact-item">
          <i className="contact-icon location-icon"></i>
          <span>{contact.location}</span>
        </div>
        <div className="contact-item">
          <i className="contact-icon linkedin-icon"></i>
          <span>{contact.linkedin}</span>
        </div>
        <div className="contact-item">
          <i className="contact-icon github-icon"></i>
          <span>{contact.github}</span>
        </div>
        <div className="contact-item">
          <i className="contact-icon portfolio-icon"></i>
          <span>{contact.portfolio}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;