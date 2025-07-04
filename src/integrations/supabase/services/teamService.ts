import { supabase } from '../client'
import { Tables, TablesInsert, TablesUpdate } from '../types'

export type OrganizationTeam = Tables<'organization_teams'>
export type OrganizationTeamInsert = TablesInsert<'organization_teams'>
export type OrganizationTeamUpdate = TablesUpdate<'organization_teams'>

export type TeamPosition = Tables<'team_positions'>
export type TeamPositionInsert = TablesInsert<'team_positions'>
export type TeamPositionUpdate = TablesUpdate<'team_positions'>

export type OrganizationTeamPosition = Tables<'organization_team_positions'>
export type OrganizationTeamPositionInsert = TablesInsert<'organization_team_positions'>
export type OrganizationTeamPositionUpdate = TablesUpdate<'organization_team_positions'>

export class TeamService {
  // Buscar todas as equipes
  static async getAllTeams(): Promise<OrganizationTeam[]> {
    const { data, error } = await supabase
      .from('organization_teams')
      .select(`
        *,
        organizations!organization_teams_organization_id_fkey (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar equipes: ${error.message}`)
    }

    return data || []
  }

  // Buscar equipes por organização
  static async getTeamsByOrganization(organizationId: number): Promise<OrganizationTeam[]> {
    const { data, error } = await supabase
      .from('organization_teams')
      .select(`
        *,
        organizations!organization_teams_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar equipes da organização: ${error.message}`)
    }

    return data || []
  }

  // Buscar equipe por ID
  static async getTeamById(id: number): Promise<OrganizationTeam | null> {
    const { data, error } = await supabase
      .from('organization_teams')
      .select(`
        *,
        organizations!organization_teams_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Erro ao buscar equipe: ${error.message}`)
    }

    return data
  }

  // Criar nova equipe
  static async createTeam(team: OrganizationTeamInsert): Promise<OrganizationTeam> {
    const { data, error } = await supabase
      .from('organization_teams')
      .insert(team)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar equipe: ${error.message}`)
    }

    return data
  }

  // Atualizar equipe
  static async updateTeam(id: number, updates: OrganizationTeamUpdate): Promise<OrganizationTeam> {
    const { data, error } = await supabase
      .from('organization_teams')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar equipe: ${error.message}`)
    }

    return data
  }

  // Deletar equipe
  static async deleteTeam(id: number): Promise<void> {
    const { error } = await supabase
      .from('organization_teams')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao deletar equipe: ${error.message}`)
    }
  }

  // Buscar posições por equipe
  static async getPositionsByTeam(teamId: number): Promise<TeamPosition[]> {
    const { data, error } = await supabase
      .from('team_positions')
      .select(`
        *,
        organization_teams!team_positions_organization_team_id_fkey (
          id,
          name
        )
      `)
      .eq('organization_team_id', teamId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar posições da equipe: ${error.message}`)
    }

    return data || []
  }

  // Buscar posição por ID
  static async getPositionById(id: number): Promise<TeamPosition | null> {
    const { data, error } = await supabase
      .from('team_positions')
      .select(`
        *,
        organization_teams!team_positions_organization_team_id_fkey (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Erro ao buscar posição: ${error.message}`)
    }

    return data
  }

  // Criar nova posição
  static async createPosition(position: TeamPositionInsert): Promise<TeamPosition> {
    const { data, error } = await supabase
      .from('team_positions')
      .insert(position)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar posição: ${error.message}`)
    }

    return data
  }

  // Atualizar posição
  static async updatePosition(id: number, updates: TeamPositionUpdate): Promise<TeamPosition> {
    const { data, error } = await supabase
      .from('team_positions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar posição: ${error.message}`)
    }

    return data
  }

  // Deletar posição
  static async deletePosition(id: number): Promise<void> {
    const { error } = await supabase
      .from('team_positions')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao deletar posição: ${error.message}`)
    }
  }

  // Buscar membros da equipe
  static async getTeamMembers(teamId: number): Promise<OrganizationTeamPosition[]> {
    const { data, error } = await supabase
      .from('organization_team_positions')
      .select(`
        *,
        application_users!organization_team_positions_application_user_id_fkey (
          id,
          name,
          email
        ),
        team_positions!organization_team_positions_team_position_id_fkey (
          id,
          name
        )
      `)
      .eq('team_position_id', teamId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar membros da equipe: ${error.message}`)
    }

    return data || []
  }

  // Adicionar membro à equipe
  static async addTeamMember(member: OrganizationTeamPositionInsert): Promise<OrganizationTeamPosition> {
    const { data, error } = await supabase
      .from('organization_team_positions')
      .insert(member)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao adicionar membro à equipe: ${error.message}`)
    }

    return data
  }

  // Remover membro da equipe
  static async removeTeamMember(userId: number, positionId: number): Promise<void> {
    const { error } = await supabase
      .from('organization_team_positions')
      .delete()
      .eq('application_user_id', userId)
      .eq('team_position_id', positionId)

    if (error) {
      throw new Error(`Erro ao remover membro da equipe: ${error.message}`)
    }
  }

  // Buscar posições de um usuário
  static async getUserPositions(userId: number): Promise<OrganizationTeamPosition[]> {
    const { data, error } = await supabase
      .from('organization_team_positions')
      .select(`
        *,
        team_positions!organization_team_positions_team_position_id_fkey (
          id,
          name,
          organization_teams!team_positions_organization_team_id_fkey (
            id,
            name
          )
        )
      `)
      .eq('application_user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar posições do usuário: ${error.message}`)
    }

    return data || []
  }
} 