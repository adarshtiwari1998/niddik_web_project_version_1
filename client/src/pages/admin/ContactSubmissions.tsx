
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Building, Calendar, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "@/components/layout/AdminLayout";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface ContactSubmission {
  id: number;
  fullName: string;
  email: string;
  company: string;
  interest: string;
  createdAt: string;
}

const ContactSubmissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [interestFilter, setInterestFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  // Fetch contact submissions
  const { data: submissionsData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/contact-submissions', { page: currentPage, limit: itemsPerPage, search: searchTerm, interest: interestFilter }],
    queryFn: getQueryFn({ on401: "ignore" }),
  });

  const submissions = submissionsData?.data || [];
  const totalPages = submissionsData?.meta?.pages || 1;
  const totalSubmissions = submissionsData?.meta?.total || 0;

  // Filter submissions based on search and interest
  const filteredSubmissions = submissions.filter((submission: ContactSubmission) => {
    const matchesSearch = submission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesInterest = interestFilter === "all" || submission.interest === interestFilter;

    return matchesSearch && matchesInterest;
  });

  const getInterestBadgeColor = (interest: string) => {
    switch (interest) {
      case "hiring":
        return "bg-green-100 text-green-800";
      case "joining":
        return "bg-blue-100 text-blue-800";
      case "enterprise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatInterest = (interest: string) => {
    switch (interest) {
      case "hiring":
        return "Hiring Talent";
      case "joining":
        return "Joining as Talent";
      case "enterprise":
        return "Enterprise Solutions";
      default:
        return "Other";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20">
          <AdminLayout title="Contact Submissions" description="Manage and review contact form submissions from your website">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading contact submissions...</p>
              </div>
            </div>
          </AdminLayout>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20">
          <AdminLayout title="Contact Submissions" description="Manage and review contact form submissions from your website">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-4">Error loading contact submissions</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            </div>
          </AdminLayout>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20">
        <AdminLayout title="Contact Submissions" description="Manage and review contact form submissions from your website">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
                <p className="text-muted-foreground">
                  Manage and review contact form submissions from your website
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSubmissions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hiring Inquiries</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {submissions.filter((s: ContactSubmission) => s.interest === "hiring").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Talent Applications</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {submissions.filter((s: ContactSubmission) => s.interest === "joining").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enterprise Inquiries</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {submissions.filter((s: ContactSubmission) => s.interest === "enterprise").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={interestFilter} onValueChange={setInterestFilter}>
                    <SelectTrigger className="w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Interests</SelectItem>
                      <SelectItem value="hiring">Hiring Talent</SelectItem>
                      <SelectItem value="joining">Joining as Talent</SelectItem>
                      <SelectItem value="enterprise">Enterprise Solutions</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Submissions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions ({filteredSubmissions.length})</CardTitle>
                <CardDescription>
                  All contact form submissions from your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No contact submissions found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSubmissions.map((submission: ContactSubmission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.fullName}</TableCell>
                            <TableCell>
                              <a
                                href={`mailto:${submission.email}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {submission.email}
                              </a>
                            </TableCell>
                            <TableCell>{submission.company}</TableCell>
                            <TableCell>
                              <Badge className={getInterestBadgeColor(submission.interest)}>
                                {formatInterest(submission.interest)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                {format(new Date(submission.createdAt), "MMM dd, yyyy")}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </AdminLayout>
      </div>
      <Footer />
    </div>
  );
};

export default ContactSubmissions;
