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
  currencyConversionRate: number;
  sixMonthAverageRate: number;
  amountINR: number;
  gstRate: number;
  gstAmount: number;
  totalWithGst: number;
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
  phoneNumbers: string[];
  emailAddresses: string[];
  website?: string;
  taxId?: string;
  gstNumber?: string;
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
  phoneNumbers: string[];
  emailAddresses: string[];
}

interface TimesheetDetails {
  week1?: {
    mondayHours?: number;
    tuesdayHours?: number;
    wednesdayHours?: number;
    thursdayHours?: number;
    fridayHours?: number;
    saturdayHours?: number;
    sundayHours?: number;
    totalWeekHours?: number;
  };
  week2?: {
    mondayHours?: number;
    tuesdayHours?: number;
    wednesdayHours?: number;
    thursdayHours?: number;
    fridayHours?: number;
    saturdayHours?: number;
    sundayHours?: number;
    totalWeekHours?: number;
  };
  regularHours?: number;
  overtimeHours?: number;
  totalRegularAmount?: number;
  totalOvertimeAmount?: number;
}

interface InvoiceTemplateProps {
  invoice: InvoiceData;
  companyData: CompanyData;
  clientData: ClientData;
  timesheetDetails: TimesheetDetails;
}

const InvoiceTemplateNew = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ invoice, companyData, clientData, timesheetDetails }, ref) => {
    const formatCurrency = (amount: number, currency: string = 'USD') => {
      if (currency === 'USD') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      } else {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
    };

    const formatDate = (dateString: string) => {
      return format(new Date(dateString), 'dd MMM yyyy');
    };

    return (
      <div ref={ref} className="bg-white p-8 text-black" style={{ width: '210mm', minHeight: '297mm', fontSize: '14px' }}>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            {/* Company Header */}
            <div className="flex items-center space-x-4">
              {companyData.logoUrl && (
                <img 
                  src={companyData.logoUrl} 
                  alt={companyData.name}
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-blue-800">{companyData.name}</h1>
                <div className="text-sm text-gray-600 mt-1">
                  <p>{companyData.address}</p>
                  <p>{companyData.city}, {companyData.state} {companyData.zipCode}</p>
                  <p>{companyData.country}</p>
                  {companyData.phoneNumbers.length > 0 && (
                    <p>Phone: {companyData.phoneNumbers[0]}</p>
                  )}
                  {companyData.emailAddresses.length > 0 && (
                    <p>Email: {companyData.emailAddresses[0]}</p>
                  )}
                  {companyData.gstNumber && (
                    <p>GST: {companyData.gstNumber}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Invoice Title and Number */}
            <div className="text-right">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">INVOICE</h2>
              <div className="bg-blue-50 p-3 border">
                <p className="text-sm font-semibold text-gray-600">INVOICE NUMBER</p>
                <p className="text-lg font-bold">{invoice.invoiceNumber}</p>
              </div>
              <div className="mt-2 text-sm">
                <p><strong>Date:</strong> {formatDate(invoice.issuedDate)}</p>
                <p><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Bill To */}
          <div className="border p-4">
            <div className="bg-blue-600 text-white p-2 mb-3">
              <h3 className="font-bold">BILL TO</h3>
            </div>
            <div className="flex items-start space-x-3">
              {clientData.logoUrl && (
                <img 
                  src={clientData.logoUrl} 
                  alt={clientData.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <div className="text-sm">
                <p className="font-bold text-lg">{clientData.name}</p>
                {clientData.contactPerson && (
                  <p className="font-medium">{clientData.contactPerson}</p>
                )}
                <p>{clientData.billToAddress}</p>
                <p>{clientData.billToCity}, {clientData.billToState} {clientData.billToZipCode}</p>
                <p>{clientData.billToCountry}</p>
                {clientData.phoneNumbers.length > 0 && (
                  <p>Phone: {clientData.phoneNumbers[0]}</p>
                )}
                {clientData.emailAddresses.length > 0 && (
                  <p>Email: {clientData.emailAddresses[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Ship To (Same as Bill To) */}
          <div className="border p-4">
            <div className="bg-blue-600 text-white p-2 mb-3">
              <h3 className="font-bold">SHIP TO</h3>
            </div>
            <div className="flex items-start space-x-3">
              {clientData.logoUrl && (
                <img 
                  src={clientData.logoUrl} 
                  alt={clientData.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <div className="text-sm">
                <p className="font-bold text-lg">{clientData.name}</p>
                {clientData.contactPerson && (
                  <p className="font-medium">{clientData.contactPerson}</p>
                )}
                <p>{clientData.billToAddress}</p>
                <p>{clientData.billToCity}, {clientData.billToState} {clientData.billToZipCode}</p>
                <p>{clientData.billToCountry}</p>
                {clientData.phoneNumbers.length > 0 && (
                  <p>Phone: {clientData.phoneNumbers[0]}</p>
                )}
                {clientData.emailAddresses.length > 0 && (
                  <p>Email: {clientData.emailAddresses[0]}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="border border-gray-400 p-3 text-left font-bold">DESCRIPTION</th>
                <th className="border border-gray-400 p-3 text-center font-bold">QTY</th>
                <th className="border border-gray-400 p-3 text-center font-bold">RATE</th>
                <th className="border border-gray-400 p-3 text-center font-bold">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {/* Main Service Line */}
              <tr>
                <td className="border border-gray-400 p-3">
                  <div>
                    <p className="font-semibold">Professional Services - {invoice.candidateName}</p>
                    <p className="text-sm text-gray-600">
                      Period: {formatDate(invoice.weekStartDate)} to {formatDate(invoice.weekEndDate)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Hours: {invoice.totalHours.toFixed(2)} hours
                    </p>
                  </div>
                </td>
                <td className="border border-gray-400 p-3 text-center">{invoice.totalHours.toFixed(2)}</td>
                <td className="border border-gray-400 p-3 text-center">
                  {formatCurrency(invoice.hourlyRate * invoice.currencyConversionRate, 'INR')}
                  <div className="text-xs text-gray-600 mt-1">≈ {formatCurrency(invoice.hourlyRate, 'USD')}</div>
                </td>
                <td className="border border-gray-400 p-3 text-center font-semibold">
                  {formatCurrency(invoice.amountINR, 'INR')}
                  <div className="text-xs text-gray-600 mt-1">≈ {formatCurrency(invoice.totalAmount, 'USD')}</div>
                </td>
              </tr>

              {/* Bi-Weekly Breakdown if available */}
              {timesheetDetails.week1 && (
                <tr className="bg-gray-50">
                  <td className="border border-gray-400 p-3 pl-8">
                    <div className="text-sm">
                      <p className="font-medium">Week 1 Breakdown:</p>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        {timesheetDetails.week1.mondayHours && timesheetDetails.week1.mondayHours > 0 && (
                          <span>Mon: {timesheetDetails.week1.mondayHours}h</span>
                        )}
                        {timesheetDetails.week1.tuesdayHours && timesheetDetails.week1.tuesdayHours > 0 && (
                          <span>Tue: {timesheetDetails.week1.tuesdayHours}h</span>
                        )}
                        {timesheetDetails.week1.wednesdayHours && timesheetDetails.week1.wednesdayHours > 0 && (
                          <span>Wed: {timesheetDetails.week1.wednesdayHours}h</span>
                        )}
                        {timesheetDetails.week1.thursdayHours && timesheetDetails.week1.thursdayHours > 0 && (
                          <span>Thu: {timesheetDetails.week1.thursdayHours}h</span>
                        )}
                        {timesheetDetails.week1.fridayHours && timesheetDetails.week1.fridayHours > 0 && (
                          <span>Fri: {timesheetDetails.week1.fridayHours}h</span>
                        )}
                        {timesheetDetails.week1.saturdayHours && timesheetDetails.week1.saturdayHours > 0 && (
                          <span>Sat: {timesheetDetails.week1.saturdayHours}h</span>
                        )}
                        {timesheetDetails.week1.sundayHours && timesheetDetails.week1.sundayHours > 0 && (
                          <span>Sun: {timesheetDetails.week1.sundayHours}h</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="border border-gray-400 p-3 text-center text-sm">
                    {timesheetDetails.week1.totalWeekHours?.toFixed(2) || '0.00'}
                  </td>
                  <td className="border border-gray-400 p-3 text-center text-sm">-</td>
                  <td className="border border-gray-400 p-3 text-center text-sm">-</td>
                </tr>
              )}

              {timesheetDetails.week2 && (
                <tr className="bg-gray-50">
                  <td className="border border-gray-400 p-3 pl-8">
                    <div className="text-sm">
                      <p className="font-medium">Week 2 Breakdown:</p>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        {timesheetDetails.week2.mondayHours && timesheetDetails.week2.mondayHours > 0 && (
                          <span>Mon: {timesheetDetails.week2.mondayHours}h</span>
                        )}
                        {timesheetDetails.week2.tuesdayHours && timesheetDetails.week2.tuesdayHours > 0 && (
                          <span>Tue: {timesheetDetails.week2.tuesdayHours}h</span>
                        )}
                        {timesheetDetails.week2.wednesdayHours && timesheetDetails.week2.wednesdayHours > 0 && (
                          <span>Wed: {timesheetDetails.week2.wednesdayHours}h</span>
                        )}
                        {timesheetDetails.week2.thursdayHours && timesheetDetails.week2.thursdayHours > 0 && (
                          <span>Thu: {timesheetDetails.week2.thursdayHours}h</span>
                        )}
                        {timesheetDetails.week2.fridayHours && timesheetDetails.week2.fridayHours > 0 && (
                          <span>Fri: {timesheetDetails.week2.fridayHours}h</span>
                        )}
                        {timesheetDetails.week2.saturdayHours && timesheetDetails.week2.saturdayHours > 0 && (
                          <span>Sat: {timesheetDetails.week2.saturdayHours}h</span>
                        )}
                        {timesheetDetails.week2.sundayHours && timesheetDetails.week2.sundayHours > 0 && (
                          <span>Sun: {timesheetDetails.week2.sundayHours}h</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="border border-gray-400 p-3 text-center text-sm">
                    {timesheetDetails.week2.totalWeekHours?.toFixed(2) || '0.00'}
                  </td>
                  <td className="border border-gray-400 p-3 text-center text-sm">-</td>
                  <td className="border border-gray-400 p-3 text-center text-sm">-</td>
                </tr>
              )}

              {/* Subtotal */}
              <tr className="bg-gray-100">
                <td className="border border-gray-400 p-3" colSpan={3}>
                  <div className="text-right font-semibold">SUBTOTAL</div>
                </td>
                <td className="border border-gray-400 p-3 text-center font-semibold">
                  {formatCurrency(invoice.amountINR, 'INR')}
                  <div className="text-xs text-gray-600 mt-1">≈ {formatCurrency(invoice.totalAmount, 'USD')}</div>
                </td>
              </tr>

              {/* GST */}
              <tr>
                <td className="border border-gray-400 p-3" colSpan={3}>
                  <div className="text-right">GST ({invoice.gstRate}%)</div>
                </td>
                <td className="border border-gray-400 p-3 text-center">
                  {formatCurrency(invoice.amountINR * (invoice.gstRate / 100), 'INR')}
                  <div className="text-xs text-gray-600 mt-1">≈ {formatCurrency(invoice.gstAmount, 'USD')}</div>
                </td>
              </tr>

              {/* Total */}
              <tr className="bg-blue-100 font-bold text-lg">
                <td className="border border-gray-400 p-3" colSpan={3}>
                  <div className="text-right">TOTAL (INR)</div>
                </td>
                <td className="border border-gray-400 p-3 text-center">
                  {formatCurrency(invoice.amountINR * (1 + invoice.gstRate / 100), 'INR')}
                  <div className="text-xs text-gray-600 mt-1">≈ {formatCurrency(invoice.totalWithGst, 'USD')}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Currency Conversion Information */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="border p-4 bg-yellow-50">
            <h4 className="font-bold text-gray-800 mb-2">Currency Conversion Details</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Original Amount (INR):</span>
                <span className="font-medium">{formatCurrency(invoice.amountINR, 'INR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Current USD/INR Rate:</span>
                <span className="font-medium">{invoice.currencyConversionRate.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>6-Month Average Rate:</span>
                <span className="font-medium">{invoice.sixMonthAverageRate.toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold">
                <span>Converted Amount (USD):</span>
                <span>{formatCurrency(invoice.totalAmount, 'USD')}</span>
              </div>
            </div>
          </div>

          <div className="border p-4">
            <h4 className="font-bold text-gray-800 mb-2">Payment Terms</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Payment due within 30 days</li>
              <li>• All amounts in Indian Rupees (INR)</li>
              <li>• Wire transfer preferred</li>
              <li>• Late payments subject to 1.5% monthly charge</li>
            </ul>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-2">Notes</h4>
            <div className="bg-gray-50 p-3 border-l-4 border-blue-500 text-sm">
              {invoice.notes}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-4 text-center text-sm text-gray-600">
          <p className="font-semibold">Thank you for your business!</p>
          <p className="mt-1">This invoice was generated automatically by {companyData.name}</p>
          <p className="mt-1">Professional IT Staffing & Consulting Services</p>
        </div>
      </div>
    );
  }
);

InvoiceTemplateNew.displayName = 'InvoiceTemplateNew';

export default InvoiceTemplateNew;