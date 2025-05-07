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
import { InfoIcon, CheckCircleIcon, ClockIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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

  return (
    <Container className="py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Request a Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Experience how our platform can transform your talent acquisition process.
          Our team will guide you through our solutions tailored to your needs.
        </p>
      </div>

      {(checkEmail && existingRequest) ? (
        renderRequestStatus()
      ) : (
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Request Demo</CardTitle>
            <CardDescription>
              Fill out the form below to request a personalized demo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  className="w-full"
                  disabled={isPending || checkingRequest}
                >
                  {isPending ? "Submitting..." : "Request Demo"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}