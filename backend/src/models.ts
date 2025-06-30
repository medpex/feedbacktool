export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  timestamp: string;
  customer: string;
  customerName: string;
  concern: string;
  refId: string;
}

export interface FeedbackLink {
  id: string;
  customerNumber: string;
  concern: string;
  firstName: string;
  lastName: string;
  feedbackUrl: string;
  qrCodeUrl: string;
  createdAt: string;
  used: boolean;
} 