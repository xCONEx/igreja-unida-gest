
import { useState } from 'react';
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
import { Loader2, Mail } from 'lucide-react';

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrganizationCreated: () => void;
}

const CreateOrganizationDialog = ({ open, onOpenChange, onOrganizationCreated }: CreateOrganizationDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    adminEmail: '',
    adminName: '',
    subscription_plan: 'Free' as 'Free' | 'Basic' | 'Premium',
    max_users: 15,
    max_storage_gb: 0.5,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.adminEmail) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome da organização e email do administrador são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.adminEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Criar a organização primeiro (com owner_id temporário)
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          owner_id: 1, // Temporário, será atualizado depois
          subscription_plan: formData.subscription_plan,
          max_users: formData.max_users,
          max_storage_gb: formData.max_storage_gb,
        })
        .select()
        .single();

      if (orgError) {
        throw orgError;
      }

      // Criar o usuário admin na tabela application_users
      const { data: appUser, error: userError } = await supabase
        .from('application_users')
        .insert({
          email: formData.adminEmail,
          name: formData.adminName || formData.adminEmail,
          organization_id: organization.id,
          is_admin: true,
          can_add_people: true,
          can_organize_events: true,
          can_manage_media: true,
          pending: false,
          profile_url: null,
        })
        .select()
        .single();

      if (userError) {
        throw userError;
      }

      // Atualizar a organização com o owner_id correto
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ owner_id: appUser.id })
        .eq('id', organization.id);

      if (updateError) {
        console.warn('Erro ao atualizar owner:', updateError);
      }

      toast({
        title: "Organização criada com sucesso!",
        description: `${organization.name} foi criada. O administrador (${formData.adminEmail}) pode fazer login no sistema.`,
      });

      setFormData({
        name: '',
        adminEmail: '',
        adminName: '',
        subscription_plan: 'Free',
        max_users: 15,
        max_storage_gb: 0.5,
      });

      onOrganizationCreated();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Erro ao criar organização:', error);
      toast({
        title: "Erro ao criar organização",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Organização</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova organização e do administrador responsável.
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

          <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Mail className="w-4 h-4" />
              <h3 className="font-medium">Dados do Administrador</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email do Administrador *</Label>
              <Input
                id="admin-email"
                type="email"
                value={formData.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                placeholder="admin@exemplo.com"
                disabled={loading}
              />
              <p className="text-xs text-gray-600">
                Esta pessoa será o administrador principal da organização
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-name">Nome do Administrador</Label>
              <Input
                id="admin-name"
                value={formData.adminName}
                onChange={(e) => handleInputChange('adminName', e.target.value)}
                placeholder="Nome completo (opcional)"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscription-plan">Plano de Assinatura</Label>
            <Select 
              value={formData.subscription_plan} 
              onValueChange={(value) => handleInputChange('subscription_plan', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Gratuito</SelectItem>
                <SelectItem value="Basic">Básico</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-users">Máximo de Usuários</Label>
              <Input
                id="max-users"
                type="number"
                value={formData.max_users}
                onChange={(e) => handleInputChange('max_users', parseInt(e.target.value) || 15)}
                placeholder="15"
                disabled={loading}
                min="1"
                max="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-storage">Armazenamento (GB)</Label>
              <Input
                id="max-storage"
                type="number"
                step="0.1"
                value={formData.max_storage_gb}
                onChange={(e) => handleInputChange('max_storage_gb', parseFloat(e.target.value) || 0.5)}
                placeholder="0.5"
                disabled={loading}
                min="0.1"
                max="100"
              />
            </div>
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
                  Criando...
                </>
              ) : (
                'Criar Organização'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationDialog;
