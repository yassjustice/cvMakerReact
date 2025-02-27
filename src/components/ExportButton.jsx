import React from 'react';
import { exportToPDF } from '../utils/pdfExport';
import { exportToWord } from '../utils/wordExport';
import '../styles/Button.css';

const ExportButton = ({ format, theme }) => {
  const handleExport = () => {
    if (format === 'pdf') {
      exportToPDF(theme);
    } else if (format === 'docx') {
      exportToWord(theme);
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