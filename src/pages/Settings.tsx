
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Settings as SettingsIcon,
  Users,
  Church
} from 'lucide-react';

const Settings = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas preferências e configurações da organização
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Menu */}
          <div className="space-y-2">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-700">
                    <User className="h-4 w-4 mr-3" />
                    Perfil
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Church className="h-4 w-4 mr-3" />
                    Organização
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-3" />
                    Membros
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-3" />
                    Notificações
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-3" />
                    Segurança
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-3" />
                    Plano
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" placeholder="Seu nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Função Principal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leader">Líder de Louvor</SelectItem>
                        <SelectItem value="vocalist">Vocalista</SelectItem>
                        <SelectItem value="guitarist">Guitarrista</SelectItem>
                        <SelectItem value="bassist">Baixista</SelectItem>
                        <SelectItem value="drummer">Baterista</SelectItem>
                        <SelectItem value="keyboardist">Tecladista</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>

            {/* Organization Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Church className="h-5 w-5" />
                  Configurações da Organização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Nome da Organização</Label>
                    <Input id="org-name" placeholder="Nome da sua igreja/ministério" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-address">Endereço</Label>
                    <Input id="org-address" placeholder="Endereço completo" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-phone">Telefone</Label>
                      <Input id="org-phone" placeholder="(11) 3333-3333" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-email">Email</Label>
                      <Input id="org-email" type="email" placeholder="contato@igreja.com" />
                    </div>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Atualizar Organização
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Notificações por Email</Label>
                      <p className="text-sm text-gray-500">Receber emails sobre eventos e atualizações</p>
                    </div>
                    <Switch id="email-notifications" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="event-reminders">Lembretes de Eventos</Label>
                      <p className="text-sm text-gray-500">Receber lembretes antes dos eventos</p>
                    </div>
                    <Switch id="event-reminders" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="member-updates">Atualizações de Membros</Label>
                      <p className="text-sm text-gray-500">Notificações sobre novos membros e mudanças</p>
                    </div>
                    <Switch id="member-updates" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="practice-reminders">Lembretes de Ensaio</Label>
                      <p className="text-sm text-gray-500">Receber lembretes de ensaios agendados</p>
                    </div>
                    <Switch id="practice-reminders" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Plano Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Plano Inicial</h3>
                    <span className="text-2xl font-bold text-blue-600">R$ 29/mês</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• 15 usuários inclusos</p>
                    <p>• 500MB de armazenamento</p>
                    <p>• Suporte por email</p>
                    <p>• Funcionalidades básicas</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Alterar Plano
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Gerenciar Cobrança
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
