import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import CandidateLayout from '@/components/layouts/CandidateLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, addDays, parseISO, isAfter, endOfWeek, subWeeks } from 'date-fns';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  FileText,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface WeeklyTimesheet {
  id: number;
  candidateId: number;
  weekStartDate: string;
  mondayHours: number;
  tuesdayHours: number;
  wednesdayHours: number;
  thursdayHours: number;
  fridayHours: number;
  saturdayHours: number;
  sundayHours: number;
  totalWeeklyHours: number;
  totalWeeklyAmount: number;
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: number;
  rejectionReason?: string;
}

interface BillingConfig {
  id: number;
  candidateId: number;
  hourlyRate: number;
  workingHoursPerWeek: number;
  workingDaysPerWeek?: number;
  currency: string;
  isActive: boolean;
  hasHiredApplication?: boolean;
}

export default function CandidateTimesheets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // Default to current week (the week user is working on)
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [activeTab, setActiveTab] = useState("timesheet");
  const [selectedTimesheetId, setSelectedTimesheetId] = useState<number | null>(null);
  const [newTimesheet, setNewTimesheet] = useState({
    mondayHours: 0,
    tuesdayHours: 0,
    wednesdayHours: 0,
    thursdayHours: 0,
    fridayHours: 0,
    saturdayHours: 0,
    sundayHours: 0
  });

  // Get billing configuration
  const { data: billingConfig, isLoading: billingLoading, error: billingError } = useQuery({
    queryKey: ['/api/candidate/billing-status'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
  });

  // Get timesheets for current candidate
  const { data: timesheets, isLoading: timesheetsLoading, error: timesheetsError } = useQuery({
    queryKey: [`/api/timesheets/candidate/${user?.id}`, { page: 1, limit: 50 }],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
  });

  // Auto-select the most recent timesheet (current week if available)
  useEffect(() => {
    if (timesheets?.data && timesheets.data.length > 0 && selectedTimesheetId === null) {
      // Find the current week's timesheet or the most recent one
      const currentWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      
      // First try to find current week's timesheet
      const currentWeekTimesheet = timesheets.data.find((t: WeeklyTimesheet) => 
        t.weekStartDate === currentWeekStart
      );
      
      if (currentWeekTimesheet) {
        setSelectedTimesheetId(currentWeekTimesheet.id);
        // Set selected week to current week
        setSelectedWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
      } else {
        // If no current week timesheet, select the most recent one
        const sortedTimesheets = [...timesheets.data].sort((a: WeeklyTimesheet, b: WeeklyTimesheet) => 
          new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime()
        );
        setSelectedTimesheetId(sortedTimesheets[0].id);
        // Set selected week to match the most recent timesheet
        setSelectedWeek(startOfWeek(parseISO(sortedTimesheets[0].weekStartDate), { weekStartsOn: 1 }));
      }
    }
  }, [timesheets?.data, selectedTimesheetId]);

  // Get specific week timesheet
  const weekStartString = format(selectedWeek, 'yyyy-MM-dd');
  const { data: weekTimesheet, isLoading: weekTimesheetLoading, error: weekTimesheetError } = useQuery({
    queryKey: [`/api/timesheets/${user?.id}/${weekStartString}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && !!weekStartString,
  });

  // Create timesheet mutation
  const createTimesheetMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/timesheets', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      toast({
        title: "Timesheet submitted successfully",
        description: "Your timesheet has been submitted for approval",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/timesheets/candidate/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/timesheets/${user?.id}/${weekStartString}`] });
      // Don't reset form - let useEffect handle form population based on loaded data
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting timesheet",
        description: error.message || "Failed to submit timesheet",
        variant: "destructive",
      });
    }
  });

  // Update timesheet mutation
  const updateTimesheetMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest(`/api/timesheets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      toast({
        title: "Timesheet updated successfully",
        description: "Your timesheet has been updated",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/timesheets/candidate/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/timesheets/${user?.id}/${weekStartString}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating timesheet",
        description: error.message || "Failed to update timesheet",
        variant: "destructive",
      });
    }
  });

  // Populate form when existing timesheet data is loaded or when week changes
  useEffect(() => {
    if (weekTimesheet?.data) {
      // Populate form with original total hours (regular + overtime) that user entered
      setNewTimesheet({
        mondayHours: (parseFloat(weekTimesheet.data.mondayHours) || 0) + (parseFloat(weekTimesheet.data.mondayOvertime) || 0),
        tuesdayHours: (parseFloat(weekTimesheet.data.tuesdayHours) || 0) + (parseFloat(weekTimesheet.data.tuesdayOvertime) || 0),
        wednesdayHours: (parseFloat(weekTimesheet.data.wednesdayHours) || 0) + (parseFloat(weekTimesheet.data.wednesdayOvertime) || 0),
        thursdayHours: (parseFloat(weekTimesheet.data.thursdayHours) || 0) + (parseFloat(weekTimesheet.data.thursdayOvertime) || 0),
        fridayHours: (parseFloat(weekTimesheet.data.fridayHours) || 0) + (parseFloat(weekTimesheet.data.fridayOvertime) || 0),
        saturdayHours: (parseFloat(weekTimesheet.data.saturdayHours) || 0) + (parseFloat(weekTimesheet.data.saturdayOvertime) || 0),
        sundayHours: (parseFloat(weekTimesheet.data.sundayHours) || 0) + (parseFloat(weekTimesheet.data.sundayOvertime) || 0)
      });
    } else {
      // Reset form when no timesheet exists for the selected week
      setNewTimesheet({
        mondayHours: 0,
        tuesdayHours: 0,
        wednesdayHours: 0,
        thursdayHours: 0,
        fridayHours: 0,
        saturdayHours: 0,
        sundayHours: 0
      });
    }
  }, [weekTimesheet?.data, selectedWeek]);

  const handleSubmitTimesheet = () => {
    if (!user || !billingConfig?.data) return;

    const weekEndDate = format(addDays(selectedWeek, 6), 'yyyy-MM-dd');
    const timesheetData = {
      candidateId: user.id,
      weekStartDate: weekStartString,
      weekEndDate: weekEndDate,
      ...newTimesheet
    };

    createTimesheetMutation.mutate(timesheetData);
  };

  const handleUpdateTimesheet = () => {
    if (!weekTimesheet?.data) return;

    updateTimesheetMutation.mutate({
      id: weekTimesheet.data.id,
      data: newTimesheet
    });
  };

  // Delete timesheet mutation
  const deleteTimesheetMutation = useMutation({
    mutationFn: (timesheetId: number) => apiRequest(`/api/timesheets/${timesheetId}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      toast({
        title: "Timesheet deleted successfully",
        description: "Your timesheet has been deleted",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/timesheets/candidate/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/timesheets/${user?.id}/${weekStartString}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting timesheet",
        description: error.message || "Failed to delete timesheet",
        variant: "destructive",
      });
    }
  });

  const handleDeleteTimesheet = (timesheetId: number) => {
    if (window.confirm('Are you sure you want to delete this timesheet?')) {
      deleteTimesheetMutation.mutate(timesheetId);
    }
  };

  const handleNextWeek = () => {
    const nextWeek = addDays(selectedWeek, 7);
    setSelectedWeek(nextWeek);
  };

  const totalHours = Object.values(newTimesheet).reduce((sum, hours) => sum + hours, 0);
  const totalAmount = totalHours * (billingConfig?.data?.hourlyRate || 0);

  // Check submission rules based on working days
  const workingDaysPerWeek = billingConfig?.data?.workingDaysPerWeek || 5;
  const today = new Date();
  
  // Calculate the end of the selected week (Sunday night at 23:59:59)
  const selectedWeekEnd = new Date(addDays(selectedWeek, 6));
  selectedWeekEnd.setHours(23, 59, 59, 999); // Set to end of Sunday
  
  // Check if today is during the selected week (Monday to Sunday)
  const isCurrentWeek = today >= selectedWeek && today <= selectedWeekEnd;
  
  // Check if the week has completely ended (past Sunday night)
  const weekHasEnded = today > selectedWeekEnd;
  
  // Check if user already submitted timesheet for this week
  const hasSubmittedThisWeek = timesheets?.data?.some((t: WeeklyTimesheet) => 
    format(parseISO(t.weekStartDate), 'yyyy-MM-dd') === format(selectedWeek, 'yyyy-MM-dd')
  );
  
  // Get current week's timesheet if it exists
  const currentWeekTimesheet = timesheets?.data?.find((t: WeeklyTimesheet) => 
    format(parseISO(t.weekStartDate), 'yyyy-MM-dd') === format(selectedWeek, 'yyyy-MM-dd')
  );
  
  // User can update existing timesheet if it's not approved
  const canUpdateTimesheet = currentWeekTimesheet && currentWeekTimesheet.status !== 'approved';
  
  // User can submit new timesheet for current week or future weeks (allow future week submissions)
  const canSubmitNewTimesheet = !hasSubmittedThisWeek;
  
  // Show next week option if current week already has a submitted timesheet
  const shouldShowNextWeek = hasSubmittedThisWeek && isCurrentWeek;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'submitted':
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  // Dynamic working days based on billing configuration - reuse from above
  const allDayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const allDayKeys = ['mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours', 'sundayHours'] as const;
  
  // Filter days based on working days configuration
  const dayLabels = workingDaysPerWeek === 6 ? allDayLabels.slice(0, 6) : allDayLabels.slice(0, 5);
  const dayKeys = workingDaysPerWeek === 6 ? allDayKeys.slice(0, 6) : allDayKeys.slice(0, 5);

  if (!user) return null;

  // Show loading state while fetching billing config
  if (billingLoading) {
    return (
      <CandidateLayout activeTab="timesheets">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Timesheet & Billing</h1>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading billing configuration...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CandidateLayout>
    );
  }

  // Check if candidate is hired and has billing configuration
  const isHired = billingConfig?.data?.hasHiredApplication === true;
  const hasBillingConfig = billingConfig?.data?.isActive === true;

  if (!isHired) {
    return (
      <CandidateLayout activeTab="timesheets">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Timesheet & Billing</h1>
              <p className="text-muted-foreground">
                Submit your weekly hours and track attendance
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Not Available</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Timesheet management is only available for hired candidates. You need to be hired for a position to access this feature.
                </p>
                <p className="text-sm text-muted-foreground">
                  Once you are hired for a position, you'll be able to submit weekly timesheets and track your working hours here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CandidateLayout>
    );
  }

  if (!hasBillingConfig) {
    return (
      <CandidateLayout activeTab="timesheets">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Timesheet & Billing</h1>
              <p className="text-muted-foreground">
                Submit your weekly hours and track attendance
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Billing Configuration Required</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Your timesheet access is being set up. Please wait for the admin to configure your billing settings.
                </p>
                <p className="text-sm text-muted-foreground">
                  Once the admin adds your billing configuration, you'll be able to submit weekly timesheets and track your working hours here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout activeTab="timesheets">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Timesheet & Billing</h1>
            <p className="text-muted-foreground">
              Submit your weekly hours and track attendance
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="timesheet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timesheet" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timesheet Submission
            </TabsTrigger>
            <TabsTrigger value="weekly-timesheet" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Weekly Timesheet
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Attendance Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timesheet" className="space-y-6">
            {/* Billing Information Card */}
            {billingConfig?.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Billing Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Hourly Rate</Label>
                      <p className="text-lg font-semibold">{billingConfig.data.currency} {billingConfig.data.hourlyRate}/hour</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Weekly Hours</Label>
                      <p className="text-lg font-semibold">{billingConfig.data.workingHoursPerWeek} hours/week</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Working Days</Label>
                      <p className="text-lg font-semibold">{workingDaysPerWeek} days/week</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Week Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Week</CardTitle>
                <CardDescription>Choose the week for timesheet submission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Calendar
                    mode="single"
                    selected={selectedWeek}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedWeek(startOfWeek(date, { weekStartsOn: 1 }));
                      }
                    }}
                    className="rounded-md border"
                    modifiers={{
                      submitted: timesheets?.data?.reduce((dates: Date[], t: WeeklyTimesheet) => {
                        if (t.status === 'submitted') {
                          const weekStart = parseISO(t.weekStartDate);
                          for (let i = 0; i < workingDaysPerWeek; i++) {
                            dates.push(addDays(weekStart, i));
                          }
                        }
                        return dates;
                      }, []) || [],
                      pending: timesheets?.data?.reduce((dates: Date[], t: WeeklyTimesheet) => {
                        if (t.status === 'pending') {
                          const weekStart = parseISO(t.weekStartDate);
                          for (let i = 0; i < workingDaysPerWeek; i++) {
                            dates.push(addDays(weekStart, i));
                          }
                        }
                        return dates;
                      }, []) || [],
                      approved: timesheets?.data?.reduce((dates: Date[], t: WeeklyTimesheet) => {
                        if (t.status === 'approved') {
                          const weekStart = parseISO(t.weekStartDate);
                          for (let i = 0; i < workingDaysPerWeek; i++) {
                            dates.push(addDays(weekStart, i));
                          }
                        }
                        return dates;
                      }, []) || [],
                      rejected: timesheets?.data?.reduce((dates: Date[], t: WeeklyTimesheet) => {
                        if (t.status === 'rejected') {
                          const weekStart = parseISO(t.weekStartDate);
                          for (let i = 0; i < workingDaysPerWeek; i++) {
                            dates.push(addDays(weekStart, i));
                          }
                        }
                        return dates;
                      }, []) || [],
                      selected: (() => {
                        const dates: Date[] = [];
                        const selectedWeekStart = format(selectedWeek, 'yyyy-MM-dd');
                        // Only show selected if it's not already submitted/pending/approved/rejected
                        const hasTimesheet = timesheets?.data?.some((t: WeeklyTimesheet) => 
                          format(parseISO(t.weekStartDate), 'yyyy-MM-dd') === selectedWeekStart
                        );
                        
                        if (!hasTimesheet) {
                          for (let i = 0; i < workingDaysPerWeek; i++) {
                            dates.push(addDays(selectedWeek, i));
                          }
                        }
                        return dates;
                      })()
                    }}
                    modifiersStyles={{
                      submitted: { backgroundColor: '#fef3c7', color: '#92400e' },
                      pending: { backgroundColor: '#fef3c7', color: '#92400e' },
                      approved: { backgroundColor: '#dcfce7', color: '#166534' },
                      rejected: { backgroundColor: '#fecaca', color: '#991b1b' },
                      selected: { backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold' }
                    }}
                  />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Calendar Legend:</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                          <span>Submitted</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                          <span>Pending</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-200 rounded"></div>
                          <span>Approved</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-200 rounded"></div>
                          <span>Rejected</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-200 rounded"></div>
                          <span>Selected</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                    <p className="font-medium">Selected Week:</p>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedWeek, 'MMM dd')} - {format(addDays(selectedWeek, workingDaysPerWeek === 6 ? 5 : 4), 'MMM dd, yyyy')}
                      {workingDaysPerWeek === 6 ? ' (Mon-Sat)' : ' (Mon-Fri)'}
                    </p>
                    {weekTimesheet?.data && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Status:</span>
                        {getStatusBadge(weekTimesheet.data.status)}
                      </div>
                    )}
                    {shouldShowNextWeek && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                        <p className="text-sm text-blue-800">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          Next week available: {format(addDays(selectedWeek, 7), 'MMM dd')} - {format(addDays(selectedWeek, 7 + (workingDaysPerWeek === 6 ? 5 : 4)), 'MMM dd, yyyy')}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleNextWeek}
                          className="mt-2"
                        >
                          Switch to Next Week
                        </Button>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hours Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Hours</CardTitle>
                <CardDescription>
                  Enter your working hours for each day of the selected week
                  {workingDaysPerWeek === 6 ? ' (Monday - Saturday)' : ' (Monday - Friday)'}
                </CardDescription>
                {hasSubmittedThisWeek && currentWeekTimesheet?.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-green-800">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Timesheet approved - Cannot edit. Navigate to next week to submit new timesheet.
                    </p>
                  </div>
                )}
                {hasSubmittedThisWeek && (currentWeekTimesheet?.status === 'submitted' || currentWeekTimesheet?.status === 'pending') && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-yellow-800">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      {currentWeekTimesheet?.status === 'pending' 
                        ? 'Timesheet pending review - Admin has reverted approval. You can still edit until approved.'
                        : 'Timesheet submitted - Waiting for admin approval. You can still edit until approved.'
                      }
                    </p>
                  </div>
                )}
                {hasSubmittedThisWeek && currentWeekTimesheet?.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-red-800">
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Timesheet rejected - You can edit and resubmit.
                      {currentWeekTimesheet.rejectionReason && (
                        <span className="block mt-1 font-medium">Reason: {currentWeekTimesheet.rejectionReason}</span>
                      )}
                    </p>
                  </div>
                )}
                {!hasSubmittedThisWeek && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-blue-800">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Ready to submit: Enter your hours for the selected week and submit.
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className={`grid gap-4 mb-6 ${
                  workingDaysPerWeek === 5 
                    ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5' 
                    : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
                }`}>
                  {dayLabels.map((day, index) => {
                    const key = dayKeys[index];
                    return (
                      <div key={day} className="space-y-2">
                        <Label className="text-sm font-medium">{day}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={newTimesheet[key]}
                          onChange={(e) => setNewTimesheet(prev => ({
                            ...prev,
                            [key]: parseFloat(e.target.value) || 0
                          }))}
                          disabled={!canSubmitNewTimesheet && !canUpdateTimesheet}
                          placeholder="0.0"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Total Hours</Label>
                      <p className="text-lg font-semibold">{totalHours.toFixed(1)} hours</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Total Amount</Label>
                      <p className="text-lg font-semibold">{billingConfig?.data?.currency || 'USD'} {totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!weekTimesheet?.data ? (
                      canSubmitNewTimesheet && !hasSubmittedThisWeek ? (
                        <Button 
                          onClick={handleSubmitTimesheet}
                          disabled={createTimesheetMutation.isPending || totalHours === 0}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Submit Timesheet
                        </Button>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {isCurrentWeek ? 'Complete your timesheet to submit' : weekHasEnded ? 'Submission deadline has passed' : 'Select current week to submit timesheet'}
                        </div>
                      )
                    ) : weekTimesheet.data.status !== 'approved' ? (
                      canUpdateTimesheet ? (
                        <Button 
                          onClick={handleUpdateTimesheet}
                          disabled={updateTimesheetMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Update Timesheet
                        </Button>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {weekTimesheet.data.status === 'approved' ? 'Timesheet approved - Cannot edit' : isCurrentWeek ? 'Timesheet submitted - Contact admin for changes' : 'Week ended - Timesheet locked for editing'}
                        </div>
                      )
                    ) : (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved - Cannot Edit
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previous Timesheets */}
            <Card>
              <CardHeader>
                <CardTitle>Previous Timesheets</CardTitle>
                <CardDescription>Your submitted timesheets</CardDescription>
              </CardHeader>
              <CardContent>
                {timesheetsLoading ? (
                  <div className="text-center py-4">Loading timesheets...</div>
                ) : !timesheets?.data?.length ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No timesheets submitted yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timesheets.data.map((timesheet: WeeklyTimesheet) => (
                      <div key={timesheet.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">
                              Week of {format(parseISO(timesheet.weekStartDate), 'MMM dd')} - {format(addDays(parseISO(timesheet.weekStartDate), workingDaysPerWeek === 6 ? 5 : 4), 'MMM dd, yyyy')} ({workingDaysPerWeek === 6 ? 'Mon-Sat' : 'Mon-Fri'})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Submitted: {format(parseISO(timesheet.submittedAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          {getStatusBadge(timesheet.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total Hours:</span>
                            <p className="font-medium">{timesheet.totalWeeklyHours}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Amount:</span>
                            <p className="font-medium">{billingConfig?.data?.currency || 'USD'} {parseFloat(timesheet.totalWeeklyAmount || '0').toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <p className="font-medium capitalize">{timesheet.status}</p>
                          </div>
                          {timesheet.rejectionReason && (
                            <div className="md:col-span-4">
                              <span className="text-muted-foreground">Rejection Reason:</span>
                              <p className="text-red-600">{timesheet.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                        {timesheet.status !== 'approved' && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedWeek(timesheet.weekStartDate);
                                setActiveTab('timesheet');
                              }}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Update
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteTimesheet(timesheet.id)}
                              disabled={deleteTimesheetMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Attendance Tracking
                </CardTitle>
                <CardDescription>
                  View your attendance records and timesheet history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Monthly Calendar View */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Monthly Attendance</h3>
                    <Calendar
                      mode="single"
                      selected={new Date()}
                      className="rounded-md border w-fit"
                    />
                  </div>

                  {/* Attendance Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                          <p className="text-2xl font-bold text-green-600">
                            {timesheets?.data?.filter((t: WeeklyTimesheet) => t.status === 'approved').length || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Approved Timesheets</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <AlertCircle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                          <p className="text-2xl font-bold text-yellow-600">
                            {timesheets?.data?.filter((t: WeeklyTimesheet) => t.status === 'submitted').length || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Pending Review</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                          <p className="text-2xl font-bold text-blue-600">
                            {timesheets?.data?.reduce((sum: number, t: WeeklyTimesheet) => sum + t.totalWeeklyHours, 0) || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Total Hours</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly-timesheet" className="space-y-6">
            {/* Weekly Employee Timesheet */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Weekly Employee Timesheet
                    </CardTitle>
                    <CardDescription>
                      Professional timesheet template showing submitted and approved hours
                    </CardDescription>
                  </div>
                  
                  {/* Enhanced Week Range Filter */}
                  {timesheets?.data && timesheets.data.length > 0 && (
                    <div className="flex items-center gap-3">
                      <label htmlFor="timeframe-select" className="text-sm font-semibold text-gray-700">Timeframe</label>
                      <select 
                        id="timeframe-select"
                        value={selectedTimesheetId || ''}
                        onChange={(e) => setSelectedTimesheetId(e.target.value ? parseInt(e.target.value) : null)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white min-w-[280px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {!selectedTimesheetId && <option value="" disabled>Select a week range</option>}
                        {timesheets.data
                          .sort((a: WeeklyTimesheet, b: WeeklyTimesheet) => 
                            new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime()
                          )
                          .map((timesheet: WeeklyTimesheet) => {
                            const startDate = parseISO(timesheet.weekStartDate);
                            const endDate = addDays(startDate, billingConfig?.data?.workingDaysPerWeek === 6 ? 5 : 4);
                            const dateRange = `${format(startDate, 'dd/MM/yyyy')} to ${format(endDate, 'dd/MM/yyyy')}`;
                            return (
                              <option key={timesheet.id} value={timesheet.id}>
                                Week of {dateRange}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {timesheets?.data && timesheets.data.length > 0 ? (
                  <div className="space-y-6">
                    {selectedTimesheetId ? (
                      // Show selected timesheet
                      timesheets.data
                        .filter((t: WeeklyTimesheet) => t.id === selectedTimesheetId)
                        .map((timesheet: WeeklyTimesheet) => (
                          <TimesheetTemplate 
                            key={timesheet.id}
                            timesheet={timesheet}
                            billingConfig={billingConfig?.data}
                            user={user}
                          />
                        ))
                    ) : (
                      // Show message to select a timesheet
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Timesheet Week</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Please select a week from the dropdown above to view the timesheet template.
                        </p>
                        <p className="text-xs text-gray-400">
                          {timesheets.data.length} timesheet{timesheets.data.length !== 1 ? 's' : ''} available
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No timesheets submitted</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Submit your first timesheet to see it displayed here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            {/* Attendance Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Attendance Tracking
                </CardTitle>
                <CardDescription>
                  View your attendance summary and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Attendance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                        <p className="text-2xl font-bold text-green-600">
                          {timesheets?.data?.filter((t: WeeklyTimesheet) => t.status === 'approved').length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Approved Timesheets</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <AlertCircle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                        <p className="text-2xl font-bold text-yellow-600">
                          {timesheets?.data?.filter((t: WeeklyTimesheet) => t.status === 'submitted').length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Pending Review</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-blue-600">
                          {timesheets?.data?.reduce((sum: number, t: WeeklyTimesheet) => sum + t.totalWeeklyHours, 0) || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Hours</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CandidateLayout>
  );
}

// Professional Timesheet Template Component
function TimesheetTemplate({ timesheet, billingConfig, user }: {
  timesheet: WeeklyTimesheet;
  billingConfig?: BillingConfig;
  user: any;
}) {
  const weekStartDate = parseISO(timesheet.weekStartDate);
  const monthYear = format(weekStartDate, 'MMMM yyyy');
  
  // Days of the week - define this first
  const weekDays = [
    { label: 'Mon', key: 'mondayHours', date: format(addDays(weekStartDate, 0), 'M/d') },
    { label: 'Tue', key: 'tuesdayHours', date: format(addDays(weekStartDate, 1), 'M/d') },
    { label: 'Wed', key: 'wednesdayHours', date: format(addDays(weekStartDate, 2), 'M/d') },
    { label: 'Thu', key: 'thursdayHours', date: format(addDays(weekStartDate, 3), 'M/d') },
    { label: 'Fri', key: 'fridayHours', date: format(addDays(weekStartDate, 4), 'M/d') },
    { label: 'Sat', key: 'saturdayHours', date: format(addDays(weekStartDate, 5), 'M/d') },
    { label: 'Sun', key: 'sundayHours', date: format(addDays(weekStartDate, 6), 'M/d') }
  ];

  const workingDays = billingConfig?.workingDaysPerWeek === 6 ? weekDays : weekDays.slice(0, 5);
  
  // Now calculate week range using workingDays
  const weekEndDate = addDays(weekStartDate, workingDays.length - 1);
  const weekOf = `${format(weekStartDate, 'M/d/yyyy')} - ${format(weekEndDate, 'M/d/yyyy')}`;
  
  // Fetch company information for timesheet display
  const { data: companyInfo } = useQuery({
    queryKey: ['/api/candidate/timesheet-company-info'],
  });

  // Employment type for conditional columns
  const isFullTime = billingConfig?.employmentType === 'fulltime';

  // Get client company and company settings from API response
  const clientCompany = companyInfo?.data?.clientCompany;
  const niddikCompany = companyInfo?.data?.companySettings;

  // Debug logging to see actual data structure
  console.log('Company Info Response:', companyInfo);
  console.log('Niddik Company Data:', niddikCompany);
  console.log('Client Company Data:', clientCompany);

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          {/* Niddik Logo */}
          {(niddikCompany?.logoUrl || niddikCompany?.logo_url) && (
            <img 
              src={niddikCompany.logoUrl || niddikCompany.logo_url} 
              alt={niddikCompany.name || 'NIDDIK'} 
              className="w-16 h-16 object-contain"
            />
          )}
          <div>
            <h3 className="text-xl font-bold">{niddikCompany?.name || 'NIDDIK'}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{niddikCompany?.address || 'Platina Heights, Sector 59'}</p>
              <p>{niddikCompany?.city && niddikCompany?.state && niddikCompany?.country ? `${niddikCompany.city}, ${niddikCompany.state} ${niddikCompany.zipCode || niddikCompany.zip_code || ''}` : 'Noida, UP 201301'}</p>
              <p>{niddikCompany?.country || 'India'}</p>
              <p>{niddikCompany?.phoneNumbers?.[0] || niddikCompany?.phone_numbers?.[0] || '+91 9717312058'}</p>
              <p>{niddikCompany?.website || 'https://niddik.com'}</p>
            </div>
          </div>
        </div>
        
        <div className="text-right space-y-4">
          {/* Employee and Supervisor Information - Separate Block */}
          <div className="text-sm space-y-2 p-3 bg-gray-50 rounded-lg border">
            <div>
              <p className="font-medium"><strong>Employee Name:</strong> {user?.fullName || user?.username}</p>
            </div>
            <div>
              <p className="font-medium"><strong>Supervisor Name:</strong> {billingConfig?.supervisorName || 'Test'}</p>
            </div>
          </div>
          
          {/* Client Company Information - Separate Block */}
          {clientCompany && (
            <div className="text-sm p-3 bg-blue-50 rounded-lg border">
              <div className="flex items-center justify-end gap-2 mb-2">
                {(clientCompany.logoUrl || clientCompany.logo_url) && (
                  <img 
                    src={clientCompany.logoUrl || clientCompany.logo_url} 
                    alt={clientCompany.name} 
                    className="w-8 h-8 object-contain"
                  />
                )}
                <p className="font-medium"><strong>Client Company:</strong> {clientCompany.name}</p>
              </div>
              {(clientCompany.billToAddress || clientCompany.bill_to_address) && (
                <div className="text-xs text-gray-600 space-y-0.5 text-right">
                  <p>{clientCompany.billToAddress || clientCompany.bill_to_address}</p>
                  {(clientCompany.billToCity || clientCompany.bill_to_city) && (clientCompany.billToState || clientCompany.bill_to_state) && (
                    <p>{clientCompany.billToCity || clientCompany.bill_to_city}, {clientCompany.billToState || clientCompany.bill_to_state} {clientCompany.billToZipCode || clientCompany.bill_to_zip_code || ''}</p>
                  )}
                  {(clientCompany.billToCountry || clientCompany.bill_to_country) && <p>{clientCompany.billToCountry || clientCompany.bill_to_country}</p>}
                </div>
              )}
            </div>
          )}
          <div className="mt-4">
            <p className="font-semibold border-b-2 border-black inline-block text-lg">Week of: {weekOf}</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-green-600 text-white px-3 py-1 text-sm font-medium">
            {monthYear}
          </div>
          <div className="mt-2 text-xs">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="w-6 h-6 text-center font-medium text-gray-600">{day}</div>
              ))}
            </div>
            <div className="text-sm font-medium text-green-600 mb-1">
              Week Range
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Show week range based on working days */}
              {workingDays.map((day, index) => {
                const dayNumber = format(addDays(weekStartDate, index), 'd');
                return (
                  <div key={day.label} className="w-6 h-6 text-center text-xs bg-green-100 rounded flex items-center justify-center font-medium">
                    {dayNumber}
                  </div>
                );
              })}
              {/* Fill remaining days if working days < 7 */}
              {Array.from({ length: 7 - workingDays.length }, (_, i) => (
                <div key={`empty-${i}`} className="w-6 h-6"></div>
              ))}
            </div>
            <div className="text-xs text-gray-600 mt-1 font-medium">
              {format(weekStartDate, 'MMM d')} - {format(addDays(weekStartDate, workingDays.length - 1), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <Badge 
          className={
            timesheet.status === 'approved' 
              ? 'bg-green-100 text-green-800' 
              : timesheet.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }
        >
          {timesheet.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
          {timesheet.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
          {timesheet.status === 'submitted' && <AlertCircle className="w-3 h-3 mr-1" />}
          {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
        </Badge>
      </div>

      {/* Timesheet Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 text-sm">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="border border-gray-400 px-2 py-1 font-bold">Day of Week</th>
              <th className="border border-gray-400 px-2 py-1 font-bold">Regular<br/>[h:mm]</th>
              <th className="border border-gray-400 px-2 py-1 font-bold">Overtime<br/>[h:mm]</th>
              {isFullTime && (
                <>
                  <th className="border border-gray-400 px-2 py-1 font-bold">Sick<br/>[h:mm]</th>
                  <th className="border border-gray-400 px-2 py-1 font-bold">Paid Leave<br/>[h:mm]</th>
                  <th className="border border-gray-400 px-2 py-1 font-bold">Unpaid Leave<br/>[h:mm]</th>
                </>
              )}
              <th className="border border-gray-400 px-2 py-1 font-bold">TOTAL<br/>[h:mm]</th>
            </tr>
          </thead>
          <tbody>
            {workingDays.map((day) => {
              const hours = parseFloat(timesheet[day.key as keyof WeeklyTimesheet] as string) || 0;
              const hoursFormatted = hours.toFixed(2);
              
              return (
                <tr key={day.label}>
                  <td className="border border-gray-400 px-2 py-1 font-medium">
                    {day.label} {day.date}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 text-center">
                    {hoursFormatted}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 text-center">0.00</td>
                  {isFullTime && (
                    <>
                      <td className="border border-gray-400 px-2 py-1 text-center bg-green-100"></td>
                      <td className="border border-gray-400 px-2 py-1 text-center bg-green-100"></td>
                      <td className="border border-gray-400 px-2 py-1 text-center bg-green-100"></td>
                    </>
                  )}
                  <td className="border border-gray-400 px-2 py-1 text-center font-medium">
                    {hoursFormatted}
                  </td>
                </tr>
              );
            })}
            
            {/* Total Row */}
            <tr className="bg-green-100">
              <td className="border border-gray-400 px-2 py-1 font-bold">Total Hrs:</td>
              <td className="border border-gray-400 px-2 py-1 text-center font-bold">
                {parseFloat(timesheet.totalWeeklyHours).toFixed(2)}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-center font-bold">0.00</td>
              {isFullTime && (
                <>
                  <td className="border border-gray-400 px-2 py-1 text-center font-bold">0.00</td>
                  <td className="border border-gray-400 px-2 py-1 text-center font-bold">0.00</td>
                  <td className="border border-gray-400 px-2 py-1 text-center font-bold">0.00</td>
                </>
              )}
              <td className="border border-gray-400 px-2 py-1 text-center font-bold">
                {parseFloat(timesheet.totalWeeklyHours).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rate and Pay Information */}
      <div className="mt-4">
        <table className="w-full border-collapse border border-gray-400 text-sm">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1 font-medium">Rate/Hour:</td>
              <td className="border border-gray-400 px-2 py-1 text-center">
                {billingConfig?.currency} {parseFloat(billingConfig?.hourlyRate || '0').toFixed(2)}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-center">
                {billingConfig?.currency} 0.00
              </td>
              {isFullTime && (
                <>
                  <td className="border border-gray-400 px-2 py-1 text-center">{billingConfig?.currency} 0.00</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{billingConfig?.currency} 0.00</td>
                  <td className="border border-gray-400 px-2 py-1 text-center">{billingConfig?.currency} 0.00</td>
                </>
              )}
              <td className="border border-gray-400 px-2 py-1 text-center"></td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-400 px-2 py-1 font-bold">Total Pay:</td>
              <td className="border border-gray-400 px-2 py-1 text-center font-bold">
                {billingConfig?.currency} {parseFloat(timesheet.totalWeeklyAmount).toFixed(2)}
              </td>
              <td className="border border-gray-400 px-2 py-1 text-center font-bold">
                {billingConfig?.currency} 0.00
              </td>
              {isFullTime && (
                <>
                  <td className="border border-gray-400 px-2 py-1 text-center font-bold">{billingConfig?.currency} 0.00</td>
                  <td className="border border-gray-400 px-2 py-1 text-center font-bold">{billingConfig?.currency} 0.00</td>
                  <td className="border border-gray-400 px-2 py-1 text-center font-bold">{billingConfig?.currency} 0.00</td>
                </>
              )}
              <td className="border border-gray-400 px-2 py-1 text-center font-bold bg-red-600 text-white">
                {billingConfig?.currency} {parseFloat(timesheet.totalWeeklyAmount).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 text-center">
        <div className="inline-block border-2 border-red-600 p-2">
          <p className="font-bold">Total Hours Reported: <span className="text-red-600">{parseFloat(timesheet.totalWeeklyHours).toFixed(2)}</span></p>
          <p className="font-bold">Total Pay: <span className="bg-red-600 text-white px-2">{billingConfig?.currency} {parseFloat(timesheet.totalWeeklyAmount).toFixed(2)}</span></p>
        </div>
      </div>

      {/* Signature Lines */}
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <div className="border-b border-black mb-1"></div>
          <p className="text-sm">Employee Signature</p>
          <div className="border-b border-black mb-1 mt-6"></div>
          <p className="text-sm">Date</p>
        </div>
        <div>
          <div className="border-b border-black mb-1"></div>
          <p className="text-sm">Supervisor Signature</p>
          <div className="border-b border-black mb-1 mt-6"></div>
          <p className="text-sm">Date</p>
        </div>
      </div>
    </div>
  );
}