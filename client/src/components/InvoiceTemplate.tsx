import React, { forwardRef } from 'react';
import { format } from 'date-fns';

interface InvoiceData {
  invoiceNumber: string;
  candidateName: string;
  candidateEmail: string;
  weekStartDate: string;
  weekEndDate: string;
  totalHours: number;
  hourlyRate: number;
  totalAmount: number;
  currency: string;
  issuedDate: string;
  dueDate: string;
  notes?: string;
}

interface CompanyData {
  name: string;
  logoUrl?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
}

interface ClientData {
  name: string;
  logoUrl?: string;
  billToAddress: string;
  billToCity: string;
  billToState: string;
  billToCountry: string;
  billToZipCode: string;
  contactPerson: string;
  email: string;
  phone: string;
}

interface TimesheetDetails {
  mondayHours: number;
  tuesdayHours: number;
  wednesdayHours: number;
  thursdayHours: number;
  fridayHours: number;
  saturdayHours: number;
  sundayHours: number;
  regularHours: number;
  overtimeHours: number;
  totalRegularAmount: number;
  totalOvertimeAmount: number;
}

interface InvoiceTemplateProps {
  invoice: InvoiceData;
  companyData: CompanyData;
  clientData: ClientData;
  timesheetDetails: TimesheetDetails;
}

const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ invoice, companyData, clientData, timesheetDetails }, ref) => {
    const formatCurrency = (amount: number, currency: string = 'INR') => {
      return `${currency} ${amount.toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
      return format(new Date(dateString), 'MMM dd, yyyy');
    };

    const days = [
      { name: 'Monday', hours: timesheetDetails.mondayHours },
      { name: 'Tuesday', hours: timesheetDetails.tuesdayHours },
      { name: 'Wednesday', hours: timesheetDetails.wednesdayHours },
      { name: 'Thursday', hours: timesheetDetails.thursdayHours },
      { name: 'Friday', hours: timesheetDetails.fridayHours },
      { name: 'Saturday', hours: timesheetDetails.saturdayHours },
      { name: 'Sunday', hours: timesheetDetails.sundayHours }
    ];

    return (
      <div ref={ref} className="bg-white p-8 text-black min-h-[297mm]" style={{ width: '210mm', fontFamily: 'Arial, sans-serif' }}>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          {/* Company Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {companyData.logoUrl && (
                <img 
                  src={companyData.logoUrl} 
                  alt={companyData.name}
                  className="h-16 w-auto object-contain"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-blue-600">{companyData.name}</h1>
                <p className="text-sm text-gray-600">IT Recruitment & Staffing Solutions</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>{companyData.address}</p>
              <p>{companyData.city}, {companyData.state} {companyData.zipCode}</p>
              <p>{companyData.country}</p>
              {companyData.phone && <p>Phone: {companyData.phone}</p>}
              <p>Email: {companyData.email}</p>
              {companyData.website && <p>Website: {companyData.website}</p>}
              {companyData.taxId && <p>Tax ID: {companyData.taxId}</p>}
            </div>
          </div>

          {/* Invoice Info */}
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</p>
              <p><span className="font-medium">Date:</span> {formatDate(invoice.issuedDate)}</p>
              <p><span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Client Company */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 pb-1 border-b-2 border-blue-500">BILL TO</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-2">
                {clientData.logoUrl && (
                  <img 
                    src={clientData.logoUrl} 
                    alt={clientData.name}
                    className="h-8 w-auto object-contain"
                  />
                )}
                <p className="font-bold text-lg">{clientData.name}</p>
              </div>
              {clientData.contactPerson && <p>Attn: {clientData.contactPerson}</p>}
              <p>{clientData.billToAddress}</p>
              <p>{clientData.billToCity}, {clientData.billToState} {clientData.billToZipCode}</p>
              <p>{clientData.billToCountry}</p>
              {clientData.email && <p>Email: {clientData.email}</p>}
              {clientData.phone && <p>Phone: {clientData.phone}</p>}
            </div>
          </div>

          {/* Service Provider (Candidate) */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 pb-1 border-b-2 border-green-500">SERVICE PROVIDER</h3>
            <div className="space-y-1">
              <p className="font-bold text-lg">{invoice.candidateName}</p>
              <p>Email: {invoice.candidateEmail}</p>
              <p className="text-sm text-gray-600">via {companyData.name}</p>
            </div>
          </div>
        </div>

        {/* Service Period */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-gray-800 mb-2">SERVICE PERIOD</h3>
          <p className="text-lg">{formatDate(invoice.weekStartDate)} - {formatDate(invoice.weekEndDate)}</p>
          <p className="text-sm text-gray-600">Weekly IT Consulting Services</p>
        </div>

        {/* Daily Hours Breakdown */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3 pb-1 border-b-2 border-blue-500">HOURS BREAKDOWN</h3>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {days.map((day) => (
              <div key={day.name} className="text-center p-2 border rounded">
                <div className="font-medium text-sm text-gray-600">{day.name.substring(0, 3)}</div>
                <div className="text-lg font-bold">{day.hours.toFixed(1)}h</div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Table */}
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-gray-300 p-3 text-left">Description</th>
              <th className="border border-gray-300 p-3 text-center">Hours</th>
              <th className="border border-gray-300 p-3 text-center">Rate</th>
              <th className="border border-gray-300 p-3 text-center">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* Regular Hours */}
            {timesheetDetails.regularHours > 0 && (
              <tr>
                <td className="border border-gray-300 p-3">
                  <div>
                    <div className="font-medium">Regular Hours</div>
                    <div className="text-sm text-gray-600">Standard working hours</div>
                  </div>
                </td>
                <td className="border border-gray-300 p-3 text-center">{timesheetDetails.regularHours.toFixed(2)}</td>
                <td className="border border-gray-300 p-3 text-center">{formatCurrency(invoice.hourlyRate, invoice.currency)}</td>
                <td className="border border-gray-300 p-3 text-center">{formatCurrency(timesheetDetails.totalRegularAmount, invoice.currency)}</td>
              </tr>
            )}

            {/* Overtime Hours */}
            {timesheetDetails.overtimeHours > 0 && (
              <tr>
                <td className="border border-gray-300 p-3">
                  <div>
                    <div className="font-medium">Overtime Hours</div>
                    <div className="text-sm text-gray-600">Hours exceeding standard work schedule</div>
                  </div>
                </td>
                <td className="border border-gray-300 p-3 text-center">{timesheetDetails.overtimeHours.toFixed(2)}</td>
                <td className="border border-gray-300 p-3 text-center">{formatCurrency(invoice.hourlyRate, invoice.currency)}</td>
                <td className="border border-gray-300 p-3 text-center">{formatCurrency(timesheetDetails.totalOvertimeAmount, invoice.currency)}</td>
              </tr>
            )}

            {/* Total Row */}
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 p-3" colSpan={3}>
                <div className="text-right">TOTAL</div>
              </td>
              <td className="border border-gray-300 p-3 text-center text-xl">
                {formatCurrency(invoice.totalAmount, invoice.currency)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Payment Terms</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Payment due within 30 days of invoice date</li>
              <li>• Late payments may incur additional charges</li>
              <li>• All payments in {invoice.currency}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Total Hours:</span>
                <span className="font-medium">{invoice.totalHours.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Hourly Rate:</span>
                <span className="font-medium">{formatCurrency(invoice.hourlyRate, invoice.currency)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-lg">
                <span>Total Amount:</span>
                <span>{formatCurrency(invoice.totalAmount, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-2">Notes</h4>
            <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
              {invoice.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-4 text-center text-sm text-gray-600">
          <p>Thank you for your business!</p>
          <p className="mt-2">This invoice was generated by {companyData.name} - Professional IT Staffing Solutions</p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;