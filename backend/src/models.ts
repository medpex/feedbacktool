
export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  timestamp: string;
  customer: string;
  customer_name: string;
  concern: string;
  ref_id: string;
}

export interface FeedbackLink {
  id: string;
  customer_number: string;
  concern: string;
  first_name: string;
  last_name: string;
  feedback_url: string;
  qr_code_url: string;
  created_at: string;
  used: boolean;
}
