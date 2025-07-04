import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { OrganizationService } from '@/integrations/supabase/services/organizationService'
import { UserService } from '@/integrations/supabase/services/userService'
import { Loader2, Plus } from 'lucide-react'

interface CreateOrganizationDialogProps {
  onOrganizationCreated: () => void
}

const CreateOrganizationDialog: React.FC<CreateOrganizationDialogProps> = ({ onOrganizationCreated }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: '',
    ownerName: '',
    ownerEmail: '',
    subscriptionPlan: 'Free' as 'Free' | 'Basic' | 'Premium',
    maxUsers: 15,
    maxStorageGB: 0.5
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.organizationName || !formData.ownerName || !formData.ownerEmail) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Primeiro, criar o usuário proprietário
      const user = await UserService.createUser({
        email: formData.ownerEmail,
        name: formData.ownerName,
        organization_id: 0, // Será atualizado após criar a organização
        is_admin: true,
        can_add_people: true,
        can_organize_events: true,
        can_manage_media: true,
        receive_cancel_event_notification: true,
        pending: false
      })

      // Depois, criar a organização
      const organization = await OrganizationService.createOrganization({
        name: formData.organizationName,
        owner_id: user.id,
        subscription_plan: formData.subscriptionPlan,
        max_users: formData.maxUsers,
        max_storage_gb: formData.maxStorageGB
      })

      // Atualizar o usuário com o ID da organização
      await UserService.updateUser(user.id, {
        organization_id: organization.id
      })

      toast({
        title: "Organização criada com sucesso!",
        description: `A organização "${formData.organizationName}" foi criada e o proprietário foi notificado.`,
      })

      setFormData({
        organizationName: '',
        ownerName: '',
        ownerEmail: '',
        subscriptionPlan: 'Free',
        maxUsers: 15,
        maxStorageGB: 0.5
      })

      setOpen(false)
      onOrganizationCreated()

    } catch (error: any) {
      toast({
        title: "Erro ao criar organização",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Organização
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Organização</DialogTitle>
          <DialogDescription>
            Crie uma nova organização e defina o proprietário. Preencha todos os campos obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Nome da Organização *</Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              placeholder="Ex: Igreja Batista Central"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Nome do Proprietário *</Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Email do Proprietário *</Label>
            <Input
              id="ownerEmail"
              type="email"
              value={formData.ownerEmail}
              onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
              placeholder="joao@igreja.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriptionPlan">Plano de Assinatura</Label>
            <Select
              value={formData.subscriptionPlan}
              onValueChange={(value) => handleInputChange('subscriptionPlan', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free (15 usuários, 0.5GB)</SelectItem>
                <SelectItem value="Basic">Basic (50 usuários, 5GB)</SelectItem>
                <SelectItem value="Premium">Premium (200 usuários, 20GB)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsers">Usuários Máximos</Label>
              <Input
                id="maxUsers"
                type="number"
                value={formData.maxUsers}
                onChange={(e) => handleInputChange('maxUsers', parseInt(e.target.value))}
                min="1"
                max="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStorageGB">Armazenamento (GB)</Label>
              <Input
                id="maxStorageGB"
                type="number"
                step="0.1"
                value={formData.maxStorageGB}
                onChange={(e) => handleInputChange('maxStorageGB', parseFloat(e.target.value))}
                min="0.1"
                max="100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Organização'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateOrganizationDialog 