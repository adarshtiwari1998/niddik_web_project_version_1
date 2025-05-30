
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

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timeoutId);
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

  const downloads = downloadsData?.data || [];
  const totalDownloads = downloadsData?.total || 0;
  const totalPages = Math.ceil(totalDownloads / limit);

  return (
    <AdminLayout 
      title="Whitepaper Downloads" 
      description="Manage and track whitepaper download requests"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Whitepaper Downloads ({totalDownloads})
            </CardTitle>
            <CardDescription>
              Track and manage whitepaper download requests
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
};

const WhitepaperDownloadsWithSuspense = () => (
  <Suspense fallback={<LoadingScreen />}>
    <WhitepaperDownloads />
  </Suspense>
);

export default WhitepaperDownloadsWithSuspense;
