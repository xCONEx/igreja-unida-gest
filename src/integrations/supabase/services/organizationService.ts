
import { supabase } from '../client'
import { Tables, TablesInsert, TablesUpdate } from '../types'

export type Organization = Tables<'organizations'>
export type OrganizationInsert = TablesInsert<'organizations'>
export type OrganizationUpdate = TablesUpdate<'organizations'>

export class OrganizationService {
  // Buscar todas as organizações (para admin master)
  static async getAllOrganizations(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar organizações:', error)
      throw new Error(`Erro ao buscar organizações: ${error.message}`)
    }

    return data || []
  }

  // Buscar organização por ID
  static async getOrganizationById(id: number): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar organização:', error)
      throw new Error(`Erro ao buscar organização: ${error.message}`)
    }

    return data
  }

  // Criar nova organização
  static async createOrganization(organization: OrganizationInsert): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert(organization)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar organização:', error)
      throw new Error(`Erro ao criar organização: ${error.message}`)
    }

    return data
  }

  // Atualizar organização
  static async updateOrganization(id: number, updates: OrganizationUpdate): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar organização:', error)
      throw new Error(`Erro ao atualizar organização: ${error.message}`)
    }

    return data
  }

  // Deletar organização
  static async deleteOrganization(id: number): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar organização:', error)
      throw new Error(`Erro ao deletar organização: ${error.message}`)
    }
  }

  // Buscar estatísticas das organizações
  static async getOrganizationStats() {
    const { data: organizations, error } = await supabase
      .from('organizations')
      .select('subscription_plan, created_at')

    if (error) {
      console.error('Erro ao buscar estatísticas das organizações:', error)
      throw new Error(`Erro ao buscar estatísticas das organizações: ${error.message}`)
    }

    const stats = {
      total: organizations?.length || 0,
      active: organizations?.length || 0, // Assumindo que todas são ativas por enquanto
      free: organizations?.filter(org => org.subscription_plan === 'Free').length || 0,
      basic: organizations?.filter(org => org.subscription_plan === 'Basic').length || 0,
      premium: organizations?.filter(org => org.subscription_plan === 'Premium').length || 0,
      recent: organizations?.filter(org => {
        const createdDate = new Date(org.created_at)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return createdDate >= thirtyDaysAgo
      }).length || 0
    }

    return stats
  }
}
