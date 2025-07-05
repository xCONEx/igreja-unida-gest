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
      application_users: {
        Row: {
          birth_date: string | null
          can_add_people: boolean
          can_manage_media: boolean
          can_organize_events: boolean
          country_dial_code: string | null
          created_at: string
          email: string
          id: number
          is_admin: boolean
          name: string
          organization_id: number
          pending: boolean
          phone_number: string | null
          profile_url: string | null
          receive_cancel_event_notification: boolean
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          can_add_people?: boolean
          can_manage_media?: boolean
          can_organize_events?: boolean
          country_dial_code?: string | null
          created_at?: string
          email: string
          id?: number
          is_admin?: boolean
          name: string
          organization_id: number
          pending?: boolean
          phone_number?: string | null
          profile_url?: string | null
          receive_cancel_event_notification?: boolean
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          can_add_people?: boolean
          can_manage_media?: boolean
          can_organize_events?: boolean
          country_dial_code?: string | null
          created_at?: string
          email?: string
          id?: number
          is_admin?: boolean
          name?: string
          organization_id?: number
          pending?: boolean
          phone_number?: string | null
          profile_url?: string | null
          receive_cancel_event_notification?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_blocks: {
        Row: {
          created_at: string
          end_date: string
          event_id: number
          id: number
          reason: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          event_id: number
          id?: number
          reason: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          event_id?: number
          id?: number
          reason?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_blocks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_schedules: {
        Row: {
          created_at: string
          date: string
          description: string | null
          event_id: number
          id: number
          time: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          event_id: number
          id?: number
          time?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          event_id?: number
          id?: number
          time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: number
          organization_id: number
          start_date: string
          status: Database["public"]["Enums"]["event_status_enum"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: number
          organization_id: number
          start_date: string
          status?: Database["public"]["Enums"]["event_status_enum"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: number
          organization_id?: number
          start_date?: string
          status?: Database["public"]["Enums"]["event_status_enum"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string
          id: number
          name: string
          organization_id: number
          size: number
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          organization_id: number
          size: number
          type: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          organization_id?: number
          size?: number
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      music: {
        Row: {
          artist: string | null
          chords: string | null
          created_at: string
          id: number
          lyrics: string | null
          organization_id: number
          title: string
          updated_at: string
        }
        Insert: {
          artist?: string | null
          chords?: string | null
          created_at?: string
          id?: number
          lyrics?: string | null
          organization_id: number
          title: string
          updated_at?: string
        }
        Update: {
          artist?: string | null
          chords?: string | null
          created_at?: string
          id?: number
          lyrics?: string | null
          organization_id?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_team_positions: {
        Row: {
          application_user_id: number
          created_at: string
          id: number
          team_position_id: number
          updated_at: string
        }
        Insert: {
          application_user_id: number
          created_at?: string
          id?: number
          team_position_id: number
          updated_at?: string
        }
        Update: {
          application_user_id?: number
          created_at?: string
          id?: number
          team_position_id?: number
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
          },
        ]
      }
      organization_teams: {
        Row: {
          created_at: string
          id: number
          name: string
          organization_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          organization_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          organization_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: number
          max_storage_gb: number
          max_users: number
          name: string
          owner_id: number
          subscription_plan: Database["public"]["Enums"]["subscription_plan_enum"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          max_storage_gb: number
          max_users: number
          name: string
          owner_id: number
          subscription_plan: Database["public"]["Enums"]["subscription_plan_enum"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          max_storage_gb?: number
          max_users?: number
          name?: string
          owner_id?: number
          subscription_plan?: Database["public"]["Enums"]["subscription_plan_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "application_users"
            referencedColumns: ["id"]
          },
        ]
      }
      team_positions: {
        Row: {
          created_at: string
          id: number
          name: string
          organization_team_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          organization_team_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          organization_team_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_positions_organization_team_id_fkey"
            columns: ["organization_team_id"]
            isOneToOne: false
            referencedRelation: "organization_teams"
            referencedColumns: ["id"]
          },
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
      event_status_enum: "Scheduled" | "Cancelled" | "Completed" | "Draft"
      subscription_plan_enum: "Free" | "Basic" | "Premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_status_enum: ["Scheduled", "Cancelled", "Completed", "Draft"],
      subscription_plan_enum: ["Free", "Basic", "Premium"],
    },
  },
} as const
