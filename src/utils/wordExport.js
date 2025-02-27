import { Packer } from "docx";
import { saveAs } from "file-saver";
import {
    createDocument,
    createHeader,
    createSummary,
    createSkills,
    createExperience,
    createEducation,
    createCertifications,
    createAdditionalExperience,
    createLanguages,
    createInterests,
} from "./docxGenerators";
import fs from "fs";
import path from "path";

// Helper function to convert the image to base64 if needed

export const exportToWord = async (cvData, theme, imagePath) => {
    try {
        // Create the Word document based on CV data
        const doc = await createDocument(cvData, theme, imagePath);

        // Generate the Word document
        const blob = await Packer.toBlob(doc);

        // Save the file
        saveAs(blob, `YASSIR_HAKIMI_CV_${theme}.docx`);

        return {
            success: true,
            message: `CV successfully exported with ${theme} theme.`,
        };
    } catch (error) {
        console.error("Error exporting to Word:", error);

        return {
            success: false,
            message: `Failed to export CV: ${error.message}`,
        };
    }
};

// Additional utility functions

/**
 * Gets available themes for CV export
 * @returns {Array} List of available themes
 */
export const getAvailableThemes = () => {
    return ["minimal", "professional", "modern"];
};

/**
 * Validates if the provided theme is available
 * @param {string} theme - The theme to validate
 * @returns {boolean} Whether the theme is valid
 */
export const isValidTheme = (theme) => {
    return getAvailableThemes().includes(theme);
};

/**
 * Export CV with default theme if none specified
 * @returns {Promise} Result of export operation
 */
export const exportWithDefaultTheme = async () => {
    return exportToWord("professional");
};
