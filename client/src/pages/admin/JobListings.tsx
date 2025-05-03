import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { JobListing } from "@shared/schema";
import { Link } from "wouter";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function JobListings() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  // Fetch job listings data
  const { data: jobListingsData, isLoading } = useQuery({
    queryKey: ["/api/job-listings", page, search, category, status],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      if (search) queryParams.append('search', search);
      if (category && category !== 'all') queryParams.append('category', category);
      if (status && status !== 'all') queryParams.append('status', status);
      
      const response = await fetch(`/api/job-listings?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch job listings');
      return response.json();
    }
  });

  // Extract data and pagination info
  const jobListings = jobListingsData?.data || [];
  const totalItems = jobListingsData?.meta?.total || 0;
  const totalPages = jobListingsData?.meta?.pages || 1;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Listings</h1>
            <p className="text-muted-foreground">
              Manage job listings and opportunities.
            </p>
          </div>
          <Link href="/admin/jobs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Job Listing
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Job Listings</CardTitle>
            <CardDescription>
              Search and filter through all job listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search job listings..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full"
                />
              </div>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Customer Success">
                    Customer Success
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="filled">Filled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Listings</CardTitle>
            <CardDescription>
              Showing all job listings for your company.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Posted Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobListings.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center h-32 text-muted-foreground"
                          >
                            No job listings found. Create your first job listing
                            by clicking the "Add Job Listing" button.
                          </TableCell>
                        </TableRow>
                      ) : (
                        jobListings.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">
                              {job.title}
                            </TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>{job.category}</TableCell>
                            <TableCell>{formatDate(job.postedDate)}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  job.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : job.status === "filled"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {job.status.charAt(0).toUpperCase() +
                                  job.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {job.featured ? (
                                <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                  Featured
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                  Regular
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/admin/jobs/${job.id}/edit`}>
                                  <Button size="icon" variant="outline">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </Link>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(i + 1);
                            }}
                            isActive={page === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                          }}
                          className={
                            page >= totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}