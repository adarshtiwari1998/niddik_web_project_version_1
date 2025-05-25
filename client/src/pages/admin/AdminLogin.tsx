
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from 'react-helmet-async';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginMutation } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await loginMutation.mutateAsync(values);
      if (response.role === 'admin') {
        toast({
          title: "Login successful",
          description: "Redirecting to admin dashboard...",
        });
        // Set loading state for dashboard
        sessionStorage.setItem('admin_dashboard_loading', 'true');
        // Redirect to admin dashboard
        setTimeout(() => {
          setLocation("/admin/dashboard");
        }, 100);
      } else {
        throw new Error("Unauthorized access");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Niddik</title>
        <meta name="description" content="Secure login portal for Niddik administrators." />
        <meta property="og:title" content="Admin Login | Niddik" />
        <meta property="og:description" content="Secure login portal for Niddik administrators." />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <div className="bg-green-600 text-white rounded-md px-3 py-1 text-xs font-medium">
                Admin Area
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the administrator dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input type="password" placeholder="Enter password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
