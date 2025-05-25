
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Phone, Eye, Users as UsersIcon, RefreshCw, Download, BarChart3, MapPin, Briefcase, DollarSign, Settings, Trash2, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [ctcFilter, setCtcFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    experience: "",
    notice_period: "",
    current_ctc: "",
    expected_ctc: "",
    skills: "",
    location: "",
    city: "",
    state: "",
    country: "",
    zip_code: ""
  });

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

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "User has been successfully deleted and logged out.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users/analytics'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Edit user mutation
  const editUserMutation = useMutation({
    mutationFn: async ({ userId, userData }: { userId: number; userData: any }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User updated",
        description: "User information has been successfully updated.",
      });
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
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

  const handleDeleteUser = (userId: number) => {
    deleteUserMutation.mutate(userId);
  };

  const handleEditUser = (userData: User) => {
    setEditingUser(userData);
    setEditFormData({
      username: userData.username || "",
      email: userData.email || "",
      full_name: userData.full_name || "",
      phone: userData.phone || "",
      experience: userData.experience || "",
      notice_period: userData.notice_period || "",
      current_ctc: userData.current_ctc || "",
      expected_ctc: userData.expected_ctc || "",
      skills: userData.skills || "",
      location: userData.location || "",
      city: userData.city || "",
      state: userData.state || "",
      country: userData.country || "",
      zip_code: userData.zip_code || ""
    });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    
    editUserMutation.mutate({
      userId: editingUser.id,
      userData: editFormData
    });
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
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditUser(userData)}
                                      title="Edit User"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Edit User: {userData.username}</DialogTitle>
                                      <DialogDescription>
                                        Update user information. Email and username cannot be edited for security reasons.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                          id="username"
                                          value={editFormData.username}
                                          disabled
                                          className="bg-muted cursor-not-allowed"
                                          title="Username cannot be edited"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                          id="email"
                                          type="email"
                                          value={editFormData.email}
                                          disabled
                                          className="bg-muted cursor-not-allowed"
                                          title="Email cannot be edited"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="full_name">Full Name</Label>
                                        <Input
                                          id="full_name"
                                          value={editFormData.full_name}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                          id="phone"
                                          value={editFormData.phone}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="experience">Experience (years)</Label>
                                        <Input
                                          id="experience"
                                          value={editFormData.experience}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, experience: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="notice_period">Notice Period</Label>
                                        <Input
                                          id="notice_period"
                                          value={editFormData.notice_period}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, notice_period: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="current_ctc">Current CTC</Label>
                                        <Input
                                          id="current_ctc"
                                          value={editFormData.current_ctc}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, current_ctc: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="expected_ctc">Expected CTC</Label>
                                        <Input
                                          id="expected_ctc"
                                          value={editFormData.expected_ctc}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, expected_ctc: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                          id="city"
                                          value={editFormData.city}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, city: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                          id="state"
                                          value={editFormData.state}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, state: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                          id="country"
                                          value={editFormData.country}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, country: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="zip_code">ZIP Code</Label>
                                        <Input
                                          id="zip_code"
                                          value={editFormData.zip_code}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                                        />
                                      </div>
                                      <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="skills">Skills</Label>
                                        <Textarea
                                          id="skills"
                                          value={editFormData.skills}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, skills: e.target.value }))}
                                          placeholder="Comma-separated skills"
                                        />
                                      </div>
                                      <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                          id="location"
                                          value={editFormData.location}
                                          onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        type="submit"
                                        onClick={handleSaveEdit}
                                        disabled={editUserMutation.isPending}
                                      >
                                        {editUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      title="Delete User"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user account for{" "}
                                        <strong>{userData.username}</strong> ({userData.email}) and remove all their data from our servers.
                                        <br /><br />
                                        The user will be immediately logged out if they have an active session and will not be able to log in again.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteUser(userData.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={deleteUserMutation.isPending}
                                      >
                                        {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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
