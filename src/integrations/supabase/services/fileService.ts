import { supabase } from '../client'
import { Tables, TablesInsert, TablesUpdate } from '../types'

export type File = Tables<'files'>
export type FileInsert = TablesInsert<'files'>
export type FileUpdate = TablesUpdate<'files'>

export class FileService {
  // Buscar todos os arquivos
  static async getAllFiles(): Promise<File[]> {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        organizations!files_organization_id_fkey (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar arquivos: ${error.message}`)
    }

    return data || []
  }

  // Buscar arquivos por organização
  static async getFilesByOrganization(organizationId: number): Promise<File[]> {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        organizations!files_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar arquivos da organização: ${error.message}`)
    }

    return data || []
  }

  // Buscar arquivo por ID
  static async getFileById(id: number): Promise<File | null> {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        organizations!files_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Erro ao buscar arquivo: ${error.message}`)
    }

    return data
  }

  // Criar novo arquivo
  static async createFile(file: FileInsert): Promise<File> {
    const { data, error } = await supabase
      .from('files')
      .insert(file)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar arquivo: ${error.message}`)
    }

    return data
  }

  // Atualizar arquivo
  static async updateFile(id: number, updates: FileUpdate): Promise<File> {
    const { data, error } = await supabase
      .from('files')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar arquivo: ${error.message}`)
    }

    return data
  }

  // Deletar arquivo
  static async deleteFile(id: number): Promise<void> {
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao deletar arquivo: ${error.message}`)
    }
  }

  // Buscar arquivos por tipo
  static async getFilesByType(type: string): Promise<File[]> {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        organizations!files_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('type', type)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar arquivos por tipo: ${error.message}`)
    }

    return data || []
  }

  // Buscar arquivos por nome
  static async searchFilesByName(name: string): Promise<File[]> {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        organizations!files_organization_id_fkey (
          id,
          name
        )
      `)
      .ilike('name', `%${name}%`)
      .order('name', { ascending: true })

    if (error) {
      throw new Error(`Erro ao buscar arquivos por nome: ${error.message}`)
    }

    return data || []
  }

  // Buscar arquivos grandes (acima de um tamanho específico)
  static async getLargeFiles(minSizeBytes: number): Promise<File[]> {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        organizations!files_organization_id_fkey (
          id,
          name
        )
      `)
      .gte('size', minSizeBytes)
      .order('size', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar arquivos grandes: ${error.message}`)
    }

    return data || []
  }

  // Calcular uso de armazenamento por organização
  static async getStorageUsageByOrganization(organizationId: number): Promise<number> {
    const { data, error } = await supabase
      .from('files')
      .select('size')
      .eq('organization_id', organizationId)

    if (error) {
      throw new Error(`Erro ao calcular uso de armazenamento: ${error.message}`)
    }

    const totalSize = data?.reduce((sum, file) => sum + file.size, 0) || 0
    return totalSize
  }

  // Verificar se organização excedeu limite de armazenamento
  static async checkStorageLimit(organizationId: number): Promise<{ usage: number; limit: number; exceeded: boolean }> {
    const usage = await this.getStorageUsageByOrganization(organizationId)
    
    // Buscar limite da organização
    const { data: org, error } = await supabase
      .from('organizations')
      .select('max_storage_gb')
      .eq('id', organizationId)
      .single()

    if (error) {
      throw new Error(`Erro ao buscar limite de armazenamento: ${error.message}`)
    }

    const limitBytes = (org?.max_storage_gb || 0.5) * 1024 * 1024 * 1024 // Converter GB para bytes
    const exceeded = usage > limitBytes

    return {
      usage,
      limit: limitBytes,
      exceeded
    }
  }
} 