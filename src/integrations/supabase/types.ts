export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      calculos_inventario: {
        Row: {
          alertas: Json | null
          comparacao: Json | null
          created_at: string | null
          custo_custas: number
          custo_honorarios: number
          custo_itcmd: number
          custo_total: number
          detalhamento: Json | null
          dividas_espolio: number | null
          estado: string
          id: string
          insights: Json | null
          numero_herdeiros: number | null
          patrimonio: number
          percentual_sobre_patrimonio: number | null
          profile_id: string | null
          tem_litigio: boolean | null
          tem_menores_incapazes: boolean | null
          tem_testamento: boolean | null
          tempo_estimado: string | null
          tipo_processo: string
          valor_imoveis: number | null
          valor_investimentos: number | null
          valor_outros_bens: number | null
          valor_veiculos: number | null
        }
        Insert: {
          alertas?: Json | null
          comparacao?: Json | null
          created_at?: string | null
          custo_custas: number
          custo_honorarios: number
          custo_itcmd: number
          custo_total: number
          detalhamento?: Json | null
          dividas_espolio?: number | null
          estado: string
          id?: string
          insights?: Json | null
          numero_herdeiros?: number | null
          patrimonio: number
          percentual_sobre_patrimonio?: number | null
          profile_id?: string | null
          tem_litigio?: boolean | null
          tem_menores_incapazes?: boolean | null
          tem_testamento?: boolean | null
          tempo_estimado?: string | null
          tipo_processo: string
          valor_imoveis?: number | null
          valor_investimentos?: number | null
          valor_outros_bens?: number | null
          valor_veiculos?: number | null
        }
        Update: {
          alertas?: Json | null
          comparacao?: Json | null
          created_at?: string | null
          custo_custas?: number
          custo_honorarios?: number
          custo_itcmd?: number
          custo_total?: number
          detalhamento?: Json | null
          dividas_espolio?: number | null
          estado?: string
          id?: string
          insights?: Json | null
          numero_herdeiros?: number | null
          patrimonio?: number
          percentual_sobre_patrimonio?: number | null
          profile_id?: string | null
          tem_litigio?: boolean | null
          tem_menores_incapazes?: boolean | null
          tem_testamento?: boolean | null
          tempo_estimado?: string | null
          tipo_processo?: string
          valor_imoveis?: number | null
          valor_investimentos?: number | null
          valor_outros_bens?: number | null
          valor_veiculos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calculos_inventario_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calculos_refinados: {
        Row: {
          ajustes: Json | null
          calculo_original_id: string | null
          comparativo: Json | null
          created_at: string | null
          id: string
          isencoes: Json | null
          patrimonio_liquido: number | null
          tem_litigio_refinado: boolean | null
          total_refinado: number
        }
        Insert: {
          ajustes?: Json | null
          calculo_original_id?: string | null
          comparativo?: Json | null
          created_at?: string | null
          id?: string
          isencoes?: Json | null
          patrimonio_liquido?: number | null
          tem_litigio_refinado?: boolean | null
          total_refinado: number
        }
        Update: {
          ajustes?: Json | null
          calculo_original_id?: string | null
          comparativo?: Json | null
          created_at?: string | null
          id?: string
          isencoes?: Json | null
          patrimonio_liquido?: number | null
          tem_litigio_refinado?: boolean | null
          total_refinado?: number
        }
        Relationships: [
          {
            foreignKeyName: "calculos_refinados_calculo_original_id_fkey"
            columns: ["calculo_original_id"]
            isOneToOne: false
            referencedRelation: "calculos_inventario"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_consultas: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          profile_id: string | null
          tipo_calculadora: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          profile_id?: string | null
          tipo_calculadora: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          profile_id?: string | null
          tipo_calculadora?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_consultas_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          data_ativacao: string | null
          email: string
          id: string
          nome: string
          produto: string | null
          senha_hash: string | null
          token_definicao_senha: string | null
          token_gerado_em: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          data_ativacao?: string | null
          email: string
          id?: string
          nome: string
          produto?: string | null
          senha_hash?: string | null
          token_definicao_senha?: string | null
          token_gerado_em?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          data_ativacao?: string | null
          email?: string
          id?: string
          nome?: string
          produto?: string | null
          senha_hash?: string | null
          token_definicao_senha?: string | null
          token_gerado_em?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gerar_token_seguro: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      hash_password_pbkdf2: {
        Args: { password: string }
        Returns: string
      }
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
