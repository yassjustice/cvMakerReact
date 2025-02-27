import jsPDF from 'jspdf';

export const exportToPDF = (theme) => {
  // Get the CV content element
  const element = document.getElementById('cv-content');
  
  // Clone it to avoid modifying the original
  const clone = element.cloneNode(true);
  clone.classList.add('pdf-export');
  
  // Apply font smoothing to improve text rendering
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    .pdf-export * {
      font-family: 'Roboto', sans-serif;
      font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    
    .pdf-export img {
      image-rendering: high-quality !important;
    }
  `;
  clone.appendChild(styleElement);

  // Create a new jsPDF instance
  const pdf = new jsPDF('portrait', 'mm', 'a4');

  // Manually add text content from the clone to the PDF
  // Iterate through the clone to get text and render it into the PDF
  const contentText = clone.innerText;

  // Add the main text content
  pdf.setFont('Roboto');
  pdf.setFontSize(12);
  pdf.text(contentText, 10, 20);

  // Optional: Add images manually if required (for example, logos or images in the CV)
  const images = clone.querySelectorAll('img');
  images.forEach((img, index) => {
    const imgData = img.src;
    const x = 10;
    const y = 30 + index * 50; // Space images vertically
    pdf.addImage(imgData, 'PNG', x, y, 50, 50); // Adjust image size if needed
  });

  // Enhance PDF metadata for ATS systems
  pdf.setProperties({
    title: `CV - YASSIR HAKIMI - ${theme}`,
    subject: 'Professional Resume',
    author: 'YASSIR HAKIMI',
    keywords: 'CV, resume, professional',
    creator: 'CV Generator'
  });

  // Save the PDF with the provided theme
  pdf.save(`YASSIR_HAKIMI_CV_${theme}.pdf`);

  // Clean up
  return Promise.resolve({
    success: true,
    message: `CV successfully exported to PDF with ${theme} theme.`
  });
};

// Optional: Preload images before PDF generation to ensure high-quality rendering
export const preloadImagesForPDF = () => {
  return new Promise((resolve) => {
    const images = document.querySelectorAll('#cv-content img');
    let loaded = 0;
    
    if (images.length === 0) {
      resolve();
      return;
    }
    
    images.forEach(img => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) resolve();
      } else {
        img.onload = () => {
          loaded++;
          if (loaded === images.length) resolve();
        };
        img.onerror = () => {
          loaded++;
          if (loaded === images.length) resolve();
        };
      }
    });
  });
};

// Usage example with image preloading:
// export const exportToPDFWithPreload = async (theme) => {
//   await preloadImagesForPDF();
//   return exportToPDF(theme);
// };
