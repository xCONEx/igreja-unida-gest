
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, UserPlus, Settings } from 'lucide-react';

const Teams = () => {
  const teams = [
    {
      id: 1,
      name: 'Louvor Principal',
      description: 'Equipe principal de louvor dos cultos dominicais',
      memberCount: 8,
      positions: ['Vocal', 'Guitarra', 'Baixo', 'Bateria', 'Teclado']
    },
    {
      id: 2,
      name: 'Louvor Jovem',
      description: 'Equipe de louvor para cultos de jovens',
      memberCount: 6,
      positions: ['Vocal', 'Guitarra', 'Violão', 'Cajón']
    },
    {
      id: 3,
      name: 'Coral Infantil',
      description: 'Coral das crianças para eventos especiais',
      memberCount: 12,
      positions: ['Vocal', 'Regente']
    }
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Equipes</h1>
            <p className="text-gray-600 mt-1">
              Gerencie suas equipes musicais e suas posições
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Equipe
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {team.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {team.memberCount} membros
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  {team.description}
                </p>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Posições:</h4>
                  <div className="flex flex-wrap gap-2">
                    {team.positions.map((position, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {position}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                  <Button size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add New Team Card */}
          <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center">
                <div className="p-3 bg-gray-100 rounded-full mx-auto mb-4 w-fit">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Nova Equipe</h3>
                <p className="text-sm text-gray-500">
                  Clique para criar uma nova equipe musical
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{teams.length}</div>
                <div className="text-sm text-gray-600">Equipes Ativas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {teams.reduce((sum, team) => sum + team.memberCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total de Membros</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {teams.reduce((sum, team) => sum + team.positions.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Posições Disponíveis</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Teams;
