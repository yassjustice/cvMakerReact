import React from 'react';
import { exportToPDF } from '../utils/pdfExport';
import { exportToWord } from '../utils/wordExport';
import '../styles/Button.css';
import cvData from "../data/cvData";



const ExportButton = ({ format, theme }) => {
  const imagePath = "/assets/profile-pic.jpg"; // Note the leading slash
  const handleExport = () => {
    if (format === 'pdf') {
      exportToPDF(theme);
    } else if (format === 'docx') {
      exportToWord(cvData, theme, imagePath);
    }
  };

  return (
    <button 
      className={`export-button ${format} ${theme}`} 
      onClick={handleExport}
    >
      Export as {format.toUpperCase()}
    </button>
  );
};

export default ExportButton;