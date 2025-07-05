
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { Loader2, Search, Building2, Users, HardDrive, Calendar, Crown, Edit, Trash2 } from 'lucide-react';

interface ViewOrganizationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewOrganizationsDialog = ({ open, onOpenChange }: ViewOrganizationsDialogProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrgId, setUpdatingOrgId] = useState<number | null>(null);

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const allOrgs = await OrganizationService.getAllOrganizations();
      setOrganizations(allOrgs);
      console.log('Organizações carregadas:', allOrgs.length);
    } catch (error) {
      console.error('Erro ao carregar organizações:', error);
      toast({
        title: "Erro ao carregar organizações",
        description: "Não foi possível carregar a lista de organizações.",
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

  const handleDeleteOrganization = async (orgId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta organização? Esta ação não pode ser desfeita e excluirá todos os dados relacionados.')) {
      return;
    }

    setUpdatingOrgId(orgId);
    try {
      await OrganizationService.deleteOrganization(orgId);
      toast({
        title: "Organização excluída",
        description: "A organização foi excluída com sucesso.",
      });
      loadOrganizations(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao excluir organização:', error);
      toast({
        title: "Erro ao excluir organização",
        description: "Não foi possível excluir a organização.",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrgId(null);
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free':
        return 'bg-gray-100 text-gray-800';
      case 'Basic':
        return 'bg-blue-100 text-blue-800';
      case 'Premium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'Free':
        return 'Gratuito';
      case 'Basic':
        return 'Básico';
      case 'Premium':
        return 'Premium';
      default:
        return plan;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Ver Todas Organizações
          </DialogTitle>
          <DialogDescription>
            Visualize e gerencie todas as organizações do sistema
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar organizações por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando organizações...</span>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {/* Mobile View */}
              <div className="block md:hidden space-y-4">
                {filteredOrganizations.map((org) => (
                  <div key={org.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium text-lg">{org.name}</div>
                        <Badge className={getPlanColor(org.subscription_plan)}>
                          {getPlanLabel(org.subscription_plan)}
                        </Badge>
                      </div>
                      <Crown className="w-5 h-5 text-yellow-600" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>Máx. {org.max_users} usuários</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-gray-400" />
                        <span>{org.max_storage_gb}GB</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Criada em {formatDate(org.created_at)}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={updatingOrgId === org.id}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteOrganization(org.id)}
                        disabled={updatingOrgId === org.id}
                        className="flex-1"
                      >
                        {updatingOrgId === org.id ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        ) : (
                          <Trash2 className="w-3 h-3 mr-1" />
                        )}
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Usuários</TableHead>
                      <TableHead>Armazenamento</TableHead>
                      <TableHead>Criada em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrganizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-600" />
                            <span className="font-medium">{org.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPlanColor(org.subscription_plan)}>
                            {getPlanLabel(org.subscription_plan)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>Máx. {org.max_users}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <HardDrive className="w-4 h-4 text-gray-400" />
                            <span>{org.max_storage_gb}GB</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(org.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={updatingOrgId === org.id}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteOrganization(org.id)}
                              disabled={updatingOrgId === org.id}
                            >
                              {updatingOrgId === org.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredOrganizations.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm ? 'Nenhuma organização encontrada para a busca.' : 'Nenhuma organização encontrada.'}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrganizationsDialog;
