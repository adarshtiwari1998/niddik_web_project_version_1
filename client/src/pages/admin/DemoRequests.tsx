import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CalendarIcon, CheckCircle, ChevronLeft, ChevronRight, ClockIcon, Trash2, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Form schema for updating demo request
const formSchema = z.object({
  status: z.string().min(1, "Please select a status"),
  adminNotes: z.string().optional(),
  scheduledDate: z.date().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case "scheduled":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function DemoRequests() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all_statuses");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch demo requests with pagination and filtering
  const { data: responseData, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/demo-requests', page, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      
      if (statusFilter !== "all_statuses") {
        params.append("status", statusFilter);
      }
      
      const response = await apiRequest("GET", `/api/admin/demo-requests?${params.toString()}`);
      return await response.json();
    },
  });
  
  // Extract data and meta from response
  const data = responseData?.data || [];
  const meta = responseData?.meta || { total: 0, pages: 1, page: 1, limit: 10 };

  // Update demo request mutation
  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormValues }) => {
      const response = await apiRequest("PATCH", `/api/admin/demo-requests/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Demo request has been updated",
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/demo-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update request. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Delete demo request mutation
  const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/demo-requests/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Demo request has been deleted",
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/demo-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      adminNotes: "",
      scheduledDate: null,
    },
  });

  // Open dialog and initialize form values
  const handleEditRequest = (request: any) => {
    setSelectedRequest(request);
    
    // Set default form values based on the selected request
    form.reset({
      status: request.status,
      adminNotes: request.adminNotes || "",
      scheduledDate: request.scheduledDate ? new Date(request.scheduledDate) : null,
    });
    
    setIsDialogOpen(true);
  };

  // Handle form submit
  const onSubmit = (values: FormValues) => {
    if (!selectedRequest) return;
    
    updateMutate({
      id: selectedRequest.id,
      data: values,
    });
  };
  
  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (deleteRequestId) {
      deleteMutate(deleteRequestId);
    }
  };
  
  // Open delete confirmation dialog
  const handleDeleteClick = (id: number) => {
    setDeleteRequestId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout title="Demo Requests" description="Manage demonstration requests from potential clients">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Demo Requests</CardTitle>
          <CardDescription>
            Manage and track customer demo requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-sm font-medium">
                Filter by Status:
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1); // Reset to first page when filter changes
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_statuses">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => refetch()}>Refresh</Button>
          </div>

          {isLoading ? (
            <p className="text-center py-4">Loading demo requests...</p>
          ) : data && data.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Requested On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled For</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((request: any) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="font-medium">{request.companyName || "N/A"}</div>
                        </TableCell>
                        <TableCell>
                          <div>{request.fullName || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.workEmail}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.phoneNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.createdAt && format(new Date(request.createdAt), "PPP")}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          {request.scheduledDate 
                            ? format(new Date(request.scheduledDate), "PPP 'at' p") 
                            : "Not scheduled"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditRequest(request)}
                            >
                              Manage
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteClick(request.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {meta.pages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    </PaginationItem>
                    
                    {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <Button
                          variant={page === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(prev => Math.min(prev + 1, meta.pages))}
                        disabled={page === meta.pages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <p className="text-center py-4">No demo requests found.</p>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Demo Request</DialogTitle>
            <DialogDescription>
              Update the status and details of this demo request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p>{selectedRequest.companyName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact</p>
                  <p>{selectedRequest.fullName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedRequest.workEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{selectedRequest.phoneNumber}</p>
                </div>
              </div>

              {selectedRequest.message && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground">Message</p>
                  <p className="p-3 bg-muted rounded-md text-sm mt-1">{selectedRequest.message}</p>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Scheduled Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP 'at' p")
                                ) : (
                                  <span>Pick a date and time</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={(date) => {
                                if (date) {
                                  // Set time to noon by default
                                  const datetime = new Date(date);
                                  datetime.setHours(12, 0, 0, 0);
                                  field.onChange(datetime);
                                } else {
                                  field.onChange(null);
                                }
                              }}
                              initialFocus
                            />
                            {field.value && (
                              <div className="p-3 border-t border-border">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => field.onChange(null)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Clear
                                </Button>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Required when status is "Scheduled"
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adminNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add notes about this request"
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Internal notes (not visible to requestor)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdatePending}>
                      {isUpdatePending ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the demo request. The user will be able to submit a new request after deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeletePending}
            >
              {isDeletePending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}