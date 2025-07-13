import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, FileText, Plus, Save, Check, X, Edit, Trash2, Building, Filter, User, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth, subWeeks, addWeeks, parseISO } from "date-fns";
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

  // Admin timesheet view states
  const [adminViewMode, setAdminViewMode] = useState<'weekly' | 'bi-weekly' | 'monthly'>('weekly');
  const [selectedCandidate, setSelectedCandidate] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(() => {
    const today = new Date();
    return format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  });

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
    queryKey: ['/api/admin/timesheets'],
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
      const response = await fetch(`/api/timesheets/${timesheetId}/approve`, {
        method: 'POST'
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
      const response = await fetch(`/api/timesheets/${timesheetId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="billing-config">
            {isAdmin ? "Billing Configuration" : "My Billing"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="billing-config" className="space-y-6">
          <BillingConfig />
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
                      onApprove={(id) => approveTimesheetMutation.mutate(id)}
                      onReject={(id, reason) => rejectTimesheetMutation.mutate({ timesheetId: id, reason })}
                      getStatusBadge={getStatusBadge}
                    />
                  ) : adminViewMode === 'bi-weekly' ? (
                    <BiWeeklyTableView 
                      groups={getGroupedTimesheets()}
                      onApprove={(id) => approveTimesheetMutation.mutate(id)}
                      onReject={(id, reason) => rejectTimesheetMutation.mutate({ timesheetId: id, reason })}
                      getStatusBadge={getStatusBadge}
                    />
                  ) : (
                    <MonthlyTableView 
                      groups={getGroupedTimesheets()}
                      onApprove={(id) => approveTimesheetMutation.mutate(id)}
                      onReject={(id, reason) => rejectTimesheetMutation.mutate({ timesheetId: id, reason })}
                      getStatusBadge={getStatusBadge}
                    />
                  )
                ) : (
                  <WeeklyTableView 
                    timesheets={candidateTimesheets?.data || []}
                    getStatusBadge={getStatusBadge}
                    isCandidate={true}
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

// Weekly Table View Component
function WeeklyTableView({ timesheets, onApprove, onReject, getStatusBadge }: any) {
  return (
    <div className="space-y-6">
      {timesheets.map((timesheet: WeeklyTimesheet) => (
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
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(timesheet.status)}
                {timesheet.status === 'submitted' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onApprove(timesheet.id)}>
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
                                onReject(timesheet.id, reason);
                              }
                            }}
                          />
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
            <table className="w-full">
              <thead>
                <tr className="bg-green-500 text-white">
                  <th className="p-3 text-left font-medium">Day of Week</th>
                  <th className="p-3 text-center font-medium">Regular<br/>[h:mm]</th>
                  <th className="p-3 text-center font-medium">Overtime<br/>[h:mm]</th>
                  <th className="p-3 text-center font-medium">Sick<br/>[h:mm]</th>
                  <th className="p-3 text-center font-medium">Paid Leave<br/>[h:mm]</th>
                  <th className="p-3 text-center font-medium">Unpaid Leave<br/>[h:mm]</th>
                  <th className="p-3 text-center font-medium bg-gray-600">TOTAL<br/>[h:mm]</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { 
                    day: `Mon ${format(addDays(new Date(timesheet.weekStartDate), 0), 'M/d')}`, 
                    hours: timesheet.mondayHours 
                  },
                  { 
                    day: `Tue ${format(addDays(new Date(timesheet.weekStartDate), 1), 'M/d')}`, 
                    hours: timesheet.tuesdayHours 
                  },
                  { 
                    day: `Wed ${format(addDays(new Date(timesheet.weekStartDate), 2), 'M/d')}`, 
                    hours: timesheet.wednesdayHours 
                  },
                  { 
                    day: `Thu ${format(addDays(new Date(timesheet.weekStartDate), 3), 'M/d')}`, 
                    hours: timesheet.thursdayHours 
                  },
                  { 
                    day: `Fri ${format(addDays(new Date(timesheet.weekStartDate), 4), 'M/d')}`, 
                    hours: timesheet.fridayHours 
                  },
                  { 
                    day: `Sat ${format(addDays(new Date(timesheet.weekStartDate), 5), 'M/d')}`, 
                    hours: timesheet.saturdayHours 
                  },
                  { 
                    day: `Sun ${format(addDays(new Date(timesheet.weekStartDate), 6), 'M/d')}`, 
                    hours: timesheet.sundayHours 
                  }
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 border-r font-medium">{row.day}</td>
                    <td className="p-3 text-center border-r bg-green-50">{(parseFloat(row.hours) || 0).toFixed(2)}</td>
                    <td className="p-3 text-center border-r">0.00</td>
                    <td className="p-3 text-center border-r bg-green-50">0.00</td>
                    <td className="p-3 text-center border-r bg-green-50">0.00</td>
                    <td className="p-3 text-center border-r bg-green-50">0.00</td>
                    <td className="p-3 text-center font-medium bg-gray-100">{(parseFloat(row.hours) || 0).toFixed(2)}</td>
                  </tr>
                ))}
                
                {/* Totals Row */}
                <tr className="bg-green-100 font-medium">
                  <td className="p-3 border-r">Total Hrs:</td>
                  <td className="p-3 text-center border-r">{(parseFloat(timesheet.totalWeeklyHours) || 0).toFixed(2)}</td>
                  <td className="p-3 text-center border-r">0.00</td>
                  <td className="p-3 text-center border-r">0.00</td>
                  <td className="p-3 text-center border-r">0.00</td>
                  <td className="p-3 text-center border-r">0.00</td>
                  <td className="p-3 text-center bg-gray-200">{(parseFloat(timesheet.totalWeeklyHours) || 0).toFixed(2)}</td>
                </tr>

                {/* Rate Row */}
                <tr className="bg-gray-50">
                  <td className="p-3 border-r font-medium">Rate/Hour:</td>
                  <td className="p-3 text-center border-r">INR {((parseFloat(timesheet.totalWeeklyAmount || '0') / (parseFloat(timesheet.totalWeeklyHours) || 1)) || 0).toFixed(2)}</td>
                  <td className="p-3 text-center border-r">INR 0.00</td>
                  <td className="p-3 text-center border-r">INR 0.00</td>
                  <td className="p-3 text-center border-r">INR 0.00</td>
                  <td className="p-3 text-center border-r">INR 0.00</td>
                  <td className="p-3 text-center bg-gray-200"></td>
                </tr>

                {/* Pay Row */}
                <tr className="bg-white">
                  <td className="p-3 border-r font-medium">Total Pay:</td>
                  <td className="p-3 text-center border-r">INR {parseFloat(timesheet.totalWeeklyAmount || '0').toFixed(2)}</td>
                  <td className="p-3 text-center border-r">INR 0.00</td>
                  <td className="p-3 text-center border-r">INR 0.00</td>
                  <td className="p-3 text-center border-r">INR 0.00</td>
                  <td className="p-3 text-center border-r">INR 0.00</td>
                  <td className="p-3 text-center bg-red-500 text-white font-bold">INR {parseFloat(timesheet.totalWeeklyAmount || '0').toFixed(2)}</td>
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
                <div className="font-bold text-lg text-red-600">Total Pay: INR {parseFloat(timesheet.totalWeeklyAmount || '0').toFixed(2)}</div>
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
      ))}
    </div>
  );
}

// Bi-Weekly Table View Component
function BiWeeklyTableView({ groups, onApprove, onReject, getStatusBadge }: any) {
  return (
    <div className="space-y-8">
      {groups.map((group: any) => {
        const candidateGroups = group.timesheets.reduce((acc: any, ts: WeeklyTimesheet) => {
          const key = `${ts.candidateId}-${ts.candidateName}`;
          if (!acc[key]) {
            acc[key] = {
              candidateName: ts.candidateName,
              candidateEmail: ts.candidateEmail,
              timesheets: []
            };
          }
          acc[key].timesheets.push(ts);
          return acc;
        }, {});

        return (
          <div key={group.period} className="border rounded-lg overflow-hidden">
            {/* Bi-Weekly Header */}
            <div className="bg-blue-100 p-4 border-b">
              <h3 className="font-bold text-xl">Bi-Weekly Period</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(group.timesheets[0]?.weekStartDate), 'MMM dd')} - {format(new Date(group.timesheets[group.timesheets.length - 1]?.weekEndDate), 'MMM dd, yyyy')}
              </p>
              <div className="mt-2">
                <span className="font-medium">Total: {group.totalHours} hours | Amount: INR {(parseFloat(group.totalAmount) || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Individual Candidate Tables */}
            {Object.entries(candidateGroups).map(([key, candidate]: [string, any]) => (
              <div key={key} className="border-b last:border-b-0">
                <div className="bg-gray-50 p-3 border-b">
                  <h4 className="font-medium">{candidate.candidateName}</h4>
                  <p className="text-sm text-muted-foreground">{candidate.candidateEmail}</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-500 text-white">
                        <th className="p-2 text-left font-medium">Week</th>
                        <th className="p-2 text-center font-medium">Mon</th>
                        <th className="p-2 text-center font-medium">Tue</th>
                        <th className="p-2 text-center font-medium">Wed</th>
                        <th className="p-2 text-center font-medium">Thu</th>
                        <th className="p-2 text-center font-medium">Fri</th>
                        <th className="p-2 text-center font-medium">Sat</th>
                        <th className="p-2 text-center font-medium">Sun</th>
                        <th className="p-2 text-center font-medium bg-gray-600">Total</th>
                        <th className="p-2 text-center font-medium">Status</th>
                        <th className="p-2 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidate.timesheets.map((timesheet: WeeklyTimesheet, index: number) => (
                        <tr key={timesheet.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-2 border-r font-medium">
                            {format(new Date(timesheet.weekStartDate), 'M/d')} - {format(new Date(timesheet.weekEndDate), 'M/d')}
                          </td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.mondayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.tuesdayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.wednesdayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.thursdayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.fridayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.saturdayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.sundayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center font-medium bg-gray-100">{(parseFloat(timesheet.totalWeeklyHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center">{getStatusBadge(timesheet.status)}</td>
                          <td className="p-2 text-center">
                            {timesheet.status === 'submitted' && (
                              <div className="flex gap-1 justify-center">
                                <Button size="sm" onClick={() => onApprove(timesheet.id)}>
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => onReject(timesheet.id, 'Rejected by admin')}>
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      
                      {/* Totals */}
                      <tr className="bg-blue-100 font-bold">
                        <td className="p-2 border-r">Bi-Weekly Total:</td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.mondayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.tuesdayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.wednesdayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.thursdayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.fridayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.saturdayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.sundayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center bg-gray-200">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.totalWeeklyHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center"></td>
                        <td className="p-2 text-center"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Pay Summary */}
                <div className="bg-gray-50 p-3 text-center">
                  <span className="font-bold text-red-600">
                    Total Pay: INR {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + parseFloat(ts.totalWeeklyAmount || '0'), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Monthly Table View Component
function MonthlyTableView({ groups, onApprove, onReject, getStatusBadge }: any) {
  return (
    <div className="space-y-8">
      {groups.map((group: any) => {
        const monthName = format(new Date(group.period + '-01'), 'MMMM yyyy');
        const candidateGroups = group.timesheets.reduce((acc: any, ts: WeeklyTimesheet) => {
          const key = `${ts.candidateId}-${ts.candidateName}`;
          if (!acc[key]) {
            acc[key] = {
              candidateName: ts.candidateName,
              candidateEmail: ts.candidateEmail,
              timesheets: [],
              totalHours: 0,
              totalAmount: 0
            };
          }
          acc[key].timesheets.push(ts);
          acc[key].totalHours += ts.totalWeeklyHours;
          acc[key].totalAmount += parseFloat(ts.totalWeeklyAmount || '0');
          return acc;
        }, {});

        return (
          <div key={group.period} className="border rounded-lg overflow-hidden">
            {/* Monthly Header */}
            <div className="bg-green-100 p-4 border-b">
              <h3 className="font-bold text-xl">Monthly Summary - {monthName}</h3>
              <p className="text-sm text-muted-foreground">
                {Object.keys(candidateGroups).length} candidate(s), {group.timesheets.length} timesheet(s)
              </p>
              <div className="mt-2">
                <span className="font-medium">Total: {group.totalHours} hours | Amount: INR {(parseFloat(group.totalAmount) || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Individual Candidate Tables */}
            {Object.entries(candidateGroups).map(([key, candidate]: [string, any]) => (
              <div key={key} className="border-b last:border-b-0">
                <div className="bg-gray-50 p-3 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{candidate.candidateName}</h4>
                      <p className="text-sm text-muted-foreground">{candidate.candidateEmail}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Monthly Total: {candidate.totalHours}h</div>
                      <div className="text-sm text-muted-foreground">Amount: INR {(parseFloat(candidate.totalAmount) || 0).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-green-500 text-white">
                        <th className="p-2 text-left font-medium">Week</th>
                        <th className="p-2 text-center font-medium">Mon</th>
                        <th className="p-2 text-center font-medium">Tue</th>
                        <th className="p-2 text-center font-medium">Wed</th>
                        <th className="p-2 text-center font-medium">Thu</th>
                        <th className="p-2 text-center font-medium">Fri</th>
                        <th className="p-2 text-center font-medium">Sat</th>
                        <th className="p-2 text-center font-medium">Sun</th>
                        <th className="p-2 text-center font-medium bg-gray-600">Total</th>
                        <th className="p-2 text-center font-medium">Amount</th>
                        <th className="p-2 text-center font-medium">Status</th>
                        <th className="p-2 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidate.timesheets.map((timesheet: WeeklyTimesheet, index: number) => (
                        <tr key={timesheet.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-2 border-r font-medium">
                            {format(new Date(timesheet.weekStartDate), 'M/d')} - {format(new Date(timesheet.weekEndDate), 'M/d')}
                          </td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.mondayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.tuesdayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.wednesdayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.thursdayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.fridayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.saturdayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center border-r bg-green-50">{(parseFloat(timesheet.sundayHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center font-medium bg-gray-100">{(parseFloat(timesheet.totalWeeklyHours) || 0).toFixed(2)}</td>
                          <td className="p-2 text-center font-medium">INR {timesheet.totalWeeklyAmount}</td>
                          <td className="p-2 text-center">{getStatusBadge(timesheet.status)}</td>
                          <td className="p-2 text-center">
                            {timesheet.status === 'submitted' && (
                              <div className="flex gap-1 justify-center">
                                <Button size="sm" onClick={() => onApprove(timesheet.id)}>
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => onReject(timesheet.id, 'Rejected by admin')}>
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      
                      {/* Monthly Totals */}
                      <tr className="bg-green-100 font-bold">
                        <td className="p-2 border-r">Monthly Total:</td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.mondayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.tuesdayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.wednesdayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.thursdayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.fridayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.saturdayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center border-r">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.sundayHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center bg-gray-200">
                          {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + (parseFloat(ts.totalWeeklyHours) || 0), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center font-medium">
                          INR {candidate.timesheets.reduce((sum: number, ts: WeeklyTimesheet) => sum + parseFloat(ts.totalWeeklyAmount || '0'), 0).toFixed(2)}
                        </td>
                        <td className="p-2 text-center"></td>
                        <td className="p-2 text-center"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Pay Summary */}
                <div className="bg-gray-50 p-3 text-center">
                  <span className="font-bold text-red-600">
                    Monthly Pay: INR {(parseFloat(candidate.totalAmount) || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}