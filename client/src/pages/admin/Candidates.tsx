import { useState } from "react";
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

export default function Candidates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all_statuses");
  const pageSize = 10;

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
    window.location.href = `/admin/users?search=${encodeURIComponent(userEmail)}`;
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
                    <TableHead>Bill Rate</TableHead>
                    <TableHead>Pay Rate</TableHead>
                    <TableHead>Margin/Profit</TableHead>
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
                      <TableCell>
                        {application.billRate ? `$${application.billRate}` : "-"}
                      </TableCell>
                      <TableCell>
                        {application.payRate ? `$${application.payRate}` : "-"}
                      </TableCell>
                      <TableCell>
                        {application.billRate && application.payRate 
                          ? `$${(parseFloat(application.billRate) - parseFloat(application.payRate)).toFixed(2)}` 
                          : "-"}
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
    </AdminLayout>
  );
}