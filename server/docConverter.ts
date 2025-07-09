import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import htmlPdf from 'html-pdf-node';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { convert } from 'html-to-text';

interface ConversionResult {
  success: boolean;
  pdfBuffer?: Buffer;
  originalName: string;
  convertedName: string;
  error?: string;
}

// Helper function to create a simple PDF using pdf-lib
async function createSimplePdf(textContent: string, title: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const pages = [];
  const lines = textContent.split('\n');
  const pageHeight = 792; // A4 page height in points
  const pageWidth = 612; // A4 page width in points
  const margin = 50;
  const lineHeight = 14;
  const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);
  
  for (let i = 0; i < lines.length; i += maxLinesPerPage) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const pageLines = lines.slice(i, i + maxLinesPerPage);
    
    let yPosition = pageHeight - margin;
    
    // Add title on first page
    if (i === 0) {
      page.drawText(title, {
        x: margin,
        y: yPosition,
        size: 16,
        font: helveticaFont,
        color: rgb(0, 0, 0)
      });
      yPosition -= lineHeight * 2;
    }
    
    // Add content lines
    pageLines.forEach(line => {
      if (yPosition > margin) {
        page.drawText(line.substring(0, 100), { // Limit line length
          x: margin,
          y: yPosition,
          size: 11,
          font: timesRomanFont,
          color: rgb(0, 0, 0)
        });
        yPosition -= lineHeight;
      }
    });
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
        // Convert DOC/DOCX to HTML using mammoth
        const result = await mammoth.convertToHtml({ buffer: file.buffer });
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
        
        // Try to generate PDF from HTML using html-pdf-node first
        let pdfBuffer: Buffer;
        try {
          const options = {
            format: 'A4',
            border: {
              top: '1in',
              right: '1in',
              bottom: '1in',
              left: '1in'
            }
          };
          
          pdfBuffer = await htmlPdf.generatePdf({ content: styledHtml }, options);
        } catch (puppeteerError) {
          console.log('Puppeteer PDF generation failed, using fallback method:', puppeteerError);
          
          // Fallback: Use pdf-lib to create a simple PDF from text
          const textContent = convert(html, {
            wordwrap: 80,
            preserveNewlines: true,
            ignoreHref: true
          });
          
          pdfBuffer = await createSimplePdf(textContent, baseName);
        }
        
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