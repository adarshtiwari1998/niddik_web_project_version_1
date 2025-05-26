import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone,
  FileText,
  Calendar,
  DollarSign,
  ExternalLink
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { JobApplication } from "@shared/schema";
import AdminLayout from "@/components/layout/AdminLayout";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartBar,
  ChartPie
} from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
  applications: JobApplication[];
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
function UserApplicationsTable({ data, onViewDetails }: { data: AnalyticsData[], onViewDetails: (userEmail: string) => void }) {
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
                  <Button variant="outline" size="sm" onClick={() => onViewDetails(user.userEmail)}>
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

function UserDetailModal({ userEmail, data, onClose }: { userEmail: string | null, data: AnalyticsData[], onClose: () => void }) {
  const userData = userEmail ? data.find(user => user.userEmail === userEmail) : null;

  if (!userData) {
    return null;
  }

  return (
    <Dialog open={!!userEmail} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Details for {userData.userName}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-lg font-semibold">{userData.userName}</div>
            <div className="text-muted-foreground">Name</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{userData.userEmail}</div>
            <div className="text-muted-foreground">Email</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{userData.applicationsCount}</div>
            <div className="text-muted-foreground">Applications Count</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{userData.latestApplicationDate}</div>
            <div className="text-muted-foreground">Latest Application Date</div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Job Applications</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData.applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.jobId || 'N/A'}</TableCell>
                    <TableCell>{app.jobTitle || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          app.status === "new" ? "default" :
                          app.status === "reviewing" ? "secondary" :
                          app.status === "interview" ? "outline" :
                          app.status === "hired" ? "success" :
                          app.status === "rejected" ? "destructive" : "default"
                        }
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 
                       app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Candidates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
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

    

  // Fetch job applications data
  const { data: applicationsData, isLoading, error } = useQuery({
    queryKey: ['/api/admin/applications', statusFilter],
    queryFn: async () => {
      const queryParams = buildQueryParams();
      const res = await fetch(`/api/admin/applications?${queryParams}`, {
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

  // Client-side filtering of applications based on search term
  const filteredApplications = useMemo(() => {
    if (!applicationsData?.data) return [];

    let filtered = applicationsData.data;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((application: any) => 
        application.user?.fullName?.toLowerCase().includes(searchLower) ||
        application.user?.email?.toLowerCase().includes(searchLower) ||
        application.user?.phone?.toLowerCase().includes(searchLower) ||
        application.user?.skills?.toLowerCase().includes(searchLower) ||
        application.user?.location?.toLowerCase().includes(searchLower) ||
        application.job?.title?.toLowerCase().includes(searchLower) ||
        application.job?.company?.toLowerCase().includes(searchLower) ||
        application.status?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [applicationsData?.data, search]);

  // Fetch analytics data
  const { data: analyticsData, isLoading: isAnalyticsLoading, error: analyticsError } = useQuery<AnalyticsData[]>({
    queryKey: ['/api/admin/analytics'],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics`, {
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

  // Client-side filtering of analytics data based on search term
  const filteredAnalyticsData = useMemo(() => {
    if (!analyticsData) return [];

    let filtered = analyticsData;

    // Apply search filter
    if (analyticsSearch) {
      const searchLower = analyticsSearch.toLowerCase();
      filtered = filtered.filter((user: AnalyticsData) => 
        user.userName?.toLowerCase().includes(searchLower) ||
        user.userEmail?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (analyticsStatusFilter && analyticsStatusFilter !== "all_statuses") {
      filtered = filtered.filter((user: AnalyticsData) => {
        return user.statuses[analyticsStatusFilter as keyof typeof user.statuses] > 0;
      });
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'applications_desc':
          return b.applicationsCount - a.applicationsCount;
        case 'applications_asc':
          return a.applicationsCount - b.applicationsCount;
        case 'latest_desc':
          return new Date(b.latestApplicationDate).getTime() - new Date(a.latestApplicationDate).getTime();
        case 'name_asc':
          return a.userName.localeCompare(b.userName);
        default:
          return b.applicationsCount - a.applicationsCount;
      }
    });
  }, [analyticsData, analyticsSearch, analyticsStatusFilter, sortBy]);

  // Client-side pagination
  const paginatedApplications = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, page, pageSize]);

  // Calculate total pages based on filtered results
  const totalPages = Math.ceil(filteredApplications.length / pageSize);

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

  // Handler for navigating to user details
  const handleViewUserDetails = (userEmail: string) => {
    // Navigate to users page with search parameter to find the user
    setLocation(`/admin/users?search=${encodeURIComponent(userEmail)}`);
  };

  // Redirect to login if not authenticated or not an admin
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    // No API call needed since we're filtering client-side
  };

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
                    placeholder="Search by name, email, date (YYYY-MM-DD), or skills..."
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
                {applicationsData?.data?.length} applications found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <span className="text-sm text-muted-foreground mt-2 block">Loading applications...</span>
                  </TableCell>
                </TableRow>
              ) : paginatedApplications?.length === 0 ? (
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
                        <TableHead>Skills</TableHead>
                        <TableHead>Application Date</TableHead>
                        <TableHead>Cover Letter/Note</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedApplications?.map((application: any) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <button
                                onClick={() => handleViewUserDetails(application.user?.email || '')}
                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-left"
                                title="View user details"
                              >
                                {application.user?.fullName || 'Unknown User'}
                                <ExternalLink className="h-3 w-3" />
                              </button>
                              <div className="text-xs text-muted-foreground">{application.job?.title || 'Unknown Job'}</div>
                              <div className="text-xs text-gray-500">
                                Applied: {formatDate(application.appliedDate || application.createdAt)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {application.user?.phone || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {application.user?.email || "-"}
                            </div>
                          </TableCell>
                          <TableCell>{application.user?.experience || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {application.user?.noticePeriod || "Immediately"}
                            </div>
                          </TableCell>
                          <TableCell>{application.user?.location || application.job?.location || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {application.user?.currentCtc || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {application.user?.expectedCtc || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[250px]">
                              <span className="text-xs text-gray-600">
                                {application.skills || 'Not specified'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span className="text-sm">
                                {formatDate(application.appliedDate || application.createdAt)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px]">
                              {application.coverLetter ? (
                                <div>
                                  <span className="text-xs text-gray-600 block">
                                    {application.coverLetter.length > 50 
                                      ? `${application.coverLetter.substring(0, 50)}...` 
                                      : application.coverLetter
                                    }
                                  </span>
                                  {application.coverLetter.length > 50 && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="link" size="sm" className="p-0 h-auto text-xs text-blue-600">
                                          Read More
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                          <DialogTitle>Cover Letter</DialogTitle>
                                          <DialogDescription>
                                            Full cover letter from {application.user?.fullName || 'Unknown User'}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-4">
                                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {application.coverLetter}
                                          </p>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">No cover letter provided</span>
                              )}
                            </div>
                          </TableCell>
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
                                onClick={() => window.location.href = `mailto:${application.user?.email || ''}`}
                                disabled={!application.user?.email}
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
             <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredApplications.length)} of {filteredApplications.length} applications
            {search && applicationsData?.data && (
              <span className="text-blue-600 ml-2">
                (filtered from {applicationsData.data.length} total)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analyticsData ? (
            <>
              <AnalyticsOverview data={filteredAnalyticsData} />
              <StatusDistributionCard data={filteredAnalyticsData} />

              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Analytics Filters</CardTitle>
                  <CardDescription>Filter and sort user analytics data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search users..."
                        value={analyticsSearch}
                        onChange={(e) => setAnalyticsSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>

                    <Select
                      value={analyticsStatusFilter}
                      onValueChange={setAnalyticsStatusFilter}
                    >
                      <SelectTrigger>
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_statuses">All Statuses</SelectItem>
                        <SelectItem value="new">Has New</SelectItem>
                        <SelectItem value="reviewing">Has Reviewing</SelectItem>
                        <SelectItem value="interview">Has Interview</SelectItem>
                        <SelectItem value="hired">Has Hired</SelectItem>
                        <SelectItem value="rejected">Has Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={sortBy}
                      onValueChange={setSortBy}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applications_desc">Most Applications</SelectItem>
                        <SelectItem value="applications_asc">Least Applications</SelectItem>
                        <SelectItem value="latest_desc">Latest Application</SelectItem>
                        <SelectItem value="name_asc">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setAnalyticsSearch("");
                        setAnalyticsStatusFilter("all_statuses");
                        setSortBy("applications_desc");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <UserApplicationsTable 
                data={filteredAnalyticsData} 
                onViewDetails={setSelectedUserEmail}
              />

              <UserDetailModal 
                userEmail={selectedUserEmail} 
                data={filteredAnalyticsData} 
                onClose={() => setSelectedUserEmail(null)}
              />
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Loading analytics data...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}