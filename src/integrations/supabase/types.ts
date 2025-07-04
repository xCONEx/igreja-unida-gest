export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: number
          name: string
          owner_id: number
          created_at: string
          updated_at: string
          subscription_plan: Database["public"]["Enums"]["subscription_plan_enum"]
          max_users: number
          max_storage_gb: number
        }
        Insert: {
          id?: number
          name: string
          owner_id: number
          created_at?: string
          updated_at?: string
          subscription_plan?: Database["public"]["Enums"]["subscription_plan_enum"]
          max_users?: number
          max_storage_gb?: number
        }
        Update: {
          id?: number
          name?: string
          owner_id?: number
          created_at?: string
          updated_at?: string
          subscription_plan?: Database["public"]["Enums"]["subscription_plan_enum"]
          max_users?: number
          max_storage_gb?: number
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "application_users"
            referencedColumns: ["id"]
          }
        ]
      }
      application_users: {
        Row: {
          id: number
          email: string
          name: string
          phone_number: string | null
          birth_date: string | null
          country_dial_code: string | null
          profile_url: string | null
          organization_id: number
          is_admin: boolean
          can_add_people: boolean
          can_organize_events: boolean
          can_manage_media: boolean
          receive_cancel_event_notification: boolean
          pending: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          name: string
          phone_number?: string | null
          birth_date?: string | null
          country_dial_code?: string | null
          profile_url?: string | null
          organization_id: number
          is_admin?: boolean
          can_add_people?: boolean
          can_organize_events?: boolean
          can_manage_media?: boolean
          receive_cancel_event_notification?: boolean
          pending?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          name?: string
          phone_number?: string | null
          birth_date?: string | null
          country_dial_code?: string | null
          profile_url?: string | null
          organization_id?: number
          is_admin?: boolean
          can_add_people?: boolean
          can_organize_events?: boolean
          can_manage_media?: boolean
          receive_cancel_event_notification?: boolean
          pending?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      organization_teams: {
        Row: {
          id: number
          name: string
          organization_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          organization_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          organization_id?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      team_positions: {
        Row: {
          id: number
          name: string
          organization_team_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          organization_team_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          organization_team_id?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_positions_organization_team_id_fkey"
            columns: ["organization_team_id"]
            isOneToOne: false
            referencedRelation: "organization_teams"
            referencedColumns: ["id"]
          }
        ]
      }
      organization_team_positions: {
        Row: {
          id: number
          application_user_id: number
          team_position_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          application_user_id: number
          team_position_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          application_user_id?: number
          team_position_id?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_team_positions_application_user_id_fkey"
            columns: ["application_user_id"]
            isOneToOne: false
            referencedRelation: "application_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_team_positions_team_position_id_fkey"
            columns: ["team_position_id"]
            isOneToOne: false
            referencedRelation: "team_positions"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          id: number
          title: string
          description: string | null
          start_date: string
          end_date: string
          organization_id: number
          status: Database["public"]["Enums"]["event_status_enum"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          start_date: string
          end_date: string
          organization_id: number
          status?: Database["public"]["Enums"]["event_status_enum"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          organization_id?: number
          status?: Database["public"]["Enums"]["event_status_enum"]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      event_schedules: {
        Row: {
          id: number
          event_id: number
          date: string
          time: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          event_id: number
          date: string
          time?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          event_id?: number
          date?: string
          time?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      event_blocks: {
        Row: {
          id: number
          event_id: number
          start_date: string
          end_date: string
          reason: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          event_id: number
          start_date: string
          end_date: string
          reason: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          event_id?: number
          start_date?: string
          end_date?: string
          reason?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_blocks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      music: {
        Row: {
          id: number
          title: string
          artist: string | null
          lyrics: string | null
          chords: string | null
          organization_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          artist?: string | null
          lyrics?: string | null
          chords?: string | null
          organization_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          artist?: string | null
          lyrics?: string | null
          chords?: string | null
          organization_id?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      files: {
        Row: {
          id: number
          name: string
          type: string
          size: number
          url: string
          organization_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          type: string
          size: number
          url: string
          organization_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
          size?: number
          url?: string
          organization_id?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_plan_enum: "Free" | "Basic" | "Premium"
      event_status_enum: "Scheduled" | "Cancelled" | "Completed" | "Draft"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
