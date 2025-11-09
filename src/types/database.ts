export type Database = {
  public: {
    Tables: {
      gift_messages: {
        Row: {
          id: string;
          short_id: string;
          applicant_name: string;
          applicant_phone: string;
          message: string;
          recipient_phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          short_id: string;
          applicant_name: string;
          applicant_phone: string;
          message: string;
          recipient_phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          short_id?: string;
          applicant_name?: string;
          applicant_phone?: string;
          message?: string;
          recipient_phone?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

export type GiftMessage = Database['public']['Tables']['gift_messages']['Row'];

