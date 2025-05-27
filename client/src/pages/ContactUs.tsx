
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { RectangleEllipsis, MapPin, Globe, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import Container from "@/components/ui/container";
import { motion } from "framer-motion";
import GlobalNetworkMap from "@/components/sections/GlobalNetworkMap";
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
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { useState } from "react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required"),
  interest: z.string().min(1, "Please select an interest")
});

export default function ContactUs() {
  const { toast } = useToast();
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

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
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Ready to transform your hiring process? Get in touch with our team of experts and discover how Niddik can help you build exceptional tech teams.
              </p>
            </div>
          </Container>
        </section>

        {/* Global Network Map Section */}
        <section className="py-20 bg-gray-900">
          <Container>
            <div className="text-center mb-12">
              <motion.h2
                className="text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Our Global Network
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Connected across three major technology markets - India, United States, and Canada. 
                Our network enables seamless talent acquisition and deployment worldwide.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <GlobalNetworkMap />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">India Hub</h3>
                <p className="text-gray-400">Our headquarters in Noida serves as the central command for our global operations and talent pool.</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">US Market</h3>
                <p className="text-gray-400">Strategic presence across major US tech hubs including New York, San Francisco, and Austin.</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RectangleEllipsis className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Canada Network</h3>
                <p className="text-gray-400">Growing presence in Toronto, Vancouver, and Montreal connecting top Canadian talent.</p>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Contact Form Section */}
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
                      <a href="#" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full">
                        <Linkedin className="text-white" size={20} />
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

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Niddik?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're not just another talent platform. We're your strategic partner in building world-class tech teams.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-andela-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-andela-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Talent Pool</h3>
                <p className="text-gray-600">Access to 150K+ top-rated, highly skilled global tech professionals.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-andela-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RectangleEllipsis className="h-8 w-8 text-andela-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Faster Hiring</h3>
                <p className="text-gray-600">66% faster time-to-hire with our AI-powered matching algorithms.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-andela-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-andela-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                <p className="text-gray-600">33% faster project delivery with our carefully vetted talent.</p>
              </div>
            </div>
          </Container>
        </section>

        <Footer />
      </div>
    </div>
  );
}
