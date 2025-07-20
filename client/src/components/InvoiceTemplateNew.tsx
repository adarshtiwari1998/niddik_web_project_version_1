import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

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

interface BillingData {
  hourlyRate: number;
  currency: string;
  workingDaysPerWeek: number;
  employmentType: string;
  supervisorName: string;
  clientCompanyName: string;
  endUserName?: string;
}

interface InvoiceTemplateProps {
  invoice: InvoiceData;
  companyData: CompanyData;
  clientData: ClientData;
  timesheetDetails: TimesheetDetails;
  billingData?: BillingData;
}

// Currency Rates Display Component
const CurrencyRatesDisplay: React.FC<{ sixMonthAverageRate: number; currentRate: number }> = ({ sixMonthAverageRate, currentRate }) => {
  const { data: currencyRates } = useQuery({
    queryKey: ['/api/admin/currency-rates'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const displayRates = currencyRates?.data?.monthlyRates || [];

  return (
    <div className="border border-gray-400 p-3">
      <h4 className="font-bold text-sm mb-2">Last 6 Months Avg. Conversion $ to INR is {sixMonthAverageRate.toFixed(0)}</h4>
      <div className="text-xs space-y-1">
        {displayRates.length > 0 ? (
          displayRates.slice(-7).map((rate: any, index: number) => (
            <div key={index} className={`flex justify-between ${index === displayRates.length - 1 ? 'border-t pt-1' : ''}`}>
              <span>{rate.month}</span>
              <span>{rate.average.toFixed(6)}</span>
            </div>
          ))
        ) : (
          // Fallback display using calculated rates if API data is not available
          <>
            <div className="flex justify-between">
              <span>Jan</span>
              <span>{(sixMonthAverageRate * 0.995).toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Feb</span>
              <span>{(sixMonthAverageRate * 1.002).toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Mar</span>
              <span>{(sixMonthAverageRate * 0.998).toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Apr</span>
              <span>{(sixMonthAverageRate * 1.001).toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span>May</span>
              <span>{(sixMonthAverageRate * 0.994).toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Jun</span>
              <span>{(sixMonthAverageRate * 1.005).toFixed(6)}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span>Jul</span>
              <span>{currentRate.toFixed(6)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const InvoiceTemplateNew = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ invoice, companyData, clientData, timesheetDetails, billingData }, ref) => {
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

    // Get the current invoice date for currency calculation
    const invoiceDate = new Date(invoice.issuedDate);
    const invoiceMonth = invoiceDate.getMonth();
    const invoiceYear = invoiceDate.getFullYear();

    return (
      <div ref={ref} className="bg-white p-8 text-black" style={{ width: '210mm', minHeight: '297mm', fontSize: '12px' }}>
        
        {/* Header Section with Company Logo and Tagline */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            {/* Company Header */}
            <div className="flex items-start space-x-4">
              {companyData.logoUrl && (
                <img 
                  src={companyData.logoUrl} 
                  alt={companyData.name}
                  className="w-20 h-20 object-contain"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-blue-800">{companyData.name}</h1>
                <p className="text-sm text-gray-600 italic mb-2">
                  {companyData.name === 'NIDDIK' ? '(An IT Division of NIDDIKKARE' : 'Connecting People, Changing Lives'}
                </p>
                <div className="text-xs text-gray-700">
                  <p>{companyData.address}</p>
                  <p>{companyData.city}, {companyData.state} - {companyData.zipCode}</p>
                  <p>{companyData.country}</p>
                  {companyData.phoneNumbers && companyData.phoneNumbers.length > 0 && (
                    <p>IND: {companyData.phoneNumbers[0]}</p>
                  )}
                  {companyData.emailAddresses && companyData.emailAddresses.length > 0 && (
                    <p>{companyData.emailAddresses[0]}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Invoice Title and Number */}
            <div className="text-right">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">INVOICE</h2>
              <div className="bg-gray-100 p-3 border">
                <p className="text-sm font-semibold text-gray-600">INVOICE NO.</p>
                <p className="text-lg font-bold">{invoice.invoiceNumber}</p>
              </div>
              <div className="mt-2 text-sm">
                <p><strong>{formatDate(invoice.issuedDate)}</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To and Ship To Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Bill To */}
          <div className="border border-gray-400">
            <div className="bg-blue-600 text-white p-2">
              <h3 className="font-bold text-sm">BILL TO</h3>
            </div>
            <div className="p-3">
              <div className="flex items-start space-x-3">
                {clientData.logoUrl && (
                  <img 
                    src={clientData.logoUrl} 
                    alt={clientData.name}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <div className="text-xs">
                  <p className="font-bold text-sm">{clientData.name}</p>
                  <p>{clientData.contactPerson}</p>
                  <p>{clientData.billToAddress}</p>
                  <p>{clientData.billToCity}, {clientData.billToState} {clientData.billToZipCode}</p>
                  <p>{clientData.billToCountry}</p>
                  {clientData.phoneNumbers && clientData.phoneNumbers.length > 0 && (
                    <p>Phone: {clientData.phoneNumbers[0]}</p>
                  )}
                  {clientData.emailAddresses && clientData.emailAddresses.length > 0 && (
                    <p>Email: {clientData.emailAddresses[0]}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ship To */}
          <div className="border border-gray-400">
            <div className="bg-blue-600 text-white p-2">
              <h3 className="font-bold text-sm">SHIP TO</h3>
            </div>
            <div className="p-3">
              <div className="flex items-start space-x-3">
                {clientData.logoUrl && (
                  <img 
                    src={clientData.logoUrl} 
                    alt={clientData.name}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <div className="text-xs">
                  <p className="font-bold text-sm">{clientData.name}</p>
                  <p>{clientData.contactPerson}</p>
                  <p>{clientData.billToAddress}</p>
                  <p>{clientData.billToCity}, {clientData.billToState} {clientData.billToZipCode}</p>
                  <p>{clientData.billToCountry}</p>
                  {clientData.phoneNumbers && clientData.phoneNumbers.length > 0 && (
                    <p>Phone: {clientData.phoneNumbers[0]}</p>
                  )}
                  {clientData.emailAddresses && clientData.emailAddresses.length > 0 && (
                    <p>Email: {clientData.emailAddresses[0]}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Header */}
        <div className="mb-4">
          <div className="bg-yellow-500 text-black p-2 text-center font-bold text-sm">
            Contingent Staffing ::: Offshore Recruiting & Development
          </div>
        </div>

        {/* Main Service Table */}
        <div className="mb-6">
          {timesheetDetails.overtimeHours && timesheetDetails.overtimeHours > 0 ? (
            // Show overtime breakdown table when overtime exists
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="border border-gray-400 p-2 text-left font-bold">DESCRIPTION</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">REGULAR HOURS</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">OVERTIME HOURS</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">TOTAL HOURS</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">HOURLY RATE</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {/* Candidate Description */}
                <tr>
                  <td className="border border-gray-400 p-3">
                    <div>
                      <p className="font-semibold text-sm">
                        1. {invoice.candidateName}: {invoice.candidateName} has joined {clientData.name}, effective
                      </p>
                      <p className="text-xs mt-1">
                        {formatDate(invoice.weekStartDate)}, and has been deployed at {billingData?.endUserName || clientData.name}, one of {clientData.name}'s
                      </p>
                      <p className="text-xs">
                        key clients, in the role of {billingData?.employmentType || 'Developer/Analyst'}.
                      </p>
                    </div>
                  </td>
                  <td className="border border-gray-400 p-2 text-center"></td>
                  <td className="border border-gray-400 p-2 text-center"></td>
                  <td className="border border-gray-400 p-2 text-center"></td>
                  <td className="border border-gray-400 p-2 text-center"></td>
                  <td className="border border-gray-400 p-2 text-center"></td>
                </tr>

                {/* Task Details with Overtime Breakdown */}
                <tr>
                  <td className="border border-gray-400 p-3 pl-8">
                    <p className="text-xs">
                      Task performed during {formatDate(invoice.weekStartDate)} to {formatDate(invoice.weekEndDate)}
                    </p>
                  </td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {(timesheetDetails.regularHours || 0).toFixed(2)}
                  </td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {(timesheetDetails.overtimeHours || 0).toFixed(2)}
                  </td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {invoice.totalHours.toFixed(2)}
                  </td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {formatCurrency(invoice.hourlyRate, 'USD')}
                  </td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {formatCurrency(invoice.totalAmount, 'USD')}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            // Show simple table when no overtime
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="border border-gray-400 p-2 text-left font-bold">DESCRIPTION</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">HOURS</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">HOURLY RATE</th>
                  <th className="border border-gray-400 p-2 text-center font-bold">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {/* Candidate Description */}
                <tr>
                  <td className="border border-gray-400 p-3">
                    <div>
                      <p className="font-semibold text-sm">
                        1. {invoice.candidateName}: {invoice.candidateName} has joined {clientData.name}, effective
                      </p>
                      <p className="text-xs mt-1">
                        {formatDate(invoice.weekStartDate)}, and has been deployed at {billingData?.endUserName || clientData.name}, one of {clientData.name}'s
                      </p>
                      <p className="text-xs">
                        key clients, in the role of {billingData?.employmentType || 'Developer/Analyst'}.
                      </p>
                    </div>
                  </td>
                  <td className="border border-gray-400 p-2 text-center"></td>
                  <td className="border border-gray-400 p-2 text-center"></td>
                  <td className="border border-gray-400 p-2 text-center"></td>
                </tr>

                {/* Task Details */}
                <tr>
                  <td className="border border-gray-400 p-3 pl-8">
                    <p className="text-xs">
                      Task performed during {formatDate(invoice.weekStartDate)} to {formatDate(invoice.weekEndDate)}
                    </p>
                  </td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {invoice.totalHours.toFixed(2)}
                  </td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {formatCurrency(invoice.hourlyRate, 'USD')}
                  </td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {formatCurrency(invoice.totalAmount, 'USD')}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Summary and Currency Conversion */}
        <div className="flex">
          {/* Left Side - Currency Conversion Details */}
          <div className="w-1/2 pr-4">
            <CurrencyRatesDisplay sixMonthAverageRate={invoice.sixMonthAverageRate} currentRate={invoice.currencyConversionRate} />
          </div>

          {/* Right Side - Calculation */}
          <div className="w-1/2">
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 text-right font-semibold">SUBTOTAL</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">
                    {formatCurrency(invoice.totalAmount, 'USD')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 text-right">DISCOUNT</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(0, 'USD')}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 text-right">SUBTOTAL LESS DISCOUNT</td>
                  <td className="border border-gray-400 p-2 text-right font-semibold">
                    {formatCurrency(invoice.totalAmount, 'USD')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 text-right">GOODS & SERVICES TAX RATE</td>
                  <td className="border border-gray-400 p-2 text-right">{invoice.gstRate.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 text-right">TOTAL TAX</td>
                  <td className="border border-gray-400 p-2 text-right">
                    {formatCurrency(invoice.gstAmount, 'USD')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 text-right">SHIPPING/HANDLING</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(0, 'USD')}</td>
                </tr>
                <tr className="bg-red-100">
                  <td className="border border-gray-400 p-2 text-right font-bold">Balance Due</td>
                  <td className="border border-gray-400 p-2 text-right font-bold text-lg">
                    {formatCurrency(invoice.totalWithGst, 'USD')}
                  </td>
                </tr>
                <tr className="bg-red-200">
                  <td className="border border-gray-400 p-2 text-center font-bold text-lg" colSpan={2}>
                    INR {formatCurrency(invoice.totalWithGst * invoice.currencyConversionRate, 'INR').replace('₹', '')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-600">
          <div className="flex justify-between">
            <div>
              <h4 className="font-bold mb-2">Currency Conversion Details</h4>
              <p>Original Amount (INR): {formatCurrency(invoice.amountINR, 'INR')}</p>
              <p>Current USD/INR Rate: {invoice.currencyConversionRate.toFixed(4)}</p>
              <p>6-Month Average Rate: {invoice.sixMonthAverageRate.toFixed(4)}</p>
              <p className="font-semibold">Converted Amount (USD): {formatCurrency(invoice.totalAmount, 'USD')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Payment Terms</h4>
              <ul className="space-y-1">
                <li>• Payment due within 30 days</li>
                <li>• All amounts in US Dollars (USD)</li>
                <li>• Wire transfer preferred</li>
                <li>• Late payments subject to 1.5% monthly charge</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InvoiceTemplateNew.displayName = 'InvoiceTemplateNew';

export default InvoiceTemplateNew;