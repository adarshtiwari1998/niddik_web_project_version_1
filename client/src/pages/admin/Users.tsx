
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Phone, Eye, Users as UsersIcon, RefreshCw, Download, BarChart3, MapPin, Briefcase, DollarSign, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface UserAnalytics {
  experienceDistribution: { range: string; count: number }[];
  locationDistribution: { location: string; count: number }[];
  skillsDistribution: { skill: string; count: number }[];
  ctcDistribution: { range: string; count: number }[];
  totalUsers: number;
  activeUsers: number;
  recentUsers: number;
}

const Users = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [ctcFilter, setCtcFilter] = useState("all");
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
    queryKey: ['/api/admin/users', page, debouncedSearch, experienceFilter, locationFilter, ctcFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      if (experienceFilter && experienceFilter !== 'all') {
        params.append('experience', experienceFilter);
      }
      if (locationFilter && locationFilter !== 'all') {
        params.append('location', locationFilter);
      }
      if (ctcFilter && ctcFilter !== 'all') {
        params.append('ctc', ctcFilter);
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

  const { data: analyticsData } = useQuery<{
    success: boolean;
    data: UserAnalytics;
  }>({
    queryKey: ['/api/admin/users/analytics'],
    queryFn: async () => {
      const res = await fetch('/api/admin/users/analytics', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
    refetchInterval: 60000,
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
    if (!dateString) return 'Never';
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

  const clearFilters = () => {
    setExperienceFilter("all");
    setLocationFilter("all");
    setCtcFilter("all");
    setSearch("");
    setPage(1);
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  const users = usersData?.data || [];
  const meta = usersData?.meta;
  const analytics = analyticsData?.data;

  return (
    <AdminLayout title="Users Management" description="Manage and view all registered users">
      <Helmet>
        <title>Users Management | Admin Dashboard</title>
        <meta name="description" content="Manage and view all registered users in the system." />
      </Helmet>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Users List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">{analytics?.totalUsers || 0}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  Total Users
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">{analytics?.activeUsers || 0}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Active Users
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">{analytics?.recentUsers || 0}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  New This Month
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">
                  {analytics ? Math.round((analytics.activeUsers / analytics.totalUsers) * 100) : 0}%
                </CardTitle>
                <CardDescription>Engagement Rate</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experience Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.experienceDistribution?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.range}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(item.count / (analytics?.totalUsers || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.locationDistribution?.slice(0, 10).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.location}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(item.count / (analytics?.totalUsers || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Popular Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.skillsDistribution?.slice(0, 10).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.skill}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(item.count / (analytics?.totalUsers || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTC Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  CTC Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.ctcDistribution?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.range}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(item.count / (analytics?.totalUsers || 1)) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Header with Stats and Actions */}
          <div className="flex justify-between items-center">
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Search & Filter Users</CardTitle>
              <CardDescription>Search by User ID, username, email, or full name</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience</SelectItem>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-8">5-8 years</SelectItem>
                    <SelectItem value="8+">8+ years</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ctcFilter} onValueChange={setCtcFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="CTC Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All CTC</SelectItem>
                    <SelectItem value="0-3">0-3 LPA</SelectItem>
                    <SelectItem value="3-6">3-6 LPA</SelectItem>
                    <SelectItem value="6-10">6-10 LPA</SelectItem>
                    <SelectItem value="10-15">10-15 LPA</SelectItem>
                    <SelectItem value="15+">15+ LPA</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
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
                          <TableHead>Skills</TableHead>
                          <TableHead>CTC</TableHead>
                          <TableHead>Resume</TableHead>
                          <TableHead>Last Activity</TableHead>
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
                                {userData.zip_code && (
                                  <div className="text-xs text-muted-foreground">ZIP: {userData.zip_code}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {userData.skills ? (
                                <div className="max-w-[150px]">
                                  <div className="text-sm truncate" title={userData.skills}>
                                    {userData.skills}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">No skills listed</span>
                              )}
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
                              <div className="text-sm">{formatDate(userData.last_logout)}</div>
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
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Users;
