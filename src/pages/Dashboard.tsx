
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Users, 
  Calendar, 
  Music, 
  Plus,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalSongs: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const fetchStats = async () => {
      // Aqui você faria as queries reais para buscar estatísticas
      // Por enquanto, usando dados mock
      setStats({
        totalMembers: 24,
        totalEvents: 8,
        totalSongs: 156,
        upcomingEvents: 3
      });
    };

    fetchUser();
    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Novo Evento',
      description: 'Criar um novo culto ou evento',
      icon: Calendar,
      action: () => console.log('Criar evento'),
      color: 'bg-blue-500'
    },
    {
      title: 'Adicionar Membro',
      description: 'Convidar novo membro para a equipe',
      icon: Users,
      action: () => console.log('Adicionar membro'),
      color: 'bg-green-500'
    },
    {
      title: 'Nova Música',
      description: 'Adicionar música ao repertório',
      icon: Music,
      action: () => console.log('Adicionar música'),
      color: 'bg-purple-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Novo evento criado',
      description: 'Culto de Domingo - 15/12/2024',
      time: '2 horas atrás',
      icon: Calendar
    },
    {
      id: 2,
      action: 'Membro adicionado',
      description: 'João Silva foi adicionado à equipe de Louvor',
      time: '1 dia atrás',
      icon: Users
    },
    {
      id: 3,
      action: 'Música adicionada',
      description: 'Reckless Love foi adicionada ao repertório',
      time: '2 dias atrás',
      icon: Music
    }
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Olá, {user?.user_metadata?.name || user?.email || 'Usuário'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Bem-vindo ao seu painel de controle
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ação Rápida
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Membros
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalMembers}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Eventos Ativos
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {stats.upcomingEvents} próximos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Músicas no Repertório
              </CardTitle>
              <Music className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalSongs}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Star className="h-3 w-3 mr-1" />
                24 favoritas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Próximos Eventos
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</div>
              <p className="text-xs text-gray-500 mt-1">
                Esta semana
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full h-auto p-4 justify-start"
                  onClick={action.action}
                >
                  <div className={`p-2 rounded-lg ${action.color} mr-4`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{action.title}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <activity.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">
                      {activity.action}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {activity.description}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Culto de Domingo</div>
                    <div className="text-sm text-gray-500">15 de Dezembro, 2024 - 09:00</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Ver Detalhes
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Music className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Ensaio Geral</div>
                    <div className="text-sm text-gray-500">18 de Dezembro, 2024 - 19:30</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Ver Detalhes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
