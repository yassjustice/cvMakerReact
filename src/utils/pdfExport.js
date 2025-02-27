import html2pdf from 'html2pdf.js';

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
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: optimizeLegibility !important;
    }
    
    .pdf-export img {
      image-rendering: high-quality !important;
    }
  `;
  clone.appendChild(styleElement);
  
  // Configure the export options for high-quality output
  const opt = {
    margin: [10, 10, 10, 10], // 10mm margins on all sides
    filename: `YASSIR_HAKIMI_CV_${theme}.pdf`,
    image: { 
      type: 'png', // PNG provides better quality than JPEG for text/graphics
      quality: 1.0  // Maximum quality
    },
    html2canvas: { 
      scale: 4,       // Higher scale for sharper rendering (increased from 2)
      useCORS: true,
      logging: false, // Disable logging for better performance
      letterRendering: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      imageTimeout: 15000, // Longer timeout for image processing
      dpi: 300,      // Higher DPI
      windowWidth: document.documentElement.offsetWidth
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: false, // Avoid compression artifacts
      precision: 16,   // Higher precision
      putOnlyUsedFonts: true,
      floatPrecision: 16
    },
    fontFaces: [{  // Embed fonts properly
      family: 'Roboto',
      weight: 'normal'
    }, {
      family: 'Roboto',
      weight: 'bold'
    }],
    pagebreak: { mode: 'avoid-all' }
  };
  
  // Add temporary container to body (for better rendering)
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.appendChild(clone);
  document.body.appendChild(container);
  
  // Generate PDF with progress callback
  return new Promise((resolve, reject) => {
    html2pdf()
      .set(opt)
      .from(clone)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        // Enhance PDF metadata for ATS systems
        pdf.setProperties({
          title: `CV - YASSIR HAKIMI - ${theme}`,
          subject: 'Professional Resume',
          author: 'YASSIR HAKIMI',
          keywords: 'CV, resume, professional',
          creator: 'CV Generator'
        });
      })
      .save()
      .then(() => {
        // Clean up
        container.remove();
        resolve({
          success: true,
          message: `CV successfully exported to PDF with ${theme} theme.`
        });
      })
      .catch((error) => {
        container.remove();
        reject({
          success: false,
          message: `Failed to export PDF: ${error.message}`
        });
      });
  });
};

// Optional: Add this function to preload images before PDF generation
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
// 
// export const exportToPDFWithPreload = async (theme) => {
//   await preloadImagesForPDF();
//   return exportToPDF(theme);
// };