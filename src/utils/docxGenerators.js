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
    ImageRun
  } from 'docx';
  import profilePic from '../assets/profile-pic.jpg';
  
  // Create the main document
  export const createDocument = (cvData, theme) => {
    const sections = [
      createHeader(cvData.personalInfo),
      createSummary(cvData.summary),
      createSkills(cvData.skills),
      createExperience(cvData.experience),
      createEducation(cvData.education),
      createCertifications(cvData.certifications),
      createAdditionalExperience(cvData.additionalExperience),
      createLanguages(cvData.languages),
      createInterests(cvData.interests)
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
          children: content
        }
      ]
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
            color: "333333"
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
            color: getHeadingColorForTheme(theme)
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
            color: getHeadingColorForTheme(theme)
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
      case 'professional':
        return 'Georgia';
      case 'modern':
        return 'Roboto';
      case 'minimal':
      default:
        return 'Open Sans';
    }
  };
  
  const getHeadingColorForTheme = (theme) => {
    switch (theme) {
      case 'professional':
        return '2c3e50';
      case 'modern':
        return '3498db';
      case 'minimal':
      default:
        return '333333';
    }
  };
  
  const getBorderColorForTheme = (theme) => {
    switch (theme) {
      case 'professional':
        return '2c3e50';
      case 'modern':
        return '3498db';
      case 'minimal':
      default:
        return 'e0e0e0';
    }
  };
  
  // Create the header section with personal info
  export const createHeader = (personalInfo) => {
    const { name, title, contact } = personalInfo;
    
    // Create header elements
    const headerElements = [
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
      }),
    ];
    
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
        text: '',
        border: {
          bottom: {
            color: getBorderColorForTheme('professional'),
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
        text: 'Summary',
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
        text: 'Skills',
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
                  text: category.charAt(0).toUpperCase() + category.slice(1),
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
                  text: skillList.join(', '),
                }),
              ],
            }),
          ],
        });
      }),
    });
    
    skillsElements.push(skillsTable);
    skillsElements.push(
      new Paragraph({
        text: '',
        spacing: {
          after: 400,
        },
      })
    );
    
    return skillsElements;
  };
  
  // Create the experience section
  export const createExperience = (experience) => {
    const experienceElements = [
      new Paragraph({
        text: 'Experience',
        heading: HeadingLevel.HEADING_2,
      }),
    ];
    
    experience.forEach(job => {
      experienceElements.push(
        new Paragraph({
          text: job.title,
          heading: HeadingLevel.HEADING_3,
          spacing: {
            before: 200,
          },
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
        })
      );
      
      job.responsibilities.forEach(resp => {
        experienceElements.push(
          new Paragraph({
            text: resp,
            bullet: {
              level: 0,
            },
          })
        );
      });
    });
    
    experienceElements.push(
      new Paragraph({
        text: '',
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
        text: 'Education',
        heading: HeadingLevel.HEADING_2,
      }),
    ];
    
    education.forEach(edu => {
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
        text: '',
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
        text: 'Certifications',
        heading: HeadingLevel.HEADING_2,
      }),
    ];
    
    certifications.forEach(cert => {
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
        text: '',
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
        text: 'Additional Experience',
        heading: HeadingLevel.HEADING_2,
      }),
    ];
    
    additionalExperience.forEach(exp => {
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
        text: '',
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
        text: 'Languages',
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
      rows: languages.map(lang => {
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
        text: '',
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
        text: 'Interests',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: interests.join(', '),
      }),
    ];
    
    return interestElements;
  };