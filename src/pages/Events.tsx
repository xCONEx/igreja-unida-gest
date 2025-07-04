
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Clock, MapPin, Users, Settings } from 'lucide-react';

const Events = () => {
  const events = [
    {
      id: 1,
      title: 'Culto de Domingo',
      description: 'Culto principal de domingo pela manhã',
      date: '2024-12-15',
      time: '09:00',
      location: 'Templo Principal',
      status: 'Confirmado',
      attendees: 45,
      team: 'Louvor Principal',
      type: 'Culto'
    },
    {
      id: 2,
      title: 'Ensaio Geral',
      description: 'Ensaio preparatório para o culto especial de Natal',
      date: '2024-12-18',
      time: '19:30',
      location: 'Sala de Ensaio',
      status: 'Planejado',
      attendees: 12,
      team: 'Louvor Principal',
      type: 'Ensaio'
    },
    {
      id: 3,
      title: 'Culto de Natal',
      description: 'Celebração especial de Natal com apresentações',
      date: '2024-12-24',
      time: '19:00',
      location: 'Templo Principal',
      status: 'Planejado',
      attendees: 80,
      team: 'Todos',
      type: 'Evento Especial'
    },
    {
      id: 4,
      title: 'Culto de Jovens',
      description: 'Culto especial para a juventude',
      date: '2024-12-20',
      time: '19:30',
      location: 'Salão Jovens',
      status: 'Confirmado',
      attendees: 25,
      team: 'Louvor Jovem',
      type: 'Culto'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800';
      case 'Planejado':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      case 'Adiado':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Culto':
        return 'bg-blue-100 text-blue-800';
      case 'Ensaio':
        return 'bg-purple-100 text-purple-800';
      case 'Evento Especial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Eventos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie cultos, ensaios e eventos especiais
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg font-semibold">
                        {event.title}
                      </CardTitle>
                      <Badge variant="secondary" className={getTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {event.description}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-600">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-600">{event.attendees} pessoas</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <Badge variant="secondary" className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{event.team}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button size="sm" className="flex-1">
                    Ver Agenda
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Calendar View Toggle */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Vista do Calendário</h3>
                <p className="text-sm text-gray-600">
                  Visualize todos os eventos em formato de calendário mensal
                </p>
              </div>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Calendário
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-sm text-gray-600">Total de Eventos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'Confirmado').length}
              </div>
              <div className="text-sm text-gray-600">Confirmados</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {events.filter(e => e.type === 'Evento Especial').length}
              </div>
              <div className="text-sm text-gray-600">Eventos Especiais</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {events.reduce((sum, event) => sum + event.attendees, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Participantes</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Events;
