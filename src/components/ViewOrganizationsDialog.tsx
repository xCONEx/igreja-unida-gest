
import { useState, useEffect } from 'react';
import { OrganizationService, Organization } from '@/integrations/supabase/services/organizationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Loader2, Search, Building2, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import EditOrganizationDialog from './EditOrganizationDialog';

interface ViewOrganizationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewOrganizationsDialog = ({ open, onOpenChange }: ViewOrganizationsDialogProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const data = await OrganizationService.getAllOrganizations();
      setOrganizations(data);
      setFilteredOrganizations(data);
    } catch (error: any) {
      console.error('Erro ao carregar organizações:', error);
      toast({
        title: "Erro ao carregar organizações",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadOrganizations();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrganizations(organizations);
    } else {
      const filtered = organizations.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    }
  }, [searchTerm, organizations]);

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization);
    setShowEditDialog(true);
  };

  const handleDelete = async (organizationId: number, organizationName: string) => {
    try {
      await OrganizationService.deleteOrganization(organizationId);
      toast({
        title: "Organização excluída",
        description: `${organizationName} foi excluída com sucesso.`,
      });
      loadOrganizations();
    } catch (error: any) {
      console.error('Erro ao excluir organização:', error);
      toast({
        title: "Erro ao excluir organização",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleOrganizationUpdated = () => {
    loadOrganizations();
    setShowEditDialog(false);
    setEditingOrganization(null);
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'bg-gray-100 text-gray-800';
      case 'Basic': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Todas as Organizações
            </DialogTitle>
            <DialogDescription>
              Visualize e gerencie todas as organizações do sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome da organização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={loadOrganizations}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Atualizar'
                )}
              </Button>
            </div>

            <div className="flex-1 overflow-auto border rounded-lg">
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Usuários</TableHead>
                      <TableHead>Criada em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrganizations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          {searchTerm ? 'Nenhuma organização encontrada com esse nome.' : 'Nenhuma organização encontrada.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrganizations.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell className="font-medium">{org.name}</TableCell>
                          <TableCell>
                            <Badge className={getPlanBadgeColor(org.subscription_plan)}>
                              {org.subscription_plan === 'Free' ? 'Gratuito' : 
                               org.subscription_plan === 'Basic' ? 'Básico' : 'Premium'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span>{org.max_users}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span>{formatDate(org.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(org)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir a organização "{org.name}"? 
                                      Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(org.id, org.name)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Total: {filteredOrganizations.length} organizações</span>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditOrganizationDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onOrganizationUpdated={handleOrganizationUpdated}
        organization={editingOrganization}
      />
    </>
  );
};

export default ViewOrganizationsDialog;
