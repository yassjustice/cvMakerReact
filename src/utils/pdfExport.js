import html2pdf from 'html2pdf.js';

export const exportToPDF = (theme) => {
  // Get the CV content element
  const element = document.getElementById('cv-content');
  
  // Clone it to avoid modifying the original
  const clone = element.cloneNode(true);
  clone.classList.add('pdf-export');
  
  // Configure the export options for ATS-friendly output
  const opt = {
    margin: [10, 10, 10, 10], // 10mm margins on all sides
    filename: `YASSIR_HAKIMI_CV_${theme}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      letterRendering: true 
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    },
    pagebreak: { mode: 'avoid-all' }
  };
  
  // Generate PDF
  html2pdf().set(opt).from(clone).save();
  
  // Clean up
  clone.remove();
};