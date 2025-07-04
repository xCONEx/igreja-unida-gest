
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
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Campo obrigatório",
        description: "Nome da igreja é obrigatório.",
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

      // Atualizar role do usuário atual para admin da igreja
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          church_id: church.id,
          role: 'admin',
        });

      if (roleError) {
        console.warn('Erro ao atualizar role:', roleError);
      }

      toast({
        title: "Igreja criada com sucesso!",
        description: `${church.name} foi criada e você é o administrador.`,
      });

      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
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
            Preencha os dados da nova igreja. Você será o administrador.
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
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
