
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Church, Users, User as UserIcon, Settings, Bell, Calendar } from 'lucide-react';
import CreateChurchDialog from '@/components/CreateChurchDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserRole {
  role: 'master' | 'admin' | 'leader' | 'collaborator' | 'member';
  church_id?: string;
}

interface Church {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userChurch, setUserChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateChurch, setShowCreateChurch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserRole(session.user.id);
          } else {
            setUserRole(null);
            setUserChurch(null);
          }
          setLoading(false);
        }
      );

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        await fetchUserRole(session.user.id);
      }
      setLoading(false);

      return () => subscription.unsubscribe();
    };

    initializeAuth();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role, church_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      if (roles && roles.length > 0) {
        setUserRole(roles[0]);
        
        if (roles[0].church_id) {
          await fetchChurchData(roles[0].church_id);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  };

  const fetchChurchData = async (churchId: string) => {
    try {
      const { data: church, error } = await supabase
        .from('churches')
        .select('*')
        .eq('id', churchId)
        .single();

      if (error) {
        console.error('Error fetching church data:', error);
        return;
      }

      setUserChurch(church);
    } catch (error) {
      console.error('Error in fetchChurchData:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap = {
      master: 'Master Admin',
      admin: 'Admin Igreja',
      leader: 'Líder',
      collaborator: 'Colaborador',
      member: 'Membro'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'master':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'leader':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Church className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Church className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Igreja Unida</h1>
                <p className="text-sm text-gray-500">Sistema de Gestão</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                {userRole && (
                  <Badge variant={getRoleBadgeVariant(userRole.role)}>
                    {getRoleDisplay(userRole.role)}
                  </Badge>
                )}
              </div>
              <Button onClick={handleLogout} variant="outline">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!userRole || (!userChurch && userRole.role !== 'master') ? (
          // Lobby - usuário sem igreja
          <div className="text-center py-12">
            <Church className="h-24 w-24 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bem-vindo ao Sistema
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Você está no lobby do sistema. Para acessar uma igreja, você precisa ser convidado por um administrador ou criar uma nova igreja.
            </p>
            
            {userRole?.role === 'master' && (
              <Button onClick={() => setShowCreateChurch(true)} size="lg">
                <Church className="mr-2 h-5 w-5" />
                Criar Nova Igreja
              </Button>
            )}
            
            <Card className="max-w-2xl mx-auto mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notícias do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Sistema Atualizado</h3>
                  <p className="text-blue-800 text-sm">
                    Nova versão com melhorias na gestão de escalas e repertórios.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900">Bem-vindo!</h3>
                  <p className="text-green-800 text-sm">
                    Aguarde o convite de uma igreja para começar a usar o sistema.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Dashboard principal - usuário com igreja
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              {userChurch && (
                <p className="text-gray-600 mt-2">
                  {userChurch.name} • {getRoleDisplay(userRole.role)}
                </p>
              )}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="members">Membros</TabsTrigger>
                <TabsTrigger value="departments">Departamentos</TabsTrigger>
                <TabsTrigger value="scales">Escalas</TabsTrigger>
                <TabsTrigger value="songs">Músicas</TabsTrigger>
                {(userRole.role === 'master' || userRole.role === 'admin') && (
                  <TabsTrigger value="settings">Configurações</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Membros</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">
                        Total de membros
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">
                        Departamentos ativos
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Escalas</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">
                        Escalas este mês
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Músicas</CardTitle>
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground">
                        No repertório
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="members">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestão de Membros</CardTitle>
                    <CardDescription>
                      Gerencie os membros da igreja
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-500 py-8">
                      Funcionalidade em desenvolvimento
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="departments">
                <Card>
                  <CardHeader>
                    <CardTitle>Departamentos</CardTitle>
                    <CardDescription>
                      Gerencie os departamentos e subdepartamentos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-500 py-8">
                      Funcionalidade em desenvolvimento
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scales">
                <Card>
                  <CardHeader>
                    <CardTitle>Escalas</CardTitle>
                    <CardDescription>
                      Gerencie as escalas de louvor e outros departamentos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-500 py-8">
                      Funcionalidade em desenvolvimento
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="songs">
                <Card>
                  <CardHeader>
                    <CardTitle>Músicas e Repertórios</CardTitle>
                    <CardDescription>
                      Gerencie as músicas e repertórios da igreja
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-500 py-8">
                      Funcionalidade em desenvolvimento
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {(userRole.role === 'master' || userRole.role === 'admin') && (
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações</CardTitle>
                      <CardDescription>
                        Configurações da igreja e do sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userRole.role === 'master' && (
                          <Button onClick={() => setShowCreateChurch(true)}>
                            <Church className="mr-2 h-4 w-4" />
                            Criar Nova Igreja
                          </Button>
                        )}
                        <p className="text-center text-gray-500 py-4">
                          Mais configurações em desenvolvimento
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </div>

      {/* Create Church Dialog */}
      <CreateChurchDialog 
        open={showCreateChurch} 
        onOpenChange={setShowCreateChurch}
        onChurchCreated={() => {
          setShowCreateChurch(false);
          window.location.reload(); // Refresh to load new church data
        }}
      />
    </div>
  );
};

export default Dashboard;
