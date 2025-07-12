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
import { format, startOfWeek, addDays, parseISO, isAfter, endOfWeek } from 'date-fns';
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
  status: 'submitted' | 'approved' | 'rejected';
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
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [activeTab, setActiveTab] = useState("timesheet");
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

  // Get specific week timesheet
  const weekStartString = format(selectedWeek, 'yyyy-MM-dd');
  const { data: weekTimesheet, isLoading: weekTimesheetLoading, error: weekTimesheetError } = useQuery({
    queryKey: [`/api/timesheets/${user?.id}/${weekStartString}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && !!weekStartString,
  });

  // Create timesheet mutation
  const createTimesheetMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/timesheets', data),
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
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest('PUT', `/api/timesheets/${id}`, data),
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
      // Populate form with existing data
      setNewTimesheet({
        mondayHours: parseFloat(weekTimesheet.data.mondayHours) || 0,
        tuesdayHours: parseFloat(weekTimesheet.data.tuesdayHours) || 0,
        wednesdayHours: parseFloat(weekTimesheet.data.wednesdayHours) || 0,
        thursdayHours: parseFloat(weekTimesheet.data.thursdayHours) || 0,
        fridayHours: parseFloat(weekTimesheet.data.fridayHours) || 0,
        saturdayHours: parseFloat(weekTimesheet.data.saturdayHours) || 0,
        sundayHours: parseFloat(weekTimesheet.data.sundayHours) || 0
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
    mutationFn: (timesheetId: number) => apiRequest('DELETE', `/api/timesheets/${timesheetId}`),
    onSuccess: () => {
      toast({
        title: "Timesheet deleted successfully",
        description: "Your timesheet has been deleted",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/timesheets/candidate/${user?.id}`] });
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

  const totalHours = Object.values(newTimesheet).reduce((sum, hours) => sum + hours, 0);
  const totalAmount = totalHours * (billingConfig?.data?.hourlyRate || 0);

  // Check if selected week has ended (can only update timesheets during current week)
  const selectedWeekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  const isCurrentWeek = !isAfter(new Date(), selectedWeekEnd);
  const canUpdateTimesheet = isCurrentWeek; // Can update only during current week
  const canSubmitNewTimesheet = isAfter(new Date(), selectedWeekEnd); // Can submit new only after week ends

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'submitted':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  // Dynamic working days based on billing configuration
  const workingDaysPerWeek = billingConfig?.data?.workingDaysPerWeek || 5;
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

  // Check if candidate is hired
  const isHired = billingConfig?.data?.hasHiredApplication === true;

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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timesheet" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timesheet Submission
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
                    mode="range"
                    selected={{
                      from: selectedWeek,
                      to: addDays(selectedWeek, workingDaysPerWeek === 6 ? 5 : 4)
                    }}
                    onSelect={(range) => {
                      if (range?.from) {
                        setSelectedWeek(startOfWeek(range.from, { weekStartsOn: 1 }));
                      }
                    }}
                    className="rounded-md border"
                    numberOfMonths={1}
                  />
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
                {!canUpdateTimesheet && weekTimesheet?.data && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-blue-800">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Week ended: This timesheet is locked for editing. You can only view the submitted data.
                    </p>
                  </div>
                )}
                {canUpdateTimesheet && weekTimesheet?.data && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-green-800">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Current week: You can update your timesheet until the week ends.
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
                          disabled={weekTimesheet?.data?.status === 'approved' || (!canUpdateTimesheet && weekTimesheet?.data)}
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
                      canSubmitNewTimesheet ? (
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
                          Timesheet submission available after week ends
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
                          Week ended - Timesheet locked for editing
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
                              {format(parseISO(timesheet.weekStartDate), 'MMM dd')} - {format(addDays(parseISO(timesheet.weekStartDate), workingDaysPerWeek === 6 ? 5 : 4), 'MMM dd, yyyy')}
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
        </Tabs>
      </div>
    </CandidateLayout>
  );
}