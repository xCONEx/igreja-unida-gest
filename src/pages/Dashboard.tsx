import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Church, 
  LogOut, 
  Mail, 
  Users, 
  Calendar, 
  Music, 
  Building,
  Plus
} from 'lucide-react';
import { CreateChurchDialog } from '@/components/create-church-dialog';

interface Church {
  id: string;
  name: string;
}

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userChurch, setUserChurch] = useState<Church | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          await fetchChurch(user.id);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        toast({
          title: "Erro",
          description: "Falha ao buscar informações do usuário.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const fetchChurch = async (userId: string) => {
    try {
      const { data: churchData, error: churchError } = await supabase
        .from('user_churches')
        .select('church_id, role')
        .eq('user_id', userId)
        .single();

      if (churchError) {
        console.error("Erro ao buscar igreja do usuário:", churchError);
        return;
      }

      if (churchData) {
        setUserRole(churchData.role);
        const { data: church, error: getChurchError } = await supabase
          .from('churches')
          .select('*')
          .eq('id', churchData.church_id)
          .single();

        if (getChurchError) {
          console.error("Erro ao buscar detalhes da igreja:", getChurchError);
          return;
        }

        setUserChurch(church);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da igreja:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  const handleChurchCreated = (church: Church) => {
    setUserChurch(church);
  };

  const renderLobbyView = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center gap-3">
              <Church className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Igreja Unida</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-sm text-gray-600 text-center sm:text-left">
                Olá, <span className="font-semibold text-gray-900">{user?.user_metadata?.name || user?.email}</span>
              </span>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Sistema
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Você ainda não está vinculado a nenhuma igreja. Para acessar o sistema completo, 
            você precisa receber um convite de uma igreja ou criar uma nova igreja.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <Card className="p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 sm:mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Aguardar Convite
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Aguarde receber um convite por email de uma igreja já cadastrada no sistema.
              </p>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 sm:mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Criar Nova Igreja
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Crie uma nova igreja e torne-se o administrador principal.
              </p>
            </div>
            <CreateChurchDialog onChurchCreated={handleChurchCreated} />
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6 text-center bg-blue-50 border-blue-200">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Gestão de Membros</h4>
            <p className="text-sm text-gray-600">
              Organize e gerencie todos os membros da sua igreja
            </p>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center bg-green-50 border-green-200">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Escalas e Eventos</h4>
            <p className="text-sm text-gray-600">
              Organize escalas de louvor e eventos da igreja
            </p>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center bg-purple-50 border-purple-200">
            <Music className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Repertório Musical</h4>
            <p className="text-sm text-gray-600">
              Gerencie músicas e repertórios do ministério
            </p>
          </Card>
        </div>
      </main>
    </div>
  );

  const renderChurchDashboard = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center gap-3">
              <Church className="h-8 w-8 text-blue-600" />
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{userChurch?.name}</h1>
                <p className="text-sm text-gray-600">
                  {userRole === 'admin' ? 'Administrador' : 
                   userRole === 'leader' ? 'Líder' : 
                   userRole === 'collaborator' ? 'Colaborador' : 'Membro'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-sm text-gray-600 text-center sm:text-left">
                Olá, <span className="font-semibold text-gray-900">{user?.user_metadata?.name || user?.email}</span>
              </span>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Gerencie as atividades da sua igreja de forma eficiente
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Membros</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Eventos</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full">
                <Music className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Músicas</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-full">
                <Building className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Departamentos</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card className="p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <Plus className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Adicionar Membro</div>
                  <div className="text-sm text-gray-500">Cadastrar novo membro da igreja</div>
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <Calendar className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Criar Evento</div>
                  <div className="text-sm text-gray-500">Organizar novo evento ou culto</div>
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <Music className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Gerenciar Músicas</div>
                  <div className="text-sm text-gray-500">Adicionar músicas ao repertório</div>
                </div>
              </Button>
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Calendar className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">Nenhuma atividade recente</p>
                <p className="text-sm text-gray-400">As atividades aparecerão aqui</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        Carregando...
      </div>
    );
  }

  return userChurch ? renderChurchDashboard() : renderLobbyView();
};

export default Dashboard;
