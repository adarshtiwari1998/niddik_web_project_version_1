import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, FileText, Plus, Save, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import BillingConfig from "@/components/BillingConfig";
import AdminLayout from "@/components/layout/AdminLayout";
import { Helmet } from 'react-helmet-async';

interface CandidateBilling {
  id: number;
  candidateId: number;
  hourlyRate: number;
  workingHoursPerWeek: number;
  currency: string;
  isActive: boolean;
}

interface WeeklyTimesheet {
  id: number;
  candidateId: number;
  candidateName?: string;
  candidateEmail?: string;
  weekStartDate: string;
  weekEndDate: string;
  mondayHours: number;
  tuesdayHours: number;
  wednesdayHours: number;
  thursdayHours: number;
  fridayHours: number;
  saturdayHours: number;
  sundayHours: number;
  totalWeeklyHours: number;
  totalWeeklyAmount: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  candidateId: number;
  candidateName?: string;
  candidateEmail?: string;
  timesheetId?: number;
  weekStartDate: string;
  weekEndDate: string;
  totalHours: number;
  hourlyRate: number;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  pdfUrl?: string;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
}

export default function TimesheetManagement() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("timesheets");
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const today = new Date();
    return format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  });
  const [timesheetData, setTimesheetData] = useState({
    mondayHours: 0,
    tuesdayHours: 0,
    wednesdayHours: 0,
    thursdayHours: 0,
    fridayHours: 0,
    saturdayHours: 0,
    sundayHours: 0
  });

  const isAdmin = user?.role === 'admin';

  // Fetch candidate billing info
  const { data: billing } = useQuery({
    queryKey: ['/api/candidate-billing', user?.id],
    enabled: !!user?.id && !isAdmin
  });

  // Fetch timesheets for candidate
  const { data: candidateTimesheets, isLoading: timesheetsLoading } = useQuery({
    queryKey: ['/api/timesheets/candidate', user?.id],
    enabled: !!user?.id && !isAdmin
  });

  // Fetch all timesheets for admin
  const { data: adminTimesheets, isLoading: adminTimesheetsLoading } = useQuery({
    queryKey: ['/api/admin/timesheets'],
    enabled: isAdmin
  });

  // Fetch specific timesheet for the selected week
  const { data: weekTimesheet } = useQuery({
    queryKey: ['/api/timesheets', user?.id, selectedWeek],
    enabled: !!user?.id && !!selectedWeek && !isAdmin
  });

  // Fetch invoices for candidate
  const { data: candidateInvoices } = useQuery({
    queryKey: ['/api/invoices/candidate', user?.id],
    enabled: !!user?.id && !isAdmin
  });

  // Fetch all invoices for admin
  const { data: adminInvoices } = useQuery({
    queryKey: ['/api/admin/invoices'],
    enabled: isAdmin
  });

  // Create timesheet mutation
  const createTimesheetMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/timesheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create timesheet');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Timesheet submitted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/timesheets/candidate'] });
      setTimesheetData({
        mondayHours: 0,
        tuesdayHours: 0,
        wednesdayHours: 0,
        thursdayHours: 0,
        fridayHours: 0,
        saturdayHours: 0,
        sundayHours: 0
      });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Approve timesheet mutation
  const approveTimesheetMutation = useMutation({
    mutationFn: async (timesheetId: number) => {
      const response = await fetch(`/api/admin/timesheets/${timesheetId}/approve`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to approve timesheet');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Timesheet approved successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/timesheets'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Reject timesheet mutation
  const rejectTimesheetMutation = useMutation({
    mutationFn: async ({ timesheetId, reason }: { timesheetId: number; reason: string }) => {
      const response = await fetch(`/api/admin/timesheets/${timesheetId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rejectionReason: reason })
      });
      if (!response.ok) throw new Error('Failed to reject timesheet');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Timesheet rejected" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/timesheets'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSubmitTimesheet = () => {
    if (!user?.id || !selectedWeek || !billing) return;

    const weekStart = new Date(selectedWeek);
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    createTimesheetMutation.mutate({
      candidateId: user.id,
      weekStartDate: format(weekStart, 'yyyy-MM-dd'),
      weekEndDate: format(weekEnd, 'yyyy-MM-dd'),
      ...timesheetData
    });
  };

  const handleHoursChange = (day: string, hours: string) => {
    const numHours = Math.max(0, Math.min(24, parseFloat(hours) || 0));
    setTimesheetData(prev => ({
      ...prev,
      [`${day}Hours`]: numHours
    }));
  };

  const getTotalHours = () => {
    return Object.values(timesheetData).reduce((sum, hours) => sum + hours, 0);
  };

  const getEstimatedAmount = () => {
    if (!billing) return 0;
    return getTotalHours() * billing.hourlyRate;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: "Draft", variant: "secondary" as const },
      submitted: { label: "Submitted", variant: "default" as const },
      approved: { label: "Approved", variant: "default" as const },
      rejected: { label: "Rejected", variant: "destructive" as const },
      sent: { label: "Sent", variant: "default" as const },
      paid: { label: "Paid", variant: "default" as const },
      overdue: { label: "Overdue", variant: "destructive" as const }
    };
    const config = statusMap[status] || { label: status, variant: "secondary" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!user) {
    return <div>Please log in to access timesheet management.</div>;
  }

  if (!isAdmin && (!billing || !billing.hasHiredApplication)) {
    return (
      <AdminLayout title="Timesheet Management" description="Configure billing to access timesheet management">
        <Helmet>
          <title>Timesheet Management | Niddik Admin</title>
          <meta name="description" content="Manage candidate timesheets, billing configuration, and invoice generation." />
          <meta property="og:title" content="Timesheet Management | Niddik Admin" />
          <meta property="og:description" content="Manage candidate timesheets, billing configuration, and invoice generation." />
        </Helmet>
        <Card>
          <CardHeader>
            <CardTitle>Timesheet Management</CardTitle>
            <CardDescription>
              {!billing?.hasHiredApplication ? 
                "Timesheet management is only available for hired candidates. You need to be hired for a position to access this feature." :
                "Your billing configuration is not set up yet. Please contact your administrator to configure your hourly rate."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {!billing?.hasHiredApplication ? "Not Available" : "Billing Setup Required"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {!billing?.hasHiredApplication ? 
                  "Once you are hired for a position, you'll be able to submit weekly timesheets and track your working hours here." :
                  "Contact your administrator to set up your billing configuration and start submitting timesheets."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Timesheet Management" description="Manage timesheets and invoices for all candidates">
      <Helmet>
        <title>Timesheet Management | Niddik Admin</title>
        <meta name="description" content="Manage candidate timesheets, billing configuration, and invoice generation." />
        <meta property="og:title" content="Timesheet Management | Niddik Admin" />
        <meta property="og:description" content="Manage candidate timesheets, billing configuration, and invoice generation." />
      </Helmet>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timesheets">
            <Clock className="w-4 h-4 mr-2" />
            Timesheets
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <FileText className="w-4 h-4 mr-2" />
            Invoices
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="billing">
              <DollarSign className="w-4 h-4 mr-2" />
              Billing Config
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="timesheets" className="space-y-6">
          {!isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Submit New Timesheet
                </CardTitle>
                <CardDescription>
                  Enter your working hours for the selected week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="week-select">Select Week</Label>
                    <Input
                      id="week-select"
                      type="date"
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="text-sm text-muted-foreground">
                      Week: {format(new Date(selectedWeek), 'MMM dd')} - {format(endOfWeek(new Date(selectedWeek), { weekStartsOn: 1 }), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day, index) => (
                    <div key={day} className="space-y-2">
                      <Label htmlFor={`${day}-hours`} className="capitalize">
                        {day.slice(0, 3)}
                      </Label>
                      <Input
                        id={`${day}-hours`}
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={timesheetData[`${day}Hours`]}
                        onChange={(e) => handleHoursChange(day, e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">Total Hours: {getTotalHours()}</div>
                    <div className="text-sm text-muted-foreground">
                      Estimated Amount: {billing?.currency} {getEstimatedAmount().toFixed(2)}
                    </div>
                  </div>
                  <Button 
                    onClick={handleSubmitTimesheet}
                    disabled={getTotalHours() === 0 || createTimesheetMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Submit Timesheet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                {isAdmin ? "All Timesheets" : "My Timesheets"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isAdmin ? (
                  adminTimesheets?.data?.map((timesheet: WeeklyTimesheet) => (
                    <div key={timesheet.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{timesheet.candidateName}</h4>
                          <p className="text-sm text-muted-foreground">{timesheet.candidateEmail}</p>
                        </div>
                        {getStatusBadge(timesheet.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Week:</span> {format(new Date(timesheet.weekStartDate), 'MMM dd')} - {format(new Date(timesheet.weekEndDate), 'MMM dd')}
                        </div>
                        <div>
                          <span className="font-medium">Total Hours:</span> {timesheet.totalWeeklyHours}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ${timesheet.totalWeeklyAmount?.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {timesheet.submittedAt ? format(new Date(timesheet.submittedAt), 'MMM dd, yyyy') : '-'}
                        </div>
                      </div>
                      {timesheet.status === 'submitted' && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() => approveTimesheetMutation.mutate(timesheet.id)}
                            disabled={approveTimesheetMutation.isPending}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Timesheet</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting this timesheet.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <textarea
                                  className="w-full p-3 border rounded-md"
                                  rows={3}
                                  placeholder="Rejection reason..."
                                  onChange={(e) => {
                                    const reason = e.target.value;
                                    if (reason.trim()) {
                                      rejectTimesheetMutation.mutate({ timesheetId: timesheet.id, reason });
                                    }
                                  }}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                      {timesheet.rejectionReason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                          <p className="text-sm text-red-700">{timesheet.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  candidateTimesheets?.data?.map((timesheet: WeeklyTimesheet) => (
                    <div key={timesheet.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">
                            Week: {format(new Date(timesheet.weekStartDate), 'MMM dd')} - {format(new Date(timesheet.weekEndDate), 'MMM dd, yyyy')}
                          </h4>
                        </div>
                        {getStatusBadge(timesheet.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Total Hours:</span> {timesheet.totalWeeklyHours}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ${timesheet.totalWeeklyAmount?.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {timesheet.submittedAt ? format(new Date(timesheet.submittedAt), 'MMM dd, yyyy') : '-'}
                        </div>
                      </div>
                      {timesheet.rejectionReason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                          <p className="text-sm text-red-700">{timesheet.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {(isAdmin ? adminTimesheetsLoading : timesheetsLoading) && (
                  <div className="text-center py-4">Loading timesheets...</div>
                )}

                {(isAdmin ? !adminTimesheets?.data?.length : !candidateTimesheets?.data?.length) && 
                 !(isAdmin ? adminTimesheetsLoading : timesheetsLoading) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No timesheets found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isAdmin ? "All Invoices" : "My Invoices"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(isAdmin ? adminInvoices?.data : candidateInvoices?.data)?.map((invoice: Invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Invoice #{invoice.invoiceNumber}</h4>
                        {isAdmin && (
                          <p className="text-sm text-muted-foreground">{invoice.candidateName} - {invoice.candidateEmail}</p>
                        )}
                      </div>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Week:</span> {format(new Date(invoice.weekStartDate), 'MMM dd')} - {format(new Date(invoice.weekEndDate), 'MMM dd')}
                      </div>
                      <div>
                        <span className="font-medium">Hours:</span> {invoice.totalHours}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> {invoice.currency} {invoice.totalAmount.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span> {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    {invoice.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {invoice.notes}
                      </div>
                    )}
                  </div>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    No invoices found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="billing" className="space-y-6">
            <BillingConfig />
          </TabsContent>
        )}
      </Tabs>
    </AdminLayout>
  );
}