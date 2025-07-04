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
      .select(`
        *,
        application_users!organizations_owner_id_fkey (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar organizações: ${error.message}`)
    }

    return data || []
  }

  // Buscar organização por ID
  static async getOrganizationById(id: number): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        application_users!organizations_owner_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
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
      throw new Error(`Erro ao deletar organização: ${error.message}`)
    }
  }

  // Buscar organizações por plano de assinatura
  static async getOrganizationsByPlan(plan: 'Free' | 'Basic' | 'Premium'): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        application_users!organizations_owner_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('subscription_plan', plan)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar organizações por plano: ${error.message}`)
    }

    return data || []
  }

  // Atualizar plano de assinatura
  static async updateSubscriptionPlan(id: number, plan: 'Free' | 'Basic' | 'Premium'): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update({ 
        subscription_plan: plan,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar plano de assinatura: ${error.message}`)
    }

    return data
  }

  // Buscar estatísticas das organizações
  static async getOrganizationStats() {
    const { data: organizations, error } = await supabase
      .from('organizations')
      .select('subscription_plan, created_at')

    if (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`)
    }

    const stats = {
      total: organizations?.length || 0,
      byPlan: {
        Free: organizations?.filter(org => org.subscription_plan === 'Free').length || 0,
        Basic: organizations?.filter(org => org.subscription_plan === 'Basic').length || 0,
        Premium: organizations?.filter(org => org.subscription_plan === 'Premium').length || 0,
      },
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