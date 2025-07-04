import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { OrganizationService, Organization } from '../integrations/supabase/services/organizationService'
import { UserService, ApplicationUser } from '../integrations/supabase/services/userService'
import { EventService, Event } from '../integrations/supabase/services/eventService'
import { MusicService, Music } from '../integrations/supabase/services/musicService'
import { FileService, File } from '../integrations/supabase/services/fileService'
import { TeamService, OrganizationTeam } from '../integrations/supabase/services/teamService'
import { useAuth } from '../contexts/AuthContext'
import CreateOrganizationDialog from '../components/CreateOrganizationDialog'
import { 
  Users, 
  Building2, 
  Calendar, 
  Music as MusicIcon, 
  FileText, 
  Users2, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface DashboardStats {
  totalOrganizations: number
  totalUsers: number
  totalEvents: number
  totalMusic: number
  totalFiles: number
  totalTeams: number
  pendingUsers: number
  recentOrganizations: number
  byPlan: {
    Free: number
    Basic: number
    Premium: number
  }
}

const AdminMasterDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [users, setUsers] = useState<ApplicationUser[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [music, setMusic] = useState<Music[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [teams, setTeams] = useState<OrganizationTeam[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Carregar estatísticas
      const [orgStats, userStats, allOrgs, allUsers, allEvents, allMusic, allFiles, allTeams] = await Promise.all([
        OrganizationService.getOrganizationStats(),
        UserService.getUserStats(),
        OrganizationService.getAllOrganizations(),
        UserService.getAllUsers(),
        EventService.getAllEvents(),
        MusicService.getAllMusic(),
        FileService.getAllFiles(),
        TeamService.getAllTeams()
      ])

      setStats({
        totalOrganizations: orgStats.total,
        totalUsers: userStats.total,
        totalEvents: allEvents.length,
        totalMusic: allMusic.length,
        totalFiles: allFiles.length,
        totalTeams: allTeams.length,
        pendingUsers: userStats.pending,
        recentOrganizations: orgStats.recent,
        byPlan: orgStats.byPlan
      })

      setOrganizations(allOrgs)
      setUsers(allUsers)
      setEvents(allEvents)
      setMusic(allMusic)
      setFiles(allFiles)
      setTeams(allTeams)

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'Premium':
        return 'bg-purple-100 text-purple-800'
      case 'Basic':
        return 'bg-blue-100 text-blue-800'
      case 'Free':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-lg">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin Master</h1>
              <p className="text-gray-600">Bem-vindo, {user?.name}</p>
            </div>
            <Button onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizações</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.recentOrganizations} este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.pendingUsers} pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Total de eventos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Músicas</CardTitle>
              <MusicIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMusic}</div>
              <p className="text-xs text-muted-foreground">
                Total de músicas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Plan Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Distribuição por Plano</CardTitle>
            <CardDescription>Organizações por tipo de assinatura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{stats?.byPlan.Free}</div>
                <div className="text-sm text-gray-500">Free</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats?.byPlan.Basic}</div>
                <div className="text-sm text-gray-500">Basic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats?.byPlan.Premium}</div>
                <div className="text-sm text-gray-500">Premium</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="organizations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="organizations">Organizações</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="music">Músicas</TabsTrigger>
            <TabsTrigger value="files">Arquivos</TabsTrigger>
            <TabsTrigger value="teams">Equipes</TabsTrigger>
          </TabsList>

          <TabsContent value="organizations">
            <Card>
              <CardHeader>
                <CardTitle>Organizações</CardTitle>
                <CardDescription>Lista de todas as organizações cadastradas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Usuários Máx</TableHead>
                      <TableHead>Armazenamento</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell>{org.application_users?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getPlanBadgeColor(org.subscription_plan)}>
                            {org.subscription_plan}
                          </Badge>
                        </TableCell>
                        <TableCell>{org.max_users}</TableCell>
                        <TableCell>{org.max_storage_gb} GB</TableCell>
                        <TableCell>{formatDate(org.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Lista de todos os usuários cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Organização</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.organizations?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {user.is_admin ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <span>-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.pending ? (
                            <Badge>
                              <Clock className="h-3 w-3 mr-1" />
                              Pendente
                            </Badge>
                          ) : (
                            <Badge>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Eventos</CardTitle>
                <CardDescription>Lista de todos os eventos cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Organização</TableHead>
                      <TableHead>Data Início</TableHead>
                      <TableHead>Data Fim</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.organizations?.name || 'N/A'}</TableCell>
                        <TableCell>{formatDate(event.start_date)}</TableCell>
                        <TableCell>{formatDate(event.end_date)}</TableCell>
                        <TableCell>
                          <Badge>{event.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="music">
            <Card>
              <CardHeader>
                <CardTitle>Músicas</CardTitle>
                <CardDescription>Lista de todas as músicas cadastradas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Artista</TableHead>
                      <TableHead>Organização</TableHead>
                      <TableHead>Letra</TableHead>
                      <TableHead>Cifra</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {music.map((song) => (
                      <TableRow key={song.id}>
                        <TableCell className="font-medium">{song.title}</TableCell>
                        <TableCell>{song.artist || 'N/A'}</TableCell>
                        <TableCell>{song.organizations?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {song.lyrics ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <span>-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {song.chords ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <span>-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>Arquivos</CardTitle>
                <CardDescription>Lista de todos os arquivos cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Organização</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">{file.name}</TableCell>
                        <TableCell>{file.type}</TableCell>
                        <TableCell>{(file.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                        <TableCell>{file.organizations?.name || 'N/A'}</TableCell>
                        <TableCell>{formatDate(file.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Equipes</CardTitle>
                <CardDescription>Lista de todas as equipes cadastradas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Organização</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{team.organizations?.name || 'N/A'}</TableCell>
                        <TableCell>{formatDate(team.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminMasterDashboard 