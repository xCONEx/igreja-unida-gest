import { supabase } from '../client'
import { Tables, TablesInsert, TablesUpdate } from '../types'

export type Music = Tables<'music'>
export type MusicInsert = TablesInsert<'music'>
export type MusicUpdate = TablesUpdate<'music'>

export class MusicService {
  // Buscar todas as músicas
  static async getAllMusic(): Promise<Music[]> {
    const { data, error } = await supabase
      .from('music')
      .select(`
        *,
        organizations!music_organization_id_fkey (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar músicas: ${error.message}`)
    }

    return data || []
  }

  // Buscar músicas por organização
  static async getMusicByOrganization(organizationId: number): Promise<Music[]> {
    const { data, error } = await supabase
      .from('music')
      .select(`
        *,
        organizations!music_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar músicas da organização: ${error.message}`)
    }

    return data || []
  }

  // Buscar música por ID
  static async getMusicById(id: number): Promise<Music | null> {
    const { data, error } = await supabase
      .from('music')
      .select(`
        *,
        organizations!music_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Erro ao buscar música: ${error.message}`)
    }

    return data
  }

  // Criar nova música
  static async createMusic(music: MusicInsert): Promise<Music> {
    const { data, error } = await supabase
      .from('music')
      .insert(music)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar música: ${error.message}`)
    }

    return data
  }

  // Atualizar música
  static async updateMusic(id: number, updates: MusicUpdate): Promise<Music> {
    const { data, error } = await supabase
      .from('music')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar música: ${error.message}`)
    }

    return data
  }

  // Deletar música
  static async deleteMusic(id: number): Promise<void> {
    const { error } = await supabase
      .from('music')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao deletar música: ${error.message}`)
    }
  }

  // Buscar músicas por artista
  static async getMusicByArtist(artist: string): Promise<Music[]> {
    const { data, error } = await supabase
      .from('music')
      .select(`
        *,
        organizations!music_organization_id_fkey (
          id,
          name
        )
      `)
      .ilike('artist', `%${artist}%`)
      .order('title', { ascending: true })

    if (error) {
      throw new Error(`Erro ao buscar músicas por artista: ${error.message}`)
    }

    return data || []
  }

  // Buscar músicas por título
  static async searchMusicByTitle(title: string): Promise<Music[]> {
    const { data, error } = await supabase
      .from('music')
      .select(`
        *,
        organizations!music_organization_id_fkey (
          id,
          name
        )
      `)
      .ilike('title', `%${title}%`)
      .order('title', { ascending: true })

    if (error) {
      throw new Error(`Erro ao buscar músicas por título: ${error.message}`)
    }

    return data || []
  }

  // Buscar músicas com letras
  static async getMusicWithLyrics(): Promise<Music[]> {
    const { data, error } = await supabase
      .from('music')
      .select(`
        *,
        organizations!music_organization_id_fkey (
          id,
          name
        )
      `)
      .not('lyrics', 'is', null)
      .order('title', { ascending: true })

    if (error) {
      throw new Error(`Erro ao buscar músicas com letras: ${error.message}`)
    }

    return data || []
  }

  // Buscar músicas com cifras
  static async getMusicWithChords(): Promise<Music[]> {
    const { data, error } = await supabase
      .from('music')
      .select(`
        *,
        organizations!music_organization_id_fkey (
          id,
          name
        )
      `)
      .not('chords', 'is', null)
      .order('title', { ascending: true })

    if (error) {
      throw new Error(`Erro ao buscar músicas com cifras: ${error.message}`)
    }

    return data || []
  }
} 