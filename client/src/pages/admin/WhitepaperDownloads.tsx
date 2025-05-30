
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, Download, Mail, Building, User, Calendar, Globe, TrendingUp, Users, FileText } from "lucide-react";
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

  // Fetch all whitepaper downloads for client-side operations
  const { data: downloadsData, isLoading, error } = useQuery<WhitepaperDownloadsResponse>({
    queryKey: ["whitepaperDownloads"],
    queryFn: async () => {
      const response = await fetch(`/api/admin/whitepaper-downloads?page=1&limit=1000`, {
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

  // Client-side filtering and pagination
  const filteredAndPaginatedData = useMemo(() => {
    if (!downloadsData?.data) return { downloads: [], total: 0, totalPages: 0 };

    let filtered = downloadsData.data;

    // Client-side search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(download => 
        download.fullName.toLowerCase().includes(searchLower) ||
        download.workEmail.toLowerCase().includes(searchLower) ||
        (download.company && download.company.toLowerCase().includes(searchLower))
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDownloads = filtered.slice(startIndex, endIndex);

    return {
      downloads: paginatedDownloads,
      total,
      totalPages,
      allDownloads: downloadsData.data
    };
  }, [downloadsData?.data, searchTerm, currentPage, limit]);

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!downloadsData?.data) return null;

    const allDownloads = downloadsData.data;
    const totalDownloads = allDownloads.length;

    // Unique companies
    const uniqueCompanies = new Set(
      allDownloads
        .filter(d => d.company)
        .map(d => d.company)
    ).size;

    // Downloads in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentDownloads = allDownloads.filter(d => {
      const downloadDate = new Date(d.downloadedAt || d.createdAt);
      return downloadDate >= sevenDaysAgo;
    }).length;

    // Downloads today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayDownloads = allDownloads.filter(d => {
      const downloadDate = new Date(d.downloadedAt || d.createdAt);
      return downloadDate >= today && downloadDate < tomorrow;
    }).length;

    return {
      totalDownloads,
      uniqueCompanies,
      recentDownloads,
      todayDownloads
    };
  }, [downloadsData?.data]);

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
        variant: "default"
      });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete download record",
        variant: "destructive"
      });
    }
  });

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle delete confirmation
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <AdminLayout 
        title="Whitepaper Downloads" 
        description="Manage and track whitepaper download requests"
      >
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading whitepaper downloads: {error.message}
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const { downloads, total, totalPages } = filteredAndPaginatedData;

  return (
    <AdminLayout 
      title="Whitepaper Downloads" 
      description="Manage and track whitepaper download requests"
    >
      <div className="space-y-6">
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalDownloads}</div>
                <p className="text-xs text-muted-foreground">
                  All time downloads
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Downloads</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.todayDownloads}</div>
                <p className="text-xs text-muted-foreground">
                  Downloads today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.recentDownloads}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Companies</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.uniqueCompanies}</div>
                <p className="text-xs text-muted-foreground">
                  Different organizations
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Whitepaper Downloads ({total})
            </CardTitle>
            <CardDescription>
              Track and manage whitepaper download requests (Client-side search enabled)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              {searchTerm && (
                <Badge variant="secondary">
                  {total} result{total !== 1 ? 's' : ''} found
                </Badge>
              )}
            </div>

            {downloads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No whitepaper downloads found</p>
                {searchTerm && (
                  <p className="text-sm">Try adjusting your search terms</p>
                )}
              </div>
            ) : (
              <>
                {/* Downloads Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Name
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Company
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Downloaded At
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            IP Address
                          </div>
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {downloads.map((download) => (
                        <TableRow key={download.id}>
                          <TableCell className="font-medium">
                            {download.fullName}
                          </TableCell>
                          <TableCell>{download.workEmail}</TableCell>
                          <TableCell>
                            {download.company ? (
                              <Badge variant="secondary">{download.company}</Badge>
                            ) : (
                              <span className="text-gray-400">Not provided</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDate(download.downloadedAt || download.createdAt)}
                          </TableCell>
                          <TableCell>
                            {download.ipAddress ? (
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {download.ipAddress}
                              </code>
                            ) : (
                              <span className="text-gray-400">Unknown</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(download.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Download Record</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this whitepaper download record for {download.fullName}? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deleteMutation.isPending}
                                  >
                                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
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
                      Showing {downloads.length} of {total} downloads
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
};

const WhitepaperDownloadsWithSuspense = () => (
  <Suspense fallback={<LoadingScreen />}>
    <WhitepaperDownloads />
  </Suspense>
);

export default WhitepaperDownloadsWithSuspense;
