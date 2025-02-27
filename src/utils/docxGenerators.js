import {
    Document,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    BorderStyle,
    WidthType,
    HeadingLevel,
    AlignmentType,
    ImageRun,
} from "docx";
import fs from "fs";
import path from "path";

// Helper function to convert the image to base64 asynchronously
const convertImageToBase64 = async (imagePath) => {
    try {
        // For browser environment (using existing code)
        if (typeof window !== "undefined" && window.fetch) {
            const response = await fetch(imagePath);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Extract Base64 string from Data URL
                    resolve(reader.result.split(",")[1]);
                };
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(blob);
            });
        }
        // For Node.js environment
        else {
            // If imagePath is a URL
            if (imagePath.startsWith("http")) {
                const fetch = require("node-fetch");
                const response = await fetch(imagePath);
                const arrayBuffer = await response.arrayBuffer();
                return Buffer.from(arrayBuffer).toString("base64");
            }
            // If imagePath is a local file path
            else {
                const fs = require("fs");
                const imageBuffer = fs.readFileSync(imagePath);
                return imageBuffer.toString("base64");
            }
        }
    } catch (error) {
        console.error("Error loading profile image:", error);
        return null;
    }
};

// Create the main document
export const createDocument = async (cvData, theme, imagePath = null) => {
    // Convert image to base64 if provided
    let imageBase64 = null;

    // If imagePath is provided, convert it to base64 asynchronously
    if (imagePath) {
        try {
            imageBase64 = await convertImageToBase64(imagePath);
        } catch (error) {
            console.error("Error processing image:", error);
            // Continue without image if there's an error
        }
    }

    const header = createHeader(cvData.personalInfo, imageBase64);

    const sections = [
        header,
        createSummary(cvData.summary),
        createSkills(cvData.skills),
        createExperience(cvData.experience),
        createEducation(cvData.education),
        createCertifications(cvData.certifications),
        createAdditionalExperience(cvData.additionalExperience),
        createLanguages(cvData.languages),
        createInterests(cvData.interests),
    ];

    // Flatten all sections into a single array of content elements
    const content = sections.flat();

    return new Document({
        title: `${cvData.personalInfo.name} - CV`,
        description: `CV for ${cvData.personalInfo.name}`,
        styles: getDocumentStyles(theme),
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 720, // 0.5 inch
                            right: 720, // 0.5 inch
                            bottom: 720, // 0.5 inch
                            left: 720, // 0.5 inch
                        },
                    },
                },
                children: content,
            },
        ],
    });
};

// Get document styles based on the selected theme
const getDocumentStyles = (theme) => {
    const baseStyles = {
        paragraphStyles: [
            {
                id: "Normal",
                name: "Normal",
                run: {
                    size: 24, // 12pt
                    font: getFontForTheme(theme),
                    color: "333333",
                },
                paragraph: {
                    spacing: {
                        line: 276, // ~1.15
                    },
                },
            },
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    size: 36, // 18pt
                    bold: true,
                    color: getHeadingColorForTheme(theme),
                },
                paragraph: {
                    spacing: {
                        before: 240, // 12pt
                        after: 120, // 6pt
                    },
                },
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    size: 30, // 15pt
                    bold: true,
                    color: getHeadingColorForTheme(theme),
                },
                paragraph: {
                    spacing: {
                        before: 240, // 12pt
                        after: 120, // 6pt
                    },
                    border: {
                        bottom: {
                            color: getBorderColorForTheme(theme),
                            space: 1,
                            style: BorderStyle.SINGLE,
                            size: 1,
                        },
                    },
                },
            },
            {
                id: "Heading3",
                name: "Heading 3",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    size: 26, // 13pt
                    bold: true,
                },
                paragraph: {
                    spacing: {
                        before: 240, // 12pt
                        after: 120, // 6pt
                    },
                },
            },
        ],
    };

    return baseStyles;
};

// Helper functions for theme-specific settings
const getFontForTheme = (theme) => {
    switch (theme) {
        case "professional":
            return "Georgia";
        case "modern":
            return "Roboto";
        case "minimal":
        default:
            return "Open Sans";
    }
};

const getHeadingColorForTheme = (theme) => {
    switch (theme) {
        case "professional":
            return "2c3e50";
        case "modern":
            return "3498db";
        case "minimal":
        default:
            return "333333";
    }
};

const getBorderColorForTheme = (theme) => {
    switch (theme) {
        case "professional":
            return "2c3e50";
        case "modern":
            return "3498db";
        case "minimal":
        default:
            return "e0e0e0";
    }
};

// Create the header section with personal info
export const createHeader = (personalInfo, imageBase64 = null) => {
    const { name, title, contact } = personalInfo;
    const headerElements = [];

    // If we have an image, create a table with the image and name/title
    if (imageBase64) {
        const headerTable = new Table({
            alignment: AlignmentType.CENTER,
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
                new TableRow({
                    children: [
                        // Profile image cell
                        new TableCell({
                            width: {
                                size: 25,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new ImageRun({
                                            data: imageBase64,
                                            transformation: {
                                                width: 100,
                                                height: 100,
                                            },
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        // Name and title cell
                        new TableCell({
                            width: {
                                size: 75,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    text: name,
                                    heading: HeadingLevel.HEADING_1,
                                }),
                                new Paragraph({
                                    text: title,
                                    spacing: {
                                        after: 200,
                                    },
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });

        headerElements.push(headerTable);
    } else {
        // Without image, just add name and title paragraphs
        headerElements.push(
            new Paragraph({
                text: name,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                text: title,
                alignment: AlignmentType.CENTER,
                spacing: {
                    after: 200,
                },
            })
        );
    }

    // Rest of the code remains the same...
    // Contact info table and other header elements

    // Create contact info table
    const contactTable = new Table({
        alignment: AlignmentType.CENTER,
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: `Phone: ${contact.phone}`,
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: `Email: ${contact.email}`,
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: `Location: ${contact.location}`,
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: `LinkedIn: ${contact.linkedin}`,
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: `GitHub: ${contact.github}`,
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: `Portfolio: ${contact.portfolio}`,
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    headerElements.push(contactTable);

    // Add a divider
    headerElements.push(
        new Paragraph({
            text: "",
            border: {
                bottom: {
                    color: getBorderColorForTheme("professional"),
                    space: 1,
                    style: BorderStyle.SINGLE,
                    size: 1,
                },
            },
            spacing: {
                before: 400,
                after: 400,
            },
        })
    );

    return headerElements;
};

// Create the summary section
export const createSummary = (summary) => {
    return [
        new Paragraph({
            text: "Summary",
            heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
            text: summary,
            spacing: {
                after: 400,
            },
        }),
    ];
};

// Create the skills section
export const createSkills = (skills) => {
    const skillsElements = [
        new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_2,
        }),
    ];

    // Create a table for skills
    const skillsTable = new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
        },
        rows: Object.entries(skills).map(([category, skillList]) => {
            return new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 25,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                text:
                                    category.charAt(0).toUpperCase() +
                                    category.slice(1),
                                bold: true,
                            }),
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: 75,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                text: skillList.join(", "),
                            }),
                        ],
                    }),
                ],
            });
        }),
    });

    skillsElements.push(skillsTable);

    // Add extra spacing between Skills and Experience sections
    skillsElements.push(
        new Paragraph({
            text: "",
            spacing: {
                after: 400, // Original spacing
            },
        }),
        new Paragraph({
            text: "",
            spacing: {
                after: 400, // Additional spacing
            },
        }),
        // new Paragraph({
        //     text: "",
        //     spacing: {
        //         after: 400, // Additional spacing
        //     },
        // }),
        // new Paragraph({
        //     text: "",
        //     spacing: {
        //         after: 400, // Additional spacing
        //     },
        // }),
        // new Paragraph({
        //     text: "",
        //     spacing: {
        //         after: 400, // Additional spacing
        //     },
        // })
    );

    return skillsElements;
};

// Create the experience section
export const createExperience = (experience) => {
    const experienceElements = [
        new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_2,
            pageBreakBefore: false, // Ensure no page break before the heading
        }),
    ];

    experience.forEach((job, index) => {
        // For the first job entry, ensure it stays with the heading
        const jobElements = [
            new Paragraph({
                text: job.title,
                heading: HeadingLevel.HEADING_3,
                spacing: {
                    before: 200,
                },
                keepNext: true, // Keep this paragraph with the next paragraph
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: job.company,
                        bold: true,
                    }),
                    new TextRun({
                        text: ` | ${job.period}`,
                    }),
                ],
                spacing: {
                    after: 100,
                },
                keepNext: true, // Keep this paragraph with the next paragraph
            }),
        ];

        // Add responsibilities
        job.responsibilities.forEach((resp, i) => {
            const isLast = i === job.responsibilities.length - 1;
            jobElements.push(
                new Paragraph({
                    text: resp,
                    bullet: {
                        level: 0,
                    },
                    keepLines: true, // Keep lines of the paragraph together
                    keepNext: !isLast && i < job.responsibilities.length - 2, // Keep with next for all but last two items
                })
            );
        });

        experienceElements.push(...jobElements);
    });

    experienceElements.push(
        new Paragraph({
            text: "",
            spacing: {
                after: 400,
            },
        })
    );

    return experienceElements;
};

// Create the education section
export const createEducation = (education) => {
    const educationElements = [
        new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_2,
        }),
    ];

    education.forEach((edu) => {
        educationElements.push(
            new Paragraph({
                text: edu.degree,
                heading: HeadingLevel.HEADING_3,
                spacing: {
                    before: 200,
                },
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: edu.institution,
                        bold: true,
                    }),
                    new TextRun({
                        text: ` | ${edu.period}`,
                    }),
                ],
                spacing: {
                    after: 100,
                },
            })
        );
    });

    educationElements.push(
        new Paragraph({
            text: "",
            spacing: {
                after: 400,
            },
        })
    );

    return educationElements;
};

// Create the certifications section
export const createCertifications = (certifications) => {
    const certElements = [
        new Paragraph({
            text: "Certifications",
            heading: HeadingLevel.HEADING_2,
        }),
    ];

    certifications.forEach((cert) => {
        certElements.push(
            new Paragraph({
                text: cert,
                bullet: {
                    level: 0,
                },
            })
        );
    });

    certElements.push(
        new Paragraph({
            text: "",
            spacing: {
                after: 400,
            },
        })
    );

    return certElements;
};

// Create the additional experience section
export const createAdditionalExperience = (additionalExperience) => {
    const additionalElements = [
        new Paragraph({
            text: "Additional Experience",
            heading: HeadingLevel.HEADING_2,
        }),
    ];

    additionalExperience.forEach((exp) => {
        additionalElements.push(
            new Paragraph({
                text: exp.organization,
                heading: HeadingLevel.HEADING_3,
                spacing: {
                    before: 200,
                },
            }),
            new Paragraph({
                text: exp.period,
                spacing: {
                    after: 100,
                },
            }),
            new Paragraph({
                text: exp.details,
            })
        );
    });

    additionalElements.push(
        new Paragraph({
            text: "",
            spacing: {
                after: 400,
            },
        })
    );

    return additionalElements;
};

// Create the languages section
export const createLanguages = (languages) => {
    const languageElements = [
        new Paragraph({
            text: "Languages",
            heading: HeadingLevel.HEADING_2,
        }),
    ];

    // Create a table for languages
    const langTable = new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
        },
        rows: languages.map((lang) => {
            return new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                text: lang.language,
                                bold: true,
                            }),
                        ],
                    }),
                    new TableCell({
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                        },
                        children: [
                            new Paragraph({
                                text: lang.level,
                            }),
                        ],
                    }),
                ],
            });
        }),
    });

    languageElements.push(langTable);
    languageElements.push(
        new Paragraph({
            text: "",
            spacing: {
                after: 400,
            },
        })
    );

    return languageElements;
};

// Create the interests section
export const createInterests = (interests) => {
    const interestElements = [
        new Paragraph({
            text: "Interests",
            heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
            text: interests.join(", "),
        }),
    ];

    return interestElements;
};
