
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Phone, Eye, Users as UsersIcon, RefreshCw, Download } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Helmet } from 'react-helmet-async';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  experience: string;
  notice_period: string;
  current_ctc: string;
  expected_ctc: string;
  skills: string;
  location: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  resume_url: string;
  last_logout: string;
  created_at: string;
}

const Users = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data: usersData, isLoading, refetch } = useQuery<{
    success: boolean;
    data: User[];
    meta: { total: number; page: number; limit: number; pages: number };
  }>({
    queryKey: ['/api/admin/users', page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEmailUser = (email: string, name: string) => {
    const subject = encodeURIComponent(`Hello ${name}`);
    const body = encodeURIComponent(`Dear ${name},\n\nI hope this email finds you well.\n\nBest regards,\nNiddik Team`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleCallUser = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewResume = (resumeUrl: string) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  const users = usersData?.data || [];
  const meta = usersData?.meta;

  return (
    <AdminLayout title="Users Management" description="Manage and view all registered users">
      <Helmet>
        <title>Users Management | Admin Dashboard</title>
        <meta name="description" content="Manage and view all registered users in the system." />
      </Helmet>

      {/* Header with Stats and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">
              {meta?.total || 0} Total Users
            </span>
          </div>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Users</CardTitle>
          <CardDescription>Search by User ID, username, email, or full name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>
            {debouncedSearch 
              ? `Search results for "${debouncedSearch}"`
              : "All registered users (excluding admin users)"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {debouncedSearch ? 'No users found matching your search.' : 'No users found.'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User Details</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>CTC</TableHead>
                      <TableHead>Resume</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userData) => (
                      <TableRow key={userData.id}>
                        <TableCell className="font-medium">#{userData.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{userData.full_name || userData.username}</div>
                            <div className="text-sm text-muted-foreground">@{userData.username}</div>
                            <Badge variant="secondary" className="mt-1">
                              {userData.role}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{userData.email}</div>
                            {userData.phone && (
                              <div className="text-sm text-muted-foreground">{userData.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {userData.experience && (
                              <div className="text-sm">Exp: {userData.experience} years</div>
                            )}
                            {userData.notice_period && (
                              <div className="text-sm text-muted-foreground">
                                Notice: {userData.notice_period}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {userData.city && userData.state && (
                              <div className="text-sm">{userData.city}, {userData.state}</div>
                            )}
                            {userData.country && (
                              <div className="text-sm text-muted-foreground">{userData.country}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {userData.current_ctc && (
                              <div className="text-sm">Current: ₹{userData.current_ctc}</div>
                            )}
                            {userData.expected_ctc && (
                              <div className="text-sm text-muted-foreground">
                                Expected: ₹{userData.expected_ctc}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {userData.resume_url ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResume(userData.resume_url)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">No resume</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(userData.created_at)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEmailUser(userData.email, userData.full_name || userData.username)}
                              title="Send Email"
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            {userData.phone && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCallUser(userData.phone)}
                                title="Call User"
                              >
                                <Phone className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {meta && meta.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((page - 1) * meta.limit) + 1} to {Math.min(page * meta.limit, meta.total)} of {meta.total} users
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      Page {page} of {meta.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= meta.pages}
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
    </AdminLayout>
  );
};

export default Users;
