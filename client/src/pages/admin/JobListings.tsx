import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash, 
  FileText, 
  LogOut, 
  Shield 
} from "lucide-react";
import { JobListing } from "@shared/schema";

export default function JobListings() {
  const { user, logoutMutation } = useAuth();
  const [_, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all_statuses");
  const [categoryFilter, setCategoryFilter] = useState<string>("all_categories");
  const queryClient = useQueryClient();

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    
    if (search) params.append("search", search);
    if (statusFilter && statusFilter !== "all_statuses") params.append("status", statusFilter);
    if (categoryFilter && categoryFilter !== "all_categories") params.append("category", categoryFilter);
    
    return params.toString();
  };

  const { data, isLoading, error } = useQuery<{ data: JobListing[], meta: { total: number, pages: number } }>({
    queryKey: ['/api/job-listings', page, search, statusFilter, categoryFilter],
    queryFn: async () => {
      const res = await fetch(`/api/job-listings?${buildQueryParams()}`);
      if (!res.ok) throw new Error("Failed to fetch job listings");
      return res.json();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/admin/login");
      }
    });
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job listing?")) return;
    
    try {
      const res = await fetch(`/api/job-listings/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete job listing");
      
      // Refetch the data
      window.location.reload();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job listing. Please try again.");
    }
  };

  // Redirect to login if not authenticated or not an admin
  if (!user || user.role !== "admin") {
    return null; // The ProtectedRoute component will handle redirection
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-xl font-bold">Niddik Admin</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Job Listings</h1>
            <p className="text-muted-foreground">Create, edit, and delete job listings</p>
          </div>
          <Button onClick={() => setLocation("/admin/jobs/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Job Listings Filter</CardTitle>
            <CardDescription>Search and filter job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search jobs..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="filled">Filled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_categories">All Categories</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all_statuses");
                  setCategoryFilter("all_categories");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Job Listings</CardTitle>
            <CardDescription>
              {data?.meta?.total || 0} jobs found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading job listings...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">Error loading job listings. Please try again.</div>
            ) : data?.data.length === 0 ? (
              <div className="py-8 text-center">No job listings found. Try adjusting your filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            <span>{job.title}</span>
                            {job.featured && (
                              <Badge className="ml-2" variant="outline">Featured</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{job.company}</div>
                        </TableCell>
                        <TableCell>{job.category}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              job.status === "active" ? "default" :
                              job.status === "draft" ? "secondary" :
                              job.status === "expired" ? "destructive" :
                              job.status === "filled" ? "outline" : "default"
                            }
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLocation(`/admin/jobs/${job.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
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
      </div>
    </div>
  );
}