import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Save, DollarSign, Users, Trash2, Calendar, Building2, User, FileText, Percent, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface CandidateBilling {
  id: number;
  candidateId: number;
  candidateName?: string;
  candidateEmail?: string;
  hourlyRate: number;
  workingHoursPerWeek: number;
  workingDaysPerWeek?: number;
  currency: string;
  employmentType?: 'subcontract' | 'fulltime';
  supervisorName?: string;
  clientCompanyId?: number;
  companySettingsId?: number;
  endUserId?: number;
  tdsRate?: number;
  benefits?: string[];
  isActive: boolean;
}

interface User {
  id: number;
  email: string;
  fullName: string;
}

interface ClientCompany {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
}

interface CompanySettings {
  id: number;
  companyName: string;
  defaultHourlyRate?: number;
  defaultCurrency?: string;
  defaultWorkingDays?: number;
  overtimeMultiplier?: number;
  sickLeavePolicy?: string;
  paidLeavePolicy?: string;
}

interface EndUser {
  id: number;
  name: string;
  clientCompanyId: number;
  description?: string;
  isActive: boolean;
}

export default function BillingConfig() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [billingData, setBillingData] = useState({
    hourlyRate: 0,
    workingHoursPerWeek: 40,
    workingDaysPerWeek: 5,
    currency: 'USD',
    employmentType: 'subcontract' as 'subcontract' | 'fulltime',
    supervisorName: '',
    clientCompanyId: undefined as number | undefined,
    endUserId: undefined as number | undefined,
    companySettingsId: undefined as number | undefined,
    tdsRate: 10,
    benefits: [] as string[]
  });
  
  // Track selected benefits for full-time employees
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  
  // Available leave types for full-time employees  
  const leaveTypes = [
    'Sick Leave',
    'Paid Leave', 
    'Unpaid Leave'
  ];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBilling, setEditingBilling] = useState<CandidateBilling | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // State for creating new end users
  const [isCreatingNewEndUser, setIsCreatingNewEndUser] = useState(false);
  const [newEndUserName, setNewEndUserName] = useState('');
  const [showCreateEndUserInput, setShowCreateEndUserInput] = useState(false);

  // Fetch hired candidates only
  const { data: hiredCandidates } = useQuery({
    queryKey: ['/api/admin/hired-candidates'],
  });

  // Fetch existing billing configurations
  const { data: billingConfigs, isLoading } = useQuery({
    queryKey: ['/api/admin/candidates-billing'],
    select: (data) => {
      console.log('Billing configs API response:', data);
      return data;
    }
  });

  // Fetch client companies for dropdown
  const { data: clientCompanies, isLoading: isLoadingClientCompanies } = useQuery({
    queryKey: ['/api/admin/client-companies'],
    select: (data) => {
      console.log('Client companies API response:', data);
      console.log('Client companies array:', data?.companies);
      console.log('Companies length:', data?.companies?.length);
      return data;
    }
  });

  // Fetch company settings for dropdown
  const { data: companySettings } = useQuery({
    queryKey: ['/api/admin/company-settings'],
  });

  // Fetch end users for the selected client company
  const { data: endUsers, isLoading: isLoadingEndUsers } = useQuery({
    queryKey: [`/api/admin/end-users/by-company/${billingData.clientCompanyId}`],
    enabled: !!billingData.clientCompanyId,
  });

  // Fetch end users from submitted candidates data when client company is selected
  const { data: candidateEndUsers, isLoading: isLoadingCandidateEndUsers } = useQuery({
    queryKey: [`/api/admin/end-users/from-candidates/${getSelectedClientCompanyName()}`],
    enabled: !!billingData.clientCompanyId && !!getSelectedClientCompanyName(),
  });

  // Helper function to get selected client company name
  function getSelectedClientCompanyName(): string {
    if (!billingData.clientCompanyId || !clientCompanies?.data?.companies) return '';
    const selectedCompany = clientCompanies.data.companies.find(c => c.id === billingData.clientCompanyId);
    return selectedCompany?.name || '';
  }

  // Helper function to get combined end users without duplicates
  function getCombinedEndUsers() {
    const existingEndUsers = endUsers?.data || [];
    const candidateEndUserNames = candidateEndUsers?.data || [];
    
    // Create a Set to track existing end user names (case-insensitive)
    const existingNames = new Set(existingEndUsers.map(user => user.name.toLowerCase()));
    
    // Filter candidate end users to exclude duplicates
    const uniqueCandidateEndUsers = candidateEndUserNames.filter(name => 
      !existingNames.has(name.toLowerCase())
    );
    
    return {
      existingEndUsers,
      uniqueCandidateEndUsers
    };
  }

  // Handle end user selection
  function handleEndUserSelection(value: string) {
    if (value === 'create-new') {
      setShowCreateEndUserInput(true);
      setBillingData(prev => ({ ...prev, endUserId: undefined }));
    } else if (value.startsWith('candidate-')) {
      // Handle selection from candidates - for now just clear the selection
      // In a full implementation, you might want to create the end user automatically
      setBillingData(prev => ({ ...prev, endUserId: undefined }));
    } else {
      setShowCreateEndUserInput(false);
      setBillingData(prev => ({ ...prev, endUserId: parseInt(value) }));
    }
  }

  // Handle creating new end user
  function handleCreateEndUser() {
    if (!newEndUserName.trim() || !billingData.clientCompanyId) return;
    
    createEndUserMutation.mutate({
      name: newEndUserName.trim(),
      clientCompanyId: billingData.clientCompanyId
    });
  }

  // Create billing configuration mutation
  const createBillingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/candidate-billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        console.error('API Error Response:', error);
        if (error.errors) {
          const validationErrors = error.errors.map((e: any) => `${e.path?.join('.')}: ${e.message}`).join('\n');
          throw new Error(`Validation errors:\n${validationErrors}`);
        }
        throw new Error(error.message || 'Failed to create billing configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Billing configuration created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/candidates-billing'] });
      setIsDialogOpen(false);
      resetBillingForm();
      setSelectedCandidate(null);
    },
    onError: (error: Error) => {
      console.error('Create billing configuration error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Update billing configuration mutation
  const updateBillingMutation = useMutation({
    mutationFn: async ({ candidateId, ...data }: any) => {
      const response = await fetch(`/api/candidate-billing/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update billing configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Billing configuration updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/candidates-billing'] });
      setIsEditDialogOpen(false);
      setEditingBilling(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Delete billing configuration mutation
  const deleteBillingMutation = useMutation({
    mutationFn: async (candidateId: number) => {
      const response = await fetch(`/api/candidate-billing/${candidateId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete billing configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Billing configuration deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/candidates-billing'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Create new end user mutation
  const createEndUserMutation = useMutation({
    mutationFn: async (data: { name: string; clientCompanyId: number }) => {
      const response = await fetch('/api/admin/end-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create end user');
      }
      return response.json();
    },
    onSuccess: (newEndUser) => {
      toast({ title: "Success", description: "End user created successfully" });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/end-users/by-company/${billingData.clientCompanyId}`] });
      setBillingData(prev => ({ ...prev, endUserId: newEndUser.data.id }));
      setShowCreateEndUserInput(false);
      setNewEndUserName('');
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Reset billing form to defaults
  const resetBillingForm = () => {
    setBillingData({
      hourlyRate: 0,
      workingHoursPerWeek: 40,
      workingDaysPerWeek: 5,
      currency: 'USD',
      employmentType: 'subcontract',
      supervisorName: '',
      clientCompanyId: clientCompanies?.data?.companies?.[0]?.id || undefined,
      endUserId: undefined,
      companySettingsId: companySettings?.data?.[0]?.id || undefined,
      tdsRate: 10,
      benefits: []
    });
    setSelectedBenefits([]);
  };

  // Effect to populate form when editing
  useEffect(() => {
    if (editingBilling) {
      console.log('Populating edit form with billing data:', editingBilling);
      console.log('Client companies available:', clientCompanies);
      
      // Filter benefits to only include valid leave types
      const validBenefits = (editingBilling.benefits || []).filter(benefit => 
        leaveTypes.includes(benefit)
      );
      
      setBillingData({
        hourlyRate: editingBilling.hourlyRate,
        workingHoursPerWeek: editingBilling.workingHoursPerWeek,
        workingDaysPerWeek: editingBilling.workingDaysPerWeek || 5,
        currency: editingBilling.currency,
        employmentType: editingBilling.employmentType || 'subcontract',
        supervisorName: editingBilling.supervisorName || '',
        clientCompanyId: editingBilling.clientCompanyId,
        endUserId: editingBilling.endUserId,
        companySettingsId: editingBilling.companySettingsId,
        tdsRate: editingBilling.tdsRate || 10,
        benefits: validBenefits
      });
      setSelectedBenefits(validBenefits);
    }
  }, [editingBilling, clientCompanies]);

  // Effect to set default values for client company and company settings when data is loaded
  useEffect(() => {
    if (clientCompanies?.data?.companies && companySettings?.data && !editingBilling) {
      setBillingData(prev => ({
        ...prev,
        clientCompanyId: prev.clientCompanyId || clientCompanies.data.companies[0]?.id,
        companySettingsId: prev.companySettingsId || companySettings.data[0]?.id
      }));
    }
  }, [clientCompanies, companySettings, editingBilling]);

  // Update benefits in billing data when selected benefits change
  useEffect(() => {
    setBillingData(prev => ({ ...prev, benefits: selectedBenefits }));
  }, [selectedBenefits]);

  // Clear endUserId when client company changes
  useEffect(() => {
    setBillingData(prev => ({ ...prev, endUserId: undefined }));
  }, [billingData.clientCompanyId]);

  const handleSubmit = () => {
    if (!selectedCandidate || billingData.hourlyRate <= 0) {
      toast({ title: "Error", description: "Please select a candidate and enter a valid hourly rate", variant: "destructive" });
      return;
    }

    // Ensure we only send valid leave types for full-time employees
    const finalBenefits = billingData.employmentType === 'fulltime' 
      ? selectedBenefits.filter(benefit => leaveTypes.includes(benefit))
      : [];

    const payload = {
      candidateId: selectedCandidate,
      createdBy: user?.id || 5,
      hourlyRate: billingData.hourlyRate.toString(),
      workingHoursPerWeek: billingData.workingHoursPerWeek,
      workingDaysPerWeek: billingData.workingDaysPerWeek,
      currency: billingData.currency || 'USD',
      employmentType: billingData.employmentType || 'subcontract',
      supervisorName: billingData.supervisorName || '',
      clientCompanyId: billingData.clientCompanyId || undefined,
      endUserId: billingData.endUserId || undefined,
      companySettingsId: billingData.companySettingsId || undefined,
      tdsRate: billingData.tdsRate?.toString() || '10',
      benefits: finalBenefits
    };
    
    console.log('Submitting billing configuration:', payload);
    createBillingMutation.mutate(payload);
  };

  const handleUpdate = () => {
    if (!editingBilling || billingData.hourlyRate <= 0) {
      toast({ title: "Error", description: "Please enter a valid hourly rate", variant: "destructive" });
      return;
    }

    // Ensure we only send valid leave types for full-time employees
    const finalBenefits = billingData.employmentType === 'fulltime' 
      ? selectedBenefits.filter(benefit => leaveTypes.includes(benefit))
      : [];

    console.log('handleUpdate - finalBenefits:', finalBenefits);
    console.log('handleUpdate - selectedBenefits:', selectedBenefits);

    updateBillingMutation.mutate({
      candidateId: editingBilling.candidateId,
      hourlyRate: billingData.hourlyRate.toString(),
      workingHoursPerWeek: billingData.workingHoursPerWeek,
      workingDaysPerWeek: billingData.workingDaysPerWeek,
      currency: billingData.currency,
      employmentType: billingData.employmentType,
      supervisorName: billingData.supervisorName || null,
      clientCompanyId: billingData.clientCompanyId || null,
      endUserId: billingData.endUserId || null,
      companySettingsId: billingData.companySettingsId || null,
      tdsRate: billingData.tdsRate,
      benefits: finalBenefits,
      isActive: editingBilling.isActive
    });
  };

  const handleToggleActive = (billing: CandidateBilling) => {
    updateBillingMutation.mutate({
      candidateId: billing.candidateId,
      isActive: !billing.isActive
    });
  };

  const getAvailableCandidates = () => {
    if (!hiredCandidates?.data || !billingConfigs?.data) return [];
    
    const configuredCandidateIds = billingConfigs.data.map((config: CandidateBilling) => config.candidateId);
    return hiredCandidates.data.filter((user: User) => !configuredCandidateIds.includes(user.id));
  };

  const handleEdit = (billing: CandidateBilling) => {
    setEditingBilling(billing);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (candidateId: number) => {
    deleteBillingMutation.mutate(candidateId);
  };

  // Helper function to get client company information
  const getClientCompanyInfo = (clientCompanyId: number | null) => {
    if (!clientCompanyId || !clientCompanies?.data?.companies) {
      return null;
    }
    // Convert clientCompanyId to number to handle both string and number types
    const companyId = typeof clientCompanyId === 'string' ? parseInt(clientCompanyId) : clientCompanyId;
    const company = clientCompanies.data.companies.find((company: any) => company.id === companyId);
    return company;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Billing Configuration</h2>
          <p className="text-muted-foreground">
            Manage employment types, rates, and working hours for hired candidates
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Enhanced Config
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Enhanced Billing Configuration</DialogTitle>
              <DialogDescription>
                Set up comprehensive billing information with employment type, TDS, and benefits
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <Label htmlFor="candidate-select">Select Candidate</Label>
                <Select 
                  value={selectedCandidate?.toString() || ""} 
                  onValueChange={(value) => setSelectedCandidate(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableCandidates().map((user: User) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.fullName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employment Type Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Employment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employment-type">Employment Type</Label>
                      <Select 
                        value={billingData.employmentType} 
                        onValueChange={(value: 'subcontract' | 'fulltime') => setBillingData(prev => ({ ...prev, employmentType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subcontract">Subcontract</SelectItem>
                          <SelectItem value="fulltime">Full-time Employee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="supervisor-name">Supervisor Name</Label>
                      <Input
                        id="supervisor-name"
                        value={billingData.supervisorName}
                        onChange={(e) => setBillingData(prev => ({ ...prev, supervisorName: e.target.value }))}
                        placeholder="Enter supervisor name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rate & Hours Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Rate & Working Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourly-rate">Hourly Rate</Label>
                      <Input
                        id="hourly-rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={billingData.hourlyRate}
                        onChange={(e) => setBillingData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                        placeholder="50.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={billingData.currency} 
                        onValueChange={(value) => setBillingData(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="INR">INR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="working-hours">Working Hours per Week</Label>
                      <Input
                        id="working-hours"
                        type="number"
                        min="1"
                        max="80"
                        value={billingData.workingHoursPerWeek}
                        onChange={(e) => setBillingData(prev => ({ ...prev, workingHoursPerWeek: parseInt(e.target.value) || 40 }))}
                        placeholder="40"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="working-days">Working Days per Week</Label>
                      <Select 
                        value={billingData.workingDaysPerWeek.toString()} 
                        onValueChange={(value) => setBillingData(prev => ({ ...prev, workingDaysPerWeek: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Days (Mon-Fri)</SelectItem>
                          <SelectItem value="6">6 Days (Mon-Sat)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Company Selection */}
              <Card className="bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Client Company
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="client-company">Client Company</Label>
                    <Select 
                      value={billingData.clientCompanyId?.toString() || ''} 
                      onValueChange={(value) => setBillingData(prev => ({ ...prev, clientCompanyId: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client company" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingClientCompanies ? (
                          <div className="p-2 text-sm text-muted-foreground">Loading companies...</div>
                        ) : clientCompanies?.data?.companies?.length > 0 ? (
                          clientCompanies.data.companies.map((company: any) => (
                            <SelectItem key={company.id} value={company.id.toString()}>
                              {company.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">No companies available</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* End User Selection */}
                  {billingData.clientCompanyId && (
                    <div className="mt-4">
                      <Label htmlFor="end-user">End User</Label>
                      <Select 
                        value={billingData.endUserId?.toString() || ''} 
                        onValueChange={handleEndUserSelection}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select end user" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingEndUsers || isLoadingCandidateEndUsers ? (
                            <div className="p-2 text-sm text-muted-foreground">Loading end users...</div>
                          ) : (
                            <>
                              {(() => {
                                const { existingEndUsers, uniqueCandidateEndUsers } = getCombinedEndUsers();
                                return (
                                  <>
                                    {existingEndUsers.map((endUser: EndUser) => (
                                      <SelectItem key={endUser.id} value={endUser.id.toString()}>
                                        {endUser.name}
                                      </SelectItem>
                                    ))}
                                    
                                    {/* Show unique candidate end users (no duplicates) */}
                                    {uniqueCandidateEndUsers.map((endUserName: string, index: number) => (
                                      <SelectItem key={`candidate-${index}`} value={`candidate-${endUserName}`}>
                                        {endUserName} (from candidates)
                                      </SelectItem>
                                    ))}
                                    
                                    {/* Always show Create End User option */}
                                    <SelectItem value="create-new" className="text-blue-600 font-medium">
                                      + Create New End User
                                    </SelectItem>
                                    
                                    {/* Show message if no end users found */}
                                    {(existingEndUsers.length === 0 && uniqueCandidateEndUsers.length === 0) && (
                                      <div className="p-2 text-sm text-muted-foreground">
                                        No end users found for "{getSelectedClientCompanyName()}"
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      
                      {/* Input field for creating new end user */}
                      {showCreateEndUserInput && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder="Enter new end user name"
                            value={newEndUserName}
                            onChange={(e) => setNewEndUserName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleCreateEndUser();
                              }
                            }}
                          />
                          <Button 
                            size="sm" 
                            onClick={handleCreateEndUser}
                            disabled={!newEndUserName.trim() || createEndUserMutation.isPending}
                          >
                            {createEndUserMutation.isPending ? '...' : '✓'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setShowCreateEndUserInput(false);
                              setNewEndUserName('');
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        End user assignment based on client company selection
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Hidden field for company settings - auto-selected */}
              <div style={{ display: 'none' }}>
                <input 
                  type="hidden" 
                  value={billingData.companySettingsId || ''} 
                  onChange={() => {}} 
                />
              </div>

              {/* TDS Configuration (for Subcontract) */}
              {billingData.employmentType === 'subcontract' && (
                <Card className="bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Percent className="h-5 w-5 text-orange-600" />
                      TDS Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="tds-rate">TDS Rate (%)</Label>
                      <Input
                        id="tds-rate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={billingData.tdsRate}
                        onChange={(e) => setBillingData(prev => ({ ...prev, tdsRate: parseFloat(e.target.value) || 0 }))}
                        placeholder="10.0"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Tax Deducted at Source percentage for subcontract payments
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Leave Types Configuration (for Full-time) */}
              {billingData.employmentType === 'fulltime' && (
                <Card className="bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="h-5 w-5 text-blue-600" />
                      Leave Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {leaveTypes.map((leaveType) => (
                        <div key={leaveType} className="flex items-center space-x-2">
                          <Checkbox
                            id={leaveType}
                            checked={selectedBenefits.includes(leaveType)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBenefits(prev => [...prev, leaveType]);
                              } else {
                                setSelectedBenefits(prev => prev.filter(b => b !== leaveType));
                              }
                            }}
                          />
                          <Label
                            htmlFor={leaveType}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {leaveType}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Button 
                onClick={handleSubmit} 
                disabled={createBillingMutation.isPending}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Enhanced Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Billing Configuration</DialogTitle>
            <DialogDescription>
              Update billing information for {editingBilling?.candidateName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-hourly-rate">Hourly Rate</Label>
                <Input
                  id="edit-hourly-rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={billingData.hourlyRate}
                  onChange={(e) => setBillingData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                  placeholder="50.00"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-currency">Currency</Label>
                <Select 
                  value={billingData.currency} 
                  onValueChange={(value) => setBillingData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-working-hours">Working Hours per Week</Label>
                <Input
                  id="edit-working-hours"
                  type="number"
                  min="1"
                  max="80"
                  value={billingData.workingHoursPerWeek}
                  onChange={(e) => setBillingData(prev => ({ ...prev, workingHoursPerWeek: parseInt(e.target.value) || 40 }))}
                  placeholder="40"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-working-days">Working Days per Week</Label>
                <Select 
                  value={billingData.workingDaysPerWeek.toString()} 
                  onValueChange={(value) => setBillingData(prev => ({ ...prev, workingDaysPerWeek: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Days (Mon-Fri)</SelectItem>
                    <SelectItem value="6">6 Days (Mon-Sat)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Employment Type Selection */}
            <div>
              <Label htmlFor="edit-employment-type">Employment Type</Label>
              <Select 
                value={billingData.employmentType || 'subcontract'} 
                onValueChange={(value: 'subcontract' | 'fulltime') => setBillingData(prev => ({ ...prev, employmentType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subcontract">Subcontract</SelectItem>
                  <SelectItem value="fulltime">Full-time Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Supervisor Name */}
            <div>
              <Label htmlFor="edit-supervisor-name">Supervisor Name</Label>
              <Input
                id="edit-supervisor-name"
                type="text"
                value={billingData.supervisorName || ''}
                onChange={(e) => setBillingData(prev => ({ ...prev, supervisorName: e.target.value }))}
                placeholder="Enter supervisor name"
              />
            </div>

            {/* Client Company Selection */}
            <div>
              <Label htmlFor="edit-client-company">Client Company</Label>
              <Select 
                value={billingData.clientCompanyId?.toString() || ''} 
                onValueChange={(value) => setBillingData(prev => ({ ...prev, clientCompanyId: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client company" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingClientCompanies ? (
                    <div className="p-2 text-sm text-muted-foreground">Loading companies...</div>
                  ) : clientCompanies?.data?.companies?.length > 0 ? (
                    clientCompanies.data.companies.map((company: any) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">No companies available</div>
                  )}
                </SelectContent>
              </Select>
              {isLoadingClientCompanies && (
                <p className="text-sm text-muted-foreground mt-1">Loading companies...</p>
              )}
            </div>

            {/* End User Selection */}
            {billingData.clientCompanyId && (
              <div>
                <Label htmlFor="edit-end-user">End User</Label>
                <Select 
                  value={billingData.endUserId?.toString() || ''} 
                  onValueChange={handleEndUserSelection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select end user" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingEndUsers || isLoadingCandidateEndUsers ? (
                      <div className="p-2 text-sm text-muted-foreground">Loading end users...</div>
                    ) : (
                      <>
                        {/* Show existing end users from the end_users table */}
                        {(() => {
                          const { existingEndUsers, uniqueCandidateEndUsers } = getCombinedEndUsers();
                          return (
                            <>
                              {existingEndUsers.map((endUser: EndUser) => (
                                <SelectItem key={endUser.id} value={endUser.id.toString()}>
                                  {endUser.name}
                                </SelectItem>
                              ))}
                              
                              {/* Show unique candidate end users (no duplicates) */}
                              {uniqueCandidateEndUsers.map((endUserName: string, index: number) => (
                                <SelectItem key={`candidate-${index}`} value={`candidate-${endUserName}`}>
                                  {endUserName} (from candidates)
                                </SelectItem>
                              ))}
                              
                              {/* Always show Create End User option */}
                              <SelectItem value="create-new" className="text-blue-600 font-medium">
                                + Create New End User
                              </SelectItem>
                              
                              {/* Show message if no end users found */}
                              {(existingEndUsers.length === 0 && uniqueCandidateEndUsers.length === 0) && (
                                <div className="p-2 text-sm text-muted-foreground">
                                  No end users found for "{getSelectedClientCompanyName()}"
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </>
                    )}
                  </SelectContent>
                </Select>
                
                {/* Input field for creating new end user */}
                {showCreateEndUserInput && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Enter new end user name"
                      value={newEndUserName}
                      onChange={(e) => setNewEndUserName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateEndUser();
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      onClick={handleCreateEndUser}
                      disabled={!newEndUserName.trim() || createEndUserMutation.isPending}
                    >
                      {createEndUserMutation.isPending ? '...' : '✓'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setShowCreateEndUserInput(false);
                        setNewEndUserName('');
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground mt-1">
                  End user assignment based on client company selection
                </p>
              </div>
            )}

            {/* TDS Configuration for Subcontract */}
            {billingData.employmentType === 'subcontract' && (
              <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-orange-600" />
                  <h3 className="font-medium text-orange-800 dark:text-orange-200">TDS Configuration</h3>
                </div>
                
                <div>
                  <Label htmlFor="edit-tds-rate">TDS Rate (%)</Label>
                  <Input
                    id="edit-tds-rate"
                    type="number"
                    min="0"
                    max="30"
                    step="0.1"
                    value={billingData.tdsRate || 10}
                    onChange={(e) => setBillingData(prev => ({ ...prev, tdsRate: parseFloat(e.target.value) || 10 }))}
                    placeholder="10"
                  />
                  <p className="text-xs text-orange-600 mt-1">Tax Deducted at Source percentage for subcontract payments</p>
                </div>
              </div>
            )}

            {/* Leave Types Configuration for Full-time */}
            {billingData.employmentType === 'fulltime' && (
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-blue-800 dark:text-blue-200">Leave Types</h3>
                </div>
                
                <div>
                  <Label>Select Leave Types</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {leaveTypes.map((leaveType) => (
                      <div key={leaveType} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-leave-${leaveType.replace(/\s+/g, '-').toLowerCase()}`}
                          checked={selectedBenefits.includes(leaveType)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBenefits(prev => [...prev, leaveType]);
                            } else {
                              setSelectedBenefits(prev => prev.filter(b => b !== leaveType));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`edit-leave-${leaveType.replace(/\s+/g, '-').toLowerCase()}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {leaveType}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Select applicable leave types for this full-time employee</p>
                </div>
              </div>
            )}

            {/* Hidden field for company settings - auto-selected */}
            <div style={{ display: 'none' }}>
              <input 
                type="hidden" 
                value={billingData.companySettingsId || ''} 
                onChange={() => {}} 
              />
            </div>
            
            <Button 
              onClick={handleUpdate} 
              disabled={updateBillingMutation.isPending}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Update Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Loading billing configurations...</div>
        ) : billingConfigs?.data?.length ? (
          billingConfigs.data.map((billing: CandidateBilling) => (
            <Card key={billing.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{billing.candidateName || 'Unknown Candidate'}</h3>
                      <Badge variant={billing.isActive ? "default" : "secondary"}>
                        {billing.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant={billing.employmentType === 'fulltime' ? "outline" : "secondary"}>
                        {billing.employmentType === 'fulltime' ? 'Full-time' : 'Subcontract'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{billing.candidateEmail}</p>
                    
                    {/* Employment Information */}
                    {billing.supervisorName && (
                      <div className="flex items-center gap-1 text-sm">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>Supervisor: {billing.supervisorName}</span>
                      </div>
                    )}
                    
                    {/* Client Company Information */}
                    {(() => {
                      const clientCompany = getClientCompanyInfo(billing.clientCompanyId);
                      if (clientCompany) {
                        return (
                          <div className="flex items-center gap-2 text-sm">
                            {clientCompany.logoUrl ? (
                              <img 
                                src={clientCompany.logoUrl} 
                                alt={`${clientCompany.name} logo`}
                                className="w-6 h-6 rounded object-cover border"
                              />
                            ) : (
                              <Building2 className="w-4 h-4 text-green-600" />
                            )}
                            <span>Client: {clientCompany.name}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    
                    {/* Basic Rate & Hours Info */}
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{billing.currency} {billing.hourlyRate}/hour</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{billing.workingHoursPerWeek}h/week</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{billing.workingDaysPerWeek || 5} days/week</span>
                      </div>
                    </div>

                    {/* TDS Information for Subcontract */}
                    {billing.employmentType === 'subcontract' && billing.tdsRate && (
                      <div className="flex items-center gap-1 text-sm text-orange-600">
                        <Percent className="w-4 h-4" />
                        <span>TDS: {billing.tdsRate}%</span>
                      </div>
                    )}

                    {/* Leave Types Information for Full-time */}
                    {billing.employmentType === 'fulltime' && billing.benefits && billing.benefits.length > 0 && (
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <Gift className="w-4 h-4" />
                        <span>Leave Types: {billing.benefits.slice(0, 3).join(', ')}{billing.benefits.length > 3 ? '...' : ''}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(billing)}
                      disabled={updateBillingMutation.isPending}
                    >
                      {billing.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(billing)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Billing Configuration</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the billing configuration for {billing.candidateName}? 
                            This will also delete all related timesheet data (weekly, bi-weekly, monthly) and invoices.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(billing.candidateId)}
                            disabled={deleteBillingMutation.isPending}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Enhanced Billing Configurations</h3>
              <p className="text-muted-foreground">
                Get started by adding enhanced billing information for your hired candidates.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}