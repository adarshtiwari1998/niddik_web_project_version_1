import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { demoRequestSchema as serverSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Container from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, CheckCircleIcon, ClockIcon, CalendarIcon, Award } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

// Client-side validation schema
const formSchema = z.object({
  workEmail: z.string().email("Please enter a valid work email"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  message: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  fullName: z.string().min(1, "Full name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function RequestDemo() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [checkEmail, setCheckEmail] = useState<string | null>(null);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };
  
  // Define form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workEmail: "",
      phoneNumber: "",
      message: "",
      companyName: "",
      fullName: "",
      jobTitle: "",
      acceptedTerms: false,
    },
  });

  // Check if user already has a demo request
  const { data: existingRequest, isLoading: checkingRequest } = useQuery({
    queryKey: ['/api/demo-requests/check', checkEmail],
    enabled: !!checkEmail,
    queryFn: async () => {
      try {
        const response = await apiRequest(`/api/demo-requests/check?email=${encodeURIComponent(checkEmail || "")}`);
        if (response.success) {
          return response.data;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    staleTime: 60000, // 1 minute
  });

  // Submit mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest("/api/demo-requests", {
        method: "POST",
        data,
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Success!",
        description: "Your demo request has been submitted. We'll be in touch soon.",
      });
      setSubmitted(true);
      setCheckEmail(form.getValues().workEmail);
      queryClient.invalidateQueries({ queryKey: ['/api/demo-requests/check'] });
    },
    onError: (error: any) => {
      if (error.response?.data?.existingRequest) {
        setCheckEmail(form.getValues().workEmail);
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to submit request. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    setCheckEmail(data.workEmail);
    
    if (existingRequest) {
      return; // Already checked and has existing request
    }
    
    mutate(data);
  };

  // Render request status card
  const renderRequestStatus = () => {
    if (!existingRequest) return null;
    
    const request = existingRequest;
    
    let statusIcon = <InfoIcon className="h-5 w-5" />;
    let statusColor = "bg-blue-50 text-blue-800 border-blue-200";
    let statusText = "Your request is being processed";
    
    switch (request.status) {
      case "pending":
        statusIcon = <ClockIcon className="h-5 w-5 text-yellow-500" />;
        statusColor = "bg-yellow-50 text-yellow-800 border-yellow-200";
        statusText = "Your request is pending review";
        break;
      case "scheduled":
        statusIcon = <CalendarIcon className="h-5 w-5 text-green-500" />;
        statusColor = "bg-green-50 text-green-800 border-green-200";
        statusText = "Your demo has been scheduled";
        break;
      case "completed":
        statusIcon = <CheckCircleIcon className="h-5 w-5 text-green-500" />;
        statusColor = "bg-green-50 text-green-800 border-green-200";
        statusText = "Your demo has been completed";
        break;
      case "rejected":
        statusIcon = <InfoIcon className="h-5 w-5 text-red-500" />;
        statusColor = "bg-red-50 text-red-800 border-red-200";
        statusText = "Your request could not be processed";
        break;
    }
    
    return (
      <Card className="w-full max-w-lg mx-auto mb-8">
        <CardHeader>
          <CardTitle>Demo Request Status</CardTitle>
          <CardDescription>
            Current status of your demo request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className={`${statusColor} border`}>
            <div className="flex items-center gap-2">
              {statusIcon}
              <AlertTitle>{statusText}</AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {request.status === "scheduled" && request.scheduledDate && (
                <p className="font-medium mt-2">
                  Scheduled for: {format(new Date(request.scheduledDate), "PPP 'at' p")}
                </p>
              )}
              <p className="text-sm mt-2">
                Request submitted on {format(new Date(request.createdAt), "PPP")}
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            If you have any questions, please contact our support team.
          </p>
        </CardFooter>
      </Card>
    );
  };

  // Stats boxes for the left side of the layout
  const StatBox = ({ value, label, sublabel }: { value: string, label: string, sublabel: string }) => (
    <div className="border-l border-gray-200 pl-6 py-2">
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xs text-gray-500">{sublabel}</div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Fixed header components */}
      <AnnouncementBar 
        text="Download our new whitepaper on scaling tech teams effectively."
        linkText="Get it now"
        linkUrl="/whitepaper"
        bgColor="bg-green-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Add minimal padding to account for fixed elements */}
      <div className={`${isAnnouncementVisible ? 'pt-28' : 'pt-20'} transition-all duration-300`}>
        <main className="py-16" style={{ backgroundColor: "#e0f0eb", backgroundImage: "url('data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='circles' width='40' height='40' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'%3E%3Ccircle cx='20' cy='20' r='15' fill='none' stroke='%23ccecde' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23e0f0eb'/%3E%3Crect width='100%25' height='100%25' fill='url(%23circles)'/%3E%3C/svg%3E')" }}>
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              {/* Left Column - Content and Stats */}
              <div className="pl-4 pr-10 py-6">
                <h1 className="text-4xl font-bold mb-6">Request A Demo</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Experience the future of global tech hiring with a personalized demo of Niddik Talent Cloud. Our AI-powered platform streamlines everything from sourcing to payouts, helping you build high-performing, borderless tech teams with ease.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-14">
                  <StatBox value="150K" label="Top rated," sublabel="highly skilled global talent" />
                  <StatBox value="33%" label="Faster project" sublabel="delivery" />
                  <StatBox value="66%" label="Faster time" sublabel="to hire" />
                </div>
                

              </div>
              
              {/* Right Column - Form */}
              <div className="md:pl-10">
                {(checkEmail && existingRequest) ? (
                  renderRequestStatus()
                ) : (
                  <Card className="w-full border shadow-xl bg-white">
                    <CardContent className="pt-8 px-8">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Smith" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="jobTitle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Job Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="HR Manager" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Acme Inc." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FormField
                              control={form.control}
                              name="workEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Work Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="john@company.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phoneNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+1 (555) 000-0000" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Additional Information</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us about your specific needs or questions"
                                    className="resize-none min-h-[100px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Optional - Share any specific areas you'd like us to focus on during the demo
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="acceptedTerms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    I agree to Niddik's terms of service and privacy policy
                                  </FormLabel>
                                  <FormDescription>
                                    We'll use this information to schedule and customize your demo experience.
                                  </FormDescription>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600"
                            disabled={isPending || checkingRequest}
                          >
                            {isPending ? "Submitting..." : "Request Demo"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </div>
  );
}