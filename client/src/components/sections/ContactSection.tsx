import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { RectangleEllipsis, MapPin, Globe, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import Container from "@/components/ui/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContactFormData } from "@/lib/types";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required"),
  interest: z.string().min(1, "Please select an interest")
});

const ContactSection = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      interest: ""
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    contactMutation.mutate(data as ContactFormData);
  };

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto bg-andela-light rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
              <p className="text-andela-gray mb-8">
                Connect with us today and discover how Niddik can help you find the perfect tech talent for your needs.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your name" 
                            {...field} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-andela-green focus:border-andela-green"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            type="email" 
                            {...field}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-andela-green focus:border-andela-green"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your company name" 
                            {...field}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-andela-green focus:border-andela-green"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I'm interested in</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-andela-green focus:border-andela-green">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hiring">Hiring Talent</SelectItem>
                            <SelectItem value="joining">Joining as Talent</SelectItem>
                            <SelectItem value="enterprise">Enterprise Solutions</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-andela-green hover:bg-opacity-90 transition-colors text-white py-3 rounded-md font-medium"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Sending..." : "Get in Touch"}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div className="bg-andela-dark p-8 lg:p-12 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-andela-green/20 p-3 rounded-full mr-4">
                      <RectangleEllipsis className="text-andela-green" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <a href="mailto:info@niddik.com" className="text-gray-300 hover:text-white transition-colors">info@niddik.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-andela-green/20 p-3 rounded-full mr-4">
                      <MapPin className="text-andela-green" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Headquarters</p>
                      <p className="text-gray-300">Platina Heights, Sector 59, Noida - 201301</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-andela-green/20 p-3 rounded-full mr-4">
                      <Globe className="text-andela-green" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Contact Numbers</p>
                      <p className="text-gray-300">+91 9717312058 (INDIA)</p>
                      <p className="text-gray-300">+1 (646) 889-9517 (USA)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <p className="font-medium mb-4">Follow Us</p>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.linkedin.com/company/niddik/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full"
                  >
                    <Linkedin className="text-white" size={20} />
                  </a>
                  <a 
                    href="https://www.youtube.com/@NiddikkareLLP" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full"
                  >
                    <svg className="text-white" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full">
                    <Twitter className="text-white" size={20} />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full">
                    <Facebook className="text-white" size={20} />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full">
                    <Instagram className="text-white" size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactSection;
