import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrencyConversionDialog } from "@/components/CurrencyConversionDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, FileText, Plus, Save, Check, X, Edit, Trash2, Building, Filter, User, ChevronDown, CalendarIcon, RotateCcw, Edit2, Receipt, Download, Printer } from "lucide-react";
import InvoiceDialog from "@/components/InvoiceDialog";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth, subWeeks, addWeeks, parseISO, startOfYear, endOfYear, eachWeekOfInterval } from "date-fns";
import BillingConfig from "@/components/BillingConfig";
import AdminLayout from "@/components/layout/AdminLayout";
import { Helmet } from 'react-helmet-async';

interface CandidateBilling {
  id: number;
  candidateId: number;
  hourlyRate: number;
  workingHoursPerWeek: number;
  workingDaysPerWeek: number;
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

interface BiWeeklyTimesheet {
  id: number;
  candidateId: number;
  candidateName?: string;
  candidateEmail?: string;
  periodStartDate: string;
  periodEndDate: string;
  totalHours: string;
  totalAmount: string;
  week1StartDate: string;
  week1EndDate: string;
  week1TotalHours: string;
  week1TotalAmount: string;
  week2StartDate: string;
  week2EndDate: string;
  week2TotalHours: string;
  week2TotalAmount: string;
  mondayHours: string;
  tuesdayHours: string;
  wednesdayHours: string;
  thursdayHours: string;
  fridayHours: string;
  saturdayHours: string;
  sundayHours: string;
  status: 'calculated' | 'reviewed';
  createdAt: string;
  currency?: string;
}

interface MonthlyTimesheet {
  id: number;
  candidateId: number;
  candidateName?: string;
  candidateEmail?: string;
  year: number;
  month: number;
  monthName: string;
  periodStartDate: string;
  periodEndDate: string;
  totalHours: string;
  totalAmount: string;
  totalWeeks: number;
  mondayHours: string;
  tuesdayHours: string;
  wednesdayHours: string;
  thursdayHours: string;
  fridayHours: string;
  saturdayHours: string;
  sundayHours: string;
  status: 'calculated' | 'reviewed';
  createdAt: string;
  currency?: string;
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

  // Admin timesheet view states
  const [adminViewMode, setAdminViewMode] = useState<'weekly' | 'bi-weekly' | 'monthly'>('weekly');
  const [selectedCandidate, setSelectedCandidate] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(() => {
    const today = new Date();
    return format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  });

  // Invoice generation states
  const [selectedTimesheetForInvoice, setSelectedTimesheetForInvoice] = useState<number | null>(null);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedBiWeeklyTimesheetForInvoice, setSelectedBiWeeklyTimesheetForInvoice] = useState<number | null>(null);
  const [biWeeklyInvoiceDialogOpen, setBiWeeklyInvoiceDialogOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  // Helper functions for admin timesheet filtering and grouping
  const getFilteredTimesheets = () => {
    if (!isAdmin || !adminTimesheets?.data) return [];
    
    let filtered = adminTimesheets.data;
    
    // Filter by candidate
    if (selectedCandidate !== 'all') {
      filtered = filtered.filter((ts: WeeklyTimesheet) => ts.candidateId.toString() === selectedCandidate);
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((ts: WeeklyTimesheet) => ts.status === selectedStatus);
    }
    
    return filtered;
  };

  const getGroupedTimesheets = () => {
    const filtered = getFilteredTimesheets();
    
    if (adminViewMode === 'weekly') {
      return filtered;
    }
    
    if (adminViewMode === 'bi-weekly') {
      // Group by bi-weekly periods
      const grouped = new Map();
      filtered.forEach((ts: WeeklyTimesheet) => {
        const weekStart = parseISO(ts.weekStartDate);
        const biWeeklyKey = format(startOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        
        if (!grouped.has(biWeeklyKey)) {
          grouped.set(biWeeklyKey, []);
        }
        grouped.get(biWeeklyKey).push(ts);
      });
      
      return Array.from(grouped.entries()).map(([key, timesheets]) => ({
        period: key,
        type: 'bi-weekly',
        timesheets: timesheets.slice(0, 2), // Limit to 2 weeks
        totalHours: timesheets.slice(0, 2).reduce((sum: number, ts: WeeklyTimesheet) => sum + ts.totalWeeklyHours, 0),
        totalAmount: timesheets.slice(0, 2).reduce((sum: number, ts: WeeklyTimesheet) => sum + parseFloat(ts.totalWeeklyAmount || '0'), 0)
      }));
    }
    
    if (adminViewMode === 'monthly') {
      // Group by month
      const grouped = new Map();
      filtered.forEach((ts: WeeklyTimesheet) => {
        const weekStart = parseISO(ts.weekStartDate);
        const monthKey = format(weekStart, 'yyyy-MM');
        
        if (!grouped.has(monthKey)) {
          grouped.set(monthKey, []);
        }
        grouped.get(monthKey).push(ts);
      });
      
      return Array.from(grouped.entries()).map(([key, timesheets]) => ({
        period: key,
        type: 'monthly',
        timesheets,
        totalHours: timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + ts.totalWeeklyHours, 0),
        totalAmount: timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + parseFloat(ts.totalWeeklyAmount || '0'), 0)
      }));
    }
    
    return filtered;
  };

  // Fetch candidate billing info
  const { data: billing } = useQuery({
    queryKey: ['/api/candidate/billing-status'],
    enabled: !!user && !isAdmin
  });

  // Fetch candidate timesheets
  const { data: candidateTimesheets, isLoading: timesheetsLoading } = useQuery({
    queryKey: ['/api/timesheets/candidate', user?.id],
    enabled: !!user?.id && !isAdmin
  });

  // Fetch all timesheets for admin
  const { data: adminTimesheets, isLoading: adminTimesheetsLoading } = useQuery({
    queryKey: ['/api/admin/timesheets', { status: 'all', limit: 1000 }],
    enabled: isAdmin
  });

  // Fetch hired candidates for admin filtering
  const { data: hiredCandidates } = useQuery({
    queryKey: ['/api/admin/hired-candidates'],
    enabled: isAdmin
  });

  // Fetch invoices
  const { data: adminInvoices } = useQuery({
    queryKey: ['/api/admin/invoices'],
    enabled: isAdmin
  });

  const { data: candidateInvoices } = useQuery({
    queryKey: ['/api/invoices/candidate', user?.id],
    enabled: !!user?.id && !isAdmin
  });

  // Fetch bi-weekly timesheets
  const { data: biWeeklyTimesheets } = useQuery({
    queryKey: ['/api/admin/biweekly-timesheets'],
    enabled: isAdmin && adminViewMode === 'bi-weekly'
  });

  const { data: candidateBiWeeklyTimesheets } = useQuery({
    queryKey: ['/api/biweekly-timesheets/candidate', user?.id],
    enabled: !!user?.id && !isAdmin
  });

  // Fetch monthly timesheets
  const { data: monthlyTimesheets } = useQuery({
    queryKey: ['/api/admin/monthly-timesheets'],
    enabled: isAdmin && adminViewMode === 'monthly'
  });

  const { data: candidateMonthlyTimesheets } = useQuery({
    queryKey: ['/api/monthly-timesheets/candidate', user?.id],
    enabled: !!user?.id && !isAdmin
  });

  // Mutations for timesheet operations
  const createTimesheetMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/timesheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create timesheet');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Timesheet submitted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/timesheets'] });
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

  const approveTimesheetMutation = useMutation({
    mutationFn: async (timesheetId: number) => {
      const response = await fetch(`/api/admin/timesheets/${timesheetId}/approve`, {
        method: 'PATCH'
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

  const rejectTimesheetMutation = useMutation({
    mutationFn: async ({ timesheetId, reason }: { timesheetId: number; reason: string }) => {
      const response = await fetch(`/api/admin/timesheets/${timesheetId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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

  const editTimesheetMutation = useMutation({
    mutationFn: async ({ timesheetId, data }: { timesheetId: number; data: any }) => {
      const response = await fetch(`/api/admin/timesheets/${timesheetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update timesheet');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Timesheet updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/biweekly-timesheets'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteTimesheetMutation = useMutation({
    mutationFn: async (timesheetId: number) => {
      const response = await fetch(`/api/admin/timesheets/${timesheetId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete timesheet');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Timesheet deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/biweekly-timesheets'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Status change mutation for approve/revert functionality
  const changeTimesheetStatusMutation = useMutation({
    mutationFn: async ({ timesheetId, status }: { timesheetId: number; status: string }) => {
      const response = await fetch(`/api/admin/timesheets/${timesheetId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update timesheet status');
      return response.json();
    },
    onSuccess: (data, variables) => {
      const statusMessage = variables.status === 'pending' ? 'reverted to pending' : `changed to ${variables.status}`;
      toast({ 
        title: "Success", 
        description: `Timesheet status ${statusMessage} successfully`,
        duration: 3000
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/biweekly-timesheets'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });



  // Helper functions
  const handleHoursChange = (day: string, value: string) => {
    const hours = Math.max(0, Math.min(24, parseFloat(value) || 0));
    setTimesheetData(prev => ({ ...prev, [`${day}Hours`]: hours }));
  };

  const getTotalHours = () => {
    return Object.values(timesheetData).reduce((sum, hours) => sum + hours, 0);
  };

  const getEstimatedAmount = () => {
    const hourlyRate = parseFloat(billing?.hourlyRate || '0');
    return getTotalHours() * hourlyRate;
  };

  const handleSubmitTimesheet = () => {
    const totalHours = getTotalHours();
    if (totalHours === 0) {
      toast({ title: "Error", description: "Please enter at least some hours", variant: "destructive" });
      return;
    }

    const weekStart = new Date(selectedWeek);
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    createTimesheetMutation.mutate({
      weekStartDate: format(weekStart, 'yyyy-MM-dd'),
      weekEndDate: format(weekEnd, 'yyyy-MM-dd'),
      totalWeeklyHours: totalHours,
      totalWeeklyAmount: getEstimatedAmount(),
      ...timesheetData
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' },
      submitted: { label: 'Submitted', variant: 'default' },
      approved: { label: 'Approved', variant: 'success' },
      rejected: { label: 'Rejected', variant: 'destructive' },
      sent: { label: 'Sent', variant: 'default' },
      paid: { label: 'Paid', variant: 'success' },
      overdue: { label: 'Overdue', variant: 'destructive' }
    };

    const config = statusConfig[status] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Timesheet Management - Niddik</title>
        <meta name="description" content="Manage timesheets and billing for candidates and employees" />
      </Helmet>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheet Management</h1>
          <p className="text-gray-600 mt-1">Manage employee timesheets, billing, and company settings</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/timesheets/companiesmanagement">
            <Button variant="outline" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company Management
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="billing-config">
            {isAdmin ? "Billing Configuration" : "My Billing"}
          </TabsTrigger>
          <TabsTrigger value="invoices">Invoice</TabsTrigger>
        </TabsList>

        <TabsContent value="billing-config" className="space-y-6">
          <BillingConfig />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoiceManagement setActiveTab={setActiveTab} />
        </TabsContent>

        <TabsContent value="timesheets" className="space-y-6">
          {!isAdmin && billing?.isActive && (
            <Card>
              <CardHeader>
                <CardTitle>Submit Weekly Timesheet</CardTitle>
                <CardDescription>
                  Submit your weekly hours for approval
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="week-select">Select Week</Label>
                  <Input
                    id="week-select"
                    type="date"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                  />
                  <div className="text-sm text-muted-foreground">
                    Week: {format(new Date(selectedWeek), 'MMM dd')} - {format(endOfWeek(new Date(selectedWeek), { weekStartsOn: 1 }), 'MMM dd, yyyy')}
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
              <CardTitle className="flex items-center justify-between">
                {isAdmin ? "Timesheet Management" : "My Timesheets"}
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Admin View</span>
                  </div>
                )}
              </CardTitle>
              {isAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {/* View Mode Selector */}
                  <div className="space-y-2">
                    <Label>View Mode</Label>
                    <Select value={adminViewMode} onValueChange={(value: 'weekly' | 'bi-weekly' | 'monthly') => setAdminViewMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Weekly View
                          </div>
                        </SelectItem>
                        <SelectItem value="bi-weekly">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Bi-Weekly View
                          </div>
                        </SelectItem>
                        <SelectItem value="monthly">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Monthly View
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Candidate Filter */}
                  <div className="space-y-2">
                    <Label>Candidate</Label>
                    <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            All Candidates
                          </div>
                        </SelectItem>
                        {hiredCandidates?.data?.map((candidate: any) => (
                          <SelectItem key={candidate.id} value={candidate.id.toString()}>
                            {candidate.fullName || candidate.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Period Filter */}
                  <div className="space-y-2">
                    <Label>
                      {adminViewMode === 'monthly' ? 'Month' : adminViewMode === 'bi-weekly' ? 'Bi-Week Period' : 'Week'}
                    </Label>
                    <Input
                      type={adminViewMode === 'monthly' ? 'month' : 'date'}
                      value={adminViewMode === 'monthly' ? selectedMonth : selectedTimePeriod}
                      onChange={(e) => {
                        if (adminViewMode === 'monthly') {
                          setSelectedMonth(e.target.value);
                        } else {
                          setSelectedTimePeriod(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isAdmin ? (
                  adminViewMode === 'weekly' ? (
                    <WeeklyTableView 
                      timesheets={getFilteredTimesheets()}
                      onApprove={(id) => changeTimesheetStatusMutation.mutate({ timesheetId: id, status: 'approved' })}
                      onReject={(id, reason) => rejectTimesheetMutation.mutate({ timesheetId: id, reason })}
                      onEdit={(id, data) => editTimesheetMutation.mutate({ timesheetId: id, data })}
                      onDelete={(id) => deleteTimesheetMutation.mutate(id)}
                      getStatusBadge={getStatusBadge}
                      isAdmin={true}
                      changeTimesheetStatusMutation={changeTimesheetStatusMutation}
                      setBiWeeklyInvoiceDialogOpen={setBiWeeklyInvoiceDialogOpen}
                      setSelectedBiWeeklyTimesheetForInvoice={setSelectedBiWeeklyTimesheetForInvoice}
                      biWeeklyInvoiceDialogOpen={biWeeklyInvoiceDialogOpen}
                      selectedBiWeeklyTimesheetForInvoice={selectedBiWeeklyTimesheetForInvoice}
                    />
                  ) : adminViewMode === 'bi-weekly' ? (
                    <BiWeeklyTableView
                      timesheets={biWeeklyTimesheets?.data || []}
                      onEdit={(id, data) => editTimesheetMutation.mutate({ timesheetId: id, data })}
                      onDelete={(id) => deleteTimesheetMutation.mutate(id)}
                      getStatusBadge={getStatusBadge}
                      isAdmin={true}
                      setSelectedBiWeeklyTimesheetForInvoice={setSelectedBiWeeklyTimesheetForInvoice}
                      setBiWeeklyInvoiceDialogOpen={setBiWeeklyInvoiceDialogOpen}
                      biWeeklyInvoiceDialogOpen={biWeeklyInvoiceDialogOpen}
                      selectedBiWeeklyTimesheetForInvoice={selectedBiWeeklyTimesheetForInvoice}
                    />
                  ) : adminViewMode === 'monthly' ? (
                    <MonthlyTableView
                      timesheets={getFilteredTimesheets()}
                      getStatusBadge={getStatusBadge}
                    />
                  ) : null
                ) : (
                  <WeeklyTableView 
                    timesheets={candidateTimesheets?.data || []}
                    getStatusBadge={getStatusBadge}
                    isCandidate={true}
                    setBiWeeklyInvoiceDialogOpen={() => {}}
                    setSelectedBiWeeklyTimesheetForInvoice={() => {}}
                    biWeeklyInvoiceDialogOpen={false}
                    selectedBiWeeklyTimesheetForInvoice={null}
                  />
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
      </Tabs>
    </AdminLayout>
  );
}

// Bi-Weekly Table View Component with Working Days Support and Dynamic Generation
function BiWeeklyTableView({ timesheets, onEdit, onDelete, getStatusBadge, isAdmin, setSelectedBiWeeklyTimesheetForInvoice, setBiWeeklyInvoiceDialogOpen, biWeeklyInvoiceDialogOpen, selectedBiWeeklyTimesheetForInvoice }: any) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch billing configuration to get working days
  const { data: billingData } = useQuery({
    queryKey: ['/api/admin/candidates-billing'],
  });

  // Fetch weekly timesheets to create dynamic bi-weekly view
  const { data: weeklyTimesheets } = useQuery({
    queryKey: ['/api/admin/timesheets'],
  });

  // Timeframe filtering state
  const [selectedTimeframe, setSelectedTimeframe] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Edit state for individual weekly timesheets within bi-weekly view
  const [editingWeeklyTimesheet, setEditingWeeklyTimesheet] = useState<number | null>(null);
  const [editWeeklyData, setEditWeeklyData] = useState<any>({});

  const getBillingConfig = (candidateId: number) => {
    return billingData?.data?.find((config: any) => config.candidateId === candidateId);
  };

  // Get available timeframe options based on weekly timesheets (bi-weekly periods)
  const getTimeframeOptions = () => {
    if (!weeklyTimesheets?.data) return [];
    
    const weeks = weeklyTimesheets.data.map((ts: any) => new Date(ts.weekStartDate));
    const uniqueWeeks = [...new Set(weeks.map(w => w.getTime()))].map(t => new Date(t));
    const sortedWeeks = uniqueWeeks.sort((a, b) => a.getTime() - b.getTime());
    
    // Create bi-weekly periods
    const biweeklyPeriods = [];
    for (let i = 0; i < sortedWeeks.length; i += 2) {
      const week1Start = sortedWeeks[i];
      const week2Start = sortedWeeks[i + 1];
      
      if (week1Start) {
        const periodStart = week1Start;
        const periodEnd = week2Start ? addDays(week2Start, 6) : addDays(week1Start, 6);
        
        biweeklyPeriods.push({
          value: periodStart,
          label: `Week of ${format(periodStart, 'MM/dd/yyyy')} to ${format(periodEnd, 'MM/dd/yyyy')}`
        });
      }
    }
    
    return biweeklyPeriods;
  };

  // Filter and group weekly timesheets into bi-weekly periods
  const getBiWeeklyData = () => {
    if (!weeklyTimesheets?.data) return [];
    
    let filteredTimesheets = weeklyTimesheets.data.filter((ts: any) => ts.status === 'approved');
    
    // Apply timeframe filter if selected (2-week period)
    if (selectedTimeframe) {
      const targetWeekStart = startOfWeek(selectedTimeframe, { weekStartsOn: 1 });
      const targetWeekEnd = endOfWeek(addDays(targetWeekStart, 13), { weekStartsOn: 1 }); // 2 weeks = 14 days
      
      filteredTimesheets = filteredTimesheets.filter((ts: any) => {
        const tsStart = new Date(ts.weekStartDate);
        return tsStart >= targetWeekStart && tsStart <= targetWeekEnd;
      });
    }

    // Group by candidate and create bi-weekly periods
    const groupedByCandidate = filteredTimesheets.reduce((acc: any, ts: any) => {
      if (!acc[ts.candidateId]) {
        acc[ts.candidateId] = [];
      }
      acc[ts.candidateId].push(ts);
      return acc;
    }, {});

    const biWeeklyData: any[] = [];
    
    Object.entries(groupedByCandidate).forEach(([candidateId, timesheets]: [string, any]) => {
      const sortedTimesheets = (timesheets as any[]).sort((a, b) => 
        new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime()
      );

      // Group consecutive weeks into bi-weekly periods
      for (let i = 0; i < sortedTimesheets.length; i += 2) {
        const week1 = sortedTimesheets[i];
        const week2 = sortedTimesheets[i + 1];
        
        // Only create bi-weekly record if we have at least one week of data
        if (week1) {
          const billingConfig = getBillingConfig(parseInt(candidateId));
          const workingDays = billingConfig?.workingDaysPerWeek || 5;
          
          // Calculate overtime totals
          const week1RegularHours = parseFloat(week1.mondayHours || 0) + parseFloat(week1.tuesdayHours || 0) + parseFloat(week1.wednesdayHours || 0) + parseFloat(week1.thursdayHours || 0) + parseFloat(week1.fridayHours || 0) + parseFloat(week1.saturdayHours || 0) + parseFloat(week1.sundayHours || 0);
          const week1OvertimeHours = parseFloat(week1.mondayOvertime || 0) + parseFloat(week1.tuesdayOvertime || 0) + parseFloat(week1.wednesdayOvertime || 0) + parseFloat(week1.thursdayOvertime || 0) + parseFloat(week1.fridayOvertime || 0) + parseFloat(week1.saturdayOvertime || 0) + parseFloat(week1.sundayOvertime || 0);
          const week1RegularAmount = parseFloat(week1.totalRegularAmount || 0);
          const week1OvertimeAmount = parseFloat(week1.totalOvertimeAmount || 0);

          const week2RegularHours = week2 ? (parseFloat(week2.mondayHours || 0) + parseFloat(week2.tuesdayHours || 0) + parseFloat(week2.wednesdayHours || 0) + parseFloat(week2.thursdayHours || 0) + parseFloat(week2.fridayHours || 0) + parseFloat(week2.saturdayHours || 0) + parseFloat(week2.sundayHours || 0)) : 0;
          const week2OvertimeHours = week2 ? (parseFloat(week2.mondayOvertime || 0) + parseFloat(week2.tuesdayOvertime || 0) + parseFloat(week2.wednesdayOvertime || 0) + parseFloat(week2.thursdayOvertime || 0) + parseFloat(week2.fridayOvertime || 0) + parseFloat(week2.saturdayOvertime || 0) + parseFloat(week2.sundayOvertime || 0)) : 0;
          const week2RegularAmount = week2 ? parseFloat(week2.totalRegularAmount || 0) : 0;
          const week2OvertimeAmount = week2 ? parseFloat(week2.totalOvertimeAmount || 0) : 0;

          const totalRegularHours = week1RegularHours + week2RegularHours;
          const totalOvertimeHours = week1OvertimeHours + week2OvertimeHours;
          const totalRegularAmount = week1RegularAmount + week2RegularAmount;
          const totalOvertimeAmount = week1OvertimeAmount + week2OvertimeAmount;

          biWeeklyData.push({
            id: `bi-${candidateId}-${i}`,
            candidateId: parseInt(candidateId),
            candidateName: week1.candidateName,
            candidateEmail: week1.candidateEmail,
            week1Data: week1,
            week2Data: week2 || null, // Only include week2 if it exists
            totalHours: (totalRegularHours + totalOvertimeHours).toFixed(2),
            totalAmount: (totalRegularAmount + totalOvertimeAmount).toFixed(2),
            totalRegularHours: totalRegularHours.toFixed(2),
            totalOvertimeHours: totalOvertimeHours.toFixed(2),
            totalRegularAmount: totalRegularAmount.toFixed(2),
            totalOvertimeAmount: totalOvertimeAmount.toFixed(2),
            workingDays,
            periodStart: week1.weekStartDate,
            periodEnd: week2 ? week2.weekEndDate : week1.weekEndDate
          });
        }
      }
    });

    return biWeeklyData;
  };

  const biWeeklyData = getBiWeeklyData();
  const timeframeOptions = getTimeframeOptions();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Bi-Weekly Timesheets</h3>
        <div className="text-sm text-muted-foreground">
          Dynamically created from approved weekly timesheets
        </div>
      </div>

      {/* Timeframe Filter */}
      <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <Label className="font-medium">Timeframe</Label>
        <Select
          value={selectedTimeframe ? format(selectedTimeframe, 'yyyy-MM-dd') : 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              setSelectedTimeframe(undefined);
            } else {
              setSelectedTimeframe(new Date(value));
            }
          }}
        >
          <SelectTrigger className="w-80">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Timeframes</SelectItem>
            {timeframeOptions.map((option) => (
              <SelectItem key={option.value.getTime()} value={format(option.value, 'yyyy-MM-dd')}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Compact Date Range Display */}
        <div className="border rounded-lg bg-white px-4 py-2 w-48">
          <div className="text-center">
            <div className="text-xs font-medium text-gray-600 mb-1">Current Range</div>
            <div className="text-sm font-medium text-green-600">
              {selectedTimeframe ? (
                <>
                  {format(selectedTimeframe, 'MMM d')} - {format(addDays(selectedTimeframe, 13), 'MMM d, yyyy')}
                </>
              ) : (
                'All Periods'
              )}
            </div>
          </div>
        </div>

        {selectedTimeframe && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTimeframe(undefined)}
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Bi-Weekly Timesheets List */}
      {biWeeklyData.length > 0 ? (
        biWeeklyData.map((biWeekly: any) => {
          const week1 = biWeekly.week1Data;
          const week2 = biWeekly.week2Data;

          // Define working days based on configuration
          const getWeekDaysData = (weekData: any) => {
            if (!weekData) return [];
            
            const baseData = [
              { 
                day: 'Mon (Total)', 
                regularHours: weekData.mondayHours, 
                overtimeHours: weekData.mondayOvertime || 0,
                totalHours: (parseFloat(weekData.mondayHours || 0) + parseFloat(weekData.mondayOvertime || 0))
              },
              { 
                day: 'Tue (Total)', 
                regularHours: weekData.tuesdayHours, 
                overtimeHours: weekData.tuesdayOvertime || 0,
                totalHours: (parseFloat(weekData.tuesdayHours || 0) + parseFloat(weekData.tuesdayOvertime || 0))
              },
              { 
                day: 'Wed (Total)', 
                regularHours: weekData.wednesdayHours, 
                overtimeHours: weekData.wednesdayOvertime || 0,
                totalHours: (parseFloat(weekData.wednesdayHours || 0) + parseFloat(weekData.wednesdayOvertime || 0))
              },
              { 
                day: 'Thu (Total)', 
                regularHours: weekData.thursdayHours, 
                overtimeHours: weekData.thursdayOvertime || 0,
                totalHours: (parseFloat(weekData.thursdayHours || 0) + parseFloat(weekData.thursdayOvertime || 0))
              },
              { 
                day: 'Fri (Total)', 
                regularHours: weekData.fridayHours, 
                overtimeHours: weekData.fridayOvertime || 0,
                totalHours: (parseFloat(weekData.fridayHours || 0) + parseFloat(weekData.fridayOvertime || 0))
              },
              { 
                day: 'Sat (Total)', 
                regularHours: weekData.saturdayHours, 
                overtimeHours: weekData.saturdayOvertime || 0,
                totalHours: (parseFloat(weekData.saturdayHours || 0) + parseFloat(weekData.saturdayOvertime || 0)),
                isWorking: biWeekly.workingDays === 6 
              }
            ];
            return baseData.filter(day => day.isWorking !== false);
          };

          const week1Data = getWeekDaysData(week1);
          const week2Data = week2 ? getWeekDaysData(week2) : [];

          // Get billing configuration for employment type
          const billingConfig = getBillingConfig(biWeekly.candidateId);
          const isFullTime = billingConfig?.employmentType === 'fulltime';

          return (
            <div key={biWeekly.id} className="border rounded-lg overflow-hidden">
              {/* Header with candidate info and status */}
              <div className="bg-blue-50 p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">{biWeekly.candidateName}</h3>
                    <p className="text-sm text-muted-foreground">{biWeekly.candidateEmail}</p>
                    <p className="text-sm font-medium mt-1">
                      Bi-Weekly Period: {format(new Date(biWeekly.periodStart), 'M/d/yyyy')} - {format(new Date(biWeekly.periodEnd), 'M/d/yyyy')}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Working Days: {biWeekly.workingDays} days/week • Employment: {billingConfig?.employmentType || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      calculated
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">Total Hours: {biWeekly.totalHours}</p>
                      <p className="text-sm text-muted-foreground">Total Amount: INR {biWeekly.totalAmount}</p>
                    </div>
                    
                    {/* Edit and Delete Buttons for Admin */}
                    {isAdmin && onEdit && onDelete && (
                      <div className="flex gap-2">
                        {editingWeeklyTimesheet !== biWeekly.week1Data?.id ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Set editing state for week 1
                              if (biWeekly.week1Data?.id) {
                                setEditingWeeklyTimesheet(biWeekly.week1Data.id);
                                setEditWeeklyData({
                                  mondayHours: biWeekly.week1Data.mondayHours,
                                  tuesdayHours: biWeekly.week1Data.tuesdayHours,
                                  wednesdayHours: biWeekly.week1Data.wednesdayHours,
                                  thursdayHours: biWeekly.week1Data.thursdayHours,
                                  fridayHours: biWeekly.week1Data.fridayHours,
                                  saturdayHours: biWeekly.week1Data.saturdayHours,
                                  sundayHours: biWeekly.week1Data.sundayHours,
                                  mondayOvertime: biWeekly.week1Data.mondayOvertime,
                                  tuesdayOvertime: biWeekly.week1Data.tuesdayOvertime,
                                  wednesdayOvertime: biWeekly.week1Data.wednesdayOvertime,
                                  thursdayOvertime: biWeekly.week1Data.thursdayOvertime,
                                  fridayOvertime: biWeekly.week1Data.fridayOvertime,
                                  saturdayOvertime: biWeekly.week1Data.saturdayOvertime,
                                  sundayOvertime: biWeekly.week1Data.sundayOvertime
                                });
                              }
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit Week 1
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Save changes for week 1
                                if (biWeekly.week1Data?.id) {
                                  onEdit(biWeekly.week1Data.id, editWeeklyData);
                                  setEditingWeeklyTimesheet(null);
                                  setEditWeeklyData({});
                                }
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Cancel editing week 1
                                setEditingWeeklyTimesheet(null);
                                setEditWeeklyData({});
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                        
                        {biWeekly.week2Data?.id && editingWeeklyTimesheet !== biWeekly.week2Data?.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Set editing state for week 2
                              setEditingWeeklyTimesheet(biWeekly.week2Data.id);
                              setEditWeeklyData({
                                mondayHours: biWeekly.week2Data.mondayHours,
                                tuesdayHours: biWeekly.week2Data.tuesdayHours,
                                wednesdayHours: biWeekly.week2Data.wednesdayHours,
                                thursdayHours: biWeekly.week2Data.thursdayHours,
                                fridayHours: biWeekly.week2Data.fridayHours,
                                saturdayHours: biWeekly.week2Data.saturdayHours,
                                sundayHours: biWeekly.week2Data.sundayHours,
                                mondayOvertime: biWeekly.week2Data.mondayOvertime,
                                tuesdayOvertime: biWeekly.week2Data.tuesdayOvertime,
                                wednesdayOvertime: biWeekly.week2Data.wednesdayOvertime,
                                thursdayOvertime: biWeekly.week2Data.thursdayOvertime,
                                fridayOvertime: biWeekly.week2Data.fridayOvertime,
                                saturdayOvertime: biWeekly.week2Data.saturdayOvertime,
                                sundayOvertime: biWeekly.week2Data.sundayOvertime
                              });
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit Week 2
                          </Button>
                        )}

                        {biWeekly.week2Data?.id && editingWeeklyTimesheet === biWeekly.week2Data?.id && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Save changes for week 2
                                onEdit(biWeekly.week2Data.id, editWeeklyData);
                                setEditingWeeklyTimesheet(null);
                                setEditWeeklyData({});
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Cancel editing week 2
                                setEditingWeeklyTimesheet(null);
                                setEditWeeklyData({});
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Bi-Weekly Timesheets</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the underlying weekly timesheets for this bi-weekly period? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline">Cancel</Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => {
                                  // Delete both weekly timesheets that make up this bi-weekly period
                                  if (biWeekly.week1Data?.id) {
                                    onDelete(biWeekly.week1Data.id);
                                  }
                                  if (biWeekly.week2Data?.id) {
                                    onDelete(biWeekly.week2Data.id);
                                  }
                                }}
                              >
                                Delete Timesheets
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-green-500 text-white">
                      <th className="border border-gray-300 p-3 text-left font-medium">Day of Week</th>
                      <th className="border border-gray-300 p-3 text-center font-medium">Regular<br/>[h:mm]</th>
                      <th className="border border-gray-300 p-3 text-center font-medium">Overtime<br/>[h:mm]</th>
                      {isFullTime && (
                        <>
                          <th className="border border-gray-300 p-3 text-center font-medium">Sick<br/>[h:mm]</th>
                          <th className="border border-gray-300 p-3 text-center font-medium">Paid Leave<br/>[h:mm]</th>
                          <th className="border border-gray-300 p-3 text-center font-medium">Unpaid Leave<br/>[h:mm]</th>
                        </>
                      )}
                      <th className="border border-gray-300 p-3 text-center font-medium bg-gray-600">TOTAL<br/>[h:mm]</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Week 1 Header */}
                    <tr className="bg-blue-100 font-semibold">
                      <td colSpan={isFullTime ? 7 : 4} className="border border-gray-300 p-2 text-center text-gray-800">
                        Week 1: {format(new Date(week1.weekStartDate), 'M/d')} - {format(new Date(week1.weekEndDate), 'M/d')}
                      </td>
                    </tr>
                    {/* Week 1 Data */}
                    {week1Data.map((dayData, index) => {
                      const dayKey = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][index];
                      const isEditing = editingWeeklyTimesheet === biWeekly.week1Data?.id;
                      const regularHoursKey = `${dayKey}Hours`;
                      const overtimeHoursKey = `${dayKey}Overtime`;
                      
                      return (
                        <tr key={`week1-${index}`} className="bg-blue-50">
                          <td className="border border-gray-300 p-3 font-medium">{dayData.day}</td>
                          <td className="border border-gray-300 p-3 text-center">
                            {isEditing ? (
                              <Input
                                type="number"
                                min="0"
                                max="24"
                                step="0.1"
                                value={editWeeklyData[regularHoursKey] || 0}
                                onChange={(e) => setEditWeeklyData(prev => ({
                                  ...prev,
                                  [regularHoursKey]: parseFloat(e.target.value) || 0
                                }))}
                                className="w-20 text-center text-sm"
                              />
                            ) : (
                              parseFloat(dayData.regularHours || 0).toFixed(2)
                            )}
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            {isEditing ? (
                              <Input
                                type="number"
                                min="0"
                                max="24"
                                step="0.1"
                                value={editWeeklyData[overtimeHoursKey] || 0}
                                onChange={(e) => setEditWeeklyData(prev => ({
                                  ...prev,
                                  [overtimeHoursKey]: parseFloat(e.target.value) || 0
                                }))}
                                className="w-20 text-center text-sm"
                              />
                            ) : (
                              parseFloat(dayData.overtimeHours || 0).toFixed(2)
                            )}
                          </td>
                          {isFullTime && (
                            <>
                              <td className="border border-gray-300 p-3 text-center">0.00</td>
                              <td className="border border-gray-300 p-3 text-center">0.00</td>
                              <td className="border border-gray-300 p-3 text-center">0.00</td>
                            </>
                          )}
                          <td className="border border-gray-300 p-3 text-center font-medium bg-gray-100">
                            {isEditing ? (
                              (parseFloat(editWeeklyData[regularHoursKey] || 0) + parseFloat(editWeeklyData[overtimeHoursKey] || 0)).toFixed(2)
                            ) : (
                              dayData.totalHours.toFixed(2)
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    
                    {/* Week 2 Header - Only show if week2 exists */}
                    {week2 && (
                      <>
                        <tr className="bg-green-100 font-semibold">
                          <td colSpan={isFullTime ? 7 : 4} className="border border-gray-300 p-2 text-center text-gray-800">
                            Week 2: {format(new Date(week2.weekStartDate), 'M/d')} - {format(new Date(week2.weekEndDate), 'M/d')}
                          </td>
                        </tr>
                        {/* Week 2 Data */}
                        {week2Data.map((dayData, index) => {
                          const dayKey = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][index];
                          const isEditing = editingWeeklyTimesheet === biWeekly.week2Data?.id;
                          const regularHoursKey = `${dayKey}Hours`;
                          const overtimeHoursKey = `${dayKey}Overtime`;
                          
                          return (
                            <tr key={`week2-${index}`} className="bg-green-50">
                              <td className="border border-gray-300 p-3 font-medium">{dayData.day}</td>
                              <td className="border border-gray-300 p-3 text-center">
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    min="0"
                                    max="24"
                                    step="0.1"
                                    value={editWeeklyData[regularHoursKey] || 0}
                                    onChange={(e) => setEditWeeklyData(prev => ({
                                      ...prev,
                                      [regularHoursKey]: parseFloat(e.target.value) || 0
                                    }))}
                                    className="w-20 text-center text-sm"
                                  />
                                ) : (
                                  parseFloat(dayData.regularHours || 0).toFixed(2)
                                )}
                              </td>
                              <td className="border border-gray-300 p-3 text-center">
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    min="0"
                                    max="24"
                                    step="0.1"
                                    value={editWeeklyData[overtimeHoursKey] || 0}
                                    onChange={(e) => setEditWeeklyData(prev => ({
                                      ...prev,
                                      [overtimeHoursKey]: parseFloat(e.target.value) || 0
                                    }))}
                                    className="w-20 text-center text-sm"
                                  />
                                ) : (
                                  parseFloat(dayData.overtimeHours || 0).toFixed(2)
                                )}
                              </td>
                              {isFullTime && (
                                <>
                                  <td className="border border-gray-300 p-3 text-center">0.00</td>
                                  <td className="border border-gray-300 p-3 text-center">0.00</td>
                                  <td className="border border-gray-300 p-3 text-center">0.00</td>
                                </>
                              )}
                              <td className="border border-gray-300 p-3 text-center font-medium bg-gray-100">
                                {isEditing ? (
                                  (parseFloat(editWeeklyData[regularHoursKey] || 0) + parseFloat(editWeeklyData[overtimeHoursKey] || 0)).toFixed(2)
                                ) : (
                                  dayData.totalHours.toFixed(2)
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    )}
                    
                    {/* Totals Row */}
                    <tr className="bg-yellow-200 font-bold">
                      <td className="border border-gray-300 p-3">Total Hrs:</td>
                      <td className="border border-gray-300 p-3 text-center">{biWeekly.totalRegularHours}</td>
                      <td className="border border-gray-300 p-3 text-center">{biWeekly.totalOvertimeHours}</td>
                      {isFullTime && (
                        <>
                          <td className="border border-gray-300 p-3 text-center">0.00</td>
                          <td className="border border-gray-300 p-3 text-center">0.00</td>
                          <td className="border border-gray-300 p-3 text-center">0.00</td>
                        </>
                      )}
                      <td className="border border-gray-300 p-3 text-center bg-gray-200">{biWeekly.totalHours}</td>
                    </tr>

                    {/* Rate Row */}
                    <tr className="bg-gray-100">
                      <td className="border border-gray-300 p-3 font-medium">Rate/Hour:</td>
                      <td className="border border-gray-300 p-3 text-center">{billingConfig?.currency || 'INR'} {(parseFloat(biWeekly.totalRegularAmount) / parseFloat(biWeekly.totalRegularHours) || 0).toFixed(2)}</td>
                      <td className="border border-gray-300 p-3 text-center">{billingConfig?.currency || 'INR'} {(parseFloat(biWeekly.totalOvertimeAmount) / parseFloat(biWeekly.totalOvertimeHours) || 0).toFixed(2)}</td>
                      {isFullTime && (
                        <>
                          <td className="border border-gray-300 p-3 text-center">{billingConfig?.currency || 'INR'} 0.00</td>
                          <td className="border border-gray-300 p-3 text-center">{billingConfig?.currency || 'INR'} 0.00</td>
                          <td className="border border-gray-300 p-3 text-center">{billingConfig?.currency || 'INR'} 0.00</td>
                        </>
                      )}
                      <td className="border border-gray-300 p-3 text-center bg-gray-200"></td>
                    </tr>

                    {/* Total Pay Row */}
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-3 font-medium">Total Pay:</td>
                      <td className="border border-gray-300 p-3 text-center">{billingConfig?.currency || 'INR'} {biWeekly.totalRegularAmount}</td>
                      <td className="border border-gray-300 p-3 text-center">{billingConfig?.currency || 'INR'} {biWeekly.totalOvertimeAmount}</td>
                      {isFullTime && (
                        <>
                          <td className="border border-gray-300 p-3 text-center">{billingConfig?.currency || 'INR'} 0.00</td>
                          <td className="border border-gray-300 p-3 text-center">{billingConfig?.currency || 'INR'} 0.00</td>
                          <td className="border border-gray-300 p-3 text-center">{billingConfig?.currency || 'INR'} 0.00</td>
                        </>
                      )}
                      <td className="border border-gray-300 p-3 text-center bg-red-500 text-white font-bold">{billingConfig?.currency || 'INR'} {biWeekly.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Week Breakdown Summary - Only show if both weeks exist */}
              {week2 && (
                <div className="bg-gray-50 p-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-medium mb-2 text-blue-800">Week 1</h4>
                      <p className="text-sm">Period: {format(new Date(week1.weekStartDate), 'M/d')} - {format(new Date(week1.weekEndDate), 'M/d')}</p>
                      <p className="text-sm">Hours: {parseFloat(week1.totalWeeklyHours).toFixed(2)}</p>
                      <p className="text-sm">Amount: {billingConfig?.currency || 'INR'} {parseFloat(week1.totalWeeklyAmount).toFixed(2)}</p>
                      {billingConfig?.currency && billingConfig.currency !== 'INR' && week1.conversionRate && (
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                          INR {(parseFloat(week1.totalWeeklyAmount) * parseFloat(week1.conversionRate || '85')).toFixed(2)} (@ {parseFloat(week1.conversionRate || '85').toFixed(2)})
                          <CurrencyConversionDialog
                            trigger={
                              <button className="text-xs text-blue-600 hover:text-blue-800 underline">
                                Learn More
                              </button>
                            }
                            originalAmount={parseFloat(week1.totalWeeklyAmount)}
                            convertedAmount={parseFloat(week1.totalWeeklyAmount) * parseFloat(week1.conversionRate || '85')}
                            conversionRate={parseFloat(week1.conversionRate || '85')}
                            currency={billingConfig.currency}
                            conversionDate={week1.conversionDate || undefined}
                            monthlyBreakdown={[]}
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <h4 className="font-medium mb-2 text-green-800">Week 2</h4>
                      <p className="text-sm">Period: {format(new Date(week2.weekStartDate), 'M/d')} - {format(new Date(week2.weekEndDate), 'M/d')}</p>
                      <p className="text-sm">Hours: {parseFloat(week2.totalWeeklyHours).toFixed(2)}</p>
                      <p className="text-sm">Amount: {billingConfig?.currency || 'INR'} {parseFloat(week2.totalWeeklyAmount).toFixed(2)}</p>
                      {billingConfig?.currency && billingConfig.currency !== 'INR' && week2.conversionRate && (
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                          INR {(parseFloat(week2.totalWeeklyAmount) * parseFloat(week2.conversionRate || '85')).toFixed(2)} (@ {parseFloat(week2.conversionRate || '85').toFixed(2)})
                          <CurrencyConversionDialog
                            trigger={
                              <button className="text-xs text-blue-600 hover:text-blue-800 underline">
                                Learn More
                              </button>
                            }
                            originalAmount={parseFloat(week2.totalWeeklyAmount)}
                            convertedAmount={parseFloat(week2.totalWeeklyAmount) * parseFloat(week2.conversionRate || '85')}
                            conversionRate={parseFloat(week2.conversionRate || '85')}
                            currency={billingConfig.currency}
                            conversionDate={week2.conversionDate || undefined}
                            monthlyBreakdown={[]}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Actions for Bi-Weekly Timesheet */}
              {isAdmin && (
                <div className="bg-gray-50 p-4 border-t">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={async () => {
                        console.log('Generate Invoice clicked for bi-weekly timesheet:', biWeekly);
                        console.log('BiWeekly ID:', biWeekly.id);
                        
                        // Since this is a dynamic bi-weekly view, we need to create a bi-weekly timesheet first
                        // Then generate an invoice from it
                        try {
                          // Step 1: Generate bi-weekly timesheet from the weekly data using apiRequest
                          const biWeeklyResult = await apiRequest(`/api/admin/biweekly-timesheets/${biWeekly.candidateId}/generate`, {
                            method: 'POST',
                            body: JSON.stringify({
                              periodStartDate: biWeekly.periodStart
                            })
                          });
                          
                          console.log('Generated bi-weekly timesheet:', biWeeklyResult);
                          
                          // Step 2: Now generate invoice from the bi-weekly timesheet
                          setSelectedBiWeeklyTimesheetForInvoice(biWeeklyResult.data.id);
                          setBiWeeklyInvoiceDialogOpen(true);
                          
                          // Refresh bi-weekly timesheets data without page reload
                          queryClient.invalidateQueries({ 
                            queryKey: ['/api/admin/biweekly-timesheets'],
                            refetchType: 'active'
                          });
                        } catch (error) {
                          console.error('Error generating bi-weekly timesheet:', error);
                          toast({
                            title: "Error",
                            description: "Failed to generate bi-weekly timesheet",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Receipt className="w-4 h-4 mr-1" />
                      Generate Invoice
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No bi-weekly data found. Data is dynamically created from approved weekly timesheets.
        </div>
      )}
    </div>
  );
}

// Monthly Table View Component with Working Days Support and Dynamic Filtering
function MonthlyTableView({ timesheets, getStatusBadge }: any) {
  // Fetch billing configuration to get working days
  const { data: billingData } = useQuery({
    queryKey: ['/api/admin/candidates-billing'],
  });

  // Fetch weekly timesheets for dynamic aggregation
  const { data: weeklyTimesheets } = useQuery({
    queryKey: ['/api/admin/timesheets'],
  });

  // Monthly filtering state
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>();
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const getBillingConfig = (candidateId: number) => {
    return billingData?.data?.find((config: any) => config.candidateId === candidateId);
  };

  // Get available month/year options based on weekly timesheets
  const getMonthYearOptions = () => {
    if (!weeklyTimesheets?.data) return { months: [], years: [] };
    
    const monthsSet = new Set<string>();
    const yearsSet = new Set<string>();
    
    weeklyTimesheets.data.forEach((ts: any) => {
      const weekStart = new Date(ts.weekStartDate);
      const year = weekStart.getFullYear().toString();
      const monthYear = `${year}-${(weekStart.getMonth() + 1).toString().padStart(2, '0')}`;
      
      yearsSet.add(year);
      monthsSet.add(monthYear);
    });
    
    const months = Array.from(monthsSet).sort().map(monthYear => {
      const [year, month] = monthYear.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return {
        value: monthYear,
        label: format(date, 'MMMM yyyy')
      };
    });
    
    const years = Array.from(yearsSet).sort().map(year => ({
      value: year,
      label: year
    }));
    
    return { months, years };
  };

  // Function to group weekly timesheets by candidate and month
  const groupTimesheetsByMonth = (weeklyTimesheetsList: any[]) => {
    const monthlyGroups: { [key: string]: any[] } = {};
    
    let filteredTimesheets = weeklyTimesheetsList.filter((ts: any) => ts.status === 'approved');
    
    // Apply month filter if selected
    if (selectedMonth) {
      const targetMonth = selectedMonth.getMonth();
      const targetYear = selectedMonth.getFullYear();
      
      filteredTimesheets = filteredTimesheets.filter((ts: any) => {
        const weekStart = new Date(ts.weekStartDate);
        return weekStart.getMonth() === targetMonth && weekStart.getFullYear() === targetYear;
      });
    }
    
    // Apply year filter if selected
    if (selectedYear) {
      const targetYear = parseInt(selectedYear);
      filteredTimesheets = filteredTimesheets.filter((ts: any) => {
        const weekStart = new Date(ts.weekStartDate);
        return weekStart.getFullYear() === targetYear;
      });
    }
    
    filteredTimesheets.forEach((timesheet: any) => {
      const weekStart = new Date(timesheet.weekStartDate);
      const monthKey = `${timesheet.candidateId}-${weekStart.getFullYear()}-${weekStart.getMonth()}`;
      
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = [];
      }
      monthlyGroups[monthKey].push(timesheet);
    });
    
    return monthlyGroups;
  };

  // Function to aggregate weekly data into monthly data
  const aggregateMonthlyData = (monthlyGroups: { [key: string]: any[] }) => {
    return Object.entries(monthlyGroups).map(([monthKey, weeklyTimesheetsList]) => {
      const firstTimesheet = weeklyTimesheetsList[0];
      const candidateId = firstTimesheet.candidateId;
      const billingConfig = getBillingConfig(candidateId);
      
      // Calculate month boundaries
      const firstWeekStart = new Date(weeklyTimesheetsList[0].weekStartDate);
      const monthStart = new Date(firstWeekStart.getFullYear(), firstWeekStart.getMonth(), 1);
      const monthEnd = new Date(firstWeekStart.getFullYear(), firstWeekStart.getMonth() + 1, 0);
      
      // Calculate totals with overtime breakdown
      const totalHours = weeklyTimesheetsList.reduce((sum, ts) => sum + parseFloat(ts.totalWeeklyHours || 0), 0);
      const totalAmount = weeklyTimesheetsList.reduce((sum, ts) => sum + parseFloat(ts.totalWeeklyAmount || 0), 0);
      
      // Calculate regular and overtime totals
      const totalRegularHours = weeklyTimesheetsList.reduce((sum, ts) => {
        const regularSum = 
          parseFloat(ts.mondayHours || 0) + parseFloat(ts.tuesdayHours || 0) + parseFloat(ts.wednesdayHours || 0) + 
          parseFloat(ts.thursdayHours || 0) + parseFloat(ts.fridayHours || 0) + parseFloat(ts.saturdayHours || 0) + 
          parseFloat(ts.sundayHours || 0);
        return sum + regularSum;
      }, 0);
      
      const totalOvertimeHours = weeklyTimesheetsList.reduce((sum, ts) => {
        const overtimeSum = 
          parseFloat(ts.mondayOvertime || 0) + parseFloat(ts.tuesdayOvertime || 0) + parseFloat(ts.wednesdayOvertime || 0) + 
          parseFloat(ts.thursdayOvertime || 0) + parseFloat(ts.fridayOvertime || 0) + parseFloat(ts.saturdayOvertime || 0) + 
          parseFloat(ts.sundayOvertime || 0);
        return sum + overtimeSum;
      }, 0);
      
      const totalRegularAmount = weeklyTimesheetsList.reduce((sum, ts) => sum + parseFloat(ts.totalRegularAmount || 0), 0);
      const totalOvertimeAmount = weeklyTimesheetsList.reduce((sum, ts) => sum + parseFloat(ts.totalOvertimeAmount || 0), 0);
      
      return {
        id: monthKey,
        candidateId,
        candidateName: firstTimesheet.candidateName,
        candidateEmail: firstTimesheet.candidateEmail,
        monthName: monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        periodStartDate: monthStart.toISOString(),
        periodEndDate: monthEnd.toISOString(),
        totalHours: totalHours.toString(),
        totalAmount: totalAmount.toString(),
        totalRegularHours: totalRegularHours.toString(),
        totalOvertimeHours: totalOvertimeHours.toString(),
        totalRegularAmount: totalRegularAmount.toString(),
        totalOvertimeAmount: totalOvertimeAmount.toString(),
        totalWeeks: weeklyTimesheetsList.length,
        weeklyTimesheets: weeklyTimesheetsList.sort((a, b) => new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime()),
        workingDaysPerWeek: billingConfig?.workingDaysPerWeek || 5
      };
    });
  };

  const monthlyGroups = groupTimesheetsByMonth(weeklyTimesheets?.data || []);
  const monthlyData = aggregateMonthlyData(monthlyGroups);
  const { months, years } = getMonthYearOptions();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Monthly Timesheets</h3>
        <div className="text-sm text-muted-foreground">
          Dynamically aggregated from approved weekly timesheets
        </div>
      </div>

      {/* Month/Year Filter */}
      <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <Label className="font-medium">Filter by</Label>
        
        {/* Month Selector */}
        <Select
          value={selectedMonth ? format(selectedMonth, 'yyyy-MM') : 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              setSelectedMonth(undefined);
            } else {
              const [year, month] = value.split('-');
              setSelectedMonth(new Date(parseInt(year), parseInt(month) - 1, 1));
              setSelectedYear(''); // Clear year filter when month is selected
            }
          }}
        >
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Selector */}
        <Select
          value={selectedYear || 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              setSelectedYear('');
            } else {
              setSelectedYear(value);
              setSelectedMonth(undefined); // Clear month filter when year is selected
            }
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Calendar Popover */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <div className="bg-green-500 text-white text-center py-2 rounded font-medium">
                {selectedMonth ? format(selectedMonth, 'MMMM yyyy') : format(new Date(), 'MMMM yyyy')}
              </div>
            </div>
            <CalendarComponent
              mode="single"
              selected={selectedMonth}
              onSelect={(date) => {
                if (date) {
                  setSelectedMonth(startOfMonth(date));
                  setSelectedYear('');
                }
                setCalendarOpen(false);
              }}
              className="rounded-md"
            />
            {selectedMonth && (
              <div className="p-3 border-t text-center">
                <div className="text-sm font-medium text-green-600">Month Range</div>
                <div className="text-xs text-gray-600">
                  {format(selectedMonth, 'MMM 1')} - {format(endOfMonth(selectedMonth), 'MMM d, yyyy')}
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {(selectedMonth || selectedYear) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedMonth(undefined);
              setSelectedYear('');
            }}
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Monthly Data List */}
      {monthlyData.length > 0 ? (
        monthlyData.map((monthlyTimesheet: any) => {
          const workingDays = monthlyTimesheet.workingDaysPerWeek;
          const weeklyTimesheets = monthlyTimesheet.weeklyTimesheets;
          
          // Get billing configuration for employment type
          const billingConfig = getBillingConfig(monthlyTimesheet.candidateId);
          const isFullTime = billingConfig?.employmentType === 'fulltime';
          
          return (
            <div key={monthlyTimesheet.id} className="border rounded-lg overflow-hidden">
              {/* Header with candidate info and status */}
              <div className="bg-blue-50 p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">{monthlyTimesheet.candidateName}</h3>
                    <p className="text-sm text-muted-foreground">{monthlyTimesheet.candidateEmail}</p>
                    <p className="text-sm font-medium mt-1">
                      Monthly Period: {monthlyTimesheet.monthName} ({format(new Date(monthlyTimesheet.periodStartDate), 'M/d/yyyy')} - {format(new Date(monthlyTimesheet.periodEndDate), 'M/d/yyyy')})
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Working Days: {workingDays} days/week • Employment: {billingConfig?.employmentType || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Approved
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">Total Hours: {parseFloat(monthlyTimesheet.totalHours).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Total Amount: INR {parseFloat(monthlyTimesheet.totalAmount).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Total Weeks: {monthlyTimesheet.totalWeeks}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Month Summary Stats */}
              <div className="bg-gray-50 p-4 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Total Hours</h4>
                    <p className="text-lg font-bold">{parseFloat(monthlyTimesheet.totalHours).toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">Total Amount</h4>
                    <p className="text-lg font-bold">INR {parseFloat(monthlyTimesheet.totalAmount).toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium mb-2">Avg Hours/Week</h4>
                    <p className="text-lg font-bold">{(parseFloat(monthlyTimesheet.totalHours) / monthlyTimesheet.totalWeeks).toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-medium mb-2">Avg Pay/Week</h4>
                    <p className="text-lg font-bold">INR {(parseFloat(monthlyTimesheet.totalAmount) / monthlyTimesheet.totalWeeks).toFixed(2)}</p>
                  </div>
                </div>

                {/* Full Table View */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-green-500 text-white">
                        <th className="border border-gray-300 p-3 text-left font-medium">Day of Week</th>
                        <th className="border border-gray-300 p-3 text-center font-medium">Regular<br/>[h:mm]</th>
                        <th className="border border-gray-300 p-3 text-center font-medium">Overtime<br/>[h:mm]</th>
                        {isFullTime && (
                          <>
                            <th className="border border-gray-300 p-3 text-center font-medium">Sick<br/>[h:mm]</th>
                            <th className="border border-gray-300 p-3 text-center font-medium">Paid Leave<br/>[h:mm]</th>
                            <th className="border border-gray-300 p-3 text-center font-medium">Unpaid Leave<br/>[h:mm]</th>
                          </>
                        )}
                        <th className="border border-gray-300 p-3 text-center font-medium bg-gray-600">TOTAL<br/>[h:mm]</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyTimesheets.map((weekTimesheet: any, weekIndex: number) => {
                        const weekStart = new Date(weekTimesheet.weekStartDate);
                        const weekEnd = new Date(weekTimesheet.weekEndDate);
                        const weekColors = ['bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-purple-50', 'bg-pink-50'];
                        const weekColor = weekColors[weekIndex % weekColors.length];
                        
                        const dailyHours = [
                          { 
                            day: 'Mon (Total)', 
                            regularHours: weekTimesheet.mondayHours, 
                            overtimeHours: weekTimesheet.mondayOvertime || 0,
                            totalHours: (parseFloat(weekTimesheet.mondayHours || 0) + parseFloat(weekTimesheet.mondayOvertime || 0))
                          },
                          { 
                            day: 'Tue (Total)', 
                            regularHours: weekTimesheet.tuesdayHours, 
                            overtimeHours: weekTimesheet.tuesdayOvertime || 0,
                            totalHours: (parseFloat(weekTimesheet.tuesdayHours || 0) + parseFloat(weekTimesheet.tuesdayOvertime || 0))
                          },
                          { 
                            day: 'Wed (Total)', 
                            regularHours: weekTimesheet.wednesdayHours, 
                            overtimeHours: weekTimesheet.wednesdayOvertime || 0,
                            totalHours: (parseFloat(weekTimesheet.wednesdayHours || 0) + parseFloat(weekTimesheet.wednesdayOvertime || 0))
                          },
                          { 
                            day: 'Thu (Total)', 
                            regularHours: weekTimesheet.thursdayHours, 
                            overtimeHours: weekTimesheet.thursdayOvertime || 0,
                            totalHours: (parseFloat(weekTimesheet.thursdayHours || 0) + parseFloat(weekTimesheet.thursdayOvertime || 0))
                          },
                          { 
                            day: 'Fri (Total)', 
                            regularHours: weekTimesheet.fridayHours, 
                            overtimeHours: weekTimesheet.fridayOvertime || 0,
                            totalHours: (parseFloat(weekTimesheet.fridayHours || 0) + parseFloat(weekTimesheet.fridayOvertime || 0))
                          },
                          { 
                            day: 'Sat (Total)', 
                            regularHours: weekTimesheet.saturdayHours, 
                            overtimeHours: weekTimesheet.saturdayOvertime || 0,
                            totalHours: (parseFloat(weekTimesheet.saturdayHours || 0) + parseFloat(weekTimesheet.saturdayOvertime || 0))
                          }
                        ].slice(0, workingDays);

                        return [
                          // Week Header Row
                          <tr key={`week-${weekIndex}-header`} className={`${weekColor} font-semibold`}>
                            <td colSpan={isFullTime ? 7 : 4} className="border border-gray-300 p-2 text-center text-gray-800">
                              Week {weekIndex + 1}: {format(weekStart, 'M/d')} - {format(weekEnd, 'M/d')}
                            </td>
                          </tr>,
                          // Daily Rows for this week
                          ...dailyHours.map((dayData) => (
                            <tr key={`week-${weekIndex}-${dayData.day}`} className={weekColor}>
                              <td className="border border-gray-300 p-3 font-medium">{dayData.day}</td>
                              <td className="border border-gray-300 p-3 text-center">{parseFloat(dayData.regularHours || 0).toFixed(2)}</td>
                              <td className="border border-gray-300 p-3 text-center">{parseFloat(dayData.overtimeHours || 0).toFixed(2)}</td>
                              {isFullTime && (
                                <>
                                  <td className="border border-gray-300 p-3 text-center">0.00</td>
                                  <td className="border border-gray-300 p-3 text-center">0.00</td>
                                  <td className="border border-gray-300 p-3 text-center">0.00</td>
                                </>
                              )}
                              <td className="border border-gray-300 p-3 text-center font-medium bg-gray-100">{dayData.totalHours.toFixed(2)}</td>
                            </tr>
                          ))
                        ];
                      }).flat()}
                      
                      {/* Monthly Totals Row */}
                      <tr className="bg-yellow-200 font-bold">
                        <td className="border border-gray-300 p-3">Total Hrs:</td>
                        <td className="border border-gray-300 p-3 text-center">{parseFloat(monthlyTimesheet.totalRegularHours).toFixed(2)}</td>
                        <td className="border border-gray-300 p-3 text-center">{parseFloat(monthlyTimesheet.totalOvertimeHours).toFixed(2)}</td>
                        {isFullTime && (
                          <>
                            <td className="border border-gray-300 p-3 text-center">0.00</td>
                            <td className="border border-gray-300 p-3 text-center">0.00</td>
                            <td className="border border-gray-300 p-3 text-center">0.00</td>
                          </>
                        )}
                        <td className="border border-gray-300 p-3 text-center bg-gray-200">{parseFloat(monthlyTimesheet.totalHours).toFixed(2)}</td>
                      </tr>

                      {/* Rate Row */}
                      <tr className="bg-gray-100">
                        <td className="border border-gray-300 p-3 font-medium">Rate/Hour:</td>
                        <td className="border border-gray-300 p-3 text-center">INR {(parseFloat(monthlyTimesheet.totalRegularAmount) / parseFloat(monthlyTimesheet.totalRegularHours) || 0).toFixed(2)}</td>
                        <td className="border border-gray-300 p-3 text-center">INR {(parseFloat(monthlyTimesheet.totalOvertimeAmount) / parseFloat(monthlyTimesheet.totalOvertimeHours) || 0).toFixed(2)}</td>
                        {isFullTime && (
                          <>
                            <td className="border border-gray-300 p-3 text-center">INR 0.00</td>
                            <td className="border border-gray-300 p-3 text-center">INR 0.00</td>
                            <td className="border border-gray-300 p-3 text-center">INR 0.00</td>
                          </>
                        )}
                        <td className="border border-gray-300 p-3 text-center bg-gray-200"></td>
                      </tr>

                      {/* Total Pay Row */}
                      <tr className="bg-white">
                        <td className="border border-gray-300 p-3 font-medium">Total Pay:</td>
                        <td className="border border-gray-300 p-3 text-center">INR {parseFloat(monthlyTimesheet.totalRegularAmount).toFixed(2)}</td>
                        <td className="border border-gray-300 p-3 text-center">INR {parseFloat(monthlyTimesheet.totalOvertimeAmount).toFixed(2)}</td>
                        {isFullTime && (
                          <>
                            <td className="border border-gray-300 p-3 text-center">INR 0.00</td>
                            <td className="border border-gray-300 p-3 text-center">INR 0.00</td>
                            <td className="border border-gray-300 p-3 text-center">INR 0.00</td>
                          </>
                        )}
                        <td className="border border-gray-300 p-3 text-center bg-red-500 text-white font-bold">INR {parseFloat(monthlyTimesheet.totalAmount).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No monthly timesheets found. Monthly timesheets are automatically generated when candidates have approved weekly timesheets.
        </div>
      )}
    </div>
  );
}

// Weekly Table View Component with Working Days Support
function WeeklyTableView({ timesheets, onApprove, onReject, onEdit, onDelete, getStatusBadge, isAdmin, changeTimesheetStatusMutation, setBiWeeklyInvoiceDialogOpen, setSelectedBiWeeklyTimesheetForInvoice, biWeeklyInvoiceDialogOpen, selectedBiWeeklyTimesheetForInvoice }: any) {
  // Fetch billing configuration to get working days
  const { data: billingData } = useQuery({
    queryKey: ['/api/admin/candidates-billing'],
  });

  // Timeframe filtering state for weekly view
  const [selectedWeekTimeframe, setSelectedWeekTimeframe] = useState<Date | undefined>();
  const [weekCalendarOpen, setWeekCalendarOpen] = useState(false);

  // Auto-select the most recent timesheet week when data loads, instead of current week
  React.useEffect(() => {
    if (timesheets && timesheets.length > 0 && !selectedWeekTimeframe) {
      // Find the most recent timesheet week
      const latestTimesheet = timesheets.reduce((latest: any, current: any) => {
        const latestDate = new Date(latest.weekStartDate);
        const currentDate = new Date(current.weekStartDate);
        return currentDate > latestDate ? current : latest;
      });
      
      if (latestTimesheet) {
        const timesheetWeek = new Date(latestTimesheet.weekStartDate);
        setSelectedWeekTimeframe(timesheetWeek);
        console.log('Auto-selected timesheet week:', timesheetWeek, 'from timesheet:', latestTimesheet);
      }
    }
  }, [timesheets, selectedWeekTimeframe]);

  // Get available week options from timesheets
  const getWeekOptions = () => {
    if (!timesheets) return [];
    
    const weeks = timesheets.map((ts: any) => new Date(ts.weekStartDate));
    const uniqueWeeks = [...new Set(weeks.map(w => w.getTime()))].map(t => new Date(t));
    const sortedWeeks = uniqueWeeks.sort((a, b) => a.getTime() - b.getTime());
    
    return sortedWeeks.map(week => ({
      value: week,
      label: `Week of ${format(week, 'MM/dd/yyyy')} - ${format(addDays(week, 6), 'MM/dd/yyyy')}`
    }));
  };

  // Filter timesheets by selected week
  const getFilteredWeeklyTimesheets = () => {
    if (!timesheets) return [];
    if (!selectedWeekTimeframe) return timesheets;
    
    const filtered = timesheets.filter((timesheet: any) => {
      const timesheetStart = new Date(timesheet.weekStartDate);
      const selectedStart = selectedWeekTimeframe;
      return timesheetStart.getTime() === selectedStart.getTime();
    });
    
    console.log('Filtering timesheets:', {
      totalTimesheets: timesheets.length,
      selectedWeek: selectedWeekTimeframe,
      selectedWeekString: selectedWeekTimeframe ? format(selectedWeekTimeframe, 'yyyy-MM-dd') : 'none',
      filteredCount: filtered.length,
      availableWeeks: timesheets.map((ts: any) => ({
        weekStart: ts.weekStartDate,
        formatted: format(new Date(ts.weekStartDate), 'yyyy-MM-dd')
      }))
    });
    
    return filtered;
  };

  const getBillingConfig = (candidateId: number) => {
    return billingData?.data?.find((config: any) => config.candidateId === candidateId);
  };

  const [editingTimesheet, setEditingTimesheet] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedTimesheetForInvoice, setSelectedTimesheetForInvoice] = useState<number | null>(null);

  // Fetch invoices to check which timesheets already have invoices
  const { data: invoicesData } = useQuery({
    queryKey: ['/api/admin/invoices'],
    enabled: isAdmin
  });

  // Helper function to check if a timesheet already has an invoice
  const hasExistingInvoice = (timesheetId: number) => {
    if (!invoicesData?.data || !isAdmin) return false;
    return invoicesData.data.some((invoice: any) => invoice.timesheetId === timesheetId);
  };

  return (
    <div className="space-y-6">
      {/* Timeframe Filtering Controls */}
      <div className="flex gap-4 items-center">
        <Select value={selectedWeekTimeframe ? format(selectedWeekTimeframe, 'yyyy-MM-dd') : "all-timeframes"} onValueChange={(value) => {
          if (value === "all-timeframes") {
            setSelectedWeekTimeframe(undefined);
          } else {
            setSelectedWeekTimeframe(new Date(value));
          }
        }}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Select Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-timeframes">All Timeframes</SelectItem>
            {getWeekOptions().map((option) => (
              <SelectItem key={option.value.getTime()} value={format(option.value, 'yyyy-MM-dd')}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Compact Date Range Display */}
        <div className="border rounded-lg bg-white px-4 py-2 w-48">
          <div className="text-center">
            <div className="text-xs font-medium text-gray-600 mb-1">Current Range</div>
            <div className="text-sm font-medium text-green-600">
              {selectedWeekTimeframe ? (
                <>
                  {format(selectedWeekTimeframe, 'MMM d')} - {format(addDays(selectedWeekTimeframe, 6), 'MMM d, yyyy')}
                </>
              ) : (
                'All Periods'
              )}
            </div>
          </div>
        </div>

        {selectedWeekTimeframe && (
          <Button variant="outline" onClick={() => {
            setSelectedWeekTimeframe(undefined);
            console.log('Cleared week filter - showing all timesheets');
          }}>
            Clear Filter
          </Button>
        )}
      </div>

      {getFilteredWeeklyTimesheets().length > 0 ? getFilteredWeeklyTimesheets().map((timesheet: WeeklyTimesheet) => {
        const billingConfig = getBillingConfig(timesheet.candidateId);
        const workingDays = billingConfig?.workingDaysPerWeek || 5; // Default to 5 days
        const isFullTime = billingConfig?.employmentType === 'fulltime';

        // Define all days but filter based on working days
        const allDays = [
          { 
            key: 'monday',
            day: `Mon ${format(addDays(new Date(timesheet.weekStartDate), 0), 'M/d')}`, 
            hours: timesheet.mondayHours,
            isWorkingDay: true
          },
          { 
            key: 'tuesday',
            day: `Tue ${format(addDays(new Date(timesheet.weekStartDate), 1), 'M/d')}`, 
            hours: timesheet.tuesdayHours,
            isWorkingDay: true
          },
          { 
            key: 'wednesday',
            day: `Wed ${format(addDays(new Date(timesheet.weekStartDate), 2), 'M/d')}`, 
            hours: timesheet.wednesdayHours,
            isWorkingDay: true
          },
          { 
            key: 'thursday',
            day: `Thu ${format(addDays(new Date(timesheet.weekStartDate), 3), 'M/d')}`, 
            hours: timesheet.thursdayHours,
            isWorkingDay: true
          },
          { 
            key: 'friday',
            day: `Fri ${format(addDays(new Date(timesheet.weekStartDate), 4), 'M/d')}`, 
            hours: timesheet.fridayHours,
            isWorkingDay: true
          },
          { 
            key: 'saturday',
            day: `Sat ${format(addDays(new Date(timesheet.weekStartDate), 5), 'M/d')}`, 
            hours: timesheet.saturdayHours,
            isWorkingDay: workingDays === 6 // Only show Saturday if 6-day work week
          },
          { 
            key: 'sunday',
            day: `Sun ${format(addDays(new Date(timesheet.weekStartDate), 6), 'M/d')}`, 
            hours: timesheet.sundayHours,
            isWorkingDay: false // Sunday is never a working day
          }
        ];

        // Filter to only show working days
        const displayDays = allDays.filter(day => day.isWorkingDay);

        return (
          <div key={timesheet.id} className="border rounded-lg overflow-hidden">
            {/* Header with candidate info and status */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{timesheet.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{timesheet.candidateEmail}</p>
                  <p className="text-sm font-medium mt-1">
                    Week of: {format(new Date(timesheet.weekStartDate), 'M/d/yyyy')} - {format(new Date(timesheet.weekEndDate), 'M/d/yyyy')}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Working Days: {workingDays} days/week • Employment: {billingConfig?.employmentType || 'Unknown'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(timesheet.status)}
                  {(timesheet.status === 'submitted' || timesheet.status === 'pending') && isAdmin && onApprove && onReject && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => onApprove(timesheet.id)}
                        disabled={changeTimesheetStatusMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        {changeTimesheetStatusMutation.isPending ? 'Approving...' : 'Approve'}
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
                                  onReject(timesheet.id, reason);
                                }
                              }}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                  {timesheet.status === 'approved' && isAdmin && onEdit && onDelete && editingTimesheet !== timesheet.id && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          changeTimesheetStatusMutation.mutate({
                            timesheetId: timesheet.id,
                            status: 'pending'
                          });
                        }}
                        disabled={changeTimesheetStatusMutation.isPending}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        {changeTimesheetStatusMutation.isPending ? 'Reverting...' : 'Revert'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setEditingTimesheet(timesheet.id);
                          setEditData({
                            mondayHours: timesheet.mondayHours,
                            tuesdayHours: timesheet.tuesdayHours,
                            wednesdayHours: timesheet.wednesdayHours,
                            thursdayHours: timesheet.thursdayHours,
                            fridayHours: timesheet.fridayHours,
                            saturdayHours: timesheet.saturdayHours,
                            sundayHours: timesheet.sundayHours,
                            mondayOvertime: timesheet.mondayOvertime,
                            tuesdayOvertime: timesheet.tuesdayOvertime,
                            wednesdayOvertime: timesheet.wednesdayOvertime,
                            thursdayOvertime: timesheet.thursdayOvertime,
                            fridayOvertime: timesheet.fridayOvertime,
                            saturdayOvertime: timesheet.saturdayOvertime,
                            sundayOvertime: timesheet.sundayOvertime
                          });
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {!hasExistingInvoice(timesheet.id) && (
                        <Button 
                          size="sm" 
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedTimesheetForInvoice(timesheet.id);
                            setInvoiceDialogOpen(true);
                          }}
                        >
                          <Receipt className="w-4 h-4 mr-1" />
                          Generate Invoice
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Timesheet</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this approved timesheet? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => onDelete(timesheet.id)}
                            >
                              Delete Timesheet
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                  {timesheet.status === 'rejected' && isAdmin && onApprove && onDelete && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => onApprove(timesheet.id)}
                        disabled={changeTimesheetStatusMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        {changeTimesheetStatusMutation.isPending ? 'Approving...' : 'Approve'}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Rejected Timesheet</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to permanently delete this rejected timesheet? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => onDelete(timesheet.id)}
                            >
                              Delete Timesheet
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {timesheet.rejectionReason && (
                        <div className="ml-2">
                          <p className="text-xs text-red-600 font-medium">
                            Rejection Reason: {timesheet.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {editingTimesheet === timesheet.id && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          // Calculate regular hours total
                          const regularHoursFields = ['mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours', 'sundayHours'];
                          const totalRegularHours = regularHoursFields.reduce((sum, field) => sum + (parseFloat(editData[field]) || 0), 0);
                          
                          // Calculate overtime hours total
                          const overtimeFields = ['mondayOvertime', 'tuesdayOvertime', 'wednesdayOvertime', 'thursdayOvertime', 'fridayOvertime', 'saturdayOvertime', 'sundayOvertime'];
                          const totalOvertimeHours = overtimeFields.reduce((sum, field) => sum + (parseFloat(editData[field]) || 0), 0);
                          
                          // Calculate total hours and amounts
                          const totalHours = totalRegularHours + totalOvertimeHours;
                          const billingConfig = getBillingConfig(timesheet.candidateId);
                          const hourlyRate = parseFloat(billingConfig?.hourlyRate || '0');
                          const totalRegularAmount = totalRegularHours * hourlyRate;
                          const totalOvertimeAmount = totalOvertimeHours * hourlyRate;
                          const totalAmount = totalRegularAmount + totalOvertimeAmount;
                          
                          onEdit(timesheet.id, {
                            ...editData,
                            totalRegularHours: totalRegularHours,
                            totalOvertimeHours: totalOvertimeHours,
                            totalWeeklyHours: totalHours,
                            totalRegularAmount: totalRegularAmount,
                            totalOvertimeAmount: totalOvertimeAmount,
                            totalWeeklyAmount: totalAmount
                          });
                          setEditingTimesheet(null);
                          setEditData({});
                        }}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingTimesheet(null);
                          setEditData({});
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-500 text-white">
                    <th className="p-3 text-left font-medium">Day of Week</th>
                    <th className="p-3 text-center font-medium">Regular<br/>[h:mm]</th>
                    <th className="p-3 text-center font-medium">Overtime<br/>[h:mm]</th>
                    {isFullTime && (
                      <>
                        <th className="p-3 text-center font-medium">Sick<br/>[h:mm]</th>
                        <th className="p-3 text-center font-medium">Paid Leave<br/>[h:mm]</th>
                        <th className="p-3 text-center font-medium">Unpaid Leave<br/>[h:mm]</th>
                      </>
                    )}
                    <th className="p-3 text-center font-medium bg-gray-600">TOTAL<br/>[h:mm]</th>
                  </tr>
                </thead>
                <tbody>
                  {displayDays.map((row, index) => {
                    const isEditing = editingTimesheet === timesheet.id;
                    const fieldName = `${row.key}Hours`;
                    // Map to database field names with underscores
                    const overtimeFieldName = `${row.key.toLowerCase()}Overtime`;
                    
                    // Get regular and overtime hours from timesheet data
                    const regularHours = isEditing ? (parseFloat(editData[fieldName]) || 0) : (parseFloat(row.hours) || 0);
                    const overtimeHours = isEditing ? (parseFloat(editData[overtimeFieldName]) || parseFloat(timesheet[overtimeFieldName] || '0')) : parseFloat(timesheet[overtimeFieldName] || '0');
                    const totalDayHours = (parseFloat(regularHours) || 0) + (parseFloat(overtimeHours) || 0);
                    
                    console.log(`Day ${row.key}: Regular=${regularHours}, Overtime=${overtimeHours} (field: ${overtimeFieldName})`, timesheet);
                    
                    return (
                      <tr key={row.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 border-r font-medium">{row.day}</td>
                        <td className="p-3 text-center border-r bg-green-50">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="24"
                              value={regularHours}
                              onChange={(e) => {
                                const value = Math.max(0, Math.min(24, parseFloat(e.target.value) || 0));
                                setEditData(prev => ({ ...prev, [fieldName]: value }));
                              }}
                              className="w-20 text-center"
                            />
                          ) : (
                            (parseFloat(regularHours) || 0).toFixed(2)
                          )}
                        </td>
                        <td className="p-3 text-center border-r bg-yellow-50">
                          {isEditing ? (
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="24"
                              value={overtimeHours}
                              onChange={(e) => {
                                const value = Math.max(0, Math.min(24, parseFloat(e.target.value) || 0));
                                setEditData(prev => ({ ...prev, [overtimeFieldName]: value }));
                              }}
                              className="w-20 text-center"
                            />
                          ) : (
                            (parseFloat(overtimeHours) || 0).toFixed(2)
                          )}
                        </td>
                        {isFullTime && (
                          <>
                            <td className="p-3 text-center border-r bg-green-50">0.00</td>
                            <td className="p-3 text-center border-r bg-green-50">0.00</td>
                            <td className="p-3 text-center border-r bg-green-50">0.00</td>
                          </>
                        )}
                        <td className="p-3 text-center font-medium bg-gray-100">{totalDayHours.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  
                  {/* Totals Row */}
                  <tr className="bg-green-100 font-medium">
                    <td className="p-3 border-r">Total Hrs:</td>
                    <td className="p-3 text-center border-r">
                      {editingTimesheet === timesheet.id 
                        ? (['mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours', 'sundayHours'].reduce((sum, field) => sum + (parseFloat(editData[field]) || 0), 0)).toFixed(2)
                        : (parseFloat(timesheet.totalWeeklyHours) - parseFloat(timesheet.totalOvertimeHours || '0')).toFixed(2)
                      }
                    </td>
                    <td className="p-3 text-center border-r bg-yellow-100">
                      {editingTimesheet === timesheet.id 
                        ? (['mondayOvertime', 'tuesdayOvertime', 'wednesdayOvertime', 'thursdayOvertime', 'fridayOvertime', 'saturdayOvertime', 'sundayOvertime'].reduce((sum, field) => sum + (parseFloat(editData[field]) || 0), 0)).toFixed(2)
                        : (parseFloat(timesheet.totalOvertimeHours || '0')).toFixed(2)
                      }
                    </td>
                    {isFullTime && (
                      <>
                        <td className="p-3 text-center border-r">0.00</td>
                        <td className="p-3 text-center border-r">0.00</td>
                        <td className="p-3 text-center border-r">0.00</td>
                      </>
                    )}
                    <td className="p-3 text-center bg-gray-200">
                      {editingTimesheet === timesheet.id 
                        ? ((['mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours', 'sundayHours'].reduce((sum, field) => sum + (parseFloat(editData[field]) || 0), 0)) + (['mondayOvertime', 'tuesdayOvertime', 'wednesdayOvertime', 'thursdayOvertime', 'fridayOvertime', 'saturdayOvertime', 'sundayOvertime'].reduce((sum, field) => sum + (parseFloat(editData[field]) || 0), 0))).toFixed(2)
                        : (parseFloat(timesheet.totalWeeklyHours) || 0).toFixed(2)
                      }
                    </td>
                  </tr>

                  {/* Rate Row */}
                  <tr className="bg-gray-50">
                    <td className="p-3 border-r font-medium">Rate/Hour:</td>
                    <td className="p-3 text-center border-r">
                      {billingConfig?.currency || 'INR'} {billingConfig?.hourlyRate ? parseFloat(billingConfig.hourlyRate).toFixed(2) : '0.00'}
                    </td>
                    <td className="p-3 text-center border-r bg-yellow-50">
                      {billingConfig?.currency || 'INR'} {billingConfig?.hourlyRate ? parseFloat(billingConfig.hourlyRate).toFixed(2) : '0.00'}
                    </td>
                    {isFullTime && (
                      <>
                        <td className="p-3 text-center border-r">{billingConfig?.currency || 'INR'} 0.00</td>
                        <td className="p-3 text-center border-r">{billingConfig?.currency || 'INR'} 0.00</td>
                        <td className="p-3 text-center border-r">{billingConfig?.currency || 'INR'} 0.00</td>
                      </>
                    )}
                    <td className="p-3 text-center bg-gray-200"></td>
                  </tr>

                  {/* Pay Row */}
                  <tr className="bg-white">
                    <td className="p-3 border-r font-medium">Total Pay:</td>
                    <td className="p-3 text-center border-r">
                      {billingConfig?.currency || 'INR'} {(parseFloat(timesheet.totalRegularAmount || '0')).toFixed(2)}
                    </td>
                    <td className="p-3 text-center border-r bg-yellow-50">
                      {billingConfig?.currency || 'INR'} {(parseFloat(timesheet.totalOvertimeAmount || '0')).toFixed(2)}
                    </td>
                    {isFullTime && (
                      <>
                        <td className="p-3 text-center border-r">{billingConfig?.currency || 'INR'} 0.00</td>
                        <td className="p-3 text-center border-r">{billingConfig?.currency || 'INR'} 0.00</td>
                        <td className="p-3 text-center border-r">{billingConfig?.currency || 'INR'} 0.00</td>
                      </>
                    )}
                    <td className="p-3 text-center bg-red-500 text-white font-bold">{billingConfig?.currency || 'INR'} {parseFloat(timesheet.totalWeeklyAmount || '0').toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-4 border-t">
              <div className="flex justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg text-red-600">Total Hours Reported: {(parseFloat(timesheet.totalWeeklyHours) || 0).toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-red-600">Total Pay: {billingConfig?.currency || 'INR'} {parseFloat(timesheet.totalWeeklyAmount || '0').toFixed(2)}</div>
                  {billingConfig?.currency && billingConfig.currency !== 'INR' && (
                    <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      INR {(parseFloat(timesheet.totalWeeklyAmount || '0') * parseFloat(timesheet.conversionRate || '85')).toFixed(2)} (@ {parseFloat(timesheet.conversionRate || '85').toFixed(2)})
                      <CurrencyConversionDialog
                        trigger={
                          <button className="text-xs text-blue-600 hover:text-blue-800 underline">
                            Learn More
                          </button>
                        }
                        originalAmount={parseFloat(timesheet.totalWeeklyAmount || '0')}
                        convertedAmount={parseFloat(timesheet.totalWeeklyAmount || '0') * parseFloat(timesheet.conversionRate || '85')}
                        conversionRate={parseFloat(timesheet.conversionRate || '85')}
                        currency={billingConfig.currency}
                        conversionDate={timesheet.conversionDate || undefined}
                        monthlyBreakdown={[]}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {timesheet.rejectionReason && (
              <div className="bg-red-50 border-t border-red-200 p-4">
                <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                <p className="text-sm text-red-700">{timesheet.rejectionReason}</p>
              </div>
            )}
          </div>
        );
      }) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No timesheets found for the selected week.</p>
          <p className="text-sm mt-2">
            {selectedWeekTimeframe 
              ? `No data available for week of ${format(selectedWeekTimeframe, 'MMM d, yyyy')}`
              : 'No timesheet data available'
            }
          </p>
        </div>
      )}

      {/* Invoice Dialog */}
      <InvoiceDialog
        isOpen={invoiceDialogOpen}
        onClose={() => {
          setInvoiceDialogOpen(false);
          setSelectedTimesheetForInvoice(null);
        }}
        timesheetId={selectedTimesheetForInvoice || undefined}
        mode="generate"
        setActiveTab={setActiveTab}
      />

      {/* Bi-Weekly Invoice Dialog */}
      <InvoiceDialog
        isOpen={biWeeklyInvoiceDialogOpen}
        onClose={() => {
          setBiWeeklyInvoiceDialogOpen(false);
          setSelectedBiWeeklyTimesheetForInvoice(null);
        }}
        biWeeklyTimesheetId={selectedBiWeeklyTimesheetForInvoice || undefined}
        mode="generate"
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

// Invoice Management Component
interface InvoiceManagementProps {
  setActiveTab: (tab: string) => void;
}

function InvoiceManagement({ setActiveTab }: InvoiceManagementProps) {
  const { user } = useUser();
  const isAdmin = user?.role === 'admin';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [selectedInvoiceForDownload, setSelectedInvoiceForDownload] = useState<number | null>(null);
  
  // Fetch invoices based on user role
  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: isAdmin ? ['/api/admin/invoices'] : ['/api/invoices/candidate', user?.id],
    enabled: !!user
  });

  // Fetch hired candidates for admin filtering
  const { data: hiredCandidates } = useQuery({
    queryKey: ['/api/admin/hired-candidates'],
    enabled: isAdmin
  });

  // Generate invoice mutation
  const generateInvoiceMutation = useMutation({
    mutationFn: async (timesheetId: number) => {
      return apiRequest('/api/admin/generate-invoice', {
        method: 'POST',
        body: JSON.stringify({ timesheetId })
      });
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: "Invoice generated successfully" });
      // Only invalidate specific queries instead of causing full page reload
      queryClient.invalidateQueries({ 
        queryKey: ['/api/admin/invoices'],
        refetchType: 'active' // Only refetch active queries
      });
      // Also refresh timesheets to show updated generate button state
      queryClient.invalidateQueries({ 
        queryKey: ['/api/admin/timesheets'],
        refetchType: 'active'
      });
      // Navigate to invoice tab without page reload
      setActiveTab("invoices");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Update invoice status mutation
  const updateInvoiceStatusMutation = useMutation({
    mutationFn: async ({ invoiceId, status }: { invoiceId: number; status: string }) => {
      const response = await fetch(`/api/admin/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update invoice status');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Invoice status updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/invoices'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: number) => {
      const response = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete invoice');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Invoice deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/timesheets'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' },
      sent: { label: 'Sent', variant: 'default' },
      paid: { label: 'Paid', variant: 'success' },
      overdue: { label: 'Overdue', variant: 'destructive' }
    };

    const config = statusConfig[status] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const invoiceData = invoices?.data || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {isAdmin ? "Invoice Management" : "My Invoices"}
          </CardTitle>
          <CardDescription>
            {isAdmin ? "Generate and manage invoices for approved timesheets" : "View your generated invoices"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <div className="text-center py-8">Loading invoices...</div>
          ) : invoiceData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No invoices found
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {invoiceData.map((invoice: Invoice) => (
                  <Card key={invoice.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">#{invoice.invoiceNumber}</span>
                            {getStatusBadge(invoice.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>Candidate: {invoice.candidateName}</div>
                            <div>Period: {format(new Date(invoice.weekStartDate), 'MMM dd')} - {format(new Date(invoice.weekEndDate), 'MMM dd, yyyy')}</div>
                            <div>Issued: {format(new Date(invoice.issuedDate), 'MMM dd, yyyy')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            INR {parseFloat(invoice.amountINR || invoice.totalAmount || '0').toFixed(2)}
                            <div className="text-sm font-normal text-muted-foreground">
                              ≈ {invoice.currency} {parseFloat(invoice.totalAmount || '0').toFixed(2)}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {parseFloat(invoice.totalHours || '0').toFixed(1)} hours @ {invoice.currency} {parseFloat(invoice.hourlyRate || '0').toFixed(2)}/hr
                          </div>
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-2 mt-4 flex-wrap">
                          <Select 
                            value={invoice.status} 
                            onValueChange={(status) => updateInvoiceStatusMutation.mutate({ invoiceId: invoice.id, status })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSelectedInvoiceId(invoice.id);
                              setInvoiceDialogOpen(true);
                            }}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedInvoiceId(invoice.id);
                              setInvoiceDialogOpen(true);
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Invoice</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete invoice #{invoice.invoiceNumber}? This action cannot be undone and will allow the timesheet to generate a new invoice.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline">Cancel</Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => deleteInvoiceMutation.mutate(invoice.id)}
                                  disabled={deleteInvoiceMutation.isPending}
                                >
                                  {deleteInvoiceMutation.isPending ? 'Deleting...' : 'Delete Invoice'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {invoice.timesheetId && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="bg-orange-50 hover:bg-orange-100 border-orange-300">
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Regenerate
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Regenerate Invoice</DialogTitle>
                                  <DialogDescription>
                                    This will delete the current invoice #{invoice.invoiceNumber} and generate a new one from the original timesheet data. The new invoice will have a new invoice number.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end gap-2 mt-4">
                                  <Button variant="outline">Cancel</Button>
                                  <Button 
                                    onClick={() => {
                                      // Delete current invoice and regenerate
                                      deleteInvoiceMutation.mutate(invoice.id, {
                                        onSuccess: () => {
                                          // After deletion, generate new invoice
                                          setTimeout(() => {
                                            generateInvoiceMutation.mutate(invoice.timesheetId!);
                                          }, 500);
                                        }
                                      });
                                    }}
                                    disabled={deleteInvoiceMutation.isPending || generateInvoiceMutation.isPending}
                                    className="bg-orange-600 hover:bg-orange-700"
                                  >
                                    {deleteInvoiceMutation.isPending || generateInvoiceMutation.isPending 
                                      ? 'Regenerating...' 
                                      : 'Regenerate Invoice'}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Invoice Preview Dialog */}
      <InvoiceDialog
        isOpen={invoiceDialogOpen}
        onClose={() => {
          setInvoiceDialogOpen(false);
          setSelectedInvoiceId(null);
        }}
        invoiceId={selectedInvoiceId || undefined}
        mode="preview"
      />
    </div>
  );
}



