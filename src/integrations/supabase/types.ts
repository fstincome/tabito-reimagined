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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_track_points: {
        Row: {
          accuracy: number | null
          created_at: string
          id: string
          latitude: number
          longitude: number
          recorded_at: string
          speed: number | null
          track_id: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
          speed?: number | null
          track_id: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
          speed?: number | null
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_track_points_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "admin_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_tracks: {
        Row: {
          created_at: string
          distance_m: number
          end_label: string | null
          end_lat: number | null
          end_lng: number | null
          ended_at: string | null
          id: string
          label: string | null
          notes: string | null
          start_label: string | null
          start_lat: number | null
          start_lng: number | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          distance_m?: number
          end_label?: string | null
          end_lat?: number | null
          end_lng?: number | null
          ended_at?: string | null
          id?: string
          label?: string | null
          notes?: string | null
          start_label?: string | null
          start_lat?: number | null
          start_lng?: number | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          distance_m?: number
          end_label?: string | null
          end_lat?: number | null
          end_lng?: number | null
          ended_at?: string | null
          id?: string
          label?: string | null
          notes?: string | null
          start_label?: string | null
          start_lat?: number | null
          start_lng?: number | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          content: string | null
          content_en: string | null
          created_at: string
          excerpt: string | null
          excerpt_en: string | null
          id: string
          image_url: string | null
          published: boolean
          published_at: string | null
          slug: string | null
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          content_en?: string | null
          created_at?: string
          excerpt?: string | null
          excerpt_en?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string | null
          slug?: string | null
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string | null
          content_en?: string | null
          created_at?: string
          excerpt?: string | null
          excerpt_en?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string | null
          slug?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          category: string
          created_at: string
          departure_point: string | null
          email: string
          handled: boolean
          id: string
          item_id: string | null
          item_label: string | null
          message: string | null
          name: string
          people: number | null
          phone: string | null
          return_date: string | null
          status: string
          travel_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          departure_point?: string | null
          email: string
          handled?: boolean
          id?: string
          item_id?: string | null
          item_label?: string | null
          message?: string | null
          name: string
          people?: number | null
          phone?: string | null
          return_date?: string | null
          status?: string
          travel_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          departure_point?: string | null
          email?: string
          handled?: boolean
          id?: string
          item_id?: string | null
          item_label?: string | null
          message?: string | null
          name?: string
          people?: number | null
          phone?: string | null
          return_date?: string | null
          status?: string
          travel_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          description: string | null
          description_en: string | null
          highlights: Json
          highlights_en: Json
          id: string
          image_url: string | null
          name: string
          name_en: string | null
          province: string | null
          published: boolean
          sort_order: number
          summary: string | null
          summary_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          highlights?: Json
          highlights_en?: Json
          id?: string
          image_url?: string | null
          name: string
          name_en?: string | null
          province?: string | null
          published?: boolean
          sort_order?: number
          summary?: string | null
          summary_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          highlights?: Json
          highlights_en?: Json
          id?: string
          image_url?: string | null
          name?: string
          name_en?: string | null
          province?: string | null
          published?: boolean
          sort_order?: number
          summary?: string | null
          summary_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          handled: boolean
          id: string
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      destinations: {
        Row: {
          categorie: string | null
          categorie_en: string | null
          created_at: string
          description: string | null
          description_en: string | null
          gallery: Json
          id: string
          image_url: string | null
          name: string
          name_en: string | null
          published: boolean
          sort_order: number
          summary: string | null
          summary_en: string | null
          updated_at: string
        }
        Insert: {
          categorie?: string | null
          categorie_en?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          gallery?: Json
          id?: string
          image_url?: string | null
          name: string
          name_en?: string | null
          published?: boolean
          sort_order?: number
          summary?: string | null
          summary_en?: string | null
          updated_at?: string
        }
        Update: {
          categorie?: string | null
          categorie_en?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          gallery?: Json
          id?: string
          image_url?: string | null
          name?: string
          name_en?: string | null
          published?: boolean
          sort_order?: number
          summary?: string | null
          summary_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          description_en: string | null
          end_date: string | null
          id: string
          image_url: string | null
          place: string | null
          place_en: string | null
          published: boolean
          start_date: string | null
          status: string
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          place?: string | null
          place_en?: string | null
          published?: boolean
          start_date?: string | null
          status?: string
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          place?: string | null
          place_en?: string | null
          published?: boolean
          start_date?: string | null
          status?: string
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          categorie: string | null
          categorie_en: string | null
          created_at: string
          id: string
          image_url: string
          published: boolean
          sort_order: number
          title: string | null
          title_en: string | null
          updated_at: string
        }
        Insert: {
          categorie?: string | null
          categorie_en?: string | null
          created_at?: string
          id?: string
          image_url: string
          published?: boolean
          sort_order?: number
          title?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          categorie?: string | null
          categorie_en?: string | null
          created_at?: string
          id?: string
          image_url?: string
          published?: boolean
          sort_order?: number
          title?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      guides: {
        Row: {
          created_at: string
          id: string
          languages: string | null
          languages_en: string | null
          name: string
          phone: string | null
          photo_url: string | null
          published: boolean
          sort_order: number
          speciality: string | null
          speciality_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          languages?: string | null
          languages_en?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          published?: boolean
          sort_order?: number
          speciality?: string | null
          speciality_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          languages?: string | null
          languages_en?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          published?: boolean
          sort_order?: number
          speciality?: string | null
          speciality_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          audience: string
          body: string | null
          created_at: string
          id: string
          kind: string
          link: string | null
          read: boolean
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          audience?: string
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read?: boolean
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          audience?: string
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read?: boolean
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          created_at: string
          deadline: string | null
          description: string | null
          description_en: string | null
          file_url: string | null
          id: string
          image_url: string | null
          kind: string
          link: string | null
          organisation: string | null
          organisation_en: string | null
          published: boolean
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          description_en?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          link?: string | null
          organisation?: string | null
          organisation_en?: string | null
          published?: boolean
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          description_en?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          kind?: string
          link?: string | null
          organisation?: string | null
          organisation_en?: string | null
          published?: boolean
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          created_at: string
          description: string | null
          description_en: string | null
          duration: string | null
          duration_en: string | null
          highlights: Json
          highlights_en: Json
          id: string
          image_url: string | null
          price: string | null
          price_en: string | null
          published: boolean
          sort_order: number
          title: string
          title_en: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          duration?: string | null
          duration_en?: string | null
          highlights?: Json
          highlights_en?: Json
          id?: string
          image_url?: string | null
          price?: string | null
          price_en?: string | null
          published?: boolean
          sort_order?: number
          title: string
          title_en?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          duration?: string | null
          duration_en?: string | null
          highlights?: Json
          highlights_en?: Json
          id?: string
          image_url?: string | null
          price?: string | null
          price_en?: string | null
          published?: boolean
          sort_order?: number
          title?: string
          title_en?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          body: string | null
          body_en: string | null
          created_at: string
          hero_image_url: string | null
          id: string
          slug: string
          subtitle: string | null
          subtitle_en: string | null
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          body_en?: string | null
          created_at?: string
          hero_image_url?: string | null
          id?: string
          slug: string
          subtitle?: string | null
          subtitle_en?: string | null
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          body_en?: string | null
          created_at?: string
          hero_image_url?: string | null
          id?: string
          slug?: string
          subtitle?: string | null
          subtitle_en?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          description_en: string | null
          id: string
          logo_url: string | null
          name: string
          published: boolean
          sort_order: number
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          logo_url?: string | null
          name: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          description_en: string | null
          icon: string
          id: string
          published: boolean
          sort_order: number
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          icon?: string
          id?: string
          published?: boolean
          sort_order?: number
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          icon?: string
          id?: string
          published?: boolean
          sort_order?: number
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sites: {
        Row: {
          categorie: string | null
          categorie_en: string | null
          commune: string | null
          created_at: string
          description: string | null
          description_en: string | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          nom_site: string
          nom_site_en: string | null
          province: string | null
          published: boolean
          updated_at: string
        }
        Insert: {
          categorie?: string | null
          categorie_en?: string | null
          commune?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          nom_site: string
          nom_site_en?: string | null
          province?: string | null
          published?: boolean
          updated_at?: string
        }
        Update: {
          categorie?: string | null
          categorie_en?: string | null
          commune?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          nom_site?: string
          nom_site_en?: string | null
          province?: string | null
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      slides: {
        Row: {
          created_at: string
          cta_label: string | null
          cta_label_en: string | null
          cta_link: string | null
          id: string
          image_url: string | null
          published: boolean
          sort_order: number
          subtitle: string | null
          subtitle_en: string | null
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          cta_label_en?: string | null
          cta_link?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
          subtitle?: string | null
          subtitle_en?: string | null
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          cta_label_en?: string | null
          cta_link?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
          subtitle?: string | null
          subtitle_en?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          bio_en: string | null
          created_at: string
          facebook: string | null
          groupe: string
          id: string
          linkedin: string | null
          name: string
          photo_url: string | null
          published: boolean
          role_title: string | null
          role_title_en: string | null
          sort_order: number
          twitter: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          bio_en?: string | null
          created_at?: string
          facebook?: string | null
          groupe?: string
          id?: string
          linkedin?: string | null
          name: string
          photo_url?: string | null
          published?: boolean
          role_title?: string | null
          role_title_en?: string | null
          sort_order?: number
          twitter?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          bio_en?: string | null
          created_at?: string
          facebook?: string | null
          groupe?: string
          id?: string
          linkedin?: string | null
          name?: string
          photo_url?: string | null
          published?: boolean
          role_title?: string | null
          role_title_en?: string | null
          sort_order?: number
          twitter?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          created_at: string
          id: string
          message: string
          message_en: string | null
          photo_url: string | null
          published: boolean
          rating: number
          role_title: string | null
          role_title_en: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          message: string
          message_en?: string | null
          photo_url?: string | null
          published?: boolean
          rating?: number
          role_title?: string | null
          role_title_en?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          message?: string
          message_en?: string | null
          photo_url?: string | null
          published?: boolean
          rating?: number
          role_title?: string | null
          role_title_en?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
