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
      admin_access_requests: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          reason: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["admin_request_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          reason: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["admin_request_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          reason?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["admin_request_status"]
          user_id?: string
        }
        Relationships: []
      }
      ai_admin_tasks: {
        Row: {
          created_at: string
          created_by: string | null
          family_id: string | null
          id: string
          prompt: string
          result: string | null
          status: string
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          family_id?: string | null
          id?: string
          prompt: string
          result?: string | null
          status?: string
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          family_id?: string | null
          id?: string
          prompt?: string
          result?: string | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_admin_tasks_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insights: {
        Row: {
          child_id: string | null
          created_at: string
          created_for_user_id: string | null
          family_id: string | null
          generated_by: string
          id: string
          insight_type: string
          resolved_at: string | null
          severity: string
          status: string
          summary: string
          title: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string
          created_for_user_id?: string | null
          family_id?: string | null
          generated_by?: string
          id?: string
          insight_type: string
          resolved_at?: string | null
          severity?: string
          status?: string
          summary: string
          title: string
        }
        Update: {
          child_id?: string | null
          created_at?: string
          created_for_user_id?: string | null
          family_id?: string | null
          generated_by?: string
          id?: string
          insight_type?: string
          resolved_at?: string | null
          severity?: string
          status?: string
          summary?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_receipts: {
        Row: {
          acknowledged_at: string | null
          announcement_id: string
          created_at: string
          family_id: string | null
          id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          announcement_id: string
          created_at?: string
          family_id?: string | null
          id?: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          announcement_id?: string
          created_at?: string
          family_id?: string | null
          id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_receipts_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcement_receipts_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          active: boolean
          audience: Database["public"]["Enums"]["announcement_audience"]
          body_en: string | null
          body_gr: string
          class_id: string | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          important: boolean
          parent_user_id: string | null
          publish_at: string
          title_en: string | null
          title_gr: string
        }
        Insert: {
          active?: boolean
          audience?: Database["public"]["Enums"]["announcement_audience"]
          body_en?: string | null
          body_gr: string
          class_id?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          important?: boolean
          parent_user_id?: string | null
          publish_at?: string
          title_en?: string | null
          title_gr: string
        }
        Update: {
          active?: boolean
          audience?: Database["public"]["Enums"]["announcement_audience"]
          body_en?: string | null
          body_gr?: string
          class_id?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          important?: boolean
          parent_user_id?: string | null
          publish_at?: string
          title_en?: string | null
          title_gr?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          absence_reason: string | null
          arrival_status: string
          check_in: string | null
          check_out: string | null
          checkout_alert: boolean
          child_id: string
          created_at: string
          date: string
          id: string
          notes: string | null
          pickup_person_name: string | null
          pickup_validated: boolean
          recorded_by: string | null
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Insert: {
          absence_reason?: string | null
          arrival_status?: string
          check_in?: string | null
          check_out?: string | null
          checkout_alert?: boolean
          child_id: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          pickup_person_name?: string | null
          pickup_validated?: boolean
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Update: {
          absence_reason?: string | null
          arrival_status?: string
          check_in?: string | null
          check_out?: string | null
          checkout_alert?: boolean
          child_id?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          pickup_person_name?: string | null
          pickup_validated?: boolean
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "attendance_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_table: string
          id: string
          metadata: Json
          summary: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_table: string
          id?: string
          metadata?: Json
          summary?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_table?: string
          id?: string
          metadata?: Json
          summary?: string | null
        }
        Relationships: []
      }
      branches: {
        Row: {
          active: boolean
          address: string | null
          created_at: string
          id: string
          name_en: string | null
          name_gr: string
          operating_hours: string | null
          phone: string | null
          pickup_windows: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          created_at?: string
          id?: string
          name_en?: string | null
          name_gr: string
          operating_hours?: string | null
          phone?: string | null
          pickup_windows?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          created_at?: string
          id?: string
          name_en?: string | null
          name_gr?: string
          operating_hours?: string | null
          phone?: string | null
          pickup_windows?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      budget_categories: {
        Row: {
          active: boolean
          category_type: string
          created_at: string
          id: string
          name_en: string | null
          name_gr: string
          parent_category_id: string | null
        }
        Insert: {
          active?: boolean
          category_type?: string
          created_at?: string
          id?: string
          name_en?: string | null
          name_gr: string
          parent_category_id?: string | null
        }
        Update: {
          active?: boolean
          category_type?: string
          created_at?: string
          id?: string
          name_en?: string | null
          name_gr?: string
          parent_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_lines: {
        Row: {
          actual_amount: number
          alert_threshold: number | null
          budget_id: string
          category_id: string | null
          created_at: string
          forecast_amount: number
          id: string
          month_date: string | null
          updated_at: string
          variance_notes: string | null
        }
        Insert: {
          actual_amount?: number
          alert_threshold?: number | null
          budget_id: string
          category_id?: string | null
          created_at?: string
          forecast_amount?: number
          id?: string
          month_date?: string | null
          updated_at?: string
          variance_notes?: string | null
        }
        Update: {
          actual_amount?: number
          alert_threshold?: number | null
          budget_id?: string
          category_id?: string | null
          created_at?: string
          forecast_amount?: number
          id?: string
          month_date?: string | null
          updated_at?: string
          variance_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_lines_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_lines_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          created_at: string
          ends_on: string
          id: string
          notes: string | null
          period_type: string
          school_year_id: string | null
          starts_on: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_on: string
          id?: string
          notes?: string | null
          period_type?: string
          school_year_id?: string | null
          starts_on: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_on?: string
          id?: string
          notes?: string | null
          period_type?: string
          school_year_id?: string | null
          starts_on?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          language: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          language?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          language?: string
          role?: string
          session_id?: string
        }
        Relationships: []
      }
      child_progress_notes: {
        Row: {
          body: string | null
          child_id: string
          created_at: string
          created_by: string | null
          id: string
          note_type: string
          school_year_id: string | null
          title: string
          visible_to_parent: boolean
        }
        Insert: {
          body?: string | null
          child_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          note_type?: string
          school_year_id?: string | null
          title: string
          visible_to_parent?: boolean
        }
        Update: {
          body?: string | null
          child_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          note_type?: string
          school_year_id?: string | null
          title?: string
          visible_to_parent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "child_progress_notes_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_progress_notes_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
        ]
      }
      child_school_year_enrollments: {
        Row: {
          adaptation_status: string
          child_id: string
          class_id: string | null
          created_at: string
          enrollment_date: string | null
          enrollment_status: string
          id: string
          notes: string | null
          school_year_id: string
          tuition_plan_id: string | null
          updated_at: string
        }
        Insert: {
          adaptation_status?: string
          child_id: string
          class_id?: string | null
          created_at?: string
          enrollment_date?: string | null
          enrollment_status?: string
          id?: string
          notes?: string | null
          school_year_id: string
          tuition_plan_id?: string | null
          updated_at?: string
        }
        Update: {
          adaptation_status?: string
          child_id?: string
          class_id?: string | null
          created_at?: string
          enrollment_date?: string | null
          enrollment_status?: string
          id?: string
          notes?: string | null
          school_year_id?: string
          tuition_plan_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_school_year_enrollments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_school_year_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_school_year_enrollments_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_school_year_enrollments_tuition_plan_id_fkey"
            columns: ["tuition_plan_id"]
            isOneToOne: false
            referencedRelation: "tuition_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          allergies: string | null
          authorized_pickup: string | null
          class_id: string | null
          created_at: string
          dob: string
          food_restrictions: string | null
          full_name: string
          health_notes: string | null
          id: string
          medication_notes: string | null
          notes: string | null
          photo_consent: boolean
          status: Database["public"]["Enums"]["child_status"]
          updated_at: string
        }
        Insert: {
          allergies?: string | null
          authorized_pickup?: string | null
          class_id?: string | null
          created_at?: string
          dob: string
          food_restrictions?: string | null
          full_name: string
          health_notes?: string | null
          id?: string
          medication_notes?: string | null
          notes?: string | null
          photo_consent?: boolean
          status?: Database["public"]["Enums"]["child_status"]
          updated_at?: string
        }
        Update: {
          allergies?: string | null
          authorized_pickup?: string | null
          class_id?: string | null
          created_at?: string
          dob?: string
          food_restrictions?: string | null
          full_name?: string
          health_notes?: string | null
          id?: string
          medication_notes?: string | null
          notes?: string | null
          photo_consent?: boolean
          status?: Database["public"]["Enums"]["child_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_school_years: {
        Row: {
          branch_id: string | null
          capacity: number
          class_id: string
          created_at: string
          id: string
          ratio_children_per_teacher: number
          room_id: string | null
          schedule_notes: string | null
          school_year_id: string
          status: string
        }
        Insert: {
          branch_id?: string | null
          capacity?: number
          class_id: string
          created_at?: string
          id?: string
          ratio_children_per_teacher?: number
          room_id?: string | null
          schedule_notes?: string | null
          school_year_id: string
          status?: string
        }
        Update: {
          branch_id?: string | null
          capacity?: number
          class_id?: string
          created_at?: string
          id?: string
          ratio_children_per_teacher?: number
          room_id?: string | null
          schedule_notes?: string | null
          school_year_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_school_years_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_school_years_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_school_years_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_school_years_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          active: boolean
          age_max: number
          age_min: number
          capacity: number
          created_at: string
          id: string
          name_en: string
          name_gr: string
          teacher_id: string | null
        }
        Insert: {
          active?: boolean
          age_max?: number
          age_min?: number
          capacity?: number
          created_at?: string
          id?: string
          name_en: string
          name_gr: string
          teacher_id?: string | null
        }
        Update: {
          active?: boolean
          age_max?: number
          age_min?: number
          capacity?: number
          created_at?: string
          id?: string
          name_en?: string
          name_gr?: string
          teacher_id?: string | null
        }
        Relationships: []
      }
      communication_template_audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          from_status: string | null
          id: string
          notes: string | null
          template_id: string
          to_status: string | null
          version: number | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          notes?: string | null
          template_id: string
          to_status?: string | null
          version?: number | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          notes?: string | null
          template_id?: string
          to_status?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_template_audit_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_template_versions: {
        Row: {
          body: string
          change_summary: string | null
          created_at: string
          created_by: string | null
          id: string
          placeholders: string[]
          status: string
          subject: string | null
          template_id: string
          title: string
          version: number
        }
        Insert: {
          body: string
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          placeholders?: string[]
          status: string
          subject?: string | null
          template_id: string
          title: string
          version: number
        }
        Update: {
          body?: string
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          placeholders?: string[]
          status?: string
          subject?: string | null
          template_id?: string
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "communication_template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          audience: string
          body: string
          channel: string
          created_at: string
          created_by: string | null
          id: string
          kind: string
          language: string
          placeholders: string[]
          published_at: string | null
          published_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          subject: string | null
          submitted_at: string | null
          submitted_by: string | null
          template_key: string
          title: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          audience?: string
          body: string
          channel: string
          created_at?: string
          created_by?: string | null
          id?: string
          kind: string
          language?: string
          placeholders?: string[]
          published_at?: string | null
          published_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          subject?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          template_key: string
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          audience?: string
          body?: string
          channel?: string
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          language?: string
          placeholders?: string[]
          published_at?: string | null
          published_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          subject?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          template_key?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: []
      }
      consent_records: {
        Row: {
          child_id: string
          consent_type: string
          created_at: string
          document_url: string | null
          expires_on: string | null
          family_id: string | null
          id: string
          notes: string | null
          school_year_id: string | null
          signed_at: string | null
          signed_by_parent_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          child_id: string
          consent_type: string
          created_at?: string
          document_url?: string | null
          expires_on?: string | null
          family_id?: string | null
          id?: string
          notes?: string | null
          school_year_id?: string | null
          signed_at?: string | null
          signed_by_parent_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          child_id?: string
          consent_type?: string
          created_at?: string
          document_url?: string | null
          expires_on?: string | null
          family_id?: string | null
          id?: string
          notes?: string | null
          school_year_id?: string | null
          signed_at?: string | null
          signed_by_parent_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_records_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_records_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_records_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_records_signed_by_parent_id_fkey"
            columns: ["signed_by_parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          child_id: string
          id: string
          status: Database["public"]["Enums"]["consent_status"]
          type: Database["public"]["Enums"]["consent_type"]
          updated_at: string
        }
        Insert: {
          child_id: string
          id?: string
          status?: Database["public"]["Enums"]["consent_status"]
          type: Database["public"]["Enums"]["consent_type"]
          updated_at?: string
        }
        Update: {
          child_id?: string
          id?: string
          status?: Database["public"]["Enums"]["consent_status"]
          type?: Database["public"]["Enums"]["consent_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          activity: string | null
          child_id: string
          created_at: string
          created_by: string | null
          date: string
          food: string | null
          id: string
          incident_flag: boolean
          mood: string | null
          parent_visible: boolean
          sleep: string | null
          teacher_notes: string | null
          toilet: string | null
        }
        Insert: {
          activity?: string | null
          child_id: string
          created_at?: string
          created_by?: string | null
          date?: string
          food?: string | null
          id?: string
          incident_flag?: boolean
          mood?: string | null
          parent_visible?: boolean
          sleep?: string | null
          teacher_notes?: string | null
          toilet?: string | null
        }
        Update: {
          activity?: string | null
          child_id?: string
          created_at?: string
          created_by?: string | null
          date?: string
          food?: string | null
          id?: string
          incident_flag?: boolean
          mood?: string | null
          parent_visible?: boolean
          sleep?: string | null
          teacher_notes?: string | null
          toilet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_reports_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      family_charges: {
        Row: {
          amount: number
          charge_type: string
          child_id: string | null
          created_at: string
          discount_amount: number
          due_date: string | null
          family_id: string
          id: string
          notes: string | null
          school_year_id: string | null
          status: string
          title: string
          tuition_plan_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          charge_type?: string
          child_id?: string | null
          created_at?: string
          discount_amount?: number
          due_date?: string | null
          family_id: string
          id?: string
          notes?: string | null
          school_year_id?: string | null
          status?: string
          title: string
          tuition_plan_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          charge_type?: string
          child_id?: string | null
          created_at?: string
          discount_amount?: number
          due_date?: string | null
          family_id?: string
          id?: string
          notes?: string | null
          school_year_id?: string | null
          status?: string
          title?: string
          tuition_plan_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_charges_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_charges_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_charges_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_charges_tuition_plan_id_fkey"
            columns: ["tuition_plan_id"]
            isOneToOne: false
            referencedRelation: "tuition_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      family_documents: {
        Row: {
          child_id: string | null
          created_at: string
          document_type: string
          expires_at: string | null
          family_id: string
          file_url: string | null
          id: string
          notes: string | null
          parent_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string
          document_type: string
          expires_at?: string | null
          family_id: string
          file_url?: string | null
          id?: string
          notes?: string | null
          parent_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          child_id?: string | null
          created_at?: string
          document_type?: string
          expires_at?: string | null
          family_id?: string
          file_url?: string | null
          id?: string
          notes?: string | null
          parent_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_documents_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_documents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_documents_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      family_financial_items: {
        Row: {
          amount: number
          category_id: string | null
          child_id: string | null
          created_at: string
          due_date: string | null
          family_id: string
          id: string
          item_type: string
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number
          category_id?: string | null
          child_id?: string | null
          created_at?: string
          due_date?: string | null
          family_id: string
          id?: string
          item_type?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          child_id?: string | null
          created_at?: string
          due_date?: string | null
          family_id?: string
          id?: string
          item_type?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_financial_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "finance_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_financial_items_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_financial_items_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      family_folder_children: {
        Row: {
          child_id: string
          created_at: string
          end_date: string | null
          enrollment_status: string
          family_id: string
          id: string
          notes: string | null
          school_year_id: string | null
          start_date: string | null
        }
        Insert: {
          child_id: string
          created_at?: string
          end_date?: string | null
          enrollment_status?: string
          family_id: string
          id?: string
          notes?: string | null
          school_year_id?: string | null
          start_date?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string
          end_date?: string | null
          enrollment_status?: string
          family_id?: string
          id?: string
          notes?: string | null
          school_year_id?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_folder_children_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_folder_children_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_folder_children_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
        ]
      }
      family_folder_parents: {
        Row: {
          billing_responsibility_percent: number
          communication_preference: string
          created_at: string
          family_id: string
          household_status: string
          id: string
          notes: string | null
          parent_id: string
          receives_billing: boolean
          receives_updates: boolean
          role_label: string | null
        }
        Insert: {
          billing_responsibility_percent?: number
          communication_preference?: string
          created_at?: string
          family_id: string
          household_status?: string
          id?: string
          notes?: string | null
          parent_id: string
          receives_billing?: boolean
          receives_updates?: boolean
          role_label?: string | null
        }
        Update: {
          billing_responsibility_percent?: number
          communication_preference?: string
          created_at?: string
          family_id?: string
          household_status?: string
          id?: string
          notes?: string | null
          parent_id?: string
          receives_billing?: boolean
          receives_updates?: boolean
          role_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_folder_parents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_folder_parents_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      family_folders: {
        Row: {
          created_at: string
          family_name: string
          id: string
          legal_summary: string | null
          notes: string | null
          primary_contact_parent_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          family_name: string
          id?: string
          legal_summary?: string | null
          notes?: string | null
          primary_contact_parent_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          family_name?: string
          id?: string
          legal_summary?: string | null
          notes?: string | null
          primary_contact_parent_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_folders_primary_contact_parent_id_fkey"
            columns: ["primary_contact_parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_categories: {
        Row: {
          active: boolean
          created_at: string
          id: string
          kind: string
          name_en: string | null
          name_gr: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          name_en?: string | null
          name_gr: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          name_en?: string | null
          name_gr?: string
        }
        Relationships: []
      }
      inbox_assignments: {
        Row: {
          assigned_by: string | null
          assignee_user_id: string
          created_at: string
          due_date: string | null
          id: string
          item_href: string | null
          item_key: string
          item_kind: string
          item_title: string | null
          note: string | null
          resolved_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          assignee_user_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          item_href?: string | null
          item_key: string
          item_kind: string
          item_title?: string | null
          note?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          assignee_user_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          item_href?: string | null
          item_key?: string
          item_kind?: string
          item_title?: string | null
          note?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          action_taken: string | null
          child_id: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          occurred_at: string
          parent_informed: boolean
          parent_summary: string | null
          status: Database["public"]["Enums"]["incident_status"]
          type: string
        }
        Insert: {
          action_taken?: string | null
          child_id: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          occurred_at?: string
          parent_informed?: boolean
          parent_summary?: string | null
          status?: Database["public"]["Enums"]["incident_status"]
          type: string
        }
        Update: {
          action_taken?: string | null
          child_id?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          occurred_at?: string
          parent_informed?: boolean
          parent_summary?: string | null
          status?: Database["public"]["Enums"]["incident_status"]
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          active: boolean
          allergens: string | null
          created_at: string
          default_unit_cost: number
          id: string
          name_en: string | null
          name_gr: string
          supplier_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          allergens?: string | null
          created_at?: string
          default_unit_cost?: number
          id?: string
          name_en?: string | null
          name_gr: string
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          allergens?: string | null
          created_at?: string
          default_unit_cost?: number
          id?: string
          name_en?: string | null
          name_gr?: string
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_visits: {
        Row: {
          created_at: string
          follow_up_date: string | null
          host_user_id: string | null
          id: string
          lead_id: string
          outcome: string | null
          scheduled_at: string
          status: string
          updated_at: string
          visit_notes: string | null
        }
        Insert: {
          created_at?: string
          follow_up_date?: string | null
          host_user_id?: string | null
          id?: string
          lead_id: string
          outcome?: string | null
          scheduled_at: string
          status?: string
          updated_at?: string
          visit_notes?: string | null
        }
        Update: {
          created_at?: string
          follow_up_date?: string | null
          host_user_id?: string | null
          id?: string
          lead_id?: string
          outcome?: string | null
          scheduled_at?: string
          status?: string
          updated_at?: string
          visit_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_visits_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          campaign_id: string | null
          child_age: string | null
          child_name: string | null
          created_at: string
          desired_start: string | null
          email: string | null
          follow_up_date: string | null
          gdpr_consent: boolean
          id: string
          interest: Database["public"]["Enums"]["interest_type"]
          last_contacted_at: string | null
          lost_reason: string | null
          message: string | null
          notes: string | null
          parent_name: string
          phone: string
          source: Database["public"]["Enums"]["lead_source"]
          source_detail: string | null
          status: Database["public"]["Enums"]["lead_status"]
        }
        Insert: {
          campaign_id?: string | null
          child_age?: string | null
          child_name?: string | null
          created_at?: string
          desired_start?: string | null
          email?: string | null
          follow_up_date?: string | null
          gdpr_consent?: boolean
          id?: string
          interest?: Database["public"]["Enums"]["interest_type"]
          last_contacted_at?: string | null
          lost_reason?: string | null
          message?: string | null
          notes?: string | null
          parent_name: string
          phone: string
          source?: Database["public"]["Enums"]["lead_source"]
          source_detail?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Update: {
          campaign_id?: string | null
          child_age?: string | null
          child_name?: string | null
          created_at?: string
          desired_start?: string | null
          email?: string | null
          follow_up_date?: string | null
          gdpr_consent?: boolean
          id?: string
          interest?: Database["public"]["Enums"]["interest_type"]
          last_contacted_at?: string | null
          lost_reason?: string | null
          message?: string | null
          notes?: string | null
          parent_name?: string
          phone?: string
          source?: Database["public"]["Enums"]["lead_source"]
          source_detail?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Relationships: [
          {
            foreignKeyName: "leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          active: boolean
          cost: number
          created_at: string
          ends_on: string | null
          id: string
          name: string
          notes: string | null
          source: string
          starts_on: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          cost?: number
          created_at?: string
          ends_on?: string | null
          id?: string
          name: string
          notes?: string | null
          source?: string
          starts_on?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          cost?: number
          created_at?: string
          ends_on?: string | null
          id?: string
          name?: string
          notes?: string | null
          source?: string
          starts_on?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      meal_items: {
        Row: {
          allergens: string | null
          created_at: string
          id: string
          ingredients_text: string | null
          internal_notes: string | null
          meal_type: string
          meal_week_day_id: string
          sort_order: number
          substitutions: string | null
          title_en: string | null
          title_gr: string
          updated_at: string
        }
        Insert: {
          allergens?: string | null
          created_at?: string
          id?: string
          ingredients_text?: string | null
          internal_notes?: string | null
          meal_type: string
          meal_week_day_id: string
          sort_order?: number
          substitutions?: string | null
          title_en?: string | null
          title_gr: string
          updated_at?: string
        }
        Update: {
          allergens?: string | null
          created_at?: string
          id?: string
          ingredients_text?: string | null
          internal_notes?: string | null
          meal_type?: string
          meal_week_day_id?: string
          sort_order?: number
          substitutions?: string | null
          title_en?: string | null
          title_gr?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_items_meal_week_day_id_fkey"
            columns: ["meal_week_day_id"]
            isOneToOne: false
            referencedRelation: "meal_week_days"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_menus: {
        Row: {
          allergens: string | null
          class_id: string | null
          created_at: string
          id: string
          ingredients: string | null
          meal_type: string
          menu_date: string
          notes: string | null
          title_en: string | null
          title_gr: string
          updated_at: string
        }
        Insert: {
          allergens?: string | null
          class_id?: string | null
          created_at?: string
          id?: string
          ingredients?: string | null
          meal_type?: string
          menu_date: string
          notes?: string | null
          title_en?: string | null
          title_gr: string
          updated_at?: string
        }
        Update: {
          allergens?: string | null
          class_id?: string | null
          created_at?: string
          id?: string
          ingredients?: string | null
          meal_type?: string
          menu_date?: string
          notes?: string | null
          title_en?: string | null
          title_gr?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_menus_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_week_days: {
        Row: {
          created_at: string
          day_date: string
          day_label_en: string | null
          day_label_gr: string
          id: string
          meal_week_id: string
          notes: string | null
        }
        Insert: {
          created_at?: string
          day_date: string
          day_label_en?: string | null
          day_label_gr: string
          id?: string
          meal_week_id: string
          notes?: string | null
        }
        Update: {
          created_at?: string
          day_date?: string
          day_label_en?: string | null
          day_label_gr?: string
          id?: string
          meal_week_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_week_days_meal_week_id_fkey"
            columns: ["meal_week_id"]
            isOneToOne: false
            referencedRelation: "meal_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_weeks: {
        Row: {
          created_at: string
          created_by: string | null
          estimated_children: number
          id: string
          kitchen_notes: string | null
          parent_notes_en: string | null
          parent_notes_gr: string | null
          published_at: string | null
          school_year_id: string | null
          status: string
          title_en: string | null
          title_gr: string
          updated_at: string
          week_starts_on: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          estimated_children?: number
          id?: string
          kitchen_notes?: string | null
          parent_notes_en?: string | null
          parent_notes_gr?: string | null
          published_at?: string | null
          school_year_id?: string | null
          status?: string
          title_en?: string | null
          title_gr: string
          updated_at?: string
          week_starts_on: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          estimated_children?: number
          id?: string
          kitchen_notes?: string | null
          parent_notes_en?: string | null
          parent_notes_gr?: string | null
          published_at?: string | null
          school_year_id?: string | null
          status?: string
          title_en?: string | null
          title_gr?: string
          updated_at?: string
          week_starts_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_weeks_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_cost_items: {
        Row: {
          actual_cost: number | null
          class_id: string | null
          created_at: string
          id: string
          ingredient_id: string | null
          ingredient_name: string
          meal_item_id: string | null
          meal_week_id: string
          planned_cost: number | null
          quantity: number
          supplier_id: string | null
          unit: string
          unit_cost: number
          waste_notes: string | null
        }
        Insert: {
          actual_cost?: number | null
          class_id?: string | null
          created_at?: string
          id?: string
          ingredient_id?: string | null
          ingredient_name: string
          meal_item_id?: string | null
          meal_week_id: string
          planned_cost?: number | null
          quantity?: number
          supplier_id?: string | null
          unit?: string
          unit_cost?: number
          waste_notes?: string | null
        }
        Update: {
          actual_cost?: number | null
          class_id?: string | null
          created_at?: string
          id?: string
          ingredient_id?: string | null
          ingredient_name?: string
          meal_item_id?: string | null
          meal_week_id?: string
          planned_cost?: number | null
          quantity?: number
          supplier_id?: string | null
          unit?: string
          unit_cost?: number
          waste_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_cost_items_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_cost_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_cost_items_meal_item_id_fkey"
            columns: ["meal_item_id"]
            isOneToOne: false
            referencedRelation: "meal_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_cost_items_meal_week_id_fkey"
            columns: ["meal_week_id"]
            isOneToOne: false
            referencedRelation: "meal_weeks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_cost_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          href: string | null
          id: string
          kind: string
          message: string | null
          read_at: string | null
          related_id: string | null
          related_table: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          href?: string | null
          id?: string
          kind: string
          message?: string | null
          read_at?: string | null
          related_id?: string | null
          related_table?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          href?: string | null
          id?: string
          kind?: string
          message?: string | null
          read_at?: string | null
          related_id?: string | null
          related_table?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      parent_child_links: {
        Row: {
          can_pickup: boolean
          child_id: string
          court_order_reference: string | null
          custody_type: string
          emergency_contact: boolean
          id: string
          legal_notes: string | null
          parent_id: string
          pickup_requires_approval: boolean
          pickup_restrictions: string | null
          relationship: string | null
        }
        Insert: {
          can_pickup?: boolean
          child_id: string
          court_order_reference?: string | null
          custody_type?: string
          emergency_contact?: boolean
          id?: string
          legal_notes?: string | null
          parent_id: string
          pickup_requires_approval?: boolean
          pickup_restrictions?: string | null
          relationship?: string | null
        }
        Update: {
          can_pickup?: boolean
          child_id?: string
          court_order_reference?: string | null
          custody_type?: string
          emergency_contact?: boolean
          id?: string
          legal_notes?: string | null
          parent_id?: string
          pickup_requires_approval?: boolean
          pickup_restrictions?: string | null
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_child_links_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_child_links_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_requests: {
        Row: {
          child_id: string | null
          created_at: string
          family_id: string
          id: string
          message: string | null
          parent_user_id: string
          priority: string
          request_type: string
          resolved_at: string | null
          resolved_by: string | null
          response_text: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string
          family_id: string
          id?: string
          message?: string | null
          parent_user_id: string
          priority?: string
          request_type: string
          resolved_at?: string | null
          resolved_by?: string | null
          response_text?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          child_id?: string | null
          created_at?: string
          family_id?: string
          id?: string
          message?: string | null
          parent_user_id?: string
          priority?: string
          request_type?: string
          resolved_at?: string | null
          resolved_by?: string | null
          response_text?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_requests_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_requests_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          emergency_priority: number | null
          full_name: string
          id: string
          phone: string | null
          relationship: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          emergency_priority?: number | null
          full_name: string
          id?: string
          phone?: string | null
          relationship?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          emergency_priority?: number | null
          full_name?: string
          id?: string
          phone?: string | null
          relationship?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          charge_id: string | null
          created_at: string
          created_by: string | null
          family_id: string
          id: string
          notes: string | null
          payment_date: string
          payment_method: string | null
          receipt_url: string | null
          reference_code: string | null
        }
        Insert: {
          amount?: number
          charge_id?: string | null
          created_at?: string
          created_by?: string | null
          family_id: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          receipt_url?: string | null
          reference_code?: string | null
        }
        Update: {
          amount?: number
          charge_id?: string | null
          created_at?: string
          created_by?: string | null
          family_id?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          receipt_url?: string | null
          reference_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "family_charges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      pickup_events: {
        Row: {
          attendance_id: string | null
          child_id: string
          created_at: string
          id: string
          picked_up_at: string
          pickup_person_name: string
          pickup_person_type: string
          recorded_by: string | null
          validated: boolean
          validation_notes: string | null
        }
        Insert: {
          attendance_id?: string | null
          child_id: string
          created_at?: string
          id?: string
          picked_up_at?: string
          pickup_person_name: string
          pickup_person_type?: string
          recorded_by?: string | null
          validated?: boolean
          validation_notes?: string | null
        }
        Update: {
          attendance_id?: string | null
          child_id?: string
          created_at?: string
          id?: string
          picked_up_at?: string
          pickup_person_name?: string
          pickup_person_type?: string
          recorded_by?: string | null
          validated?: boolean
          validation_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pickup_events_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "attendance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_events_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          language: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          language?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          language?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          active: boolean
          branch_id: string | null
          capacity: number
          created_at: string
          id: string
          name_en: string | null
          name_gr: string
          notes: string | null
          room_type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          branch_id?: string | null
          capacity?: number
          created_at?: string
          id?: string
          name_en?: string | null
          name_gr: string
          notes?: string | null
          room_type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          branch_id?: string | null
          capacity?: number
          created_at?: string
          id?: string
          name_en?: string | null
          name_gr?: string
          notes?: string | null
          room_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      school_events: {
        Row: {
          all_day: boolean
          class_id: string | null
          color: string | null
          created_at: string
          created_by: string | null
          description_en: string | null
          description_gr: string | null
          ends_at: string
          id: string
          is_public: boolean
          location: string | null
          starts_at: string
          title_en: string | null
          title_gr: string
          updated_at: string
        }
        Insert: {
          all_day?: boolean
          class_id?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_gr?: string | null
          ends_at: string
          id?: string
          is_public?: boolean
          location?: string | null
          starts_at: string
          title_en?: string | null
          title_gr: string
          updated_at?: string
        }
        Update: {
          all_day?: boolean
          class_id?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_gr?: string | null
          ends_at?: string
          id?: string
          is_public?: boolean
          location?: string | null
          starts_at?: string
          title_en?: string | null
          title_gr?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_events_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      school_finance_entries: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          entry_date: string
          entry_type: string
          id: string
          notes: string | null
          payment_method: string | null
          receipt_url: string | null
          title: string
          updated_at: string
          vendor: string | null
        }
        Insert: {
          amount?: number
          category_id?: string | null
          created_at?: string
          entry_date?: string
          entry_type?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          title: string
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          entry_date?: string
          entry_type?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          title?: string
          updated_at?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_finance_entries_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "finance_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      school_holidays: {
        Row: {
          created_at: string
          ends_on: string
          holiday_type: string
          id: string
          notes: string | null
          school_year_id: string | null
          starts_on: string
          title_en: string | null
          title_gr: string
          updated_at: string
          visible_to_parents: boolean
        }
        Insert: {
          created_at?: string
          ends_on: string
          holiday_type?: string
          id?: string
          notes?: string | null
          school_year_id?: string | null
          starts_on: string
          title_en?: string | null
          title_gr: string
          updated_at?: string
          visible_to_parents?: boolean
        }
        Update: {
          created_at?: string
          ends_on?: string
          holiday_type?: string
          id?: string
          notes?: string | null
          school_year_id?: string | null
          starts_on?: string
          title_en?: string | null
          title_gr?: string
          updated_at?: string
          visible_to_parents?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "school_holidays_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
        ]
      }
      school_services: {
        Row: {
          active: boolean
          created_at: string
          description_en: string | null
          description_gr: string | null
          fee_amount: number
          id: string
          name_en: string | null
          name_gr: string
          service_type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description_en?: string | null
          description_gr?: string | null
          fee_amount?: number
          id?: string
          name_en?: string | null
          name_gr: string
          service_type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description_en?: string | null
          description_gr?: string | null
          fee_amount?: number
          id?: string
          name_en?: string | null
          name_gr?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      school_years: {
        Row: {
          adaptation_ends_on: string | null
          adaptation_starts_on: string | null
          carry_over_notes: string | null
          created_at: string
          ends_on: string
          holiday_notes: string | null
          id: string
          registration_ends_on: string | null
          registration_starts_on: string | null
          starts_on: string
          status: string
          title: string
          tuition_notes: string | null
          updated_at: string
        }
        Insert: {
          adaptation_ends_on?: string | null
          adaptation_starts_on?: string | null
          carry_over_notes?: string | null
          created_at?: string
          ends_on: string
          holiday_notes?: string | null
          id?: string
          registration_ends_on?: string | null
          registration_starts_on?: string | null
          starts_on: string
          status?: string
          title: string
          tuition_notes?: string | null
          updated_at?: string
        }
        Update: {
          adaptation_ends_on?: string | null
          adaptation_starts_on?: string | null
          carry_over_notes?: string | null
          created_at?: string
          ends_on?: string
          holiday_notes?: string | null
          id?: string
          registration_ends_on?: string | null
          registration_starts_on?: string | null
          starts_on?: string
          status?: string
          title?: string
          tuition_notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staff_class_assignments: {
        Row: {
          assignment_role: string
          class_id: string
          created_at: string
          ends_on: string | null
          id: string
          school_year_id: string | null
          staff_id: string
          starts_on: string | null
        }
        Insert: {
          assignment_role?: string
          class_id: string
          created_at?: string
          ends_on?: string | null
          id?: string
          school_year_id?: string | null
          staff_id: string
          starts_on?: string | null
        }
        Update: {
          assignment_role?: string
          class_id?: string
          created_at?: string
          ends_on?: string | null
          id?: string
          school_year_id?: string | null
          staff_id?: string
          starts_on?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_class_assignments_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_class_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_profiles: {
        Row: {
          created_at: string
          email: string | null
          employment_status: string
          full_name: string
          id: string
          permissions_notes: string | null
          phone: string | null
          role_label: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          employment_status?: string
          full_name: string
          id?: string
          permissions_notes?: string | null
          phone?: string | null
          role_label: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          employment_status?: string
          full_name?: string
          id?: string
          permissions_notes?: string | null
          phone?: string | null
          role_label?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          active: boolean
          category: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tuition_plans: {
        Row: {
          active: boolean
          created_at: string
          extras_fee: number
          id: string
          monthly_fee: number
          name_en: string | null
          name_gr: string
          notes: string | null
          registration_fee: number
          school_year_id: string | null
          sibling_discount_percent: number
          transport_fee: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          extras_fee?: number
          id?: string
          monthly_fee?: number
          name_en?: string | null
          name_gr: string
          notes?: string | null
          registration_fee?: number
          school_year_id?: string | null
          sibling_discount_percent?: number
          transport_fee?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          extras_fee?: number
          id?: string
          monthly_fee?: number
          name_en?: string | null
          name_gr?: string
          notes?: string | null
          registration_fee?: number
          school_year_id?: string | null
          sibling_discount_percent?: number
          transport_fee?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tuition_plans_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      admin_status: {
        Args: never
        Returns: {
          has_any_admin: boolean
          is_admin: boolean
        }[]
      }
      approve_admin_request: {
        Args: { _notes?: string; _request_id: string }
        Returns: boolean
      }
      can_manage_nutrition: { Args: { _user_id: string }; Returns: boolean }
      can_manage_school: { Args: { _user_id: string }; Returns: boolean }
      can_view_finance: { Args: { _user_id: string }; Returns: boolean }
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_parent_in_family: {
        Args: { _family_id: string; _user_id: string }
        Returns: boolean
      }
      is_parent_of_child: {
        Args: { _child_id: string; _user_id: string }
        Returns: boolean
      }
      is_teacher_of_child: {
        Args: { _child_id: string; _user_id: string }
        Returns: boolean
      }
      reject_admin_request: {
        Args: { _notes?: string; _request_id: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_request_status: "pending" | "approved" | "rejected"
      announcement_audience:
        | "all_parents"
        | "class"
        | "specific_parent"
        | "staff"
      app_role:
        | "admin"
        | "teacher"
        | "parent"
        | "owner"
        | "director"
        | "assistant"
        | "finance"
        | "kitchen"
      attendance_status: "present" | "absent" | "late" | "early_pickup"
      child_status: "active" | "pending" | "inactive" | "waitlist"
      consent_status: "given" | "not_given" | "withdrawn"
      consent_type:
        | "communication"
        | "photo"
        | "video"
        | "emergency_contact"
        | "newsletter"
        | "portal"
      incident_status: "open" | "resolved" | "follow_up"
      interest_type: "preschool" | "kindergarten" | "both"
      lead_source: "website" | "chatbot" | "phone" | "referral" | "other"
      lead_status:
        | "new"
        | "contacted"
        | "appointment_scheduled"
        | "visited"
        | "documents_pending"
        | "enrolled"
        | "lost"
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
      admin_request_status: ["pending", "approved", "rejected"],
      announcement_audience: [
        "all_parents",
        "class",
        "specific_parent",
        "staff",
      ],
      app_role: [
        "admin",
        "teacher",
        "parent",
        "owner",
        "director",
        "assistant",
        "finance",
        "kitchen",
      ],
      attendance_status: ["present", "absent", "late", "early_pickup"],
      child_status: ["active", "pending", "inactive", "waitlist"],
      consent_status: ["given", "not_given", "withdrawn"],
      consent_type: [
        "communication",
        "photo",
        "video",
        "emergency_contact",
        "newsletter",
        "portal",
      ],
      incident_status: ["open", "resolved", "follow_up"],
      interest_type: ["preschool", "kindergarten", "both"],
      lead_source: ["website", "chatbot", "phone", "referral", "other"],
      lead_status: [
        "new",
        "contacted",
        "appointment_scheduled",
        "visited",
        "documents_pending",
        "enrolled",
        "lost",
      ],
    },
  },
} as const