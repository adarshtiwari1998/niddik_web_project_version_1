import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, FileText, Download, Search, Users, AlertCircle, ChartBar, Eye, ExternalLink, Filter, Phone, Mail, Calendar, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { JobApplication } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

type ApplicationWithDetails = JobApplication & {
  billRate?: string;
  payRate?: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
    experience: string;
    noticePeriod: string;
    currentCtc: string;
    expectedCtc: string;
    location: string;
    city: string;
    country: string;
    zipCode: string;
  };
  job: {
    title: string;
    company: string;
    location: string;
  };
};

interface AnalyticsData {
  userEmail: string;
  userName: string;
  applicationsCount: number;
  latestApplicationDate: string;
  statuses: {
    new: number;
    reviewing: number;
    interview: number;
    hired: number;
    rejected: number;
  };
  applications: Array<{
    id: number;
    jobId: number;
    status: string;
    appliedDate: string;
    lastUpdated: string;
    coverLetter?: string;
    resumeUrl?: string;
    skills?: string;
    jobTitle: string;
    jobCompany: string;
    jobLocation: string;
  }>;
}

// Analytics Overview Card
function AnalyticsOverview({ data }: { data: AnalyticsData[] }) {
  const totalUsers = data.length;
  let totalApplications = 0;
  data.forEach(user => {
    totalApplications += user.applicationsCount;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
        <CardDescription>High-level summary of user applications</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-lg font-semibold">{totalUsers}</div>
          <div className="text-muted-foreground">Total Users</div>
        </div>
        <div>
          <div className="text-lg font-semibold">{totalApplications}</div>
          <div className="text-muted-foreground">Total Applications</div>
        </div>
      </CardContent>
    </Card>
  );
}

// Status Distribution Card
function StatusDistributionCard({ data }: { data: AnalyticsData[] }) {
  const totalNew = data.reduce((acc, user) => acc + user.statuses.new, 0);
  const totalReviewing = data.reduce((acc, user) => acc + user.statuses.reviewing, 0);
  const totalInterview = data.reduce((acc, user) => acc + user.statuses.interview, 0);
  const totalHired = data.reduce((acc, user) => acc + user.statuses.hired, 0);
  const totalRejected = data.reduce((acc, user) => acc + user.statuses.rejected, 0);

  const totalApplications = totalNew + totalReviewing + totalInterview + totalHired + totalRejected;

  const newPercentage = totalApplications > 0 ? (totalNew / totalApplications) * 100 : 0;
  const reviewingPercentage = totalApplications > 0 ? (totalReviewing / totalApplications) * 100 : 0;
  const interviewPercentage = totalApplications > 0 ? (totalInterview / totalApplications) * 100 : 0;
  const hiredPercentage = totalApplications > 0 ? (totalHired / totalApplications) * 100 : 0;
  const rejectedPercentage = totalApplications > 0 ? (totalRejected / totalApplications) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
        <CardDescription>Distribution of application statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-lg font-semibold">{totalNew}</div>
            <div className="text-muted-foreground">New ({newPercentage.toFixed(1)}%)</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{totalReviewing}</div>
            <div className="text-muted-foreground">Reviewing ({reviewingPercentage.toFixed(1)}%)</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{totalInterview}</div>
            <div className="text-muted-foreground">Interview ({interviewPercentage.toFixed(1)}%)</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{totalHired}</div>
            <div className="text-muted-foreground">Hired ({hiredPercentage.toFixed(1)}%)</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{totalRejected}</div>
            <div className="text-muted-foreground">Rejected ({rejectedPercentage.toFixed(1)}%)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// User Applications Table
function UserApplicationsTable({ data }: { data: AnalyticsData[] }) {
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Applications</CardTitle>
        <CardDescription>List of users and their application details</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Applications Count</TableHead>
              <TableHead>Latest Application Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.userEmail}>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.userEmail}</TableCell>
                <TableCell>{user.applicationsCount}</TableCell>
                <TableCell>{user.latestApplicationDate}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setSelectedUserEmail(user.userEmail)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function UserDetailModal({ 
  userEmail, 
  data, 
  onClose 
}: { 
  userEmail: string | null, 
  data: AnalyticsData[], 
  onClose: () => void 
}) {
  const userData = userEmail ? data.find(user => user.userEmail === userEmail) : null;

  if (!userData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'reviewing': return 'secondary';
      case 'interview': return 'outline';
      case 'hired': return 'default'; // Success variant
      case 'rejected': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Dialog open={!!userEmail} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Application Details</DialogTitle>
          <DialogDescription>
            Detailed view of applications for {userData.userName}
          </DialogDescription>
        </DialogHeader>
        
        {/* User Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Name</div>
            <div className="text-base font-semibold">{userData.userName}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Email</div>
            <div className="text-base font-semibold">{userData.userEmail}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Total Applications</div>
            <div className="text-base font-semibold">{userData.applicationsCount}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Latest Application</div>
            <div className="text-base font-semibold">{userData.latestApplicationDate}</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Job Applications</h3>
          {userData.applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications found
            </div>
          ) : (
            <div className="space-y-4">
              {userData.applications.map((app) => (
                <Card key={app.id} className="border-l-4 border-l-primary/20">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{app.jobTitle}</h4>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {app.jobCompany} • {app.jobLocation}
                            </p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(app.status)}>
                            {app.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div className="text-sm">
                            <span className="font-medium text-muted-foreground">Applied Date:</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(app.appliedDate)}
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-muted-foreground">Last Updated:</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(app.lastUpdated)}
                            </div>
                          </div>
                        </div>

                        {app.skills && (
                          <div className="mt-3">
                            <span className="font-medium text-muted-foreground text-sm">Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {app.skills.split(',').map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {app.coverLetter && (
                          <div className="mt-3">
                            <span className="font-medium text-muted-foreground text-sm">Cover Letter:</span>
                            <p className="text-sm mt-1 p-2 bg-muted/50 rounded text-muted-foreground">
                              {app.coverLetter}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {app.resumeUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(app.resumeUrl, '_blank')}
                            className="gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            View Resume
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`mailto:${userData.userEmail}`, '_blank')}
                          className="gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Candidates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all_statuses");
  const pageSize = 10;

  const [analyticsSearch, setAnalyticsSearch] = useState("");
  const [analyticsStatusFilter, setAnalyticsStatusFilter] = useState<string>("all_statuses");
  const [sortBy, setSortBy] = useState<string>("applications_desc");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);

  // Build query parameters for API request
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", pageSize.toString());

    if (search) params.append("search", search);
    if (statusFilter && statusFilter !== "all_statuses") params.append("status", statusFilter);

    return params.toString();
  };

    // Build query parameters for analytics API request
    const buildAnalyticsQueryParams = () => {
      const params = new URLSearchParams();
      if (analyticsSearch) params.append("search", analyticsSearch);
      if (analyticsStatusFilter && analyticsStatusFilter !== "all_statuses") params.append("status", analyticsStatusFilter);
      if (sortBy) params.append("sortBy", sortBy);

      return params.toString();
    };

  // Fetch job applications data
  const { data, isLoading, error } = useQuery<{ 
    success: boolean; 
    data: ApplicationWithDetails[];
    meta: { 
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  }>({
    queryKey: ['/api/admin/applications', page, search, statusFilter],
    queryFn: async () => {
      const res = await fetch(`/api/admin/applications?${buildQueryParams()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json();
    },
    refetchInterval: 20000, // Refetch every 20 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Consider data stale immediately
  });

    // Fetch analytics data
    const { data: analyticsData, isLoading: isAnalyticsLoading, error: analyticsError } = useQuery<AnalyticsData[]>({
      queryKey: ['/api/admin/analytics', analyticsSearch, analyticsStatusFilter, sortBy],
      queryFn: async () => {
        const res = await fetch(`/api/admin/analytics?${buildAnalyticsQueryParams()}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (!res.ok) throw new Error("Failed to fetch analytics data");
        return res.json();
      },
      refetchInterval: 30000, // Refetch every 30 seconds
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 0, // Consider data stale immediately
    });

  // Format date to a readable string
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Handler for viewing application details
  const handleViewResume = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("Resume not available");
    }
  };

  // Create a mutation for updating application status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      console.log(`Updating application ${id} to status: ${status}`);
      const res = await fetch(`/api/admin/job-applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Status update error:", errorText);
        throw new Error(`Failed to update application status: ${errorText}`);
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate the applications query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/applications'] });

      toast({
        title: "Status updated",
        description: `Application status changed to ${variables.status}`,
      });
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast({
        title: "Update failed",
        description: "Failed to update application status",
        variant: "destructive",
      });
    },
  });

  // Handler for updating application status
  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  // Handler for showing user details in modal
  const handleViewUserDetails = (userEmail: string) => {
    setSelectedUserEmail(userEmail);
  };

  // Redirect to login if not authenticated or not an admin
  if (!user || user.role !== "admin") {
    return null; // The ProtectedRoute component will handle redirection
  }

  return (
    <AdminLayout 
      title="Candidate Applications" 
      description="Manage and review job applications"
    >
      <Tabs defaultValue="applications" className="w-full">
        <TabsList>
          <TabsTrigger value="applications">
            <FileText className="h-4 w-4 mr-2" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <ChartBar className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Application Filters</CardTitle>
              <CardDescription>Search and filter candidate applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>

                <div>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_statuses">All Statuses</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all_statuses");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>
                {data?.meta?.total || 0} applications found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center">Loading applications...</div>
              ) : !data?.data || data.data.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No applications found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate Name</TableHead>
                        <TableHead>Contact No.</TableHead>
                        <TableHead>Email ID</TableHead>
                        <TableHead>Exp.</TableHead>
                        <TableHead>Notice Period</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>CTC</TableHead>
                        <TableHead>Expected CTC</TableHead>
                        {/* <TableHead>Bill Rate</TableHead>
                        <TableHead>Pay Rate</TableHead>
                        <TableHead>Margin/Profit</TableHead> */}
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.data.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <button
                                onClick={() => handleViewUserDetails(application.user.email)}
                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-left"
                                title="View user details"
                              >
                                {application.user.fullName}
                                <ExternalLink className="h-3 w-3" />
                              </button>
                              <div className="text-xs text-muted-foreground">{application.job.title}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {application.user.phone || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {application.user.email}
                            </div>
                          </TableCell>
                          <TableCell>{application.user.experience || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {application.user.noticePeriod || "Immediately"}
                            </div>
                          </TableCell>
                          <TableCell>{application.user.location || application.job.location || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {application.user.currentCtc || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {application.user.expectedCtc || "-"}
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            {application.billRate ? `$${application.billRate}` : "-"}
                          </TableCell>
                          <TableCell>
                            {application.payRate ? `$${application.payRate}` : "-"}
                          </TableCell>
                          <TableCell>
                            {application.billRate && application.payRate 
                              ? `$${(parseFloat(application.billRate) - parseFloat(application.payRate)).toFixed(2)}` 
                              : "-"}
                          </TableCell> */}
                          <TableCell>
                            <Select
                              value={application.status}
                              onValueChange={(value) => handleUpdateStatus(application.id, value)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <Badge
                                  variant={
                                    application.status === "new" ? "default" :
                                    application.status === "reviewing" ? "secondary" :
                                    application.status === "interview" ? "outline" :
                                    application.status === "hired" ? "success" :
                                    application.status === "rejected" ? "destructive" : "default"
                                  }
                                >
                                  {application.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="reviewing">Reviewing</SelectItem>
                                <SelectItem value="interview">Interview</SelectItem>
                                <SelectItem value="hired">Hired</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewResume(application.resumeUrl || '')}
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View Resume</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = `mailto:${application.user.email}`}
                              >
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Email</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            {data?.meta && data.meta.pages > 1 && (
              <CardFooter className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {data.meta.pages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(data.meta.pages, p + 1))}
                    disabled={page >= data.meta.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-8"
                  value={analyticsSearch}
                  onChange={(e) => setAnalyticsSearch(e.target.value)}
                />
              </div>
            </div>

            <Select value={analyticsStatusFilter} onValueChange={setAnalyticsStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_statuses">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applications_desc">Most Applications</SelectItem>
                <SelectItem value="applications_asc">Least Applications</SelectItem>
                <SelectItem value="latest_desc">Latest Activity</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Applications</CardTitle>
              <CardDescription>List of users and their application details</CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyticsLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-muted-foreground">Loading analytics data...</p>
                </div>
              ) : analyticsError ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <p className="mt-2 text-destructive">Failed to load analytics data</p>
                  <p className="text-sm text-muted-foreground">{analyticsError.message}</p>
                </div>
              ) : !analyticsData || analyticsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Users className="h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No user applications found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Applications Count</TableHead>
                      <TableHead>Latest Application Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.map((user, index) => (
                      <TableRow key={user.userEmail || index}>
                        <TableCell className="font-medium">
                          {user.userName || 'Unknown User'}
                        </TableCell>
                        <TableCell>{user.userEmail}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {user.applicationsCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.latestApplicationDate || 'No applications'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewUserDetails(user.userEmail)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* User Detail Modal */}
          <UserDetailModal 
            userEmail={selectedUserEmail}
            data={analyticsData || []}
            onClose={() => setSelectedUserEmail(null)}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}