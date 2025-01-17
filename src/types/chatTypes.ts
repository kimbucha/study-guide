export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface StudyPlanRequest {
  topic: string;
  duration: number;
}