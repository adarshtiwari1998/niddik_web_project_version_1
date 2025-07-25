import React, { useRef, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { FileText, Download, Printer, X } from 'lucide-react';
import InvoiceTemplateNew from './InvoiceTemplateNew';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface InvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId?: number;
  timesheetId?: number;
  biWeeklyTimesheetId?: number;
  mode?: 'preview' | 'generate';
  setActiveTab?: (tab: string) => void;
}

export default function InvoiceDialog({
  isOpen,
  onClose,
  invoiceId,
  timesheetId,
  biWeeklyTimesheetId,
  mode = 'preview',
  setActiveTab
}: InvoiceDialogProps) {
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Fetch existing invoice template data
  const { data: invoiceData, isLoading: isLoadingInvoice } = useQuery({
    queryKey: [`/api/admin/invoices/${invoiceId}/template-data`],
    enabled: !!invoiceId && mode === 'preview'
  });

  // Generate new invoice mutation
  const generateInvoiceMutation = useMutation({
    mutationFn: async (data: { timesheetId?: number; biWeeklyTimesheetId?: number }) => {
      const response = await fetch('/api/admin/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate invoice');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: "Invoice generated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/biweekly-timesheets'] });
      // Close the dialog and navigate to invoice tab if setActiveTab is provided
      onClose();
      if (setActiveTab) {
        setActiveTab("invoices");
      }
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const handleGenerateInvoice = () => {
    if (timesheetId) {
      generateInvoiceMutation.mutate({ timesheetId });
    } else if (biWeeklyTimesheetId) {
      generateInvoiceMutation.mutate({ biWeeklyTimesheetId });
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !invoiceData?.data) return;

    setIsGeneratingPDF(true);
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const invoice = invoiceData.data.invoice;
      const fileName = `Invoice-${invoice?.invoiceNumber || 'invoice'}-${invoice?.candidateName?.replace(/\s+/g, '-') || 'invoice'}.pdf`;
      pdf.save(fileName);

      toast({ title: "Success", description: "Invoice PDF downloaded successfully" });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({ 
        title: "Error", 
        description: "Failed to generate PDF", 
        variant: "destructive" 
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - ${invoiceData?.data?.invoice?.invoiceNumber || ''}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              @media print {
                body { margin: 0; padding: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const isLoading = isLoadingInvoice || generateInvoiceMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {mode === 'generate' ? 'Generate Invoice' : 'Invoice Preview'}
          </DialogTitle>
          {invoiceData?.data?.invoice && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {invoiceData.data.invoice.invoiceNumber || 'N/A'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={isGeneratingPDF}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {mode === 'generate' ? (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Generate Invoice</h3>
                  <p className="text-muted-foreground">
                    This will create an invoice for the approved {biWeeklyTimesheetId ? 'bi-weekly' : 'weekly'} timesheet.
                  </p>
                </div>
                <Button 
                  onClick={handleGenerateInvoice}
                  disabled={generateInvoiceMutation.isPending}
                  size="lg"
                >
                  {generateInvoiceMutation.isPending ? 'Generating...' : 'Generate Invoice'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading invoice...</p>
                </div>
              ) : invoiceData?.data?.invoice && invoiceData?.data?.companyData && invoiceData?.data?.clientData && invoiceData?.data?.timesheetDetails ? (
                <div className="border rounded-lg overflow-hidden">
                  <InvoiceTemplateNew
                    ref={invoiceRef}
                    invoice={invoiceData.data.invoice}
                    companyData={invoiceData.data.companyData}
                    clientData={invoiceData.data.clientData}
                    timesheetDetails={invoiceData.data.timesheetDetails}
                    billingData={invoiceData.data.billingData}
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Invoice data not available</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}