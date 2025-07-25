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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Edit, Trash2, Info, Plus, Download, Upload, Filter, Search, FileSpreadsheet, Check, X, Settings } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

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

  // For shorter statuses, show them directly in the badge
  if (status.length <= 20) {
    return (
      <Badge variant={variant} className="whitespace-nowrap" title={status}>
        {status}
      </Badge>
    );
  }

  // For longer statuses, show truncated version with tooltip
  const displayText = `${status.substring(0, 17)}...`;

  return (
    <div className="max-w-[200px]">
      <Badge variant={variant} className="whitespace-nowrap overflow-hidden text-ellipsis" title={status}>
        {displayText}
      </Badge>
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

// Column configuration for visibility control
const columnConfig = [
  { key: 'id', label: 'ID', required: true },
  { key: 'sourcedBy', label: 'Sourced By', required: false },
  { key: 'client', label: 'Client', required: false },
  { key: 'poc', label: 'POC', required: false },
  { key: 'skills', label: 'Skills', required: false },
  { key: 'candidateName', label: 'Candidate Name', required: true },
  { key: 'contactNo', label: 'Contact No', required: false },
  { key: 'emailId', label: 'Email ID', required: false },
  { key: 'experience', label: 'Experience', required: false },
  { key: 'noticePeriod', label: 'Notice Period', required: false },
  { key: 'location', label: 'Location', required: false },
  { key: 'currentCtc', label: 'Current CTC', required: false },
  { key: 'expectedCtc', label: 'Expected CTC', required: false },
  { key: 'billRate', label: 'Bill Rate', required: false },
  { key: 'payRate', label: 'Pay Rate', required: false },
  { key: 'marginPerHour', label: 'Margin Per Hour', required: false },
  { key: 'profitPerMonth', label: 'Profit Per Month', required: false },
  { key: 'status', label: 'Status', required: true },
  { key: 'actions', label: 'Actions', required: true }
];

// Default visible columns (commonly used ones)
const defaultVisibleColumns = [
  'id', 'sourcedBy', 'client', 'poc', 'skills', 'candidateName', 
  'contactNo', 'status', 'actions'
];

function SubmittedCandidates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for filters, pagination, and form dialogs
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(() => {
    const savedLimit = localStorage.getItem('submittedCandidates_pageSize');
    return savedLimit ? parseInt(savedLimit, 10) : 10;
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all_statuses");
  const [clientFilter, setClientFilter] = useState<string>("all_clients");
    // Add state for new filters
    const [sourcedByFilter, setSourcedByFilter] = useState<string>("all_sourced_by");
    const [pocFilter, setPocFilter] = useState<string>("all_pocs");
    const [marginFilter, setMarginFilter] = useState<string>("all_margins");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<SubmittedCandidate | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [applicantSearch, setApplicantSearch] = useState("");
  const [isApplicantsDialogOpen, setIsApplicantsDialogOpen] = useState(false);
  const [editDialogLoading, setEditDialogLoading] = useState(false);

  // Add state variables for upload status and progress
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');

  // State for selected applicants in import dialog
  const [selectedApplicants, setSelectedApplicants] = useState<any[]>([]);

  // State for bulk actions
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<number[]>([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [isSelectAllPages, setIsSelectAllPages] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<number[]>([]);

  // Column visibility state with persistence
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const savedColumns = localStorage.getItem('submittedCandidates_visibleColumns');
    return savedColumns ? JSON.parse(savedColumns) : defaultVisibleColumns;
  });

  // Save column preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('submittedCandidates_visibleColumns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Toggle column visibility
  const toggleColumn = (columnKey: string) => {
    const column = columnConfig.find(col => col.key === columnKey);
    if (column?.required) return; // Don't allow hiding required columns

    setVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  // Reset to default columns
  const resetToDefaultColumns = () => {
    setVisibleColumns(defaultVisibleColumns);
  };

  // Show all columns
  const showAllColumns = () => {
    setVisibleColumns(columnConfig.map(col => col.key));
  };

  // Helper function to render table header conditionally
  const renderTableHeader = (columnKey: string, label: string, sortable: boolean = true, className: string = "") => {
    if (!visibleColumns.includes(columnKey)) return null;
    
    return (
      <TableHead 
        key={columnKey}
        className={`${className} ${sortable ? 'cursor-pointer hover:bg-muted/50' : ''}`}
        onClick={sortable ? () => handleSort(columnKey) : undefined}
      >
        {label} {sortable && sortField === columnKey && (sortDirection === 'asc' ? '↑' : '↓')}
      </TableHead>
    );
  };

  // Helper function to render table cell conditionally
  const renderTableCell = (columnKey: string, content: React.ReactNode, className: string = "") => {
    if (!visibleColumns.includes(columnKey)) return null;
    
    return (
      <TableCell key={columnKey} className={className}>
        {content}
      </TableCell>
    );
  };

  // Calculate margin and profit based on bill rate and pay rate
  const calculateMarginAndProfit = (billRate: string, payRate: string) => {
    const bill = parseFloat(billRate || "0");
    const pay = parseFloat(payRate || "0");

    console.log(`Calculating margin: Bill=${bill}, Pay=${pay}`);

    if (isNaN(bill) || isNaN(pay)) {
      return { marginPerHour: "0", profitPerMonth: "0" };
    }

    const margin = (bill - pay).toFixed(2);
    const profit = ((bill - pay) * 160).toFixed(2); // 160 hours per month

    console.log(`Result: Margin=${margin}, Profit=${profit}`);

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
      const submissionDate = selectedCandidate.submissionDate 
        ? new Date(selectedCandidate.submissionDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];
        
      form.reset({
        submissionDate: submissionDate,
        sourcedBy: selectedCandidate.sourcedBy || '',
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
        salaryInLacs: selectedCandidate.salaryInLacs || "",
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
    queryKey: ['/api/submitted-candidates', { 
      page, 
      limit, 
      search, 
      status: statusFilter !== 'all_statuses' ? statusFilter : undefined,
      client: clientFilter !== 'all_clients' ? clientFilter : undefined,
      sourcedBy: sourcedByFilter !== 'all_sourced_by' ? sourcedByFilter : undefined,
      poc: pocFilter !== 'all_pocs' ? pocFilter : undefined,
      margin: marginFilter !== 'all_margins' ? marginFilter : undefined
    }],
  });

  // Query to fetch all statuses and clients for filter dropdowns (unfiltered)
  const { data: allCandidatesData } = useQuery({
    queryKey: ['/api/submitted-candidates', { page: 1, limit: 1000 }],
  });

  // Query to fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['/api/submitted-candidates/analytics/summary'],
  });

  // Mutation to create a candidate
  const createMutation = useMutation({
    mutationFn: async (data: CandidateFormValues) => {
      const combinedData = {
        ...data,
        marginPerHour,
        profitPerMonth
      };

      return await apiRequest("/api/submitted-candidates", { method: "POST", body: JSON.stringify(combinedData) });
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

      return await apiRequest(`/api/submitted-candidates/${selectedCandidate.id}`, { method: "PUT", body: JSON.stringify(combinedData) });
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
      console.log('=== SINGLE DELETE MUTATION ===');
      console.log('Candidate ID to delete:', id);
      console.log('ID type:', typeof id);
      console.log('URL being called:', `/api/submitted-candidates/${id}`);

      return await apiRequest(`/api/submitted-candidates/${id}`, { method: "DELETE" });
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

    // Mutation to delete multiple candidates in bulk using single delete API
    const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      console.log('Starting bulk delete with IDs:', ids);

      // Validate and clean IDs more strictly
      const validIds = ids
        .filter(id => id != null && id !== undefined)
        .map(id => {
          const numId = parseInt(String(id), 10);
          return Number.isInteger(numId) && numId > 0 ? numId : null;
        })
        .filter((id): id is number => id !== null);

      console.log('Valid IDs for deletion:', validIds);

      if (validIds.length === 0) {
        throw new Error('No valid candidate IDs selected for deletion');
      }

      // Delete each candidate individually using the single delete API
      const deletePromises = validIds.map(async (id) => {
        console.log(`Deleting candidate ID: ${id}`);
        try {
          const responseData = await apiRequest("DELETE", `/api/submitted-candidates/${id}`);
          console.log(`Successfully deleted candidate ${id}:`, responseData);
          return { id, success: true };
        } catch (error: any) {
          console.error(`Failed to delete candidate ${id}:`, error);
          throw new Error(`Failed to delete candidate ${id}: ${error.message}`);
        }
      });

      // Wait for all deletions to complete
      const results = await Promise.allSettled(deletePromises);

      // Check for any failures
      const failures = results.filter(result => result.status === 'rejected');
      const successes = results.filter(result => result.status === 'fulfilled');

      if (failures.length > 0) {
        console.error('Some deletions failed:', failures);
        const failureMessages = failures.map(failure => 
          failure.status === 'rejected' ? failure.reason.message : 'Unknown error'
        );
        throw new Error(`Failed to delete ${failures.length} candidates: ${failureMessages.join(', ')}`);
      }

      console.log(`Successfully deleted ${successes.length} candidates`);
      return { 
        count: successes.length, 
        deletedCount: successes.length,
        success: true 
      };
    },
    onSuccess: (data) => {
      console.log('Bulk delete completed successfully:', data);
      const deletedCount = data.count || data.deletedCount || 0;

      // Handle partial success (status 207)
      if (data.partialSuccess && data.nonExistentIds?.length > 0) {
        toast({
          title: "Partial Success",
          description: `Deleted ${deletedCount} candidates. ${data.nonExistentIds.length} candidates were not found.`,
        });
      } else {
        toast({
          title: "Bulk Delete Successful",
          description: `Successfully deleted ${deletedCount} candidate${deletedCount > 1 ? 's' : ''}`,
        });
      }

      // Reset selection state
      setSelectedCandidateIds([]);
      setIsSelectAllChecked(false);
      setIsSelectAllPages(false);
      setBulkDeleteConfirmOpen(false);
      setBulkDeleteIds([]);

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates/analytics/summary'] });
    },
    onError: (error: Error) => {
      console.error('Bulk delete failed:', error);
      toast({
        title: "Bulk Delete Failed",
        description: error.message || "Failed to delete selected candidates. Please try again.",
        variant: "destructive",
      });
      setBulkDeleteConfirmOpen(false);
      setBulkDeleteIds([]);
    },
  });

  // Mutation to import candidates in bulk
  const importMutation = useMutation({
    mutationFn: async (data: any[]) => {
      // Implement chunking logic
      const chunkSize = 50; // Adjust chunk size as needed
      const numChunks = Math.ceil(data.length / chunkSize);

      for (let i = 0; i < numChunks; i++) {
        const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);

        // Simulate upload progress
        const progress = ((i + 1) / numChunks) * 100;
        setUploadProgress(progress);
        setUploadMessage(`Uploading chunk ${i + 1} of ${numChunks}...`);
        setUploadStatus('uploading');

        try {
          await apiRequest("POST", "/api/submitted-candidates/bulk", { candidates: chunk });
        } catch (error: any) {
          setUploadStatus('error');
          setUploadMessage(error.message || "Failed to import candidates");
          throw error; // Stop processing on error
        }
      }

      setUploadStatus('success');
      setUploadMessage('Candidates imported successfully!');
      return { count: data.length }; // Return total count after successful import
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
      setUploadStatus('idle');
      setUploadProgress(0);
      setUploadMessage('');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setUploadStatus('error');
      setUploadMessage(error.message);
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
          'bill rate ($$)': 'billRate',
          'pay/hr': 'payRate',
          'pay rate': 'payRate',
          'pay_rate': 'payRate',
          'payrate': 'payRate',
          'margin/hr': 'marginPerHour',
          'margin/hour': 'marginPerHour',
          'profit/month': 'profitPerMonth',
          'status': 'status',
          'salary (lacs)': 'salaryInLacs',
          'actions': 'actions'
        };
        return headerMap[header.toLowerCase()] || header;
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn("CSV Parse Errors:", results.errors);
          // Don't return here, continue with parsing as some errors might be non-critical
        }

        // Helper function to clean numeric values
        const cleanNumericValue = (value: string | undefined): string => {
          if (!value) return '';
          // Remove currency symbols, commas, and extra spaces
          return value.toString().replace(/[₹$,\s]/g, '').replace(/[^\d.]/g, '') || '';
        };

        // Helper function to clean text values
        const cleanTextValue = (value: string | undefined): string => {
          if (!value) return '';
          return value.toString().trim().replace(/[""]/g, '');
        };

        // Helper function to validate experience
        const cleanExperience = (value: string | undefined): string => {
          if (!value) return 'Not specified';
          const cleaned = value.toString().trim();
          // If it contains invalid characters or is not a reasonable experience value
          if (/^[a-zA-Z]+$/.test(cleaned) && cleaned.length < 5) {
            return 'Not specified';
          }
          return cleaned;
        };

        const mappedData = results.data.map((row: any, index: number) => {
          // Skip completely empty rows
          const hasData = Object.values(row).some(value => 
            value && value.toString().trim() && value.toString().trim() !== ''
          );

          if (!hasData) {
            return null;
          }

          return {
            submissionDate: row.submissionDate || row['submission date'] || new Date().toISOString().split('T')[0],
            sourcedBy: cleanTextValue(row.sourcedBy || row['sourced by']) || 'CSV Import',
            client: cleanTextValue(row.client || row.Client) || 'Default Client',
            poc: cleanTextValue(row.poc || row.POC) || 'Default POC',
            skills: cleanTextValue(row.skills || row.Skills) || 'Not specified',
            candidateName: cleanTextValue(row.candidateName || row['candidate name'] || row['Candidate Name']) || `Candidate ${index + 1}`,
            contactNo: cleanTextValue(row.contactNo || row['contact no'] || row['Contact No']) || 'Not provided',
            emailId: cleanTextValue(row.emailId || row['email id'] || row['Email ID']) || `candidate${index + 1}@example.com`,
            experience: cleanExperience(row.experience || row.Experience),
            noticePeriod: cleanTextValue(row.noticePeriod || row['notice period'] || row['Notice Period']) || 'Not specified',
            location: cleanTextValue(row.location || row.Location) || 'Not specified',
            currentCtc: cleanTextValue(row.currentCtc || row['current ctc'] || row['Current CTC']) || '',
            expectedCtc: cleanTextValue(row.expectedCtc || row['expected ctc'] || row['Expected CTC']) || '',
            billRate: cleanNumericValue(row.billRate || row['bill rate'] || row['Bill Rate']) || '0',
            payRate: cleanNumericValue(row.payRate || row['pay rate'] || row['Pay Rate'] || row['pay/hr']) || '0',
            status: cleanTextValue(row.status || row.Status) || 'new',
            salaryInLacs: cleanTextValue(row.salaryInLacs || row['salary (lacs)'] || row['Salary (Lacs)']) || ''
          };
        }).filter(Boolean); // Remove null entries

        // Validate data before setting
        if (mappedData.length === 0) {
          toast({
            title: "Error",
            description: "No valid data found in CSV file",
            variant: "destructive",
          });
          return;
        }

        // Filter out rows with all empty required fields
        const validData = mappedData.filter(row => {
          const hasValidName = row.candidateName && 
                              row.candidateName !== 'Default Name' && 
                              !row.candidateName.includes('Candidate ');
          const hasValidEmail = row.emailId && !row.emailId.includes('@example.com');
          const hasValidClient = row.client !== 'Default Client';
          const hasValidPoc = row.poc !== 'Default POC';

          // Require at least name and email OR client and poc
          return (hasValidName && hasValidEmail) || (hasValidClient && hasValidPoc);
        });

        if (validData.length === 0) {
          toast({
            title: "Error", 
            description: "No valid candidate data found. Please ensure your CSV has candidate names, emails, client, and POC information.",
            variant: "destructive",
          });
          return;
        }

        // Show warning if many rows were filtered out
        if (mappedData.length - validData.length > 0) {
          toast({
            title: "Data Filtered",
            description: `${mappedData.length - validData.length} empty or invalid rows were filtered out. ${validData.length} valid records loaded.`,
          });
        }

        setImportData(validData);
        setIsPreviewMode(true);
        toast({
          title: "Success",
          description: `${validData.length} records loaded for preview`,
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
    // Check if applicant is already selected
    const isAlreadySelected = selectedApplicants.some(selected => selected.emailId === applicant.emailId);

    if (isAlreadySelected) {
      // Remove from selected if already selected
      setSelectedApplicants(prev => prev.filter(selected => selected.emailId !== applicant.emailId));
    } else {
      // Add to selected applicants
      setSelectedApplicants(prev => [...prev, applicant]);

      // Set the candidate data for inline editing
      setNewCandidateData({
        ...applicant,
        submissionDate: new Date().toISOString().split('T')[0],
        sourcedBy: 'Job Application',
        status: 'new'
      });
      setIsApplicantsDialogOpen(false);
      setIsAddingInline(true);
    }
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

  // Handle search input with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1); // Reset to first page on search

    // Auto-search after typing (debounced by React Query)
    setTimeout(() => {
      if (search !== value) {
        refetchCandidates();
      }
    }, 300);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    refetchCandidates();
  };

  // Handle page size change
  const handlePageSizeChange = (newLimit: string) => {
    const limitValue = parseInt(newLimit, 10);
    setLimit(limitValue);
    setPage(1); // Reset to first page when changing page size
    localStorage.setItem('submittedCandidates_pageSize', newLimit);
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    setIsSelectAllChecked(checked);
    if (checked) {
      const currentPageIds = candidatesData?.data
        ?.map((candidate: SubmittedCandidate) => candidate.id)
        .filter(id => id && typeof id === 'number' && !isNaN(id) && id > 0) || [];
      console.log("Selecting all current page IDs:", currentPageIds, "Total candidates on page:", candidatesData?.data?.length);
      setSelectedCandidateIds(currentPageIds);
    } else {
      setSelectedCandidateIds([]);
      setIsSelectAllPages(false);
    }
  };

  // Handle select all pages
  const handleSelectAllPages = async () => {
    try {
      // Fetch all candidate IDs across all pages
      const queryParams = new URLSearchParams({
        page: '1',
        limit: candidatesData?.meta?.total?.toString() || '1000',
        ...(search && { search }),
        ...(statusFilter !== "all_statuses" && { status: statusFilter }),
        ...(clientFilter !== "all_clients" && { client: clientFilter }),
        ...(sourcedByFilter !== "all_sourced_by" && { sourcedBy: sourcedByFilter }),
        ...(pocFilter !== "all_pocs" && { poc: pocFilter }),
        ...(marginFilter !== "all_margins" && { margin: marginFilter }),
      });

      const allData = await apiRequest("GET", `/api/submitted-candidates?${queryParams}`);
      const allIds = allData.data?.map((candidate: SubmittedCandidate) => candidate.id) || [];
      setSelectedCandidateIds(allIds);
      setIsSelectAllPages(true);
      setIsSelectAllChecked(true);
      toast({
        title: "Success",
        description: `Selected all ${allIds.length} candidates across all pages`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select all candidates",
        variant: "destructive",
      });
    }
  };

  // Handle individual candidate selection
  const handleSelectCandidate = (candidateId: number, checked: boolean) => {
    console.log("Selecting candidate:", candidateId, "type:", typeof candidateId, "checked:", checked);

    // Convert to number and validate more strictly
    const numId = parseInt(String(candidateId), 10);
    if (!Number.isInteger(numId) || numId <= 0) {
      console.error("Invalid candidate ID provided:", candidateId, "converted to:", numId);
      return;
    }

    if (checked) {
      // Ensure we don't add duplicates
      setSelectedCandidateIds(prev => {
        if (!prev.includes(numId)) {
          console.log("Added candidate ID:", numId);
          return [...prev, numId];
        }
        return prev;
      });
    } else {
      setSelectedCandidateIds(prev => {
        console.log("Removed candidate ID:", numId);
        return prev.filter(id => id !== numId);
      });
      setIsSelectAllChecked(false);
      setIsSelectAllPages(false);
    }
  };

  // Handle bulk delete with confirmation
  const handleBulkDelete = () => {
    console.log("handleBulkDelete called with selected IDs:", selectedCandidateIds);

    if (selectedCandidateIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select candidates to delete",
        variant: "destructive",
      });
      return;
    }

    // Validate all selected IDs
    const validIds = selectedCandidateIds
      .map(id => Number(id))
      .filter(id => Number.isInteger(id) && id > 0);

    console.log("Valid IDs for deletion:", validIds);

    if (validIds.length === 0) {
      toast({
        title: "Invalid Selection",
        description: "No valid candidates selected for deletion",
        variant: "destructive",
      });
      return;
    }

    if (validIds.length !== selectedCandidateIds.length) {
      toast({
        title: "Warning", 
        description: `${validIds.length} of ${selectedCandidateIds.length} selected candidates are valid for deletion`,
      });
    }

    // Store valid IDs and show confirmation
    setBulkDeleteIds(validIds);
    setBulkDeleteConfirmOpen(true);
  };

  // Execute bulk delete after confirmation
  const executeBulkDelete = () => {
    console.log("Executing bulk delete for IDs:", bulkDeleteIds);
    if (bulkDeleteIds.length > 0) {
      bulkDeleteMutation.mutate(bulkDeleteIds);
    } else {
      console.error("No IDs to delete");
      setBulkDeleteConfirmOpen(false);
    }
  };

  // Update select all state when current page data changes
  useEffect(() => {
    if (candidatesData?.data) {
      const currentPageIds = candidatesData.data.map((candidate: SubmittedCandidate) => candidate.id);
      const allCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every(id => selectedCandidateIds.includes(id));
      setIsSelectAllChecked(allCurrentPageSelected);
    }
  }, [candidatesData?.data, selectedCandidateIds]);

  // Get unique client names and statuses from all candidates data for filters
  const clients: string[] = allCandidatesData?.data ? 
    Array.from(new Set(allCandidatesData.data.map((c: SubmittedCandidate) => c.client))).filter(Boolean) as string[] : 
    [];

  const allStatuses: string[] = allCandidatesData?.data ? 
    Array.from(new Set(allCandidatesData.data.map((c: SubmittedCandidate) => c.status))).filter(Boolean) as string[] : 
    [];

      // Get unique source by, poc and margin from all candidates data for filters
      const allSourcedBy: string[] = allCandidatesData?.data ?
      Array.from(new Set(allCandidatesData.data.map((c: SubmittedCandidate) => c.sourcedBy))).filter(Boolean) as string[] :
      [];
  
    const allPocs: string[] = allCandidatesData?.data ?
      Array.from(new Set(allCandidatesData.data.map((c: SubmittedCandidate) => c.poc))).filter(Boolean) as string[] :
      [];
  
      const allMargins: string[] = allCandidatesData?.data ?
      Array.from(new Set(allCandidatesData.data.map((c: SubmittedCandidate) => c.marginPerHour))).filter(Boolean) as string[] :
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

  // Sorting state and function
  const [sortField, setSortField] = useState<string>('candidateName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Analytics sorting state
  const [statusSortBy, setStatusSortBy] = useState<'count_desc' | 'count_asc' | 'name_asc' | 'name_desc'>('count_desc');
  const [clientSortBy, setClientSortBy] = useState<'count_desc' | 'count_asc' | 'name_asc' | 'name_desc'>('count_desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort candidates
  const sortedCandidates = useMemo(() => {
    if (!candidatesData?.data) return [];

    return [...candidatesData.data].sort((a: any, b: any) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle null/undefined values
      if (aValue == null) return -1;
      if (bValue == null) return 1;

      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [candidatesData?.data, sortField, sortDirection]);

  // Sort analytics data
  const sortedStatusData = useMemo(() => {
    if (!analyticsData?.data?.statusCounts) return [];

    const entries = Object.entries(analyticsData.data.statusCounts);
    return entries.sort(([nameA, countA], [nameB, countB]) => {
      switch (statusSortBy) {
        case 'count_desc':
          return (countB as number) - (countA as number);
        case 'count_asc':
          return (countA as number) - (countB as number);
        case 'name_asc':
          return nameA.localeCompare(nameB);
        case 'name_desc':
          return nameB.localeCompare(nameA);
        default:
          return (countB as number) - (countA as number);
      }
    });
  }, [analyticsData?.data?.statusCounts, statusSortBy]);

  const sortedClientData = useMemo(() => {
    if (!analyticsData?.data?.clientCounts) return [];

    const entries = Object.entries(analyticsData.data.clientCounts);
    return entries.sort(([nameA, countA], [nameB, countB]) => {
      switch (clientSortBy) {
        case 'count_desc':
          return (countB as number) - (countA as number);
        case 'count_asc':
          return (countA as number) - (countB as number);
        case 'name_asc':
          return nameA.localeCompare(nameB);
        case 'name_desc':
          return nameB.localeCompare(nameA);
        default:
          return (countB as number) - (countA as number);
      }
    });
  }, [analyticsData?.data?.clientCounts, clientSortBy]);

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
                      <Search className="absolute left-2.5 top-2.5 h-4 w-100 text-muted-foreground" />
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
                            <TableHead>Candidate Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact No</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Notice Period</TableHead>
                    <TableHead>Current CTC</TableHead>
                    <TableHead>Expected CTC</TableHead>
                    <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(filteredApplicants || []).map((applicant: any, index: number) => (
                            <TableRow key={`applicant-${index}`}>
                              <TableCell>{applicant.candidateName}</TableCell>
                      <TableCell>{applicant.emailId}</TableCell>
                      <TableCell>{applicant.contactNo || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">{applicant.skills}</TableCell>
                      <TableCell>{applicant.experience || 'N/A'}</TableCell>
                      <TableCell>{applicant.location || 'N/A'}</TableCell>
                      <TableCell>{applicant.noticePeriod || 'N/A'}</TableCell>
                      <TableCell>{applicant.currentCtc || 'N/A'}</TableCell>
                      <TableCell>{applicant.expectedCtc || 'N/A'}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSelectApplicant(applicant)}
                          disabled={selectedApplicants.some(selected => selected.emailId === applicant.emailId)}
                        >
                          {selectedApplicants.some(selected => selected.emailId === applicant.emailId) ? 'Selected' : 'Select'}
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
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">

              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>Import Candidates from CSV</DialogTitle>
                    <DialogDescription>
                      Upload a CSV file with candidate data to bulk import.
                    </DialogDescription>
                  </div>
                  <a 
                    href="https://res.cloudinary.com/dw4glwrrn/raw/upload/v1750409932/Import_from_Sheet___Niddik_-_Sheet1_1_ujofic_uthftf.csv"
                    target="_blank">
                    View Sample Format
                  </a>
                </div>
              </DialogHeader>

                  {!isPreviewMode ? (
                    <div className="py-4">
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors duration-200 ease-in-out"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.add('border-primary');
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove('border-primary');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove('border-primary');

                          const files = Array.from(e.dataTransfer.files);
                          const csvFile = files.find(file => file.name.endsWith('.csv'));

                          if (csvFile) {
                            // Create a synthetic event object
                            const syntheticEvent = {
                              target: {
                                files: [csvFile]
                              }
                            } as React.ChangeEvent<HTMLInputElement>;

                            handleFileImport(syntheticEvent);
                                                    } else {
                            toast({
                              title: "Invalid file format",
                              description: "Please upload only CSV files",
                              variant: "destructive"
                            });
                          }
                        }}
                      >
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
                              <TableHead>Sourced By</TableHead>
                              <TableHead>Client</TableHead>
                              <TableHead>POC</TableHead>
                              <TableHead>Skills</TableHead>
                              <TableHead>Candidate Name</TableHead>
                              <TableHead>Contact No</TableHead>
                              <TableHead>Email ID</TableHead>
                              <TableHead>Experience</TableHead>
                              <TableHead>Notice Period</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Current CTC</TableHead>
                              <TableHead>Expected CTC</TableHead>
                              <TableHead>Bill Rate</TableHead>
                              <TableHead>Pay Rate</TableHead>
                              <TableHead>Margin/Hour</TableHead>
                              <TableHead>Profit/Month</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Salary (Lacs)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {importData.slice(0, 5).map((item: Record<string, string>, rowIndex: number) => (
                              <TableRow key={`preview-${rowIndex}`}>
                                <TableCell>{item.sourced_by || item.sourcedBy || ""}</TableCell>
                                <TableCell>{item.client || ""}</TableCell>
                                <TableCell>{item.poc || ""}</TableCell>
                                <TableCell>{item.skills || ""}</TableCell>
                                <TableCell>{item.candidate_name || item.candidateName || ""}</TableCell>
                                <TableCell>{item.contact_no || item.contactNo || ""}</TableCell>
                                <TableCell>{item.email_id || item.emailId || ""}</TableCell>
                                <TableCell>{item.experience || ""}</TableCell>
                                <TableCell>{item.notice_period || item.noticePeriod || ""}</TableCell>
                                <TableCell>{item.location || ""}</TableCell>
                                <TableCell>{item.current_ctc || item.currentCtc || ""}</TableCell>
                                <TableCell>{item.expected_ctc || item.expectedCtc || ""}</TableCell>
                                <TableCell>{item.bill_rate || item.billRate || ""}</TableCell>
                                <TableCell>{item.pay_rate || item.payRate || item['pay/hr'] || ""}</TableCell>
                                <TableCell>{item.margin_per_hour || ""}</TableCell>
                                <TableCell>{item.profit_per_month || ""}</TableCell>
                                <TableCell>{item.status || ""}</TableCell>
                                <TableCell>{item.salary_in_lacs || item.salaryInLacs || ""}</TableCell>
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
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (uploadStatus === 'uploading') return; // Prevent closing during upload
                        setIsPreviewMode(false);
                        if (!isPreviewMode) {
                          setIsImportDialogOpen(false);
                          setUploadStatus('idle');
                          setUploadProgress(0);
                          setUploadMessage('');
                        }
                      }}
                      disabled={uploadStatus === 'uploading'}
                    >
                      {isPreviewMode ? "Back" : "Cancel"}
                    </Button>
                    {isPreviewMode && uploadStatus !== 'success' && (
                      <Button 
                        onClick={handleImportSubmit} 
                        disabled={uploadStatus === 'uploading' || importData.length === 0}
                      >
                        {uploadStatus === 'uploading' ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading {Math.round(uploadProgress)}%
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

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, email, client, skills, location, status..."
                    className="pl-8"
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
                <Button type="submit" variant="secondary">Search</Button>
              </form>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Filters</h3>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_statuses">All Statuses</SelectItem>
                    {allStatuses.length > 0 ? 
                      allStatuses
                        .sort()
                        .map((status: string) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))
                      : statusOptions.slice(1).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                    }
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
                    <SelectValue placeholder="All Clients" />
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

                <Select
                  value={sourcedByFilter}
                  onValueChange={(value) => {
                    setSourcedByFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Sourced By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_sourced_by">All Sourced By</SelectItem>
                    {allSourcedBy.map((sourcedBy: string, index: number) => (
                      <SelectItem key={`sourcedBy-${index}`} value={sourcedBy}>
                        {sourcedBy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={pocFilter}
                  onValueChange={(value) => {
                    setPocFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All POCs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_pocs">All POCs</SelectItem>
                    {allPocs.map((poc: string, index: number) => (
                      <SelectItem key={`poc-${index}`} value={poc}>
                        {poc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={marginFilter}
                  onValueChange={(value) => {
                    setMarginFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Margins" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_margins">All Margins</SelectItem>
                    {allMargins
                      .sort((a, b) => parseFloat(a) - parseFloat(b))
                      .map((margin: string, index: number) => (
                        <SelectItem key={`margin-${index}`} value={margin}>
                          ${margin}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filter Labels */}
            {(statusFilter !== "all_statuses" || clientFilter !== "all_clients" || sourcedByFilter !== "all_sourced_by" || pocFilter !== "all_pocs" || marginFilter !== "all_margins" || search) && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {statusFilter !== "all_statuses" && (
                    <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-md px-2 py-1">
                      <span className="text-xs font-medium text-blue-700">Status:</span>
                      <span className="text-xs text-blue-600">{statusFilter}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-blue-100"
                        onClick={() => setStatusFilter("all_statuses")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {clientFilter !== "all_clients" && (
                    <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-md px-2 py-1">
                      <span className="text-xs font-medium text-green-700">Client:</span>
                      <span className="text-xs text-green-600">{clientFilter}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-green-100"
                        onClick={() => setClientFilter("all_clients")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {sourcedByFilter !== "all_sourced_by" && (
                    <div className="flex items-center gap-1 bg-purple-50 border border-purple-200 rounded-md px-2 py-1">
                      <span className="text-xs font-medium text-purple-700">Sourced By:</span>
                      <span className="text-xs text-purple-600">{sourcedByFilter}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-purple-100"
                        onClick={() => setSourcedByFilter("all_sourced_by")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {pocFilter !== "all_pocs" && (
                    <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-md px-2 py-1">
                      <span className="text-xs font-medium text-orange-700">POC:</span>
                      <span className="text-xs text-orange-600">{pocFilter}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-orange-100"
                        onClick={() => setPocFilter("all_pocs")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {marginFilter !== "all_margins" && (
                    <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-md px-2 py-1">
                      <span className="text-xs font-medium text-yellow-700">Margin:</span>
                      <span className="text-xs text-yellow-600">${marginFilter}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-yellow-100"
                        onClick={() => setMarginFilter("all_margins")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {search && (
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                      <span className="text-xs font-medium text-gray-700">Search:</span>
                      <span className="text-xs text-gray-600">{search}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-gray-100"
                        onClick={() => setSearch("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusFilter("all_statuses");
                      setClientFilter("all_clients");
                      setSourcedByFilter("all_sourced_by");
                      setPocFilter("all_pocs");
                      setMarginFilter("all_margins");
                      setSearch("");
                      setPage(1);
                    }}
                    className="text-xs"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Sorting and Display Controls */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Sort & Display</h3>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={`${sortField}_${sortDirection}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split('_');
                    setSortField(field);
                    setSortDirection(direction as 'asc' | 'desc');
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidateName_asc">Name A-Z</SelectItem>
                    <SelectItem value="candidateName_desc">Name Z-A</SelectItem>
                    <SelectItem value="submissionDate_desc">Newest First</SelectItem>
                    <SelectItem value="submissionDate_asc">Oldest First</SelectItem>
                    <SelectItem value="client_asc">Client A-Z</SelectItem>
                    <SelectItem value="client_desc">Client Z-A</SelectItem>
                    <SelectItem value="status_asc">Status A-Z</SelectItem>
                    <SelectItem value="status_desc">Status Z-A</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={limit.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Page size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>

                {/* Column Visibility Control */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Columns ({visibleColumns.length})
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Customize Columns</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={resetToDefaultColumns}
                            className="text-xs"
                          >
                            Default
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={showAllColumns}
                            className="text-xs"
                          >
                            Show All
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                        {columnConfig.map((column) => (
                          <div key={column.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`column-${column.key}`}
                              checked={visibleColumns.includes(column.key)}
                              onCheckedChange={() => toggleColumn(column.key)}
                              disabled={column.required}
                            />
                            <Label 
                              htmlFor={`column-${column.key}`}
                              className={`text-sm cursor-pointer flex-1 ${
                                column.required ? 'text-muted-foreground' : ''
                              }`}
                            >
                              {column.label}
                              {column.required && (
                                <span className="text-xs text-muted-foreground ml-1">(required)</span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {visibleColumns.length} of {columnConfig.length} columns visible
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="px-4 py-4 border-b space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="text-sm text-muted-foreground">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, candidatesData?.meta?.total || 0)} of {candidatesData?.meta?.total || 0} candidates
                  {selectedCandidateIds.length > 0 && (
                    <span className="block sm:inline sm:ml-2 text-blue-600">
                      {selectedCandidateIds.length} selected
                    </span>
                  )}
                </div>
              </div>
              
              {selectedCandidateIds.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <AlertDialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={bulkDeleteMutation.isPending}
                        className="w-full sm:w-auto"
                      >
                        {bulkDeleteMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Delete Selected ({selectedCandidateIds.length})</span>
                            <span className="sm:hidden">Delete ({selectedCandidateIds.length})</span>
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {bulkDeleteIds.length} candidate record{bulkDeleteIds.length > 1 ? 's' : ''}.
                            This action cannot be undone and will remove all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setBulkDeleteConfirmOpen(false)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={executeBulkDelete}
                            className="bg-red-500 hover:bg-red-600"
                            disabled={bulkDeleteMutation.isPending}
                          >
                            {bulkDeleteMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              `Delete ${bulkDeleteIds.length} Candidate${bulkDeleteIds.length > 1 ? 's' : ''}`
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {!isSelectAllPages && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllPages}
                      className="w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">Select All {candidatesData?.meta?.total || 0} Candidates</span>
                      <span className="sm:hidden">Select All ({candidatesData?.meta?.total || 0})</span>
                    </Button>
                  )}

                  {isSelectAllPages && (
                    <div className="text-sm text-blue-600 font-medium text-center sm:text-left">
                      All {candidatesData?.meta?.total || 0} candidates selected
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={page <= 1}
                    className="flex-1 sm:flex-none"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 px-4">
                    <span className="text-sm font-medium">{page}</span>
                    <span className="text-sm text-muted-foreground">of {totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={page >= totalPages}
                    className="flex-1 sm:flex-none"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative overflow-x-auto">
                <Table className="min-w-[1500px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <input
                          type="checkbox"
                          checked={isSelectAllChecked}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </TableHead>
                      {renderTableHeader('id', 'ID', true, 'min-w-[50px]')}
                      {renderTableHeader('sourcedBy', 'Sourced By', true, 'min-w-[150px]')}
                      {renderTableHeader('client', 'Client', true, 'min-w-[150px]')}
                      {renderTableHeader('poc', 'POC', true, 'min-w-[150px]')}
                      {renderTableHeader('skills', 'Skills', true, 'min-w-[180px]')}
                      {renderTableHeader('candidateName', 'Candidate Name', true, 'sticky left-0 bg-background z-20 min-w-[200px]')}
                      {renderTableHeader('contactNo', 'Contact No', true, 'min-w-[150px]')}
                      {renderTableHeader('emailId', 'Email ID', true, 'min-w-[180px]')}
                      {renderTableHeader('experience', 'Experience', true, 'min-w-[120px]')}
                      {renderTableHeader('noticePeriod', 'Notice Period', true, 'min-w-[120px]')}
                      {renderTableHeader('location', 'Location', true, 'min-w-[120px]')}
                      {renderTableHeader('currentCtc', 'Current CTC', true, 'min-w-[120px]')}
                      {renderTableHeader('expectedCtc', 'Expected CTC', true, 'min-w-[120px]')}
                      {renderTableHeader('billRate', 'Bill Rate ($$)', true, 'min-w-[120px]')}
                      {renderTableHeader('payRate', 'Pay/hr', true, 'min-w-[120px]')}
                      {renderTableHeader('marginPerHour', 'Margin/hr', true, 'min-w-[120px]')}
                      {renderTableHeader('profitPerMonth', 'Profit/Month', true, 'min-w-[120px]')}
                      {renderTableHeader('status', 'Status', true, 'min-w-[180px]')}
                      {renderTableHeader('actions', 'Actions', false, 'sticky right-0 bg-background z-20 min-w-[100px] text-right')}
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {/* Inline add candidate row */}
                  {isAddingInline && (
                    <TableRow className="bg-muted/30">
                      <TableCell className="w-10">
                        {/* Empty checkbox cell for inline add row */}
                      </TableCell>
                      <TableCell></TableCell>
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
                      <TableCell colSpan={10} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <span className="text-sm text-muted-foreground mt-2 block">Loading candidates...</span>
                      </TableCell>
                    </TableRow>
                  ) : candidatesData?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-muted-foreground">No candidates found</p>
                          <Button 
                            variant="link" 
                            onClick={() => {
                              setStatusFilter("all_statuses");
                              setClientFilter("all_clients");
                                                                setSourcedByFilter("all_sourced_by");
                                setPocFilter("all_pocs");
                                setMarginFilter("all_margins");
                              setSearch("");
                            }}
                          >
                            Clear filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedCandidates?.map((candidate: SubmittedCandidate) => {
                      const { marginPerHour, profitPerMonth } = calculateMarginAndProfit(candidate.billRate, candidate.payRate);
                      
                      return (
                        <TableRow key={candidate.id}>
                          <TableCell className="w-10">
                            <input
                              type="checkbox"
                              checked={selectedCandidateIds.includes(parseInt(String(candidate.id), 10))}
                              onChange={(e) => {
                                const candidateId = parseInt(String(candidate.id), 10);
                                console.log("Checkbox changed for candidate:", candidateId, "checked:", e.target.checked, "original ID:", candidate.id);
                                if (Number.isInteger(candidateId) && candidateId > 0) {
                                  handleSelectCandidate(candidateId, e.target.checked);
                                } else {
                                  console.error("Invalid candidate ID:", candidate.id, "converted to:", candidateId);
                                }
                              }}
                            />
                          </TableCell>
                          {renderTableCell('id', <span className="font-mono text-sm">{candidate.id}</span>)}
                          {renderTableCell('sourcedBy', candidate.sourcedBy || '-')}
                          {renderTableCell('client', candidate.client || '-')}
                          {renderTableCell('poc', candidate.poc || '-')}
                          {renderTableCell('skills', 
                            <div className="max-w-[150px] truncate" title={candidate.skills}>
                              {candidate.skills}
                            </div>
                          )}
                          {renderTableCell('candidateName', 
                            <div className="font-medium">{candidate.candidateName}</div>, 
                            'sticky left-0 bg-background z-20'
                          )}
                          {renderTableCell('contactNo', candidate.contactNo || '-')}
                          {renderTableCell('emailId', candidate.emailId || '-')}
                          {renderTableCell('experience', candidate.experience || '-')}
                          {renderTableCell('noticePeriod', candidate.noticePeriod || '-')}
                          {renderTableCell('location', candidate.location || '-')}
                          {renderTableCell('currentCtc', candidate.currentCtc || '-')}
                          {renderTableCell('expectedCtc', candidate.expectedCtc || '-')}
                          {renderTableCell('billRate', `$${candidate.billRate || '-'}`)}
                          {renderTableCell('payRate', `$${candidate.payRate || '-'}`)}
                          {renderTableCell('marginPerHour', `$${marginPerHour || '-'}`)}
                          {renderTableCell('profitPerMonth', `$${profitPerMonth || '-'}`)}
                          {renderTableCell('status', <StatusBadge status={candidate.status} />)}
                          {renderTableCell('actions', 
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
                                      onClick={() => {
                                        console.log('=== DELETE BUTTON CLICKED ===');
                                        console.log('Candidate object:', candidate);
                                        console.log('Candidate ID:', candidate.id);
                                        console.log('Candidate ID type:', typeof candidate.id);
                                        console.log('Candidate name:', candidate.candidateName);
                                        deleteMutation.mutate(candidate.id);
                                      }}
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
                            </div>, 
                            'sticky right-0 bg-background z-20 text-right'
                          )}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
            <CardFooter className="px-4 py-4 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, candidatesData?.meta?.total || 0)} of {candidatesData?.meta?.total || 0} candidates
                  {selectedCandidateIds.length > 0 && (
                    <span className="block sm:inline sm:ml-2 text-blue-600">
                      {selectedCandidateIds.length} selected
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={page <= 1}
                    className="flex-1 sm:flex-none"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 px-4">
                    <span className="text-sm font-medium">{page}</span>
                    <span className="text-sm text-muted-foreground">of {totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={page >= totalPages}
                    className="flex-1 sm:flex-none"
                  >
                    Next
                  </Button>
                </div>
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
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Status Distribution</CardTitle>
                        <CardDescription>Breakdown of candidates by current status</CardDescription>
                      </div>
                      <Select value={statusSortBy} onValueChange={(value: any) => setStatusSortBy(value)}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="count_desc">Count (High to Low)</SelectItem>
                          <SelectItem value="count_asc">Count (Low to High)</SelectItem>
                          <SelectItem value="name_asc">Name (A to Z)</SelectItem>
                          <SelectItem value="name_desc">Name (Z to A)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto pr-2">
                      <div className="space-y-4">
                        {sortedStatusData.map(([status, count]) => (
                          <div key={`status-${status}`} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={status} />
                            </div>
                            <div className="text-sm font-medium">{count as number}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Top Clients</CardTitle>
                        <CardDescription>Clients with most candidate submissions</CardDescription>
                      </div>
                      <Select value={clientSortBy} onValueChange={(value: any) => setClientSortBy(value)}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="count_desc">Count (High to Low)</SelectItem>
                          <SelectItem value="count_asc">Count (Low to High)</SelectItem>
                          <SelectItem value="name_asc">Name (A to Z)</SelectItem>
                          <SelectItem value="name_desc">Name (Z to A)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto pr-2">
                      <div className="space-y-4">
                        {sortedClientData.map(([client, count]) => (
                          <div key={client} className="flex items-center justify-between">
                            <div className="font-medium truncate max-w-xs" title={client}>{client}</div>
                            <div className="text-sm text-muted-foreground flex-shrink-0">{count as number} candidates</div>
                          </div>
                        ))}
                        {sortedClientData.length === 0 && (
                          <div className="text-center py-4 text-sm text-muted-foreground">
                            No client data available
                          </div>
                        )}
                      </div>
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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
                      ```typescript
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />                      Saving...
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>
              Update the details of this candidate.
            </DialogDescription>
          </DialogHeader>
          {editDialogLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              <span className="text-sm text-muted-foreground mt-2 block">Loading candidate data...</span>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-6">

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="submissionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submission Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          value={field.value || (selectedCandidate?.submissionDate ? new Date(selectedCandidate.submissionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])}
                          onChange={(e) => {
                            const value = e.target.value || new Date().toISOString().split('T')[0];
                            field.onChange(value);
                          }}
                        />
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
                      <FormLabel>Sourced By</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Recruiter name"
                          {...field}
                          value={field.value || selectedCandidate?.sourcedBy || ''}
                        />
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
                      <FormLabel>POC *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="candidateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidate Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Email ID *</FormLabel>
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
                      <FormLabel>Location *</FormLabel>
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
                  render={({ field}) => (
                    <FormItem>
                      <FormLabel>Experience (years) *</FormLabel>
                      <FormControl><Input {...field} />
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
                      <FormLabel>Current CTC *</FormLabel>
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
                      <FormLabel>Expected CTC *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills *</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} value={field.value || selectedCandidate?.salaryInLacs || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

  <FormField
    control={form.control}
    name="status"
    render={({ field }) => {
      const [isCustom, setIsCustom] = useState(false);
      const [customValue, setCustomValue] = useState("");

      useEffect(() => {
        if (field.value && !["new", "submitted to client", "scheduled for interview", "rejected", "selected"].includes(field.value)) {
          setIsCustom(true);
          setCustomValue(field.value);
        }
      }, [field.value]);

      return (
        <FormItem>
          <FormLabel>Status *</FormLabel>
          {!isCustom ? (
            <Select
              onValueChange={(value) => {
                if (value === "custom") {
                  setIsCustom(true);
                } else {
                  field.onChange(value);
                }
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {allStatuses.length > 0 ? (
                  <>
                    {allStatuses
                      .sort()
                      .map((status: string) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    <SelectItem value="custom">+ Add Custom Status</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="submitted to client">Submitted to Client</SelectItem>
                    <SelectItem value="scheduled for interview">Scheduled for Interview</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="selected">Selected</SelectItem>
                    <SelectItem value="custom">+ Add Custom Status</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex gap-2">
              <Input
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  field.onChange(e.target.value);
                }}
                placeholder="Enter custom status"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setIsCustom(false);
                  field.onChange("new");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <FormMessage />
        </FormItem>
      );
    }}
  />
                <div className="lg:col-span-2">
                  <Card className="bg-muted/40">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Rate Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                value={field.value || selectedCandidate?.billRate || ''}
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
                                value={field.value || selectedCandidate?.payRate || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <Label>Calculated Values</Label>
                        <div className="mt-2 space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Margin/hr: </span> 
                            <span>${marginPerHour}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Profit/Month: </span> 
                            <span>${profitPerMonth}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>



                 {/* <FormField
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
                  /> */}
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
      )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default SubmittedCandidates;