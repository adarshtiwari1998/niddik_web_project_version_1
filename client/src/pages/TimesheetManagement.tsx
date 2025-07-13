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
    queryKey: ['/api/admin/submitted-candidates'],
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
                    getFilteredTimesheets().map((timesheet: WeeklyTimesheet) => (
                      <TimesheetCard 
                        key={timesheet.id} 
                        timesheet={timesheet} 
                        onApprove={(id) => approveTimesheetMutation.mutate(id)}
                        onReject={(id, reason) => rejectTimesheetMutation.mutate({ timesheetId: id, reason })}
                        getStatusBadge={getStatusBadge}
                      />
                    ))
                  ) : adminViewMode === 'bi-weekly' ? (
                    getGroupedTimesheets().map((group: any) => (
                      <BiWeeklyTimesheetCard 
                        key={group.period} 
                        group={group}
                        getStatusBadge={getStatusBadge}
                      />
                    ))
                  ) : (
                    getGroupedTimesheets().map((group: any) => (
                      <MonthlyTimesheetCard 
                        key={group.period} 
                        group={group}
                        getStatusBadge={getStatusBadge}
                      />
                    ))
                  )
                ) : (
                  candidateTimesheets?.data?.map((timesheet: WeeklyTimesheet) => (
                    <TimesheetCard 
                      key={timesheet.id} 
                      timesheet={timesheet} 
                      getStatusBadge={getStatusBadge}
                      isCandidate={true}
                    />
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
      </Tabs>
    </AdminLayout>
  );
}

// Individual Timesheet Card Component
function TimesheetCard({ 
  timesheet, 
  onApprove, 
  onReject, 
  getStatusBadge,
  isCandidate = false
}: any) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium">{timesheet.candidateName || 'My Timesheet'}</h4>
          {timesheet.candidateEmail && <p className="text-sm text-muted-foreground">{timesheet.candidateEmail}</p>}
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
          <span className="font-medium">Amount:</span> {timesheet.currency || 'USD'} {parseFloat(timesheet.totalWeeklyAmount || '0').toFixed(2)}
        </div>
        <div>
          <span className="font-medium">Submitted:</span> {timesheet.submittedAt ? format(new Date(timesheet.submittedAt), 'MMM dd, yyyy') : '-'}
        </div>
      </div>
      
      {!isCandidate && timesheet.status === 'submitted' && (
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={() => onApprove(timesheet.id)}
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
                      onReject(timesheet.id, reason);
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
  );
}

// Bi-Weekly Timesheet Card Component  
function BiWeeklyTimesheetCard({ group, getStatusBadge }: any) {
  const startDate = group.timesheets[0]?.weekStartDate;
  const endDate = group.timesheets[group.timesheets.length - 1]?.weekEndDate || group.timesheets[0]?.weekEndDate;
  
  return (
    <div className="border rounded-lg p-4 bg-blue-50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-medium text-lg">Bi-Weekly Period</h4>
          <p className="text-sm text-muted-foreground">
            {format(new Date(startDate), 'MMM dd')} - {format(new Date(endDate), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="text-right">
          <div className="font-medium">Total: {group.totalHours} hours</div>
          <div className="text-sm text-muted-foreground">
            Amount: ${group.totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {group.timesheets.map((timesheet: WeeklyTimesheet) => (
          <div key={timesheet.id} className="bg-white p-3 rounded border">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{timesheet.candidateName}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  Week {format(new Date(timesheet.weekStartDate), 'MMM dd')}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">{timesheet.totalWeeklyHours}h</span>
                {getStatusBadge(timesheet.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Monthly Timesheet Card Component
function MonthlyTimesheetCard({ group, getStatusBadge }: any) {
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
    <div className="border rounded-lg p-4 bg-green-50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-medium text-lg">Monthly Summary - {monthName}</h4>
          <p className="text-sm text-muted-foreground">
            {Object.keys(candidateGroups).length} candidate(s), {group.timesheets.length} timesheet(s)
          </p>
        </div>
        <div className="text-right">
          <div className="font-medium">Total: {group.totalHours} hours</div>
          <div className="text-sm text-muted-foreground">
            Amount: ${group.totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(candidateGroups).map(([key, candidate]: [string, any]) => (
          <div key={key} className="bg-white p-4 rounded border">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h5 className="font-medium">{candidate.candidateName}</h5>
                <p className="text-sm text-muted-foreground">{candidate.candidateEmail}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">{candidate.totalHours}h</div>
                <div className="text-sm text-muted-foreground">
                  ${candidate.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {candidate.timesheets.map((timesheet: WeeklyTimesheet) => (
                <div key={timesheet.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <span>Week {format(new Date(timesheet.weekStartDate), 'MMM dd')}</span>
                  <div className="flex items-center gap-2">
                    <span>{timesheet.totalWeeklyHours}h</span>
                    {getStatusBadge(timesheet.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}