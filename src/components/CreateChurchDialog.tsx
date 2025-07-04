
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CreateChurchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChurchCreated: () => void;
}

const CreateChurchDialog = ({ open, onOpenChange, onChurchCreated }: CreateChurchDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    admin_email: '',
    admin_name: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.admin_email || !formData.admin_name) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome da igreja, email e nome do admin são obrigatórios.",
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

      // Criar a igreja
      const { data: church, error: churchError } = await supabase
        .from('churches')
        .insert({
          name: formData.name,
          address: formData.address || null,
          phone: formData.phone || null,
          email: formData.email || null,
          admin_id: user.id,
        })
        .select()
        .single();

      if (churchError) {
        throw churchError;
      }

      // Criar convite para o admin
      const { error: inviteError } = await supabase
        .from('invites')
        .insert({
          church_id: church.id,
          email: formData.admin_email,
          name: formData.admin_name,
          role: 'admin',
          invited_by: user.id,
        });

      if (inviteError) {
        console.warn('Erro ao criar convite:', inviteError);
      }

      // Atualizar role do usuário atual se necessário
      const { data: currentRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!currentRole || currentRole.role === 'member') {
        await supabase
          .from('user_roles')
          .upsert({
            user_id: user.id,
            church_id: church.id,
            role: 'admin',
          });
      }

      toast({
        title: "Igreja criada com sucesso!",
        description: `${church.name} foi criada e o convite foi enviado para ${formData.admin_email}.`,
      });

      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        admin_email: '',
        admin_name: '',
      });

      onChurchCreated();
      
    } catch (error: any) {
      console.error('Erro ao criar igreja:', error);
      toast({
        title: "Erro ao criar igreja",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Igreja</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova igreja e do administrador.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="church-name">Nome da Igreja *</Label>
            <Input
              id="church-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nome da igreja"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="church-address">Endereço</Label>
            <Textarea
              id="church-address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Endereço completo"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="church-phone">Telefone</Label>
              <Input
                id="church-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="church-email">Email</Label>
              <Input
                id="church-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contato@igreja.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">Dados do Administrador</h4>
            
            <div className="space-y-2">
              <Label htmlFor="admin-name">Nome do Admin *</Label>
              <Input
                id="admin-name"
                value={formData.admin_name}
                onChange={(e) => handleInputChange('admin_name', e.target.value)}
                placeholder="Nome completo"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email">Email do Admin *</Label>
              <Input
                id="admin-email"
                type="email"
                value={formData.admin_email}
                onChange={(e) => handleInputChange('admin_email', e.target.value)}
                placeholder="admin@email.com"
                disabled={loading}
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
                'Criar Igreja'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChurchDialog;
