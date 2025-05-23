import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Edit, Trash2, Info, Plus, Download, Upload, Filter, Search, FileSpreadsheet, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Papa from 'papaparse';

// Define the type for a submitted candidate
type SubmittedCandidate = {
  id: number;
  submissionDate: string;
  sourcedBy: string;
  client: string;
  poc: string;
  skills: string;
  candidateName: string;
  contactNo: string;
  emailId: string;
  experience: string;
  noticePeriod: string;
  location: string;
  currentCtc: string;
  expectedCtc: string;
  billRate: string;
  payRate: string;
  marginPerHour: string;
  profitPerMonth: string;
  status: string;
  salaryInLacs?: string;
  createdAt: string;
  updatedAt: string;
};

// Analytics type
type AnalyticsData = {
  totalCandidates: number;
  uniqueClients: number;
  statusCounts: Record<string, number>;
};

// Pagination type
type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

// Form schema for candidate form
const candidateFormSchema = z.object({
  submissionDate: z.string().optional(),
  sourcedBy: z.string().min(2, "Sourced by is required"),
  client: z.string().min(2, "Client is required"),
  poc: z.string().min(2, "POC is required"),
  skills: z.string().min(2, "Skills are required"),
  candidateName: z.string().min(2, "Candidate name is required"),
  contactNo: z.string().min(5, "Contact number is required"),
  emailId: z.string().email("Valid email is required"),
  experience: z.string().min(1, "Experience is required"),
  noticePeriod: z.string().min(1, "Notice period is required"),
  location: z.string().min(2, "Location is required"),
  currentCtc: z.string().min(1, "Current CTC is required"),
  expectedCtc: z.string().min(1, "Expected CTC is required"),
  billRate: z.string().optional(),
  payRate: z.string().optional(),
  status: z.string().min(2, "Status is required and can include detailed information"),
  salaryInLacs: z.string().optional(),
});

type CandidateFormValues = z.infer<typeof candidateFormSchema>;

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let variant: "outline" | "default" | "secondary" | "destructive" = "outline";

  // Support partial matching for common statuses
  const statusLower = status.toLowerCase();

  if (statusLower.includes("new")) {
    variant = "default";
  } else if (statusLower.includes("submit")) {
    variant = "secondary";
  } else if (statusLower.includes("interview") || statusLower.includes("schedul")) {
    variant = "secondary";
  } else if (statusLower.includes("reject") || statusLower.includes("declin")) {
    variant = "destructive";
  } else if (statusLower.includes("select") || statusLower.includes("accept") || statusLower.includes("offer")) {
    variant = "default";
  }

  // Get the display text - show only first 15 chars in badge if longer
  const displayText = status.length > 15 ? `${status.substring(0, 15)}...` : status;

  return (
    <div className="max-w-[200px]">
      <Badge variant={variant} className="whitespace-nowrap overflow-hidden text-ellipsis">
        {displayText}
      </Badge>
      {status.length > 15 && (
        <div className="text-xs text-muted-foreground mt-1 whitespace-normal">
          {status}
        </div>
      )}
    </div>
  );
};

// Analytics Card Component
const AnalyticsCard = ({ data }: { data: AnalyticsData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">{data.totalCandidates}</CardTitle>
          <CardDescription>Total Candidates</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">{data.uniqueClients}</CardTitle>
          <CardDescription>Unique Clients</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex gap-2 items-baseline">
            <span className="text-2xl font-bold">{data.statusCounts['selected'] || 0}</span>
            <span className="text-sm text-muted-foreground">/{data.totalCandidates}</span>
          </CardTitle>
          <CardDescription>Selected Candidates</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

// Status filter options
const statusOptions = [
  { value: "all_statuses", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "submitted to client", label: "Submitted to Client" },
  { value: "scheduled for interview", label: "Scheduled for Interview" },
  { value: "rejected", label: "Rejected" },
  { value: "selected", label: "Selected" }
];

export default function SubmittedCandidates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for filters, pagination, and form dialogs
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all_statuses");
  const [clientFilter, setClientFilter] = useState<string>("all_clients");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<SubmittedCandidate | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [applicantSearch, setApplicantSearch] = useState("");
  const [isApplicantsDialogOpen, setIsApplicantsDialogOpen] = useState(false);

  // Calculate margin and profit based on bill rate and pay rate
  const calculateMarginAndProfit = (billRate: string, payRate: string) => {
    const bill = parseFloat(billRate || "0");
    const pay = parseFloat(payRate || "0");

    if (isNaN(bill) || isNaN(pay)) {
      return { marginPerHour: "0", profitPerMonth: "0" };
    }

    const margin = (bill - pay).toFixed(2);
    const profit = ((bill - pay) * 160).toFixed(2); // 160 hours per month

    return { marginPerHour: margin, profitPerMonth: profit };
  };

  // Form for adding/editing candidates
  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      candidateName: selectedCandidate?.candidateName || "",
      emailId: selectedCandidate?.emailId || "",
      location: selectedCandidate?.location || "",
      experience: selectedCandidate?.experience || "",
      skills: selectedCandidate?.skills || "",
      noticePeriod: selectedCandidate?.noticePeriod || "",
      currentCtc: selectedCandidate?.currentCtc || "",
      expectedCtc: selectedCandidate?.expectedCtc || "",
      contactNo: selectedCandidate?.contactNo || "",
      client: selectedCandidate?.client || "",
      poc: selectedCandidate?.poc || "",
      status: selectedCandidate?.status || "new",
      billRate: selectedCandidate?.billRate?.toString() || "",
      payRate: selectedCandidate?.payRate?.toString() || "",
      marginPerHour: selectedCandidate?.marginPerHour?.toString() || "",
      profitPerMonth: selectedCandidate?.profitPerMonth?.toString() || "",
    }
  });

  // Reset form values when selected candidate changes
  useEffect(() => {
    if (selectedCandidate) {
      form.reset({
        candidateName: selectedCandidate.candidateName,
        emailId: selectedCandidate.emailId,
        location: selectedCandidate.location,
        experience: selectedCandidate.experience,
        skills: selectedCandidate.skills,
        noticePeriod: selectedCandidate.noticePeriod,
        currentCtc: selectedCandidate.currentCtc,
        expectedCtc: selectedCandidate.expectedCtc,
        contactNo: selectedCandidate.contactNo,
        client: selectedCandidate.client,
        poc: selectedCandidate.poc,
        status: selectedCandidate.status,
        billRate: selectedCandidate.billRate?.toString() || "",
        payRate: selectedCandidate.payRate?.toString() || "",
        marginPerHour: selectedCandidate.marginPerHour?.toString() || "",
        profitPerMonth: selectedCandidate.profitPerMonth?.toString() || "",
      });
    }
  }, [selectedCandidate, form]);

  // Initialize edit form when a candidate is selected
  const initializeEditForm = (candidate: SubmittedCandidate) => {
    form.reset({
      ...candidate,
      submissionDate: candidate.submissionDate ? new Date(candidate.submissionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setSelectedCandidate(candidate);
    setIsEditDialogOpen(true);
  };

  // Watch billRate and payRate for auto-calculation
  const billRate = form.watch("billRate");
  const payRate = form.watch("payRate");

  // Auto-calculate margin and profit when bill rate or pay rate changes
  const { marginPerHour, profitPerMonth } = calculateMarginAndProfit(billRate || "0", payRate || "0");

  // Query to fetch submitted candidates
  const { data: candidatesData, isLoading: isLoadingCandidates, refetch: refetchCandidates } = useQuery({
    queryKey: ['/api/submitted-candidates', page, limit, search, statusFilter, clientFilter],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(statusFilter !== "all_statuses" && { status: statusFilter }),
        ...(clientFilter !== "all_clients" && { client: clientFilter }),
      });

      const res = await apiRequest("GET", `/api/submitted-candidates?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch candidates");
      return await res.json();
    }
  });

  // Query to fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['/api/submitted-candidates/analytics/summary'],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/submitted-candidates/analytics/summary`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return await res.json();
    }
  });

  // Mutation to create a candidate
  const createMutation = useMutation({
    mutationFn: async (data: CandidateFormValues) => {
      const combinedData = {
        ...data,
        marginPerHour,
        profitPerMonth
      };

      const res = await apiRequest("POST", "/api/submitted-candidates", combinedData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create candidate");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Candidate has been added successfully",
      });
      form.reset();
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates/analytics/summary'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to update a candidate
  const updateMutation = useMutation({
    mutationFn: async (data: CandidateFormValues) => {
      if (!selectedCandidate) throw new Error("No candidate selected");

      const combinedData = {
        ...data,
        marginPerHour,
        profitPerMonth
      };

      const res = await apiRequest("PUT", `/api/submitted-candidates/${selectedCandidate.id}`, combinedData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update candidate");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Candidate has been updated successfully",
      });
      form.reset();
      setIsEditDialogOpen(false);
      setSelectedCandidate(null);
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates/analytics/summary'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to delete a candidate
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/submitted-candidates/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete candidate");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Candidate has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates/analytics/summary'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to import candidates in bulk
  const importMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const res = await apiRequest("POST", "/api/submitted-candidates/bulk", { candidates: data });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to import candidates");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `${data.count} candidates have been imported successfully`,
      });
      setImportData([]);
      setIsImportDialogOpen(false);
      setIsPreviewMode(false);
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates/analytics/summary'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // Transform headers to match our schema
        const headerMap: { [key: string]: string } = {
          'submission date': 'submissionDate',
          'sourced by': 'sourcedBy',
          'client': 'client',
          'poc': 'poc',
          'skills': 'skills',
          'candidate name': 'candidateName',
          'contact no': 'contactNo',
          'email id': 'emailId',
          'experience': 'experience',
          'notice period': 'noticePeriod',
          'location': 'location',
          'current ctc': 'currentCtc',
          'expected ctc': 'expectedCtc',
          'bill rate': 'billRate',
          'pay/hr': 'payRate',
          'status': 'status',
          'salary (lacs)': 'salaryInLacs'
        };
        return headerMap[header.toLowerCase()] || header;
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          toast({
            title: "Parse Errors",
            description: "Some rows could not be parsed correctly. Please check your CSV format.",
            variant: "destructive",
          });
          return;
        }

        const mappedData = results.data.map((row: any) => ({
          submissionDate: row.submissionDate || new Date().toISOString().split('T')[0],
          sourcedBy: row.sourcedBy || 'CSV Import',
          client: row.client || '',
          poc: row.poc || '',
          skills: row.skills || '',
          candidateName: row.candidateName || '',
          contactNo: row.contactNo || '',
          emailId: row.emailId || '',
          experience: row.experience || '',
          noticePeriod: row.noticePeriod || '',
          location: row.location || '',
          currentCtc: row.currentCtc || '',
          expectedCtc: row.expectedCtc || '',
          billRate: row.billRate || '0',
          payRate: row.payRate || '0',
          status: row.status || 'new',
          salaryInLacs: row.salaryInLacs || ''
        }));

        // Validate data before setting
        if (mappedData.length === 0) {
          toast({
            title: "Error",
            description: "No valid data found in CSV file",
            variant: "destructive",
          });
          return;
        }

        setImportData(mappedData);
        setIsPreviewMode(true);
        toast({
          title: "Success",
          description: `${mappedData.length} records loaded for preview`,
        });
      },
      error: (error) => {
        toast({
          title: "Error",
          description: `Failed to parse CSV: ${error.message}`,
          variant: "destructive",
        });
      }
    });
  };

  // Query for job applicants
  const { 
    data: applicantsData, 
    isLoading: isLoadingApplicants,
    refetch: refetchApplicants 
  } = useQuery({
    queryKey: ['/api/submitted-candidates/job-applicants'],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/submitted-candidates/job-applicants`);
      if (!res.ok) throw new Error("Failed to fetch job applicants");
      return await res.json();
    },
    enabled: false // Don't load automatically, only when requested
  });

  // Extended form type with margin calculations
  type ExtendedCandidateFormValues = CandidateFormValues & {
    marginPerHour?: string;
    profitPerMonth?: string;
  };

  // State for inline editing
  const [isAddingInline, setIsAddingInline] = useState(false);
  const [newCandidateData, setNewCandidateData] = useState<Partial<ExtendedCandidateFormValues>>({
    submissionDate: new Date().toISOString().split('T')[0],
    status: 'new'
  });

  // Handle inline editing field change
  const handleInlineFieldChange = (field: keyof ExtendedCandidateFormValues, value: string) => {
    setNewCandidateData(prev => {
      const updated = { ...prev, [field]: value } as Partial<ExtendedCandidateFormValues>;

      // Auto-calculate margin and profit if bill rate or pay rate changes
      if (field === 'billRate' || field === 'payRate') {
        const bill = parseFloat(updated.billRate || '0');
        const pay = parseFloat(updated.payRate || '0');

        if (!isNaN(bill) && !isNaN(pay)) {
          updated.marginPerHour = (bill - pay).toFixed(2);
          updated.profitPerMonth = ((bill - pay) * 160).toFixed(2);
        }
      }

      return updated;
    });
  };

  // Function to filter applicants based on search term
  const filteredApplicants = useMemo(() => {
    if (!applicantsData?.data || !applicantSearch) return applicantsData?.data;

    const searchLower = applicantSearch.toLowerCase();
    return applicantsData.data.filter((applicant: any) => 
      applicant.candidateName?.toLowerCase().includes(searchLower) ||
      applicant.emailId?.toLowerCase().includes(searchLower) ||
      applicant.skills?.toLowerCase().includes(searchLower) ||
      applicant.location?.toLowerCase().includes(searchLower)
    );
  }, [applicantsData?.data, applicantSearch]);

  // Add candidate inline
  const handleAddInline = () => {
    // Validate required fields
    const requiredFields = ['candidateName', 'client', 'poc', 'emailId', 'sourcedBy'];
    const missingFields = requiredFields.filter(field => !newCandidateData[field as keyof ExtendedCandidateFormValues]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Add margin calculations
    const billRate = newCandidateData.billRate || "0";
    const payRate = newCandidateData.payRate || "0";
    const { marginPerHour, profitPerMonth } = calculateMarginAndProfit(billRate, payRate);

    const dataToSubmit = {
      ...newCandidateData,
      marginPerHour,
      profitPerMonth
    };

    createMutation.mutate(dataToSubmit as unknown as CandidateFormValues);
    setIsAddingInline(false);
    setNewCandidateData({
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'new'
    });
  };

  // Import from existing applicants
  const handleImportFromApplicants = () => {
    // Reset applicant search when opening dialog
    setApplicantSearch("");

    // Enable the query and fetch the data
    refetchApplicants();

    setIsApplicantsDialogOpen(true);
  };

  // Handle selecting an applicant to import
  const handleSelectApplicant = (applicant: any) => {
    setNewCandidateData({
      ...applicant,
      submissionDate: new Date().toISOString().split('T')[0],
      sourcedBy: 'Job Application',
      status: 'new'
    });
    setIsApplicantsDialogOpen(false);
    setIsAddingInline(true);
  };

  // Form submit handlers
  const onSubmitAdd: SubmitHandler<CandidateFormValues> = (data) => {
    createMutation.mutate(data);
  };

  const onSubmitEdit: SubmitHandler<CandidateFormValues> = (data) => {
    updateMutation.mutate(data);
  };

  // Handle import submit
  const handleImportSubmit = () => {
    importMutation.mutate(importData);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    refetchCandidates();
  };

  // Get unique client names from candidates data for filter
  const clients: string[] = candidatesData?.data ? 
    Array.from(new Set(candidatesData.data.map((c: SubmittedCandidate) => c.client))).filter(Boolean) as string[] : 
    [];

  // Pagination controls
  const totalPages = candidatesData?.meta?.pages || 1;

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <AdminLayout title="Submitted Candidates" description="Manage candidate submissions to clients">
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Candidate List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setIsAddingInline(true)}
                className="bg-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>

              <Button 
                variant="outline" 
                onClick={handleImportFromApplicants}
              >
                <Download className="h-4 w-4 mr-2" />
                Import from Applications
              </Button>

              <Dialog open={isApplicantsDialogOpen} onOpenChange={setIsApplicantsDialogOpen}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Import from Job Applications</DialogTitle>
                    <DialogDescription>
                      Select an applicant to import as a submitted candidate
                    </DialogDescription>
                  </DialogHeader>

                  <div className="my-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or skills..."
                        className="pl-8"
                        value={applicantSearch}
                        onChange={(e) => setApplicantSearch(e.target.value)}
                      />
                    </div>
                    {applicantSearch && filteredApplicants && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Found {filteredApplicants.length} matching applicants
                      </p>
                    )}
                  </div>

                  <div className="max-h-[400px] overflow-auto">
                    {isLoadingApplicants ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">Loading applicants...</p>
                      </div>
                    ) : applicantsData?.data?.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No applicants found</p>
                      </div>
                    ) : filteredApplicants && filteredApplicants.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No matching applicants found</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Skills</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(filteredApplicants || []).map((applicant: any, index: number) => (
                            <TableRow key={`applicant-${index}`}>
                              <TableCell>{applicant.candidateName}</TableCell>
                              <TableCell>{applicant.emailId}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{applicant.skills}</TableCell>
                              <TableCell>{applicant.experience}</TableCell>
                              <TableCell>{applicant.location}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  onClick={() => handleSelectApplicant(applicant)}
                                  size="sm"
                                  variant="outline"
                                >
                                  Select
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsApplicantsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Import from Sheet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Import Candidates from CSV</DialogTitle>
                    <DialogDescription>
                      Upload a CSV file with candidate data to bulk import.
                    </DialogDescription>
                  </DialogHeader>

                  {!isPreviewMode ? (
                    <div className="py-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={handleFileImport}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">CSV files only</p>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 max-h-[500px] overflow-auto">
                      <h3 className="text-lg font-medium mb-2">Preview ({importData.length} records)</h3>
                      <div className="border rounded">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Client</TableHead>
                              <TableHead>Skills</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {importData.slice(0, 5).map((item: Record<string, string>, index: number) => (
                              <TableRow key={`preview-${index}`}>
                                <TableCell>{item.candidateName || ""}</TableCell>
                                <TableCell>{item.client || ""}</TableCell>
                                <TableCell>{item.skills || ""}</TableCell>
                                <TableCell>{item.status || ""}</TableCell>
                              </TableRow>
                            ))}
                            {importData.length > 5 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                  ...and {importData.length - 5} more records
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsPreviewMode(false);
                      if (!isPreviewMode) setIsImportDialogOpen(false);
                    }}>
                      {isPreviewMode ? "Back" : "Cancel"}
                    </Button>
                    {isPreviewMode && (
                      <Button 
                        onClick={handleImportSubmit} 
                        disabled={importMutation.isPending}
                      >
                        {importMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          "Import Candidates"
                        )}
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">The code is modified to pre-fill the edit form with data from the selected candidate, using useEffect to reset the form when the selectedCandidate changes.              <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search candidates..."
                    className="pl-8"
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
                <Button type="submit" variant="secondary">Search</Button>
              </form>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={clientFilter}
              onValueChange={(value) => {
                setClientFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_clients">All Clients</SelectItem>
                {clients.map((client: string, index: number) => (
                  <SelectItem key={`client-${index}-${client}`} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="relative overflow-x-auto">
                <Table className="min-w-[1500px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Sourced By</TableHead>
                      <TableHead className="min-w-[150px]">Client</TableHead>
                      <TableHead className="min-w-[150px]">POC</TableHead>
                      <TableHead className="min-w-[180px]">Skills</TableHead>
                      <TableHead className="sticky left-0 bg-background z-20 min-w-[200px]">Candidate Name</TableHead>
                      <TableHead className="min-w-[150px]">Contact No</TableHead>
                      <TableHead className="min-w-[180px]">Email ID</TableHead>
                      <TableHead className="min-w-[120px]">Experience</TableHead>
                      <TableHead className="min-w-[120px]">Notice Period</TableHead>
                      <TableHead className="min-w-[120px]">Location</TableHead>
                      <TableHead className="min-w-[120px]">Current CTC</TableHead>
                      <TableHead className="min-w-[120px]">Expected CTC</TableHead>
                      <TableHead className="min-w-[120px]">Bill Rate ($$)</TableHead>
                      <TableHead className="min-w-[120px]">Pay/hr</TableHead>
                      <TableHead className="min-w-[120px]">Margin/hr</TableHead>
                      <TableHead className="min-w-[120px]">Profit/Month</TableHead>
                      <TableHead className="min-w-[180px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Salary (Lacs)</TableHead>
                      <TableHead className="sticky right-0 bg-background z-20 min-w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {/* Inline add candidate row */}
                  {isAddingInline && (
                    <TableRow className="bg-muted/30">
                      {/* Sourced By (Date Picker) */}
                      <TableCell>
                        <Input 
                          type="date"
                          placeholder="Sourced By"
                          className="w-full"
                          value={newCandidateData.sourcedBy || ''}
                          onChange={(e) => handleInlineFieldChange('sourcedBy', e.target.value)}
                        />
                      </TableCell>

                      {/* Client */}
                      <TableCell>
                        <Input 
                          placeholder="Client"
                          className="w-full"
                          value={newCandidateData.client || ''}
                          onChange={(e) => handleInlineFieldChange('client', e.target.value)}
                        />
                      </TableCell>

                      {/* POC */}
                      <TableCell>
                        <Input 
                          placeholder="POC"
                          className="w-full"
                          value={newCandidateData.poc || ''}
                          onChange={(e) => handleInlineFieldChange('poc', e.target.value)}
                        />
                      </TableCell>

                      {/* Skills */}
                      <TableCell>
                        <Input
                          placeholder="Skills (comma-separated)"
                          className="w-full"
                          value={newCandidateData.skills || ''}
                          onChange={(e) => handleInlineFieldChange('skills', e.target.value)}
                        />
                      </TableCell>

                      {/* Candidate Name */}
                      <TableCell className="sticky left-0 bg-muted/30 z-20">
                        <Input 
                          placeholder="Candidate name"
                          className="w-full"
                          value={newCandidateData.candidateName || ''}
                          onChange={(e) => handleInlineFieldChange('candidateName', e.target.value)}
                        />
                      </TableCell>

                      {/* Contact No */}
                      <TableCell>
                        <Input 
                          placeholder="Contact Number"
                          className="w-full"
                          value={newCandidateData.contactNo || ''}
                          onChange={(e) => handleInlineFieldChange('contactNo', e.target.value)}
                        />
                      </TableCell>

                      {/* Email ID */}
                      <TableCell>
                        <Input 
                          placeholder="Email address"
                          className="w-full"
                          value={newCandidateData.emailId || ''}
                          onChange={(e) => handleInlineFieldChange('emailId', e.target.value)}
                        />
                      </TableCell>

                      {/* Experience */}
                      <TableCell>
                        <Input 
                          placeholder="Experience (years)"
                          className="w-full"
                          value={newCandidateData.experience || ''}
                          onChange={(e) => handleInlineFieldChange('experience', e.target.value)}
                        />
                      </TableCell>

                      {/* Notice Period */}
                      <TableCell>
                        <Input 
                          placeholder="Notice period"
                          className="w-full"
                          value={newCandidateData.noticePeriod || ''}
                          onChange={(e) => handleInlineFieldChange('noticePeriod', e.target.value)}
                        />
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <Input 
                          placeholder="Location"
                          className="w-full"
                          value={newCandidateData.location || ''}
                          onChange={(e) => handleInlineFieldChange('location', e.target.value)}
                        />
                      </TableCell>

                      {/* Current CTC */}
                      <TableCell>
                        <Input 
                          placeholder="Current CTC"
                          className="w-full"
                          value={newCandidateData.currentCtc || ''}
                          onChange={(e) => handleInlineFieldChange('currentCtc', e.target.value)}
                        />
                      </TableCell>

                      {/* Expected CTC */}
                      <TableCell>
                        <Input 
                          placeholder="Expected CTC"
                          className="w-full"
                          value={newCandidateData.expectedCtc || ''}
                          onChange={(e) => handleInlineFieldChange('expectedCtc', e.target.value)}
                        />
                      </TableCell>

                      {/* Bill Rate */}
                      <TableCell>
                        <Input 
                          placeholder="Bill rate"
                          className="w-full"
                          type="number"
                          value={newCandidateData.billRate || ''}
                          onChange={(e) => handleInlineFieldChange('billRate', e.target.value)}
                        />
                      </TableCell>

                      {/* Pay Rate */}
                      <TableCell>
                        <Input 
                          placeholder="Pay rate"
                          className="w-full"
                          type="number"
                          value={newCandidateData.payRate || ''}
                          onChange={(e) => handleInlineFieldChange('payRate', e.target.value)}
                        />
                      </TableCell>

                      {/* Margin/hr */}
                      <TableCell>
                        <div className="text-muted-foreground text-sm">Auto-calculated</div>
                      </TableCell>

                      {/* Profit/Month */}
                      <TableCell>
                        <div className="text-muted-foreground text-sm">Auto-calculated</div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <textarea 
                          placeholder="Status"
                          className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm ring-offset-background"
                          rows={2}
                          value={newCandidateData.status || ''}
                          onChange={(e) => handleInlineFieldChange('status', e.target.value)}
                        />
                      </TableCell>

                      {/* Salary (Lacs) */}
                      <TableCell>
                        <Input 
                          placeholder="Salary (Lacs)"
                          className="w-full"
                          value={newCandidateData.salaryInLacs || ''}
                          onChange={(e) => handleInlineFieldChange('salaryInLacs', e.target.value)}
                        />
                      </TableCell>

                      <TableCell className="sticky right-0 bg-muted/30 z-20 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={handleAddInline}
                            variant="ghost"
                            size="icon"
                            disabled={createMutation.isPending}
                          >
                            {createMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button
                            onClick={() => setIsAddingInline(false)}
                            variant="ghost"
                            size="icon"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {isLoadingCandidates ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <span className="text-sm text-muted-foreground mt-2 block">Loading candidates...</span>
                      </TableCell>
                    </TableRow>
                  ) : candidatesData?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-muted-foreground">No candidates found</p>
                          <Button 
                            variant="link" 
                            onClick={() => {
                              setStatusFilter("all_statuses");
                              setClientFilter("all_clients");
                              setSearch("");
                            }}
                          >
                            Clear filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    candidatesData?.data?.map((candidate: SubmittedCandidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>{candidate.sourcedBy || '-'}</TableCell>
                        <TableCell>{candidate.client || '-'}</TableCell>
                        <TableCell>{candidate.poc || '-'}</TableCell>
                        <TableCell>
                          <div className="max-w-[150px] truncate" title={candidate.skills}>
                            {candidate.skills}
                          </div>
                        </TableCell>
                        <TableCell className="sticky left-0 bg-background z-20">
                          <div className="font-medium">{candidate.candidateName}</div>
                        </TableCell>
                        <TableCell>{candidate.contactNo || '-'}</TableCell>
                        <TableCell>{candidate.emailId || '-'}</TableCell>
                        <TableCell>{candidate.experience || '-'}</TableCell>
                        <TableCell>{candidate.noticePeriod || '-'}</TableCell>
                        <TableCell>{candidate.location || '-'}</TableCell>
                        <TableCell>{candidate.currentCtc || '-'}</TableCell>
                        <TableCell>{candidate.expectedCtc || '-'}</TableCell>
                        <TableCell>${candidate.billRate || '-'}</TableCell>
                        <TableCell>${candidate.payRate || '-'}</TableCell>
                        <TableCell>${candidate.marginPerHour || '-'}</TableCell>
                        <TableCell>${candidate.profitPerMonth || '-'}</TableCell>
                        <TableCell>
                          <StatusBadge status={candidate.status} />
                        </TableCell>
                        <TableCell>{candidate.salaryInLacs || '-'}</TableCell>
                        <TableCell className="sticky right-0 bg-background z-20 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => initializeEditForm(candidate)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the candidate record for {candidate.candidateName}.
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteMutation.mutate(candidate.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    {deleteMutation.isPending ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting
                                      </>
                                    ) : (
                                      "Delete"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {candidatesData?.data?.length || 0} of {candidatesData?.meta?.total || 0} candidates
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{page}</span>
                  <span className="text-sm text-muted-foreground">of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {isLoadingAnalytics ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-muted-foreground">Loading analytics data...</p>
            </div>
          ) : analyticsData?.data ? (
            <>
              <AnalyticsCard data={analyticsData.data} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status Distribution</CardTitle>
                    <CardDescription>Breakdown of candidates by current status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analyticsData.data.statusCounts).map(([status, count]) => (
                        <div key={`status-${status}`} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={status} />
                            <span>{status}</span>
                          </div>
                          <div className="text-sm font-medium">{count as number}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Clients</CardTitle>
                    <CardDescription>Clients with most candidate submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Info className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Client breakdown visualization will be added soon.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Info className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No analytics data available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Candidate Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
            <DialogDescription>
              Enter the details of the candidate you want to add to the system.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="candidateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidate Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email ID *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="submissionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submission Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client *</FormLabel>
                      <FormControl>
                        <Input placeholder="Client company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>POC *</FormLabel>
                      <FormControl>
                        <Input placeholder="Point of contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourcedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sourced By *</FormLabel>
                      <FormControl>
                        <Input placeholder="Recruiter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Candidate location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (years) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Years of experience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="noticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notice Period *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Immediate, 30 days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentCtc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current CTC *</FormLabel>
                      <FormControl>
                        <Input placeholder="Current salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedCtc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected CTC *</FormLabel>
                      <FormControl>
                        <Input placeholder="Expected salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryInLacs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary (Lacs)</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual salary in lacs" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="submitted to client">Submitted to Client</SelectItem>
                          <SelectItem value="scheduled for interview">Scheduled for Interview</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="selected">Selected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills *</FormLabel>
                        <FormControl>
                          <Input placeholder="Comma-separated skills" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <Card className="bg-muted/40">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Rate Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="billRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bill Rate ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="Client bill rate"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="payRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pay Rate ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="Candidate pay rate"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <div className="space-y-2">
                          <Label>Margin/hr ($)</Label>
                          <Input value={marginPerHour} readOnly disabled className="bg-muted" />
                          <div className="text-xs text-muted-foreground">
                            Monthly profit: ${profitPerMonth}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Add Candidate"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Candidate Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>
              Update the details of this candidate.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="candidateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidate Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email ID *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="submissionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submission Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client *</FormLabel>
                      <FormControl>
                        <Input placeholder="Client company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>POC *</FormLabel>
                      <FormControl>
                        <Input placeholder="Point of contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourcedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sourced By *</FormLabel>
                      <FormControl>
                        <Input placeholder="Recruiter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Candidate location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (years) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Years of experience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="noticePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notice Period *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Immediate, 30 days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentCtc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current CTC *</FormLabel>
                      <FormControl>
                        <Input placeholder="Current salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedCtc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected CTC *</FormLabel>
                      <FormControl>
                        <Input placeholder="Expected salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryInLacs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary (Lacs)</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual salary in lacs" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="submitted to client">Submitted to Client</SelectItem>
                          <SelectItem value="scheduled for interview">Scheduled for Interview</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="selected">Selected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills *</FormLabel>
                        <FormControl>
                          <Input placeholder="Comma-separated skills" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <Card className="bg-muted/40">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Rate Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="billRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabelBill Rate ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="Client bill rate"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="payRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pay Rate ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="Candidate pay rate"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <div className="space-y-2">
                          <Label>Margin/hr ($)</Label>
                          <Input value={marginPerHour} readOnly disabled className="bg-muted" />
                          <div className="text-xs text-muted-foreground">
                            Monthly profit: ${profitPerMonth}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedCandidate(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Candidate"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}