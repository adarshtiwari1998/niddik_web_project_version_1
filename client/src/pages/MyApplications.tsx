import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileText, ExternalLink, Clock, Calendar, Briefcase, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { JobApplication } from "@shared/schema";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import { Link, useLocation } from "wouter";

// Application with job details
type ApplicationWithJob = JobApplication & {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
    salary: string;
    category: string;
    experienceLevel: string;
    postedDate: string;
  };
};

export default function MyApplications() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("all");
  const pageSize = 5;

  // Reset page when activeTab changes and invalidate query cache
  useEffect(() => {
    setPage(1);
    // Force refetch when tab changes
    queryClient.invalidateQueries({ queryKey: ['/api/my-applications'] });
  }, [activeTab]);

  // Fetch user's job applications (without status filter - get all)
  const { data: allApplicationsData, isLoading, error } = useQuery<{ 
    success: boolean; 
    data: ApplicationWithJob[];
    meta: {
      total: number;
      pages: number;
    }
  }>({
    queryKey: ['/api/my-applications', { userId: user?.id }],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // Fetch all applications without status filter
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "1000"); // Get all applications

      const url = `/api/my-applications?${params.toString()}`;
      console.log('🔍 Fetching all applications:', url);
      
      const res = await fetch(url, { 
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error("Failed to fetch applications");
      const result = await res.json();
      
      console.log('📊 Received', result.data?.length || 0, 'total applications');
      return result;
    },
    enabled: !!user,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0,
  });

  // Frontend filtering logic
  const filteredData = useMemo(() => {
    if (!allApplicationsData?.data) return { data: [], meta: { total: 0, pages: 0 } };

    console.log('🔄 Frontend filtering - Active tab:', activeTab);
    console.log('📋 All applications statuses:', allApplicationsData.data.map(app => ({ id: app.id, status: app.status })));

    // Filter applications based on active tab
    let filtered = allApplicationsData.data;
    if (activeTab !== "all") {
      filtered = allApplicationsData.data.filter(app => {
        console.log(`🔍 Checking app ${app.id}: status="${app.status}" vs tab="${activeTab}"`);
        return app.status?.toLowerCase() === activeTab.toLowerCase();
      });
    }

    console.log('✅ Filtered result:', {
      activeTab,
      totalApps: allApplicationsData.data.length,
      filteredCount: filtered.length,
      filteredIds: filtered.map(app => app.id)
    });

    // Apply pagination to filtered results
    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      meta: {
        total,
        pages: Math.ceil(total / pageSize)
      }
    };
  }, [allApplicationsData, activeTab, page, pageSize]);

  // Use filtered data instead of raw API data
  const data = {
    success: true,
    data: filteredData.data,
    meta: filteredData.meta
  };

  // Format date to a readable string
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  };

  // Get appropriate badge variant based on status
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'default';
      case 'reviewing':
        return 'secondary';
      case 'interview':
        return 'outline';
      case 'hired':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'withdrawn':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Get human-readable status
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'Application Submitted';
      case 'reviewing':
        return 'Under Review';
      case 'interview':
        return 'Interview Stage';
      case 'hired':
        return 'Hired';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };

  // Withdraw application mutation
  const withdrawMutation = useMutation({
    mutationFn: async (applicationId: number) => {
      const res = await fetch(`/api/my-applications/${applicationId}/withdraw`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to withdraw application");
      }
      return res.json();
    },
    onMutate: async (applicationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/my-applications'] });
      
      // Snapshot previous value
      const previousApplications = queryClient.getQueryData(['/api/my-applications']);
      
      // Return context with snapshot
      return { previousApplications };
    },
    onSuccess: (data, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-applications'] });
      toast({
        title: "Application withdrawn",
        description: "Your application has been successfully withdrawn",
      });
    },
    onError: (error, variables, context) => {
      // If there was an error, restore previous data
      if (context?.previousApplications) {
        queryClient.setQueryData(['/api/my-applications'], context.previousApplications);
      }
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to withdraw application",
        variant: "destructive",
      });
    }
  });

  // Handle application withdrawal with confirmation
  const handleWithdraw = async (id: number) => {
    if (withdrawMutation.isPending) return;
    
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      try {
        await withdrawMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to withdraw application:", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-10 text-center">
            <p>Please sign in to view your applications.</p>
            <Link href="/candidate/auth">
              <Button className="mt-4">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CandidateLayout activeTab="applications">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage all your job applications
          </p>
        </div>
        <Link href="/candidate/profile">
          <Button variant="outline">
            View My Profile
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="reviewing">Under Review</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="hired">Hired</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-red-500">Error loading applications. Please try again.</p>
            <Button variant="outline" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/my-applications'] })}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : data?.data.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p>
              {activeTab === "all" 
                ? "You haven't applied to any jobs yet." 
                : `No applications found with "${activeTab}" status.`
              }
            </p>
            <Link href={activeTab === "all" ? "/careers" : "/candidate/applications"}>
              <Button className="mt-4">
                {activeTab === "all" ? "Browse Jobs" : "View All Applications"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {data?.data.map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{application.job.title}</CardTitle>
                      <CardDescription className="flex flex-wrap gap-2 items-center mt-1">
                        <span>{application.job.company}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{application.job.location}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(application.status)}>
                      {getStatusText(application.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Job Type:</span>
                        <span>{application.job.jobType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Applied On:</span>
                        <span>{formatDate(application.appliedDate)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{formatDate(application.lastUpdated)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Resume:</span>
                        {application.resumeUrl ? (
                          <a 
                            href={application.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Not available</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Status Timeline:</span>
                      <div className="flex items-center gap-1">
                        <span className={`inline-block h-2 w-2 rounded-full ${application.status === 'new' || application.status === 'reviewing' || application.status === 'interview' || application.status === 'hired' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className="text-xs">Submitted</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center gap-1">
                        <span className={`inline-block h-2 w-2 rounded-full ${application.status === 'reviewing' || application.status === 'interview' || application.status === 'hired' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className="text-xs">Review</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center gap-1">
                        <span className={`inline-block h-2 w-2 rounded-full ${application.status === 'interview' || application.status === 'hired' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className="text-xs">Interview</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center gap-1">
                        <span className={`inline-block h-2 w-2 rounded-full ${application.status === 'hired' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className="text-xs">Hired</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/jobs/${application.job.id}`}>
                        <Button variant="outline" size="sm">
                          View Job
                        </Button>
                      </Link>
                      {(application.status === 'new' || application.status === 'reviewing') && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleWithdraw(application.id)}
                          disabled={withdrawMutation.isPending}
                        >
                          {withdrawMutation.isPending ? 'Processing...' : 'Withdraw'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data?.meta && data.meta.pages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, data.meta.total)} of {data.meta.total} applications
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(data.meta.pages, p + 1))}
                  disabled={page >= data.meta.pages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </CandidateLayout>
  );
}