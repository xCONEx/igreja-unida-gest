import { supabase } from '../client'
import { Tables, TablesInsert, TablesUpdate } from '../types'

export type Event = Tables<'events'>
export type EventInsert = TablesInsert<'events'>
export type EventUpdate = TablesUpdate<'events'>

export type EventSchedule = Tables<'event_schedules'>
export type EventScheduleInsert = TablesInsert<'event_schedules'>
export type EventScheduleUpdate = TablesUpdate<'event_schedules'>

export type EventBlock = Tables<'event_blocks'>
export type EventBlockInsert = TablesInsert<'event_blocks'>
export type EventBlockUpdate = TablesUpdate<'event_blocks'>

export class EventService {
  // Buscar todos os eventos
  static async getAllEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizations!events_organization_id_fkey (
          id,
          name
        )
      `)
      .order('start_date', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar eventos: ${error.message}`)
    }

    return data || []
  }

  // Buscar eventos por organização
  static async getEventsByOrganization(organizationId: number): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizations!events_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('organization_id', organizationId)
      .order('start_date', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar eventos da organização: ${error.message}`)
    }

    return data || []
  }

  // Buscar evento por ID
  static async getEventById(id: number): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizations!events_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Erro ao buscar evento: ${error.message}`)
    }

    return data
  }

  // Criar novo evento
  static async createEvent(event: EventInsert): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar evento: ${error.message}`)
    }

    return data
  }

  // Atualizar evento
  static async updateEvent(id: number, updates: EventUpdate): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar evento: ${error.message}`)
    }

    return data
  }

  // Deletar evento
  static async deleteEvent(id: number): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao deletar evento: ${error.message}`)
    }
  }

  // Buscar eventos por status
  static async getEventsByStatus(status: 'Scheduled' | 'Cancelled' | 'Completed' | 'Draft'): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizations!events_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('status', status)
      .order('start_date', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar eventos por status: ${error.message}`)
    }

    return data || []
  }

  // Buscar eventos futuros
  static async getUpcomingEvents(): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizations!events_organization_id_fkey (
          id,
          name
        )
      `)
      .gte('start_date', today)
      .eq('status', 'Scheduled')
      .order('start_date', { ascending: true })

    if (error) {
      throw new Error(`Erro ao buscar eventos futuros: ${error.message}`)
    }

    return data || []
  }

  // Event Schedules
  static async getEventSchedules(eventId: number): Promise<EventSchedule[]> {
    const { data, error } = await supabase
      .from('event_schedules')
      .select('*')
      .eq('event_id', eventId)
      .order('date', { ascending: true })

    if (error) {
      throw new Error(`Erro ao buscar cronogramas do evento: ${error.message}`)
    }

    return data || []
  }

  static async createEventSchedule(schedule: EventScheduleInsert): Promise<EventSchedule> {
    const { data, error } = await supabase
      .from('event_schedules')
      .insert(schedule)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar cronograma: ${error.message}`)
    }

    return data
  }

  static async updateEventSchedule(id: number, updates: EventScheduleUpdate): Promise<EventSchedule> {
    const { data, error } = await supabase
      .from('event_schedules')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar cronograma: ${error.message}`)
    }

    return data
  }

  static async deleteEventSchedule(id: number): Promise<void> {
    const { error } = await supabase
      .from('event_schedules')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao deletar cronograma: ${error.message}`)
    }
  }

  // Event Blocks
  static async getEventBlocks(eventId: number): Promise<EventBlock[]> {
    const { data, error } = await supabase
      .from('event_blocks')
      .select('*')
      .eq('event_id', eventId)
      .order('start_date', { ascending: true })

    if (error) {
      throw new Error(`Erro ao buscar bloqueios do evento: ${error.message}`)
    }

    return data || []
  }

  static async createEventBlock(block: EventBlockInsert): Promise<EventBlock> {
    const { data, error } = await supabase
      .from('event_blocks')
      .insert(block)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar bloqueio: ${error.message}`)
    }

    return data
  }

  static async updateEventBlock(id: number, updates: EventBlockUpdate): Promise<EventBlock> {
    const { data, error } = await supabase
      .from('event_blocks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar bloqueio: ${error.message}`)
    }

    return data
  }

  static async deleteEventBlock(id: number): Promise<void> {
    const { error } = await supabase
      .from('event_blocks')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Erro ao deletar bloqueio: ${error.message}`)
    }
  }
} 