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
    companySettingsId: undefined as number | undefined,
    tdsRate: 10,
    benefits: [] as string[]
  });
  
  // Track selected benefits for full-time employees
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  
  // Available benefit options
  const benefitOptions = [
    'Health Insurance',
    'Dental Insurance',
    'Life Insurance',
    'Paid Time Off',
    'Sick Leave',
    'Retirement Plan',
    'Flexible Working Hours',
    'Remote Work',
    'Professional Development',
    'Training Budget',
    'Stock Options',
    'Performance Bonus'
  ];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBilling, setEditingBilling] = useState<CandidateBilling | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch hired candidates only
  const { data: hiredCandidates } = useQuery({
    queryKey: ['/api/admin/hired-candidates'],
  });

  // Fetch existing billing configurations
  const { data: billingConfigs, isLoading } = useQuery({
    queryKey: ['/api/admin/candidates-billing'],
  });

  // Fetch client companies for dropdown
  const { data: clientCompanies } = useQuery({
    queryKey: ['/api/admin/client-companies'],
  });

  // Fetch company settings for dropdown
  const { data: companySettings } = useQuery({
    queryKey: ['/api/admin/company-settings'],
  });

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

  // Reset billing form to defaults
  const resetBillingForm = () => {
    setBillingData({
      hourlyRate: 0,
      workingHoursPerWeek: 40,
      workingDaysPerWeek: 5,
      currency: 'USD',
      employmentType: 'subcontract',
      supervisorName: '',
      clientCompanyId: clientCompanies?.data?.[0]?.id || undefined,
      companySettingsId: companySettings?.data?.[0]?.id || undefined,
      tdsRate: 10,
      benefits: []
    });
    setSelectedBenefits([]);
  };

  // Effect to populate form when editing
  useEffect(() => {
    if (editingBilling) {
      setBillingData({
        hourlyRate: editingBilling.hourlyRate,
        workingHoursPerWeek: editingBilling.workingHoursPerWeek,
        workingDaysPerWeek: editingBilling.workingDaysPerWeek || 5,
        currency: editingBilling.currency,
        employmentType: editingBilling.employmentType || 'subcontract',
        supervisorName: editingBilling.supervisorName || '',
        clientCompanyId: editingBilling.clientCompanyId,
        companySettingsId: editingBilling.companySettingsId,
        tdsRate: editingBilling.tdsRate || 10,
        benefits: editingBilling.benefits || []
      });
      setSelectedBenefits(editingBilling.benefits || []);
    }
  }, [editingBilling]);

  // Effect to set default values for client company and company settings when data is loaded
  useEffect(() => {
    if (clientCompanies?.data && companySettings?.data && !editingBilling) {
      setBillingData(prev => ({
        ...prev,
        clientCompanyId: prev.clientCompanyId || clientCompanies.data[0]?.id,
        companySettingsId: prev.companySettingsId || companySettings.data[0]?.id
      }));
    }
  }, [clientCompanies, companySettings, editingBilling]);

  // Update benefits in billing data when selected benefits change
  useEffect(() => {
    setBillingData(prev => ({ ...prev, benefits: selectedBenefits }));
  }, [selectedBenefits]);

  const handleSubmit = () => {
    if (!selectedCandidate || billingData.hourlyRate <= 0) {
      toast({ title: "Error", description: "Please select a candidate and enter a valid hourly rate", variant: "destructive" });
      return;
    }

    createBillingMutation.mutate({
      candidateId: selectedCandidate,
      createdBy: user?.id || 5,
      hourlyRate: billingData.hourlyRate.toString(),
      workingHoursPerWeek: billingData.workingHoursPerWeek,
      workingDaysPerWeek: billingData.workingDaysPerWeek,
      currency: billingData.currency,
      employmentType: billingData.employmentType,
      supervisorName: billingData.supervisorName || null,
      clientCompanyId: billingData.clientCompanyId || null,
      companySettingsId: billingData.companySettingsId || null,
      tdsRate: billingData.tdsRate,
      benefits: billingData.benefits
    });
  };

  const handleUpdate = () => {
    if (!editingBilling || billingData.hourlyRate <= 0) {
      toast({ title: "Error", description: "Please enter a valid hourly rate", variant: "destructive" });
      return;
    }

    updateBillingMutation.mutate({
      candidateId: editingBilling.candidateId,
      hourlyRate: billingData.hourlyRate.toString(),
      workingHoursPerWeek: billingData.workingHoursPerWeek,
      workingDaysPerWeek: billingData.workingDaysPerWeek,
      currency: billingData.currency,
      employmentType: billingData.employmentType,
      supervisorName: billingData.supervisorName || null,
      clientCompanyId: billingData.clientCompanyId || null,
      companySettingsId: billingData.companySettingsId || null,
      tdsRate: billingData.tdsRate,
      benefits: billingData.benefits,
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
                        {clientCompanies?.data?.companies?.map((company: any) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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

              {/* Benefits Configuration (for Full-time) */}
              {billingData.employmentType === 'fulltime' && (
                <Card className="bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="h-5 w-5 text-blue-600" />
                      Employee Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {benefitOptions.map((benefit) => (
                        <div key={benefit} className="flex items-center space-x-2">
                          <Checkbox
                            id={benefit}
                            checked={selectedBenefits.includes(benefit)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBenefits(prev => [...prev, benefit]);
                              } else {
                                setSelectedBenefits(prev => prev.filter(b => b !== benefit));
                              }
                            }}
                          />
                          <Label
                            htmlFor={benefit}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {benefit}
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
                  {clientCompanies?.data?.companies?.map((company: any) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

                    {/* Benefits Information for Full-time */}
                    {billing.employmentType === 'fulltime' && billing.benefits && billing.benefits.length > 0 && (
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <Gift className="w-4 h-4" />
                        <span>Benefits: {billing.benefits.slice(0, 3).join(', ')}{billing.benefits.length > 3 ? '...' : ''}</span>
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