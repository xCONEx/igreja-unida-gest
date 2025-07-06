
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Building2 } from 'lucide-react';
import { Organization } from '@/integrations/supabase/services/organizationService';

interface EditOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrganizationUpdated: () => void;
  organization: Organization | null;
}

const EditOrganizationDialog = ({ open, onOpenChange, onOrganizationUpdated, organization }: EditOrganizationDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    subscription_plan: 'Free' as 'Free' | 'Basic' | 'Premium',
    max_users: 50,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        subscription_plan: organization.subscription_plan as 'Free' | 'Basic' | 'Premium',
        max_users: organization.max_users,
      });
    }
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Campo obrigatório",
        description: "Nome da organização é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!organization) {
      toast({
        title: "Erro",
        description: "Organização não encontrada.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: formData.name,
          subscription_plan: formData.subscription_plan,
          max_users: formData.max_users,
        })
        .eq('id', organization.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Organização atualizada!",
        description: `${formData.name} foi atualizada com sucesso.`,
      });

      onOrganizationUpdated();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Erro ao atualizar organização:', error);
      toast({
        title: "Erro ao atualizar organização",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getMaxUsersForPlan = (plan: string) => {
    switch (plan) {
      case 'Free': return 50;
      case 'Basic': return 150;
      case 'Premium': return 500;
      default: return 50;
    }
  };

  const handlePlanChange = (plan: string) => {
    const maxUsers = getMaxUsersForPlan(plan);
    setFormData(prev => ({
      ...prev,
      subscription_plan: plan as 'Free' | 'Basic' | 'Premium',
      max_users: maxUsers
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Editar Organização
          </DialogTitle>
          <DialogDescription>
            Atualize os dados da organização selecionada.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Nome da Organização *</Label>
            <Input
              id="org-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nome da organização"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscription-plan">Plano de Assinatura</Label>
            <Select 
              value={formData.subscription_plan} 
              onValueChange={handlePlanChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Gratuito (50 usuários)</SelectItem>
                <SelectItem value="Basic">Básico (150 usuários)</SelectItem>
                <SelectItem value="Premium">Premium (500 usuários)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-users">Máximo de Usuários</Label>
            <Input
              id="max-users"
              type="number"
              value={formData.max_users}
              onChange={(e) => handleInputChange('max_users', parseInt(e.target.value) || 50)}
              disabled={loading}
              min="1"
              max="1000"
            />
            <p className="text-xs text-gray-600">
              Este valor é ajustado automaticamente baseado no plano selecionado
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrganizationDialog;
