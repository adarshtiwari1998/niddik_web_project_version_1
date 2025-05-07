import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { JobApplication } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeftIcon, Briefcase, Calendar, Clock, FileText } from "lucide-react";

export default function MyApplications() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  // Fetch user's applications
  const { data, isLoading, error } = useQuery<{ data: JobApplication[] }>({
    queryKey: ['/api/my-applications'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user, // Only run query if user is logged in
  });

  const applications = data?.data || [];

  // Function to get status badge styling
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, text: string }> = {
      pending: { color: "bg-yellow-500/80 hover:bg-yellow-500/90", text: "Pending Review" },
      reviewed: { color: "bg-blue-500/80 hover:bg-blue-500/90", text: "Reviewed" },
      interviewing: { color: "bg-purple-500/80 hover:bg-purple-500/90", text: "Interviewing" },
      hired: { color: "bg-green-500/80 hover:bg-green-500/90", text: "Hired" },
      rejected: { color: "bg-red-500/80 hover:bg-red-500/90", text: "Not Selected" },
    };

    return statusMap[status] || { color: "bg-gray-500/80 hover:bg-gray-500/90", text: status };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Applications</h1>
        <p className="text-muted-foreground mb-6">We couldn't load your applications. Please try again later.</p>
        <Button onClick={() => setLocation("/careers")}>Browse Jobs</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your job applications</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setLocation("/careers")} 
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon size={16} />
          Browse More Jobs
        </Button>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
          <h2 className="text-xl font-medium mb-2">No applications yet</h2>
          <p className="text-muted-foreground mb-6">You haven't applied to any jobs yet.</p>
          <Button onClick={() => setLocation("/careers")}>Browse Open Positions</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl">Job Application #{application.id}</CardTitle>
                    <p className="text-muted-foreground">Job ID: {application.jobId}</p>
                  </div>
                  <Badge className={getStatusBadge(application.status).color}>
                    {getStatusBadge(application.status).text}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Applied on {new Date(application.appliedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Job ID: {application.jobId}</span>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Your Cover Letter:</p>
                    <div className="bg-muted/50 p-3 rounded-md text-sm">
                      <p className="line-clamp-3">{application.coverLetter}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center mt-4">
                <div>
                  {application.resumeUrl && (
                    <a 
                      href={application.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-1" /> View Uploaded Resume
                    </a>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLocation(`/jobs/${application.jobId}`)}
                >
                  View Job
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}