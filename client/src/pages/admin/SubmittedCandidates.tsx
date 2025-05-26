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
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Papa from 'papaparse';
import React from 'react';
import { useLocation, Link } from "wouter";
import { Progress } from "@/components/ui/progress"

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
  sourcedBy: z.string().optional(),
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

function SubmittedCandidates() {
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [applicantSearch, setApplicantSearch] = useState("");
  const [isApplicantsDialogOpen, setIsApplicantsDialogOpen] = useState(false);
  const [editDialogLoading, setEditDialogLoading] = useState(false);

  // Bulk selection state
  const [selectedCandidates, setSelectedCandidates] = useState<Set<number>>(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

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
  const initializeEditForm = async (candidate: SubmittedCandidate) => {
    setEditDialogLoading(true);
    try {
      const formData = {
        ...candidate,
        sourcedBy: candidate.sourcedBy || '',
        submissionDate: candidate.submissionDate ? new Date(candidate.submissionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        client: candidate.client || '',
        poc: candidate.poc || '',
        skills: candidate.skills || '',
        candidateName: candidate.candidateName || '',
        contactNo: candidate.contactNo || '',
        emailId: candidate.emailId || '',
        experience: candidate.experience || '',
        noticePeriod: candidate.noticePeriod || '',
        location: candidate.location || '',
        currentCtc: candidate.currentCtc || '',
        expectedCtc: candidate.expectedCtc || '',
        billRate: candidate.billRate?.toString() || '',
        payRate: candidate.payRate?.toString() || '',
        status: candidate.status || '',
        salaryInLacs: candidate.salaryInLacs || ''
      };
      form.reset(formData);
      setSelectedCandidate(candidate);
      setIsEditDialogOpen(true);
    } finally {
      setEditDialogLoading(false);
    }
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

  // Mutation to bulk delete candidates
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const res = await apiRequest("POST", "/api/submitted-candidates/bulk-delete", { ids });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete candidates");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `${data.count} candidates have been deleted successfully`,
      });
      setSelectedCandidates(new Set());
      setIsSelectAllChecked(false);
      setShowBulkActions(false);
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
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const simulateProgress = (progress: number) => {
        return new Promise(resolve => {
          setTimeout(() => {
            setUploadProgress(progress);
            resolve(void 0);
          }, 100);
        });
      };

      // Simulate upload process with progress updates
      for (let i = 10; i <= 100; i += 10) {
        await simulateProgress(i);
      }

      const res = await apiRequest("POST", "/api/submitted-candidates/bulk", { candidates: data });
      setIsUploading(false);

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
      setUploadProgress(0);
      setIsUploading(false);
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates/analytics/summary'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
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
          'pay rate': 'payRate',
          'pay_rate': 'payRate',
          'payrate': 'payRate',
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
    const requiredFields = [
      'candidateName', 'client', 'poc', 'contactNo', 'emailId', 
      'experience', 'noticePeriod', 'location', 'currentCtc', 
      'expectedCtc', 'skills', 'sourcedBy'
    ];
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

  // Bulk selection handlers
  const handleSelectCandidate = (candidateId: number, checked: boolean) => {
    const newSelected = new Set(selectedCandidates);
    if (checked) {
      newSelected.add(candidateId);
    } else {
      newSelected.delete(candidateId);
    }
    setSelectedCandidates(newSelected);
    setShowBulkActions(newSelected.size > 0);

    // Update select all checkbox state
    const totalCandidates = candidatesData?.data?.length || 0;
    setIsSelectAllChecked(newSelected.size === totalCandidates && totalCandidates > 0);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(candidatesData?.data?.map((c: SubmittedCandidate) => c.id) || []);
      setSelectedCandidates(allIds);
      setShowBulkActions(allIds.size > 0);
    } else {
      setSelectedCandidates(new Set());
      setShowBulkActions(false);
    }
    setIsSelectAllChecked(checked);
  };

  const handleBulkDelete = () => {
    const idsArray = Array.from(selectedCandidates);
    bulkDeleteMutation.mutate(idsArray);
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
                            <TableHead                            <TableHead>Skills</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredApplicants?.map((applicant: any) => (
                            <TableRow key={applicant.id}>
                              <TableCell>{applicant.candidateName}</TableCell>
                              <TableCell>{applicant.emailId}</TableCell>
                              <TableCell>{applicant.skills}</TableCell>
                              <TableCell>{applicant.location}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  onClick={() => handleSelectApplicant(applicant)}
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
                </DialogContent>
              </Dialog>

              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Import Candidates from CSV</DialogTitle>
                    <DialogDescription>
                      Upload a CSV file with candidate data. Required columns: candidate name, email, client, poc, skills, experience, notice period, location, current ctc, expected ctc, contact no, status
                    </DialogDescription>
                  </DialogHeader>

                  {!isPreviewMode ? (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={handleFileImport}
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          Select a CSV file to upload
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">
                          Preview: {importData.length} candidates ready to import
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsPreviewMode(false);
                              setImportData([]);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleImportSubmit}
                            disabled={importMutation.isPending || isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Importing ({uploadProgress}%)
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Import All
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                        {isUploading && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Import Progress</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-xs text-muted-foreground">
                              Processing batch {Math.ceil((uploadProgress / 100) * Math.ceil(importData.length / 20))} of {Math.ceil(importData.length / 20)}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="max-h-[400px] overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Client</TableHead>
                              <TableHead>Skills</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {importData.slice(0, 10).map((candidate, index) => (
                              <TableRow key={index}>
                                <TableCell>{candidate.candidateName}</TableCell>
                                <TableCell>{candidate.emailId}</TableCell>
                                <TableCell>{candidate.client}</TableCell>
                                <TableCell>{candidate.skills}</TableCell>
                                <TableCell>{candidate.status}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {importData.length > 10 && (
                          <p className="text-sm text-muted-foreground mt-2">
                            ... and {importData.length - 10} more candidates
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, client, or skills..."
                    className="pl-8"
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
                <Button type="submit" variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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

                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_clients">All Clients</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {showBulkActions && (
            <div className="bg-muted p-3 rounded-md flex items-center justify-between">
              <span className="text-sm">
                {selectedCandidates.size} candidate{selectedCandidates.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCandidates(new Set());
                    setIsSelectAllChecked(false);
                    setShowBulkActions(false);
                  }}
                >
                  Clear Selection
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedCandidates.size} selected candidate{selectedCandidates.size !== 1 ? 's' : ''}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBulkDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete {selectedCandidates.size} Candidate{selectedCandidates.size !== 1 ? 's' : ''}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {/* Candidates Table */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted Candidates</CardTitle>
              <CardDescription>
                {candidatesData?.meta ? 
                  `Showing ${((candidatesData.meta.page - 1) * candidatesData.meta.limit) + 1}-${Math.min(candidatesData.meta.page * candidatesData.meta.limit, candidatesData.meta.total)} of ${candidatesData.meta.total} candidates` :
                  'Loading candidates...'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCandidates ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Loading candidates...</p>
                </div>
              ) : candidatesData?.data?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No candidates found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={isSelectAllChecked}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Client/POC</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>CTC</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Inline Add Row */}
                      {isAddingInline && (
                        <TableRow className="bg-muted/50">
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleAddInline}
                                disabled={createMutation.isPending}
                              >
                                {createMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setIsAddingInline(false);
                                  setNewCandidateData({
                                    submissionDate: new Date().toISOString().split('T')[0],
                                    status: 'new'
                                  });
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={newCandidateData.submissionDate || ''}
                              onChange={(e) => handleInlineFieldChange('submissionDate', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Input
                                placeholder="Candidate Name*"
                                value={newCandidateData.candidateName || ''}
                                onChange={(e) => handleInlineFieldChange('candidateName', e.target.value)}
                                className="h-8"
                              />
                              <Input
                                placeholder="Email*"
                                type="email"
                                value={newCandidateData.emailId || ''}
                                onChange={(e) => handleInlineFieldChange('emailId', e.target.value)}
                                className="h-8"
                              />
                              <Input
                                placeholder="Contact No*"
                                value={newCandidateData.contactNo || ''}
                                onChange={(e) => handleInlineFieldChange('contactNo', e.target.value)}
                                className="h-8"
                              />
                              <Input
                                placeholder="Sourced By*"
                                value={newCandidateData.sourcedBy || ''}
                                onChange={(e) => handleInlineFieldChange('sourcedBy', e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Input
                                placeholder="Client*"
                                value={newCandidateData.client || ''}
                                onChange={(e) => handleInlineFieldChange('client', e.target.value)}
                                className="h-8"
                              />
                              <Input
                                placeholder="POC*"
                                value={newCandidateData.poc || ''}
                                onChange={(e) => handleInlineFieldChange('poc', e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Skills*"
                              value={newCandidateData.skills || ''}
                              onChange={(e) => handleInlineFieldChange('skills', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Input
                                placeholder="Experience*"
                                value={newCandidateData.experience || ''}
                                onChange={(e) => handleInlineFieldChange('experience', e.target.value)}
                                className="h-8"
                              />
                              <Input
                                placeholder="Notice Period*"
                                value={newCandidateData.noticePeriod || ''}
                                onChange={(e) => handleInlineFieldChange('noticePeriod', e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Location*"
                              value={newCandidateData.location || ''}
                              onChange={(e) => handleInlineFieldChange('location', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Input
                                placeholder="Current CTC*"
                                value={newCandidateData.currentCtc || ''}
                                onChange={(e) => handleInlineFieldChange('currentCtc', e.target.value)}
                                className="h-8"
                              />
                              <Input
                                placeholder="Expected CTC*"
                                value={newCandidateData.expectedCtc || ''}
                                onChange={(e) => handleInlineFieldChange('expectedCtc', e.target.value)}
                                className="h-8"
                              />
                              <Input
                                placeholder="Bill Rate"
                                value={newCandidateData.billRate || ''}
                                onChange={(e) => handleInlineFieldChange('billRate', e.target.value)}
                                className="h-8"
                              />
                              <Input
                                placeholder="Pay Rate"
                                value={newCandidateData.payRate || ''}
                                onChange={(e) => handleInlineFieldChange('payRate', e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={newCandidateData.status || 'new'} 
                              onValueChange={(value) => handleInlineFieldChange('status', value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.slice(1).map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      )}

                      {/* Existing Candidates */}
                      {candidatesData?.data?.map((candidate: SubmittedCandidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedCandidates.has(candidate.id)}
                              onCheckedChange={(checked) => handleSelectCandidate(candidate.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell>
                            {candidate.submissionDate ? 
                              new Date(candidate.submissionDate).toLocaleDateString() : 
                              'N/A'
                            }
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{candidate.candidateName}</div>
                              <div className="text-sm text-muted-foreground">{candidate.emailId}</div>
                              <div className="text-sm text-muted-foreground">{candidate.contactNo}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{candidate.client}</div>
                              <div className="text-sm text-muted-foreground">POC: {candidate.poc}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] text-sm">
                              {candidate.skills.length > 50 ? 
                                `${candidate.skills.substring(0, 50)}...` : 
                                candidate.skills
                              }
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{candidate.experience}</div>
                              <div className="text-xs text-muted-foreground">
                                Notice: {candidate.noticePeriod}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{candidate.location}</TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div>Current: {candidate.currentCtc}</div>
                              <div>Expected: {candidate.expectedCtc}</div>
                              {candidate.billRate && candidate.payRate && (
                                <>
                                  <div className="text-xs text-muted-foreground">
                                    Bill: ${candidate.billRate} | Pay: ${candidate.payRate}
                                  </div>
                                  <div className="text-xs text-green-600">
                                    Margin: ${candidate.marginPerHour}/hr
                                  </div>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={candidate.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => initializeEditForm(candidate)}
                                disabled={editDialogLoading}
                              >
                                {editDialogLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Edit className="h-4 w-4" />
                                )}
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete candidate "{candidate.candidateName}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteMutation.mutate(candidate.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
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
              )}

              {/* Pagination */}
              {candidatesData?.meta && candidatesData.meta.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {candidatesData.meta.page} of {candidatesData.meta.pages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevPage}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Candidate</DialogTitle>
                <DialogDescription>
                  Update candidate information and submission details
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
                          <FormLabel>Candidate Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
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
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Client</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>POC</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Experience</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Notice Period</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Current CTC</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Expected CTC</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bill Rate (per hour)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
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
                          <FormLabel>Pay Rate (per hour)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Auto-calculated fields */}
                  {(marginPerHour !== "0" || profitPerMonth !== "0") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                      <div>
                        <Label>Margin per Hour (Auto-calculated)</Label>
                        <Input value={`$${marginPerHour}`} disabled />
                      </div>
                      <div>
                        <Label>Profit per Month (Auto-calculated)</Label>
                        <Input value={`$${profitPerMonth}`} disabled />
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
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
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Enter detailed status information..."
                          />
                        </FormControl>
                        <FormDescription>
                          You can enter detailed status information including progress notes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {isLoadingAnalytics ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading analytics...</p>
            </div>
          ) : analyticsData ? (
            <AnalyticsCard data={analyticsData} />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No analytics data available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

export default SubmittedCandidates;