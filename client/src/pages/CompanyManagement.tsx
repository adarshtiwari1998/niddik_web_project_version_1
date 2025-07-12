import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Building, Settings, Phone, Mail, MapPin, Search, Eye, EyeOff, ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import AdminLayout from '@/components/layout/AdminLayout';
import { Helmet } from 'react-helmet-async';

// Types
interface ClientCompany {
  id: number;
  name: string;
  logoUrl?: string;
  contactPerson?: string;
  billToAddress: string;
  billToCity: string;
  billToState: string;
  billToCountry: string;
  billToZipCode: string;
  shipToSameAsBillTo: boolean;
  shipToAddress?: string;
  shipToCity?: string;
  shipToState?: string;
  shipToCountry?: string;
  shipToZipCode?: string;
  phoneNumbers: string[];
  emailAddresses: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CompanySettings {
  id: number;
  name: string;
  logoUrl?: string;
  tagline?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phoneNumbers: string[];
  emailAddresses: string[];
  website?: string;
  taxId?: string;
  gstNumber?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Schemas
const clientCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  logoUrl: z.string().optional(),
  contactPerson: z.string().optional(),
  billToAddress: z.string().min(1, "Bill to address is required"),
  billToCity: z.string().min(1, "Bill to city is required"),
  billToState: z.string().min(1, "Bill to state is required"),
  billToCountry: z.string().min(1, "Bill to country is required"),
  billToZipCode: z.string().min(1, "Bill to zip code is required"),
  shipToSameAsBillTo: z.boolean().default(false),
  shipToAddress: z.string().optional(),
  shipToCity: z.string().optional(),
  shipToState: z.string().optional(),
  shipToCountry: z.string().optional(),
  shipToZipCode: z.string().optional(),
  phoneNumbers: z.array(z.string().min(1, "Phone number required")).min(1, "At least one phone number required"),
  emailAddresses: z.array(z.string().email("Valid email required")).min(1, "At least one email address required"),
  isActive: z.boolean().default(true),
});

const companySettingsSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  logoUrl: z.string().optional(),
  tagline: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  phoneNumbers: z.array(z.string().min(1, "Phone number required")).min(1, "At least one phone number required"),
  emailAddresses: z.array(z.string().email("Valid email required")).min(1, "At least one email address required"),
  website: z.string().optional(),
  taxId: z.string().optional(),
  gstNumber: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type ClientCompanyForm = z.infer<typeof clientCompanySchema>;
type CompanySettingsForm = z.infer<typeof companySettingsSchema>;

// Array input helper component
const ArrayInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text" 
}: { 
  label: string; 
  value: string[]; 
  onChange: (value: string[]) => void; 
  placeholder: string; 
  type?: string; 
}) => {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...value, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type={type}
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
        />
        <Button type="button" onClick={addItem} variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <Badge key={index} variant="secondary" className="gap-1">
            {item}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default function CompanyManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientCompany | null>(null);
  const [editingSettings, setEditingSettings] = useState<CompanySettings | null>(null);
  const [showInactiveClients, setShowInactiveClients] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Client companies queries
  const { data: clientCompanies, isLoading: loadingClients } = useQuery({
    queryKey: ['/api/admin/client-companies', { search: searchTerm, isActive: showInactiveClients ? undefined : true }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: '1',
        limit: '100',
        ...(searchTerm && { search: searchTerm }),
        ...(showInactiveClients ? {} : { isActive: 'true' })
      });
      const response = await apiRequest(`/api/admin/client-companies?${params}`);
      return response.data;
    },
  });

  // Company settings queries
  const { data: companySettings, isLoading: loadingSettings } = useQuery({
    queryKey: ['/api/admin/company-settings', { search: searchTerm }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: '1',
        limit: '100',
        ...(searchTerm && { search: searchTerm })
      });
      const response = await apiRequest(`/api/admin/company-settings?${params}`);
      
      // Handle different response structures
      if (Array.isArray(response)) {
        return response;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      } else if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    },
  });



  // Client company form
  const clientForm = useForm<ClientCompanyForm>({
    resolver: zodResolver(clientCompanySchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      contactPerson: '',
      billToAddress: '',
      billToCity: '',
      billToState: '',
      billToCountry: '',
      billToZipCode: '',
      shipToSameAsBillTo: true,
      shipToAddress: '',
      shipToCity: '',
      shipToState: '',
      shipToCountry: '',
      shipToZipCode: '',
      phoneNumbers: [],
      emailAddresses: [],
      isActive: true,
    },
  });

  // Company settings form
  const settingsForm = useForm<CompanySettingsForm>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      tagline: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      phoneNumbers: [],
      emailAddresses: [],
      website: '',
      taxId: '',
      gstNumber: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      isDefault: false,
    },
  });

  // Mutations
  const clientMutation = useMutation({
    mutationFn: async (data: ClientCompanyForm) => {
      if (editingClient) {
        return await apiRequest(`/api/admin/client-companies/${editingClient.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      } else {
        return await apiRequest('/api/admin/client-companies', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/client-companies'] });
      setShowClientDialog(false);
      setEditingClient(null);
      clientForm.reset();
      toast({
        title: "Success",
        description: `Client company ${editingClient ? 'updated' : 'created'} successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save client company",
        variant: "destructive",
      });
    },
  });

  const settingsMutation = useMutation({
    mutationFn: async (data: CompanySettingsForm) => {
      if (editingSettings) {
        return await apiRequest(`/api/admin/company-settings/${editingSettings.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      } else {
        return await apiRequest('/api/admin/company-settings', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-settings'] });
      setShowSettingsDialog(false);
      setEditingSettings(null);
      settingsForm.reset();
      toast({
        title: "Success",
        description: `Company settings ${editingSettings ? 'updated' : 'created'} successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save company settings",
        variant: "destructive",
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/client-companies/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/client-companies'] });
      toast({
        title: "Success",
        description: "Client company deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete client company",
        variant: "destructive",
      });
    },
  });

  const deleteSettingsMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/company-settings/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/company-settings'] });
      toast({
        title: "Success",
        description: "Company settings deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete company settings",
        variant: "destructive",
      });
    },
  });

  // Effects
  useEffect(() => {
    if (editingClient) {
      clientForm.reset({
        name: editingClient.name,
        logoUrl: editingClient.logoUrl || '',
        contactPerson: editingClient.contactPerson || '',
        billToAddress: editingClient.billToAddress,
        billToCity: editingClient.billToCity,
        billToState: editingClient.billToState,
        billToCountry: editingClient.billToCountry,
        billToZipCode: editingClient.billToZipCode,
        shipToSameAsBillTo: editingClient.shipToSameAsBillTo,
        shipToAddress: editingClient.shipToAddress || '',
        shipToCity: editingClient.shipToCity || '',
        shipToState: editingClient.shipToState || '',
        shipToCountry: editingClient.shipToCountry || '',
        shipToZipCode: editingClient.shipToZipCode || '',
        phoneNumbers: editingClient.phoneNumbers,
        emailAddresses: editingClient.emailAddresses,
        isActive: editingClient.isActive,
      });
    }
  }, [editingClient, clientForm]);

  useEffect(() => {
    if (editingSettings) {
      settingsForm.reset({
        name: editingSettings.name,
        logoUrl: editingSettings.logoUrl || '',
        tagline: editingSettings.tagline || '',
        address: editingSettings.address,
        city: editingSettings.city,
        state: editingSettings.state,
        country: editingSettings.country,
        zipCode: editingSettings.zipCode,
        phoneNumbers: editingSettings.phoneNumbers,
        emailAddresses: editingSettings.emailAddresses,
        website: editingSettings.website || '',
        taxId: editingSettings.taxId || '',
        gstNumber: editingSettings.gstNumber || '',
        bankName: editingSettings.bankName || '',
        accountNumber: editingSettings.accountNumber || '',
        routingNumber: editingSettings.routingNumber || '',
        isDefault: editingSettings.isDefault,
      });
    }
  }, [editingSettings, settingsForm]);

  const watchShipToSameAsBillTo = clientForm.watch('shipToSameAsBillTo');

  // Logo upload function
  const handleLogoUpload = async (file: File, isSettings: boolean = false) => {
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch('/api/upload-company-logo', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      const result = await response.json();
      
      if (isSettings) {
        settingsForm.setValue('logoUrl', result.url);
      } else {
        clientForm.setValue('logoUrl', result.url);
      }

      toast({
        title: "Success",
        description: "Logo uploaded successfully to ImageKit",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <AdminLayout title="Company Management" description="Manage client companies and company settings for invoicing">
      <Helmet>
        <title>Company Management | Niddik Admin</title>
        <meta name="description" content="Manage client companies and company settings for invoicing and billing." />
        <meta property="og:title" content="Company Management | Niddik Admin" />
        <meta property="og:description" content="Manage client companies and company settings for invoicing and billing." />
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/timesheets">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Timesheets
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowInactiveClients(!showInactiveClients)}
            >
              {showInactiveClients ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showInactiveClients ? 'Hide' : 'Show'} Inactive
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clients">Client Companies</TabsTrigger>
          <TabsTrigger value="settings">Company Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Client Companies</h2>
            <Button onClick={() => setShowClientDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Client Company
            </Button>
          </div>

          {loadingClients ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientCompanies?.companies?.map((company: ClientCompany) => (
                <Card key={company.id} className={cn("relative", !company.isActive && "opacity-60")}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-500" />
                        <div>
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          {company.contactPerson && (
                            <CardDescription>{company.contactPerson}</CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant={company.isActive ? "default" : "secondary"}>
                          {company.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{company.billToCity}, {company.billToState}, {company.billToCountry}</span>
                    </div>
                    {company.phoneNumbers.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{company.phoneNumbers[0]}</span>
                      </div>
                    )}
                    {company.emailAddresses.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4" />
                        <span>{company.emailAddresses[0]}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingClient(company);
                          setShowClientDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this client company?")) {
                            deleteClientMutation.mutate(company.id);
                          }
                        }}
                        disabled={deleteClientMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Company Settings</h2>
            <Button onClick={() => setShowSettingsDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Company Settings
            </Button>
          </div>

          {loadingSettings ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(companySettings) && companySettings.map((settings: CompanySettings) => (
                <Card key={settings.id} className={cn("relative", settings.isDefault && "ring-2 ring-blue-500")}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {settings.logoUrl ? (
                          <img 
                            src={settings.logoUrl} 
                            alt={`${settings.name} logo`}
                            className="w-8 h-8 rounded object-contain"
                          />
                        ) : (
                          <Settings className="w-5 h-5 text-green-500" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{settings.name}</CardTitle>
                          {settings.tagline && (
                            <CardDescription>{settings.tagline}</CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {settings.isDefault && (
                          <Badge variant="default">Default</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{settings.city}, {settings.state}, {settings.country}</span>
                    </div>
                    {settings.phoneNumbers.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{settings.phoneNumbers[0]}</span>
                      </div>
                    )}
                    {settings.emailAddresses.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4" />
                        <span>{settings.emailAddresses[0]}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSettings(settings);
                          setShowSettingsDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this company settings?")) {
                            deleteSettingsMutation.mutate(settings.id);
                          }
                        }}
                        disabled={deleteSettingsMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Client Company Dialog */}
      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Edit Client Company' : 'Add Client Company'}
            </DialogTitle>
            <DialogDescription>
              {editingClient ? 'Update the client company information' : 'Add a new client company for invoicing and Timesheet'}
            </DialogDescription>
          </DialogHeader>
          <Form {...clientForm}>
            <form onSubmit={clientForm.handleSubmit((data) => clientMutation.mutate(data))} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={clientForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientForm.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={clientForm.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Logo</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {field.value && (
                          <div className="flex items-center gap-4">
                            <div className="w-32 h-16 border rounded flex items-center justify-center bg-gray-50">
                              <img
                                src={field.value}
                                alt="Company logo"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.onChange('')}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(file, false);
                            }}
                            disabled={uploadingLogo}
                            className="hidden"
                            id="client-logo-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('client-logo-upload')?.click()}
                            disabled={uploadingLogo}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Bill To Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={clientForm.control}
                    name="billToAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={clientForm.control}
                    name="billToCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={clientForm.control}
                    name="billToState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={clientForm.control}
                    name="billToCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={clientForm.control}
                    name="billToZipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={clientForm.control}
                  name="shipToSameAsBillTo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Ship To Same as Bill To</FormLabel>
                        <FormDescription>
                          Use the same address for shipping
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!watchShipToSameAsBillTo && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ship To Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={clientForm.control}
                        name="shipToAddress"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={clientForm.control}
                        name="shipToCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={clientForm.control}
                        name="shipToState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={clientForm.control}
                        name="shipToCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={clientForm.control}
                        name="shipToZipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={clientForm.control}
                  name="phoneNumbers"
                  render={({ field }) => (
                    <FormItem>
                      <ArrayInput
                        label="Phone Numbers"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter phone number"
                        type="tel"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientForm.control}
                  name="emailAddresses"
                  render={({ field }) => (
                    <FormItem>
                      <ArrayInput
                        label="Email Addresses"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter email address"
                        type="email"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={clientForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Enable this client company
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowClientDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={clientMutation.isPending}>
                  {clientMutation.isPending ? 'Saving...' : (editingClient ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Company Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSettings ? 'Edit Company Settings' : 'Add Company Settings'}
            </DialogTitle>
            <DialogDescription>
              {editingSettings ? 'Update the company settings information' : 'Add company settings for invoicing'}
            </DialogDescription>
          </DialogHeader>
          <Form {...settingsForm}>
            <form onSubmit={settingsForm.handleSubmit((data) => settingsMutation.mutate(data))} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={settingsForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingsForm.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={settingsForm.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Logo</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {field.value && (
                          <div className="flex items-center gap-4">
                            <div className="w-32 h-16 border rounded flex items-center justify-center bg-gray-50">
                              <img
                                src={field.value}
                                alt="Company logo"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.onChange('')}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(file, true);
                            }}
                            disabled={uploadingLogo}
                            className="hidden"
                            id="settings-logo-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('settings-logo-upload')?.click()}
                            disabled={uploadingLogo}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={settingsForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={settingsForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={settingsForm.control}
                  name="phoneNumbers"
                  render={({ field }) => (
                    <FormItem>
                      <ArrayInput
                        label="Phone Numbers"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter phone number"
                        type="tel"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingsForm.control}
                  name="emailAddresses"
                  render={({ field }) => (
                    <FormItem>
                      <ArrayInput
                        label="Email Addresses"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter email address"
                        type="email"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={settingsForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingsForm.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={settingsForm.control}
                  name="gstNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingsForm.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={settingsForm.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingsForm.control}
                  name="routingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={settingsForm.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Default Company</FormLabel>
                      <FormDescription>
                        Set as default company for invoicing
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowSettingsDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={settingsMutation.isPending}>
                  {settingsMutation.isPending ? 'Saving...' : (editingSettings ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
}