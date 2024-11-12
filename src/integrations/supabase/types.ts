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
      api_cache: {
        Row: {
          created_at: string
          data: Json
          expires_at: string
          key: string
        }
        Insert: {
          created_at?: string
          data: Json
          expires_at: string
          key: string
        }
        Update: {
          created_at?: string
          data?: Json
          expires_at?: string
          key?: string
        }
        Relationships: []
      }
      gift_conversations: {
        Row: {
          conversation_thread_id: string
          created_at: string
          id: string
          message: string
          message_type: Database["public"]["Enums"]["question_type"]
          parent_message_id: string | null
          user_id: string | null
        }
        Insert: {
          conversation_thread_id: string
          created_at?: string
          id?: string
          message: string
          message_type: Database["public"]["Enums"]["question_type"]
          parent_message_id?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_thread_id?: string
          created_at?: string
          id?: string
          message?: string
          message_type?: Database["public"]["Enums"]["question_type"]
          parent_message_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_conversations_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "gift_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          api_endpoint: string | null
          api_version: string | null
          commission_rate: number | null
          created_at: string
          id: string
          is_enabled: boolean | null
          platform: Database["public"]["Enums"]["platform_type"]
          settings: Json | null
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          api_version?: string | null
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          platform: Database["public"]["Enums"]["platform_type"]
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          api_version?: string | null
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          platform?: Database["public"]["Enums"]["platform_type"]
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      premium_users: {
        Row: {
          created_at: string
          daily_question_count: number | null
          id: string
          is_premium: boolean | null
          last_question_date: string | null
          premium_since: string
          premium_until: string
        }
        Insert: {
          created_at?: string
          daily_question_count?: number | null
          id: string
          is_premium?: boolean | null
          last_question_date?: string | null
          premium_since?: string
          premium_until?: string
        }
        Update: {
          created_at?: string
          daily_question_count?: number | null
          id?: string
          is_premium?: boolean | null
          last_question_date?: string | null
          premium_since?: string
          premium_until?: string
        }
        Relationships: []
      }
      product_recommendations: {
        Row: {
          created_at: string
          id: string
          platform: Database["public"]["Enums"]["platform_type"]
          platform_specific_data: Json | null
          price: number | null
          product_name: string
          product_url: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          platform: Database["public"]["Enums"]["platform_type"]
          platform_specific_data?: Json | null
          price?: number | null
          product_name: string
          product_url: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          platform_specific_data?: Json | null
          price?: number | null
          product_name?: string
          product_url?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      saved_gift_items: {
        Row: {
          ai_reasoning: string | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          list_id: string
          name: string
          price: string | null
          retailer: string | null
          status: Database["public"]["Enums"]["gift_item_status"] | null
          updated_at: string
          url: string | null
        }
        Insert: {
          ai_reasoning?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          list_id: string
          name: string
          price?: string | null
          retailer?: string | null
          status?: Database["public"]["Enums"]["gift_item_status"] | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          ai_reasoning?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          list_id?: string
          name?: string
          price?: string | null
          retailer?: string | null
          status?: Database["public"]["Enums"]["gift_item_status"] | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_gift_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "gift_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_gift_searches: {
        Row: {
          budget: number
          created_at: string
          description: string
          id: string
          occasion: string
          recipient_name: string
          status: Database["public"]["Enums"]["search_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget: number
          created_at?: string
          description: string
          id?: string
          occasion: string
          recipient_name: string
          status?: Database["public"]["Enums"]["search_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number
          created_at?: string
          description?: string
          id?: string
          occasion?: string
          recipient_name?: string
          status?: Database["public"]["Enums"]["search_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scraped_products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          last_checked_at: string
          price: number
          product_name: string
          product_url: string
          store_sku: string | null
          store_type: Database["public"]["Enums"]["store_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          last_checked_at?: string
          price: number
          product_name: string
          product_url: string
          store_sku?: string | null
          store_type: Database["public"]["Enums"]["store_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          last_checked_at?: string
          price?: number
          product_name?: string
          product_url?: string
          store_sku?: string | null
          store_type?: Database["public"]["Enums"]["store_type"]
          updated_at?: string
        }
        Relationships: []
      }
      store_availability: {
        Row: {
          id: string
          in_stock: boolean
          last_checked_at: string
          product_id: string | null
          quantity: number | null
          store_location: Json
        }
        Insert: {
          id?: string
          in_stock: boolean
          last_checked_at?: string
          product_id?: string | null
          quantity?: number | null
          store_location: Json
        }
        Update: {
          id?: string
          in_stock?: boolean
          last_checked_at?: string
          product_id?: string | null
          quantity?: number | null
          store_location?: Json
        }
        Relationships: [
          {
            foreignKeyName: "store_availability_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "scraped_products"
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
      gift_item_status: "saved" | "purchased" | "archived"
      platform_type: "amazon" | "etsy" | "walmart" | "bestbuy"
      question_type: "user_question" | "ai_response"
      search_status: "active" | "archived"
      store_type: "target" | "walmart" | "bestbuy"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
