export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          audiometry_id: string | null
          company_id: string
          created_at: string
          details: string | null
          id: string
          severity: string
          status: string
          title: string
          type: string
          updated_at: string
          worker_id: string | null
        }
        Insert: {
          audiometry_id?: string | null
          company_id: string
          created_at?: string
          details?: string | null
          id?: string
          severity?: string
          status?: string
          title: string
          type: string
          updated_at?: string
          worker_id?: string | null
        }
        Update: {
          audiometry_id?: string | null
          company_id?: string
          created_at?: string
          details?: string | null
          id?: string
          severity?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_audiometry_id_fkey"
            columns: ["audiometry_id"]
            isOneToOne: false
            referencedRelation: "audiometries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_audiometry_id_fkey"
            columns: ["audiometry_id"]
            isOneToOne: false
            referencedRelation: "latest_audiometry_per_worker"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_audiometry_id_fkey"
            columns: ["audiometry_id"]
            isOneToOne: false
            referencedRelation: "workers_risk_summary"
            referencedColumns: ["latest_audiometry_id"]
          },
          {
            foreignKeyName: "alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers_risk_summary"
            referencedColumns: ["worker_id"]
          },
        ]
      }
      audiometries: {
        Row: {
          analysis_result: string | null
          audiogram_type: string
          classification: string | null
          company_id: string
          created_at: string
          created_by: string | null
          discomfort_flags: Json | null
          discomfort_thresholds: Json | null
          exam_date: string
          exam_reason: string
          flags: Json | null
          id: string
          masked: Json | null
          observations: string | null
          report_generated: boolean
          report_url: string | null
          thresholds: Json
          updated_at: string
          worker_id: string
        }
        Insert: {
          analysis_result?: string | null
          audiogram_type?: string
          classification?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          discomfort_flags?: Json | null
          discomfort_thresholds?: Json | null
          exam_date: string
          exam_reason: string
          flags?: Json | null
          id?: string
          masked?: Json | null
          observations?: string | null
          report_generated?: boolean
          report_url?: string | null
          thresholds?: Json
          updated_at?: string
          worker_id: string
        }
        Update: {
          analysis_result?: string | null
          audiogram_type?: string
          classification?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          discomfort_flags?: Json | null
          discomfort_thresholds?: Json | null
          exam_date?: string
          exam_reason?: string
          flags?: Json | null
          id?: string
          masked?: Json | null
          observations?: string | null
          report_generated?: boolean
          report_url?: string | null
          thresholds?: Json
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audiometries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiometries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiometries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers_risk_summary"
            referencedColumns: ["worker_id"]
          },
        ]
      }
      audiometry_comparisons: {
        Row: {
          base_audiometry_id: string
          company_id: string
          compare_audiometry_id: string
          computed_at: string
          created_at: string
          deltas: Json
          id: string
          summary: Json
          worker_id: string
        }
        Insert: {
          base_audiometry_id: string
          company_id: string
          compare_audiometry_id: string
          computed_at?: string
          created_at?: string
          deltas?: Json
          id?: string
          summary?: Json
          worker_id: string
        }
        Update: {
          base_audiometry_id?: string
          company_id?: string
          compare_audiometry_id?: string
          computed_at?: string
          created_at?: string
          deltas?: Json
          id?: string
          summary?: Json
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audiometry_comparisons_base_audiometry_id_fkey"
            columns: ["base_audiometry_id"]
            isOneToOne: false
            referencedRelation: "audiometries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiometry_comparisons_base_audiometry_id_fkey"
            columns: ["base_audiometry_id"]
            isOneToOne: false
            referencedRelation: "latest_audiometry_per_worker"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiometry_comparisons_base_audiometry_id_fkey"
            columns: ["base_audiometry_id"]
            isOneToOne: false
            referencedRelation: "workers_risk_summary"
            referencedColumns: ["latest_audiometry_id"]
          },
          {
            foreignKeyName: "audiometry_comparisons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiometry_comparisons_compare_audiometry_id_fkey"
            columns: ["compare_audiometry_id"]
            isOneToOne: false
            referencedRelation: "audiometries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiometry_comparisons_compare_audiometry_id_fkey"
            columns: ["compare_audiometry_id"]
            isOneToOne: false
            referencedRelation: "latest_audiometry_per_worker"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiometry_comparisons_compare_audiometry_id_fkey"
            columns: ["compare_audiometry_id"]
            isOneToOne: false
            referencedRelation: "workers_risk_summary"
            referencedColumns: ["latest_audiometry_id"]
          },
          {
            foreignKeyName: "audiometry_comparisons_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiometry_comparisons_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers_risk_summary"
            referencedColumns: ["worker_id"]
          },
        ]
      }
      companies: {
        Row: {
          address_json: Json | null
          cnpj: string | null
          created_at: string
          created_by: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          owner_id: string | null
          phone: string | null
          trade_name: string | null
          updated_at: string
        }
        Insert: {
          address_json?: Json | null
          cnpj?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          owner_id?: string | null
          phone?: string | null
          trade_name?: string | null
          updated_at?: string
        }
        Update: {
          address_json?: Json | null
          cnpj?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          owner_id?: string | null
          phone?: string | null
          trade_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ghes: {
        Row: {
          code: string | null
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          main_risk: string | null
          name: string
          noise_db: number | null
          notes: string | null
          sector: string | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          main_risk?: string | null
          name: string
          noise_db?: number | null
          notes?: string | null
          sector?: string | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          main_risk?: string | null
          name?: string
          noise_db?: number | null
          notes?: string | null
          sector?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ghes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_roles: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      pca_settings: {
        Row: {
          any_freq_shift_db: number
          avg_freqs: number[]
          avg_shift_db: number
          baseline_strategy: string
          company_id: string
          compare_mode: string
          created_at: string
          high_severity_any_freq_db: number
          high_severity_avg_db: number
          id: string
          nr_counts_as_shift: boolean
          updated_at: string
        }
        Insert: {
          any_freq_shift_db?: number
          avg_freqs?: number[]
          avg_shift_db?: number
          baseline_strategy?: string
          company_id: string
          compare_mode?: string
          created_at?: string
          high_severity_any_freq_db?: number
          high_severity_avg_db?: number
          id?: string
          nr_counts_as_shift?: boolean
          updated_at?: string
        }
        Update: {
          any_freq_shift_db?: number
          avg_freqs?: number[]
          avg_shift_db?: number
          baseline_strategy?: string
          company_id?: string
          compare_mode?: string
          created_at?: string
          high_severity_any_freq_db?: number
          high_severity_avg_db?: number
          id?: string
          nr_counts_as_shift?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pca_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      workers: {
        Row: {
          address_json: Json | null
          admission_date: string | null
          birth_date: string | null
          company_id: string
          cpf: string | null
          created_at: string
          email: string | null
          ghe_id: string | null
          id: string
          job_role_id: string | null
          name: string
          notes: string | null
          phone: string | null
          registration: string | null
          sex: string | null
          status: string
          termination_date: string | null
          updated_at: string
        }
        Insert: {
          address_json?: Json | null
          admission_date?: string | null
          birth_date?: string | null
          company_id: string
          cpf?: string | null
          created_at?: string
          email?: string | null
          ghe_id?: string | null
          id?: string
          job_role_id?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          registration?: string | null
          sex?: string | null
          status?: string
          termination_date?: string | null
          updated_at?: string
        }
        Update: {
          address_json?: Json | null
          admission_date?: string | null
          birth_date?: string | null
          company_id?: string
          cpf?: string | null
          created_at?: string
          email?: string | null
          ghe_id?: string | null
          id?: string
          job_role_id?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          registration?: string | null
          sex?: string | null
          status?: string
          termination_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workers_ghe_id_fkey"
            columns: ["ghe_id"]
            isOneToOne: false
            referencedRelation: "ghes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workers_ghe_id_fkey"
            columns: ["ghe_id"]
            isOneToOne: false
            referencedRelation: "workers_risk_summary"
            referencedColumns: ["ghe_id"]
          },
          {
            foreignKeyName: "workers_job_role_id_fkey"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workers_job_role_id_fkey"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "workers_risk_summary"
            referencedColumns: ["job_role_id"]
          },
        ]
      }
    }
    Views: {
      latest_audiometry_per_worker: {
        Row: {
          analysis_result: string | null
          audiogram_type: string | null
          classification: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          discomfort_flags: Json | null
          discomfort_thresholds: Json | null
          exam_date: string | null
          exam_reason: string | null
          flags: Json | null
          id: string | null
          masked: Json | null
          observations: string | null
          report_generated: boolean | null
          report_url: string | null
          thresholds: Json | null
          updated_at: string | null
          worker_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audiometries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiometries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiometries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers_risk_summary"
            referencedColumns: ["worker_id"]
          },
        ]
      }
      workers_risk_summary: {
        Row: {
          company_id: string | null
          ghe_code: string | null
          ghe_id: string | null
          ghe_main_risk: string | null
          ghe_name: string | null
          has_recent_shift: boolean | null
          job_role_id: string | null
          job_role_name: string | null
          last_comparison_at: string | null
          latest_analysis_result: string | null
          latest_audiometry_id: string | null
          latest_classification: string | null
          latest_exam_date: string | null
          latest_exam_reason: string | null
          max_open_alert_severity: string | null
          open_alerts_count: number | null
          risk_level: string | null
          worker_id: string | null
          worker_name: string | null
          worker_registration: string | null
          worker_status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      compute_audiometry_comparison: {
        Args: { p_audiometry_id: string }
        Returns: undefined
      }
      is_company_admin: { Args: { p_company_id: string }; Returns: boolean }
      is_company_member: { Args: { p_company_id: string }; Returns: boolean }
      jsonb_flag_true: {
        Args: { flags: Json; group_key: string; key: string }
        Returns: boolean
      }
      jsonb_num: { Args: { j: Json; k: string }; Returns: number }
      validate_audiometry_flags: { Args: { flags: Json }; Returns: boolean }
      validate_audiometry_thresholds: { Args: { th: Json }; Returns: boolean }
      validate_discomfort_thresholds: { Args: { th: Json }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
