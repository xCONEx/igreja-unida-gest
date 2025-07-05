
import { supabase } from '../client'
import { Tables, TablesInsert, TablesUpdate } from '../types'

export type ApplicationUser = Tables<'application_users'>
export type ApplicationUserInsert = TablesInsert<'application_users'>
export type ApplicationUserUpdate = TablesUpdate<'application_users'>

export class UserService {
  // Buscar todos os usuários (para admin master)
  static async getAllUsers(): Promise<ApplicationUser[]> {
    const { data, error } = await supabase
      .from('application_users')
      .select(`
        *,
        organizations!application_users_organization_id_fkey (
          id,
          name,
          subscription_plan
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar usuários:', error)
      throw new Error(`Erro ao buscar usuários: ${error.message}`)
    }

    return data || []
  }

  // Buscar usuário por ID
  static async getUserById(id: number): Promise<ApplicationUser | null> {
    const { data, error } = await supabase
      .from('application_users')
      .select(`
        *,
        organizations!application_users_organization_id_fkey (
          id,
          name,
          subscription_plan
        )
      `)
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar usuário:', error)
      throw new Error(`Erro ao buscar usuário: ${error.message}`)
    }

    return data
  }

  // Buscar usuário por email
  static async getUserByEmail(email: string): Promise<ApplicationUser | null> {
    const { data, error } = await supabase
      .from('application_users')
      .select(`
        *,
        organizations!application_users_organization_id_fkey (
          id,
          name,
          subscription_plan
        )
      `)
      .eq('email', email)
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar usuário por email:', error)
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`)
    }

    return data
  }

  // Criar novo usuário
  static async createUser(user: ApplicationUserInsert): Promise<ApplicationUser> {
    const { data, error } = await supabase
      .from('application_users')
      .insert(user)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar usuário:', error)
      throw new Error(`Erro ao criar usuário: ${error.message}`)
    }

    return data
  }

  // Atualizar usuário
  static async updateUser(id: number, updates: ApplicationUserUpdate): Promise<ApplicationUser> {
    const { data, error } = await supabase
      .from('application_users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw new Error(`Erro ao atualizar usuário: ${error.message}`)
    }

    return data
  }

  // Deletar usuário
  static async deleteUser(id: number): Promise<void> {
    const { error } = await supabase
      .from('application_users')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar usuário:', error)
      throw new Error(`Erro ao deletar usuário: ${error.message}`)
    }
  }

  // Buscar usuários por organização
  static async getUsersByOrganization(organizationId: number): Promise<ApplicationUser[]> {
    const { data, error } = await supabase
      .from('application_users')
      .select(`
        *,
        organizations!application_users_organization_id_fkey (
          id,
          name,
          subscription_plan
        )
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar usuários da organização:', error)
      throw new Error(`Erro ao buscar usuários da organização: ${error.message}`)
    }

    return data || []
  }

  // Buscar usuários pendentes
  static async getPendingUsers(): Promise<ApplicationUser[]> {
    const { data, error } = await supabase
      .from('application_users')
      .select(`
        *,
        organizations!application_users_organization_id_fkey (
          id,
          name,
          subscription_plan
        )
      `)
      .eq('pending', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar usuários pendentes:', error)
      throw new Error(`Erro ao buscar usuários pendentes: ${error.message}`)
    }

    return data || []
  }

  // Aprovar usuário
  static async approveUser(id: number): Promise<ApplicationUser> {
    const { data, error } = await supabase
      .from('application_users')
      .update({ 
        pending: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao aprovar usuário:', error)
      throw new Error(`Erro ao aprovar usuário: ${error.message}`)
    }

    return data
  }

  // Buscar estatísticas dos usuários (protegido para admin masters)
  static async getUserStats() {
    // Esta função só funciona para admin masters devido às políticas RLS
    const { data: users, error } = await supabase
      .from('application_users')
      .select('pending, is_admin, created_at')

    if (error) {
      console.error('Erro ao buscar estatísticas dos usuários:', error)
      throw new Error(`Erro ao buscar estatísticas dos usuários: ${error.message}`)
    }

    if (!users) {
      return {
        total: 0,
        pending: 0,
        admins: 0,
        recent: 0
      }
    }

    const stats = {
      total: users.length,
      pending: users.filter(user => user.pending).length,
      admins: users.filter(user => user.is_admin).length,
      recent: users.filter(user => {
        const createdDate = new Date(user.created_at)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return createdDate >= thirtyDaysAgo
      }).length
    }

    return stats
  }
}
