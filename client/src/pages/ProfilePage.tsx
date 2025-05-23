import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User, Mail, Phone, Briefcase, Calendar, MapPin, DollarSign, Upload, Loader2, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { User as UserType } from "@shared/schema";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import { Link, useLocation } from "wouter";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  experience: z.string().optional(),
  noticePeriod: z.string().optional(),
  currentCtc: z.string().optional(),
  expectedCtc: z.string().optional(),
  skills: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUploading, setIsUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Form for profile update
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      experience: user?.experience || "",
      noticePeriod: user?.noticePeriod || "Immediately",
      currentCtc: user?.currentCtc || "",
      expectedCtc: user?.expectedCtc || "",
      skills: user?.skills || "",
      location: user?.location || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
      zipCode: user?.zipCode || "",
    },
  });

  // Form for password update
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update profile information when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        experience: user.experience || "",
        noticePeriod: user.noticePeriod || "Immediately",
        currentCtc: user.currentCtc || "",
        expectedCtc: user.expectedCtc || "",
        location: user.location || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        zipCode: user.zipCode || "",
      });
    }
  }, [user, profileForm]);

  // Fetch user applications summary
  const { data: applications } = useQuery<{ 
    success: boolean; 
    data: { status: string; count: number }[] 
  }>({
    queryKey: ['/api/my-applications/summary'],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const res = await fetch('/api/my-applications/summary');
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json();
    },
    enabled: !!user,
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      let resumeUrl = user?.resumeUrl;

      // If a new resume was uploaded, handle that first
      if (resumeFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        try {
          const uploadRes = await fetch('/api/upload-resume', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadRes.ok) {
            throw new Error('Failed to upload resume');
          }
          
          const result = await uploadRes.json();
          resumeUrl = result.url;
        } finally {
          setIsUploading(false);
        }
      }
      
      // Now update the profile with the resume URL
      const updateRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          resumeUrl,
        }),
      });
      
      if (!updateRes.ok) {
        throw new Error('Failed to update profile');
      }
      
      return updateRes.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      setResumeFile(null);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully",
      });
      
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      console.error("Password change error:", error);
      toast({
        title: "Password change failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Handle profile form submission
  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  // Handle password form submission
  const onPasswordSubmit = (data: PasswordFormValues) => {
    changePasswordMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-10 text-center">
            <p>Please sign in to view your profile.</p>
            <Link href="/auth">
              <Button className="mt-4">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CandidateLayout activeTab="profile">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account information and application settings
            </p>
          </div>
          <Link href="/candidate/applications">
            <Button variant="outline">
              View My Applications
            </Button>
          </Link>
        </div>

        {/* Application Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Application Overview</CardTitle>
            <CardDescription>Summary of your job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                <span className="text-3xl font-bold">
                  {applications?.data?.reduce((total, item) => total + item.count, 0) || 0}
                </span>
                <span className="text-sm text-muted-foreground">Total Applications</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                <span className="text-3xl font-bold text-yellow-500">
                  {applications?.data?.find(item => item.status === 'new' || item.status === 'reviewing')?.count || 0}
                </span>
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                <span className="text-3xl font-bold text-green-500">
                  {applications?.data?.find(item => item.status === 'hired')?.count || 0}
                </span>
                <span className="text-sm text-muted-foreground">Hired</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                <span className="text-3xl font-bold text-blue-500">
                  {applications?.data?.find(item => item.status === 'interview')?.count || 0}
                </span>
                <span className="text-sm text-muted-foreground">Interviews</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Tabs */}
        <Tabs 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security & Password</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile information visible to employers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-medium">Basic Information</h3>
                        <p className="text-sm text-muted-foreground mb-4">Your personal details</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Your full name" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Your email address" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Your phone number" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Career Information */}
                      <div>
                        <h3 className="text-lg font-medium">Career Information</h3>
                        <p className="text-sm text-muted-foreground mb-4">Your professional details</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Experience (Years)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Years of experience" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="noticePeriod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notice Period</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="pl-10">
                                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                      <SelectValue placeholder="Select notice period" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Immediately">Immediately</SelectItem>
                                    <SelectItem value="15 days">15 days</SelectItem>
                                    <SelectItem value="1 month">1 month</SelectItem>
                                    <SelectItem value="2 months">2 months</SelectItem>
                                    <SelectItem value="3 months">3 months</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="currentCtc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current CTC</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Current salary" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="expectedCtc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected CTC</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Expected salary" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="skills"
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>Skills</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Code className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                      placeholder="Add your skills (comma separated)" 
                                      className="pl-10" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Enter your skills separated by commas (e.g. JavaScript, React, Node.js)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Location Information */}
                      <div>
                        <h3 className="text-lg font-medium">Location Information</h3>
                        <p className="text-sm text-muted-foreground mb-4">Your address details</p>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Your current location" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="City" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <FormControl>
                                    <Input placeholder="State" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Zip Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Zip code" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={profileForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="Country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Resume Upload */}
                      <div>
                        <h3 className="text-lg font-medium">Resume</h3>
                        <p className="text-sm text-muted-foreground mb-4">Upload your latest resume</p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                              />
                            </div>
                            {user && user.resumeUrl && (
                              <a
                                href={user.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 text-sm text-primary hover:underline"
                              >
                                View Current Resume
                              </a>
                            )}
                          </div>
                          
                          {resumeFile && (
                            <p className="text-sm text-muted-foreground">
                              Selected file: {resumeFile.name}
                            </p>
                          )}
                          
                          <FormDescription>
                            Upload your resume in PDF, DOC, or DOCX format (max 5MB)
                          </FormDescription>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto" 
                      disabled={updateProfileMutation.isPending || isUploading}
                    >
                      {(updateProfileMutation.isPending || isUploading) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving changes...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>
                  Update your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <Alert className="mb-6">
                        <AlertTitle>Password Requirements</AlertTitle>
                        <AlertDescription>
                          Passwords must be at least 6 characters long and include a mix of letters, numbers, and special characters for better security.
                        </AlertDescription>
                      </Alert>
                      
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter current password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter new password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm new password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto" 
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Changing password...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Account Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View your account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Account Type</p>
                      <p className="text-sm text-muted-foreground">Your account level and permissions</p>
                    </div>
                    <Badge>Candidate</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Account Created</p>
                      <p className="text-sm text-muted-foreground">When your account was registered</p>
                    </div>
                    <span className="text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Username</p>
                      <p className="text-sm text-muted-foreground">Your login username</p>
                    </div>
                    <span className="text-sm">{user.username}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CandidateLayout>
  );
}