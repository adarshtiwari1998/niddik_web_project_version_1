import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Save, DollarSign, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CandidateBilling {
  id: number;
  candidateId: number;
  candidateName?: string;
  candidateEmail?: string;
  hourlyRate: number;
  workingHoursPerWeek: number;
  currency: string;
  isActive: boolean;
}

interface User {
  id: number;
  email: string;
  fullName: string;
}

export default function BillingConfig() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [billingData, setBillingData] = useState({
    hourlyRate: 0,
    workingHoursPerWeek: 40,
    currency: 'USD'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all users (potential candidates)
  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  // Fetch existing billing configurations
  const { data: billingConfigs, isLoading } = useQuery({
    queryKey: ['/api/admin/candidates-billing'],
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
      setBillingData({ hourlyRate: 0, workingHoursPerWeek: 40, currency: 'USD' });
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
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSubmit = () => {
    if (!selectedCandidate || billingData.hourlyRate <= 0) {
      toast({ title: "Error", description: "Please select a candidate and enter a valid hourly rate", variant: "destructive" });
      return;
    }

    createBillingMutation.mutate({
      candidateId: selectedCandidate,
      ...billingData
    });
  };

  const handleToggleActive = (billing: CandidateBilling) => {
    updateBillingMutation.mutate({
      candidateId: billing.candidateId,
      isActive: !billing.isActive
    });
  };

  const getAvailableCandidates = () => {
    if (!users?.data || !billingConfigs?.data) return [];
    
    const configuredCandidateIds = billingConfigs.data.map((config: CandidateBilling) => config.candidateId);
    return users.data.filter((user: User) => !configuredCandidateIds.includes(user.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Billing Configuration</h2>
          <p className="text-muted-foreground">
            Manage hourly rates and working hours for hired candidates
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Billing Configuration</DialogTitle>
              <DialogDescription>
                Set up billing information for a new candidate
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
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
              
              <Button 
                onClick={handleSubmit} 
                disabled={createBillingMutation.isPending}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Loading billing configurations...</div>
        ) : billingConfigs?.data?.length ? (
          billingConfigs.data.map((billing: CandidateBilling) => (
            <Card key={billing.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{billing.candidateName || 'Unknown Candidate'}</h3>
                      <Badge variant={billing.isActive ? "default" : "secondary"}>
                        {billing.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{billing.candidateEmail}</p>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{billing.currency} {billing.hourlyRate}/hour</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{billing.workingHoursPerWeek}h/week</span>
                      </div>
                    </div>
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
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Billing Configurations</h3>
              <p className="text-muted-foreground">
                Get started by adding billing information for your hired candidates.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}