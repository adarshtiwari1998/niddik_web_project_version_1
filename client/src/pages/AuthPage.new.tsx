import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, User, Mail, Lock, Upload, ArrowLeft, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

// Step 1: Basic registration schema (account details)
const registerStep1Schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(6, "Please enter a valid phone number"),
});

// Step 2: Professional details schema
const registerStep2Schema = z.object({
  experience: z.string().optional(),
  noticePeriod: z.string(),
  currentCtc: z.string().optional(),
  expectedCtc: z.string().optional(),
  skills: z.string().min(3, "Please list at least a few skills"),
  location: z.string().min(2, "Please enter your location"),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

// Step 3: Resume upload and password schema
const registerStep3Schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  resume: z.any().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Login schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Combined type for all registration steps
type RegisterFormValues = z.infer<typeof registerStep1Schema> & 
                         z.infer<typeof registerStep2Schema> & 
                         z.infer<typeof registerStep3Schema>;

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get("redirect");
  
  const [activeTab, setActiveTab] = useState("login");
  const [registrationStep, setRegistrationStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<RegisterFormValues>>({});
  const [lastLogoutTime, setLastLogoutTime] = useState<string | null>(null);
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  
  // Fetch last logout time
  useEffect(() => {
    const fetchLastLogout = async () => {
      try {
        const response = await fetch('/api/last-logout');
        if (response.ok) {
          const data = await response.json();
          if (data.lastLogout) {
            setLastLogoutTime(data.lastLogout);
          }
        }
      } catch (error) {
        console.error('Error fetching last logout time:', error);
      }
    };
    
    fetchLastLogout();
  }, []);

  // Form for login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Form for registration step 1
  const registerStep1Form = useForm<z.infer<typeof registerStep1Schema>>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      username: formData.username || "",
      email: formData.email || "",
      fullName: formData.fullName || "",
      phone: formData.phone || "",
    },
  });

  // Form for registration step 2
  const registerStep2Form = useForm<z.infer<typeof registerStep2Schema>>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: {
      experience: formData.experience || "",
      noticePeriod: formData.noticePeriod || "Immediately",
      currentCtc: formData.currentCtc || "",
      expectedCtc: formData.expectedCtc || "",
      skills: formData.skills || "",
      location: formData.location || "",
      city: formData.city || "",
      state: formData.state || "",
      country: formData.country || "",
      zipCode: formData.zipCode || "",
    },
  });

  // Form for registration step 3
  const registerStep3Form = useForm<z.infer<typeof registerStep3Schema>>({
    resolver: zodResolver(registerStep3Schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // If user is already logged in, redirect to homepage or specified redirect URL
  useEffect(() => {
    if (user) {
      if (redirectUrl) {
        setLocation(redirectUrl);
      } else if (user.role === "admin") {
        setLocation("/admin/dashboard");
      } else {
        setLocation("/candidate/dashboard");
      }
    }
  }, [user, setLocation, redirectUrl]);

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  // Handle step 1 submission
  const onStep1Submit = (data: z.infer<typeof registerStep1Schema>) => {
    setFormData({
      ...formData,
      ...data
    });
    setRegistrationStep(2);
  };

  // Handle step 2 submission
  const onStep2Submit = (data: z.infer<typeof registerStep2Schema>) => {
    setFormData({
      ...formData,
      ...data
    });
    setRegistrationStep(3);
  };

  // Handle final registration submission
  const onStep3Submit = async (data: z.infer<typeof registerStep3Schema>) => {
    setIsUploading(true);
    
    // Combine all form data
    const completeData = {
      ...formData,
      ...data
    };
    
    try {
      // Upload resume first if it exists
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        const uploadRes = await fetch('/api/upload-resume', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) {
          throw new Error('Failed to upload resume');
        }
        
        const { url } = await uploadRes.json();
        completeData.resume = url;
      }
      
      // Now register with the complete data
      registerMutation.mutate(completeData as any);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex flex-col items-start pt-2 pb-2">
              <div className="flex flex-col items-center">
                <img 
                  src="/images/niddik_logo.png" 
                  alt="NiDDiK Logo" 
                  className="h-10"
                />
                <div className="text-[10px] text-gray-500 mt-0.5">Connecting People, Changing Lives</div>
              </div>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/careers" className="text-sm font-medium hover:text-primary">
                Browse Jobs
              </Link>
              <Link href="/about-us" className="text-sm font-medium hover:text-primary">
                About Us
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {lastLogoutTime && (
              <div className="flex items-center gap-1 text-muted-foreground text-xs mr-2">
                <Clock className="h-3 w-3" />
                <span>Last seen: {format(new Date(lastLogoutTime), "MMM d, yyyy h:mm a")}</span>
              </div>
            )}
            <div className="bg-green-600 text-white rounded-md px-3 py-1 text-xs font-medium">
              A workforce partner
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Left side - Auth forms */}
        <div className="flex flex-col justify-center w-full px-4 py-12 md:w-1/2 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="flex flex-col space-y-2 text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Welcome to NiDDiK</h1>
              <p className="text-muted-foreground">
                {activeTab === "login" 
                  ? "Sign in to your account to continue" 
                  : "Create an account to get started"}
              </p>
            </div>
          
            <Tabs 
              defaultValue="login" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username or Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="Enter username or email" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    type="password" 
                                    placeholder="Enter password" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-muted-foreground">
                      Don't have an account?{" "}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto" 
                        onClick={() => setActiveTab("register")}
                      >
                        Register here
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Register Tab */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Create an Account</CardTitle>
                        <CardDescription>
                          {registrationStep === 1 && "Step 1: Personal Information"}
                          {registrationStep === 2 && "Step 2: Professional Details"}
                          {registrationStep === 3 && "Step 3: Set Password & Upload Resume"}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <div className={`h-2 w-8 rounded-full ${registrationStep >= 1 ? "bg-primary" : "bg-gray-200"}`}></div>
                        <div className={`h-2 w-8 rounded-full ${registrationStep >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
                        <div className={`h-2 w-8 rounded-full ${registrationStep >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Step 1: Basic Information */}
                    {registrationStep === 1 && (
                      <Form {...registerStep1Form}>
                        <form onSubmit={registerStep1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                          <FormField
                            control={registerStep1Form.control}
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
                            control={registerStep1Form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                      type="email" 
                                      placeholder="Your email address" 
                                      className="pl-10" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerStep1Form.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="Choose a username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerStep1Form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end">
                            <Button 
                              type="submit" 
                              className="mt-4"
                            >
                              Next <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}

                    {/* Step 2: Professional Details */}
                    {registrationStep === 2 && (
                      <Form {...registerStep2Form}>
                        <form onSubmit={registerStep2Form.handleSubmit(onStep2Submit)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={registerStep2Form.control}
                              name="experience"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Experience (Years)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Years of experience" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerStep2Form.control}
                              name="noticePeriod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Notice Period</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select notice period" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Immediately">Immediately</SelectItem>
                                      <SelectItem value="15 Days">15 Days</SelectItem>
                                      <SelectItem value="30 Days">30 Days</SelectItem>
                                      <SelectItem value="60 Days">60 Days</SelectItem>
                                      <SelectItem value="90 Days">90 Days</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerStep2Form.control}
                              name="currentCtc"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current CTC</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your current salary" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerStep2Form.control}
                              name="expectedCtc"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expected CTC</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your expected salary" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={registerStep2Form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your current location" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerStep2Form.control}
                            name="skills"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Skills</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="List your key skills (e.g., JavaScript, React, Node.js, Project Management)" 
                                    className="min-h-[100px]" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate skills with commas
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-between mt-4">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setRegistrationStep(1)}
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                            <Button type="submit">
                              Next <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}

                    {/* Step 3: Resume Upload and Password */}
                    {registrationStep === 3 && (
                      <Form {...registerStep3Form}>
                        <form onSubmit={registerStep3Form.handleSubmit(onStep3Submit)} className="space-y-4">
                          <FormField
                            control={registerStep3Form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                      type="password" 
                                      placeholder="Set a secure password" 
                                      className="pl-10" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerStep3Form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Confirm your password" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="mt-6">
                            <FormLabel className="block mb-2">Resume (Optional)</FormLabel>
                            <div className="flex items-center justify-center w-full">
                              <label 
                                htmlFor="resume-upload" 
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                  <p className="mb-1 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-muted-foreground">PDF files only (MAX. 5MB)</p>
                                  {resumeFile && (
                                    <div className="mt-2 flex items-center text-sm text-primary">
                                      <CheckCircle2 className="mr-1 h-4 w-4" />
                                      <span>{resumeFile.name}</span>
                                    </div>
                                  )}
                                </div>
                                <input 
                                  id="resume-upload" 
                                  type="file" 
                                  className="hidden" 
                                  accept=".pdf" 
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="flex justify-between mt-6">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setRegistrationStep(2)}
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                            <Button 
                              type="submit"
                              disabled={isUploading || registerMutation.isPending}
                            >
                              {isUploading || registerMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating account...
                                </>
                              ) : (
                                "Create Account"
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Right side - Hero Image */}
        <div className="hidden md:block md:w-1/2 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-foreground opacity-90"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-white p-12">
            <h2 className="text-4xl font-bold mb-6">Find Your Dream Job</h2>
            <p className="text-xl mb-8 text-center max-w-md">
              Join thousands of professionals who trust NiDDiK for their career advancement
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-4">Why Choose NiDDiK?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-green-300" />
                  <span>Access to premium job opportunities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-green-300" />
                  <span>Personalized job recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-green-300" />
                  <span>Track and manage your applications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-green-300" />
                  <span>Direct contact with top companies</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}