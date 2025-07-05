
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/integrations/supabase/services/userService';
import { OrganizationService } from '@/integrations/supabase/services/organizationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, TrendingUp, Clock, Plus, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CreateOrganizationDialog from '@/components/CreateOrganizationDialog';
import ManageUsersDialog from '@/components/ManageUsersDialog';
import ViewOrganizationsDialog from '@/components/ViewOrganizationsDialog';

const AdminMasterDashboard = () => {
  const { user, isAdminMaster, logout } = useAuth();
  const [stats, setStats] = useState({
    users: { total: 0, pending: 0, admins: 0, recent: 0 },
    organizations: { total: 0, active: 0, free: 0, premium: 0, recent: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [showViewOrganizations, setShowViewOrganizations] = useState(false);

  const loadStats = async () => {
    if (!isAdminMaster) {
      console.log('Usuário não é admin master, pulando carregamento de estatísticas')
      setLoading(false);
      return;
    }

    try {
      console.log('Carregando estatísticas do admin master...');
      
      // Carregar estatísticas dos usuários (protegido por RLS)
      let userStats = { total: 0, pending: 0, admins: 0, recent: 0 };
      try {
        userStats = await UserService.getUserStats();
        console.log('Estatísticas de usuários carregadas:', userStats);
      } catch (error) {
        console.error('Erro ao carregar estatísticas de usuários:', error);
        // Para admin masters, este erro pode significar que não há dados ainda
      }

      // Carregar estatísticas das organizações
      let orgStats = { total: 0, active: 0, free: 0, premium: 0, recent: 0 };
      try {
        orgStats = await OrganizationService.getOrganizationStats();
        console.log('Estatísticas de organizações carregadas:', orgStats);
      } catch (error) {
        console.error('Erro ao carregar estatísticas de organizações:', error);
      }

      setStats({
        users: userStats,
        organizations: orgStats
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Aviso",
        description: "Algumas estatísticas podem não estar disponíveis ainda.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [isAdminMaster]);

  const handleCreateOrganization = () => {
    loadStats(); // Recarregar estatísticas após criar
    setShowCreateOrg(false);
  };

  if (!isAdminMaster) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar o painel de administração master.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={logout} variant="outline">
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Admin Master</h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo, {user?.name}! Gerencie todas as organizações do sistema.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={() => setShowCreateOrg(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nova Organização
            </Button>
            <Button variant="outline" onClick={logout} className="w-full sm:w-auto">
              <Settings className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            🛡️ Admin Master - Acesso Total
          </Badge>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.users.recent} novos este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Organizações</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.organizations.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.organizations.active} ativas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários Pendentes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users.pending}</div>
                  <p className="text-xs text-muted-foreground">
                    Aguardando aprovação
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Planos Premium</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.organizations.premium}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.organizations.free} gratuitos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Seções Detalhadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Sistema</CardTitle>
                  <CardDescription>
                    Visão geral da plataforma Church Manager
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Administradores</span>
                    <Badge variant="secondary">{stats.users.admins}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Organizações Recentes</span>
                    <Badge variant="secondary">{stats.organizations.recent}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Planos Básicos</span>
                    <Badge variant="secondary">
                      {stats.organizations.total - stats.organizations.free - stats.organizations.premium}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>
                    Gerenciar organizações e usuários
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowCreateOrg(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Nova Organização
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowManageUsers(true)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Gerenciar Usuários
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowViewOrganizations(true)}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Ver Todas Organizações
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <CreateOrganizationDialog
        open={showCreateOrg}
        onOpenChange={setShowCreateOrg}
        onOrganizationCreated={handleCreateOrganization}
      />

      <ManageUsersDialog
        open={showManageUsers}
        onOpenChange={setShowManageUsers}
      />

      <ViewOrganizationsDialog
        open={showViewOrganizations}
        onOpenChange={setShowViewOrganizations}
      />
    </div>
  );
};

export default AdminMasterDashboard;
