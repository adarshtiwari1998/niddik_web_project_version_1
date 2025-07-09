import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import htmlPdf from 'html-pdf-node';

interface ConversionResult {
  success: boolean;
  pdfBuffer?: Buffer;
  originalName: string;
  convertedName: string;
  error?: string;
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
        
        // Generate PDF from HTML
        const options = {
          format: 'A4',
          border: {
            top: '1in',
            right: '1in',
            bottom: '1in',
            left: '1in'
          }
        };
        
        const pdfBuffer = await htmlPdf.generatePdf({ content: styledHtml }, options);
        
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