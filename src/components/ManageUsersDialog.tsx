
import { useState, useEffect } from 'react';
import { UserService, ApplicationUser } from '@/integrations/supabase/services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { Loader2, Search, UserCheck, UserX, Shield, Mail, Calendar, Building2 } from 'lucide-react';

interface ManageUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ManageUsersDialog = ({ open, onOpenChange }: ManageUsersDialogProps) => {
  const [users, setUsers] = useState<ApplicationUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await UserService.getAllUsers();
      setUsers(allUsers);
      console.log('Usuários carregados:', allUsers.length);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const handleApproveUser = async (userId: number) => {
    setUpdatingUserId(userId);
    try {
      await UserService.approveUser(userId);
      toast({
        title: "Usuário aprovado",
        description: "O usuário foi aprovado com sucesso.",
      });
      loadUsers(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      toast({
        title: "Erro ao aprovar usuário",
        description: "Não foi possível aprovar o usuário.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleAdmin = async (userId: number, currentValue: boolean) => {
    setUpdatingUserId(userId);
    try {
      await UserService.updateUser(userId, { 
        is_admin: !currentValue,
        updated_at: new Date().toISOString()
      });
      toast({
        title: currentValue ? "Admin removido" : "Admin adicionado",
        description: `Permissões de administrador ${currentValue ? 'removidas' : 'concedidas'} com sucesso.`,
      });
      loadUsers(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao alterar permissões:', error);
      toast({
        title: "Erro ao alterar permissões",
        description: "Não foi possível alterar as permissões do usuário.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      await UserService.deleteUser(userId);
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      });
      loadUsers(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gerenciar Usuários
          </DialogTitle>
          <DialogDescription>
            Visualize e gerencie todos os usuários do sistema
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar usuários por nome ou email..."
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
              <span className="ml-2 text-gray-600">Carregando usuários...</span>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {/* Mobile View */}
              <div className="block md:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        {(user as any).organizations && (
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {(user as any).organizations.name}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {user.pending && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            Pendente
                          </Badge>
                        )}
                        {user.is_admin && (
                          <Badge variant="secondary" className="text-purple-600 bg-purple-100">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Criado em {formatDate(user.created_at)}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {user.pending && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveUser(user.id)}
                          disabled={updatingUserId === user.id}
                          className="flex-1 min-w-0"
                        >
                          {updatingUserId === user.id ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <UserCheck className="w-3 h-3 mr-1" />
                          )}
                          Aprovar
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                        disabled={updatingUserId === user.id}
                        className="flex-1 min-w-0"
                      >
                        {user.is_admin ? 'Remover Admin' : 'Tornar Admin'}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={updatingUserId === user.id}
                        className="flex-1 min-w-0"
                      >
                        <UserX className="w-3 h-3 mr-1" />
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
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Organização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {(user as any).organizations?.name || 'Sem organização'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.pending && (
                              <Badge variant="outline" className="text-orange-600 border-orange-200">
                                Pendente
                              </Badge>
                            )}
                            {user.is_admin && (
                              <Badge variant="secondary" className="text-purple-600 bg-purple-100">
                                Admin
                              </Badge>
                            )}
                            {!user.pending && !user.is_admin && (
                              <Badge variant="secondary">Ativo</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.pending && (
                              <Button
                                size="sm"
                                onClick={() => handleApproveUser(user.id)}
                                disabled={updatingUserId === user.id}
                              >
                                {updatingUserId === user.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <UserCheck className="w-3 h-3" />
                                )}
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                              disabled={updatingUserId === user.id}
                            >
                              <Shield className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={updatingUserId === user.id}
                            >
                              <UserX className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm ? 'Nenhum usuário encontrado para a busca.' : 'Nenhum usuário encontrado.'}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageUsersDialog;
