import { Packer } from 'docx';
import { saveAs } from 'file-saver';
// import { 
//   createDocument, 
//   createHeader, 
//   createSummary, 
//   createSkills, 
//   createExperience, 
//   createEducation, 
//   createCertifications, 
//   createAdditionalExperience, 
//   createLanguages, 
//   createInterests 
// } from './docxGenerators';
import cvData from '../data/cvData';

export const exportToWord = async (theme) => {
  // Create the Word document based on CV data
  const doc = createDocument(cvData, theme);
  
  // Generate the Word document
  const blob = await Packer.toBlob(doc);
  
  // Save the file
  saveAs(blob, `YASSIR_HAKIMI_CV_${theme}.docx`);
};

// Note: This is a simplified approach. For a complete implementation,
// you would need to implement all the imported functions (createHeader, createSummary, etc.)
// to properly format your Word document sections.