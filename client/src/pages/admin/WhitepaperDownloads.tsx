
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, Download, Mail, Building, User, Calendar, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LoadingScreen } from "@/components/ui/loading-screen";
import AdminLayout from "@/components/layout/AdminLayout";

interface WhitepaperDownload {
  id: number;
  fullName: string;
  workEmail: string;
  company: string | null;
  downloadedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface WhitepaperDownloadsResponse {
  success: boolean;
  data: WhitepaperDownload[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const WhitepaperDownloads = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const limit = 10;

  // Fetch whitepaper downloads
  const { data: downloadsData, isLoading, error } = useQuery<WhitepaperDownloadsResponse>({
    queryKey: ["whitepaperDownloads", currentPage, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString()
      });

      if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`/api/admin/whitepaper-downloads?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch whitepaper downloads');
      }

      return response.json();
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/whitepaper-downloads/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete download record');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whitepaperDownloads"] });
      toast({
        title: "Success",
        description: "Download record deleted successfully",
      });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const downloads = downloadsData?.data || [];
  const totalPages = downloadsData?.meta?.pages || 1;
  const totalDownloads = downloadsData?.meta?.total || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  // Statistics
  const statsCards = [
    {
      title: "Total Downloads",
      value: totalDownloads.toString(),
      icon: Download,
      color: "text-blue-600"
    },
    {
      title: "This Month",
      value: downloads.filter(d => {
        const downloadDate = new Date(d.downloadedAt);
        const now = new Date();
        return downloadDate.getMonth() === now.getMonth() && 
               downloadDate.getFullYear() === now.getFullYear();
      }).length.toString(),
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Unique Companies",
      value: new Set(downloads.filter(d => d.company).map(d => d.company)).size.toString(),
      icon: Building,
      color: "text-purple-600"
    },
    {
      title: "Unique Users",
      value: new Set(downloads.map(d => d.workEmail)).size.toString(),
      icon: User,
      color: "text-orange-600"
    }
  ];

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading whitepaper downloads: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  try {
    return (
      <AdminLayout 
        title="Whitepaper Downloads" 
        description="Manage and track whitepaper download requests"
      >
        <div className="space-y-6">

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Records
          </CardTitle>
          <CardDescription>
            Track all whitepaper download requests and user information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit">Search</Button>
              {searchTerm && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>

          {/* Downloads Table */}
          {isLoading ? (
            <div className="text-center py-8">Loading downloads...</div>
          ) : downloads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No downloads found matching your search." : "No whitepaper downloads yet."}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name & Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Downloaded At</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {downloads.map((download) => (
                      <TableRow key={download.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{download.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{download.workEmail}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {download.company ? (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span>{download.company}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Not specified</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{formatDate(download.downloadedAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {download.ipAddress ? (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{download.ipAddress}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Unknown</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDelete(download.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Download Record</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this download record for {download.fullName}? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmDelete}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {downloads.length} of {totalDownloads} downloads
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 py-2 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
        </div>
      </AdminLayout>
    );
  } catch (error) {
    console.error('WhitepaperDownloads component error:', error);
    return (
      <AdminLayout 
        title="Whitepaper Downloads" 
        description="Manage and track whitepaper download requests"
      >
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Something went wrong. Please refresh the page.
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }
};

const WhitepaperDownloadsWithSuspense = () => (
  <Suspense fallback={<LoadingScreen />}>
    <WhitepaperDownloads />
  </Suspense>
);

export default WhitepaperDownloadsWithSuspense;
