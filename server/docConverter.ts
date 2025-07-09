import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { convert } from 'html-to-text';

interface ConversionResult {
  success: boolean;
  pdfBuffer?: Buffer;
  originalName: string;
  convertedName: string;
  error?: string;
}

// Helper function to create a professional PDF using pdf-lib
async function createSimplePdf(textContent: string, title: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const pageHeight = 792; // A4 page height in points
  const pageWidth = 612; // A4 page width in points
  const margin = 50;
  const lineHeight = 14;
  const maxLinesPerPage = Math.floor((pageHeight - 2 * margin - 60) / lineHeight); // Reserve space for title
  
  // Process text content
  const lines = textContent.split('\n').filter(line => line.trim().length > 0);
  const processedLines = [];
  
  for (const line of lines) {
    if (line.length <= 85) {
      processedLines.push(line);
    } else {
      // Word wrap long lines
      const words = line.split(' ');
      let currentLine = '';
      for (const word of words) {
        if ((currentLine + word).length <= 85) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) processedLines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) processedLines.push(currentLine);
    }
  }
  
  // Create pages
  for (let i = 0; i < processedLines.length; i += maxLinesPerPage) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const pageLines = processedLines.slice(i, i + maxLinesPerPage);
    
    let yPosition = pageHeight - margin;
    
    // Add title and header on first page
    if (i === 0) {
      page.drawText(title.replace(/\.(docx?|pdf)$/i, ''), {
        x: margin,
        y: yPosition,
        size: 18,
        font: helveticaBoldFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      yPosition -= 25;
      
      // Add a subtle line under title
      page.drawLine({
        start: { x: margin, y: yPosition },
        end: { x: pageWidth - margin, y: yPosition },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7)
      });
      yPosition -= 20;
    }
    
    // Add content lines with better formatting
    pageLines.forEach(line => {
      if (yPosition > margin + 20) {
        // Check if line looks like a header (short line with caps or special formatting)
        const isHeader = line.length < 50 && (line.toUpperCase() === line || line.includes(':'));
        
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: isHeader ? 12 : 11,
          font: isHeader ? helveticaBoldFont : timesRomanFont,
          color: rgb(0, 0, 0)
        });
        yPosition -= lineHeight + (isHeader ? 2 : 0);
      }
    });
    
    // Add page number
    if (i > 0 || processedLines.length > maxLinesPerPage) {
      const pageNum = Math.floor(i / maxLinesPerPage) + 1;
      page.drawText(`Page ${pageNum}`, {
        x: pageWidth - margin - 50,
        y: margin - 20,
        size: 9,
        font: timesRomanFont,
        color: rgb(0.5, 0.5, 0.5)
      });
    }
  }
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function convertDocToPdf(file: Express.Multer.File): Promise<ConversionResult> {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const baseName = path.basename(file.originalname, fileExtension);
  const convertedName = `${baseName}.pdf`;
  
  try {
    if (fileExtension === '.docx' || fileExtension === '.doc') {
      console.log(`Converting ${fileExtension.toUpperCase()} file to PDF:`, file.originalname);
      
      try {
        // Convert DOC/DOCX to HTML using mammoth with better options
        const result = await mammoth.convertToHtml(
          { buffer: file.buffer },
          {
            // Skip images during conversion
            convertImage: mammoth.images.ignoreImages,
            // Transform table elements to better text
            transformDocument: mammoth.transforms.paragraph(function(element) {
              // Skip empty paragraphs
              if (element.children.length === 0) {
                return undefined;
              }
              return element;
            })
          }
        );
        const html = result.value;
        
        // Create a styled HTML document
        const styledHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  margin: 40px; 
                  color: #333; 
                }
                p { margin: 12px 0; }
                h1, h2, h3 { color: #2c3e50; }
                ul, ol { margin: 12px 0; padding-left: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              ${html}
            </body>
          </html>
        `;
        
        // Convert HTML to text and create PDF using pdf-lib
        const textContent = convert(html, {
          wordwrap: 80,
          preserveNewlines: true,
          ignoreHref: true,
          ignoreImage: true,
          baseElements: {
            selectors: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'div', 'span', 'strong', 'em', 'table', 'tr', 'td', 'th']
          },
          formatters: {
            // Skip image tags completely
            'img': function(elem, walk, builder, formatOptions) {
              return '';
            }
          }
        });
        
        // Clean the text content to remove base64 data and other unwanted content
        const cleanedContent = textContent
          .replace(/\[data:image\/[^;]+;base64,[A-Za-z0-9+/=]+\]/g, '') // Remove base64 images
          .replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '') // Remove standalone base64
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
          .trim();

        const pdfBuffer = await createSimplePdf(cleanedContent, baseName);
        
        console.log(`Successfully converted ${file.originalname} to PDF`);
        
        return {
          success: true,
          pdfBuffer,
          originalName: file.originalname,
          convertedName
        };
      } catch (conversionError) {
        console.error(`Error during ${fileExtension.toUpperCase()} to PDF conversion:`, conversionError);
        
        return {
          success: false,
          originalName: file.originalname,
          convertedName,
          error: `Failed to convert ${fileExtension.toUpperCase()} to PDF: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`
        };
      }
    } else {
      // Not a DOC/DOCX file, return as is
      return {
        success: true,
        pdfBuffer: file.buffer,
        originalName: file.originalname,
        convertedName: file.originalname
      };
    }
  } catch (error) {
    console.error('Error in convertDocToPdf:', error);
    return {
      success: false,
      originalName: file.originalname,
      convertedName,
      error: error instanceof Error ? error.message : 'Unknown conversion error'
    };
  }
}

// Alternative conversion method using mammoth for DOCX files
export async function convertDocxToHtmlToPdf(file: Express.Multer.File): Promise<ConversionResult> {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const baseName = path.basename(file.originalname, fileExtension);
  const convertedName = `${baseName}.pdf`;
  
  try {
    if (fileExtension === '.docx') {
      console.log('Converting DOCX to HTML then PDF:', file.originalname);
      
      // Convert DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml({ buffer: file.buffer });
      const html = result.value;
      
      // Here you would typically use a library like puppeteer or html-pdf
      // For now, we'll use the docx-pdf method as primary
      return await convertDocToPdf(file);
    } else {
      return await convertDocToPdf(file);
    }
  } catch (error) {
    console.error('Error in convertDocxToHtmlToPdf:', error);
    return {
      success: false,
      originalName: file.originalname,
      convertedName,
      error: error instanceof Error ? error.message : 'Unknown conversion error'
    };
  }
}