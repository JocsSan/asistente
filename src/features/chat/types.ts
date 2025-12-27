export type MessageSender = 'user' | 'bot';
export type MessageStatus = 'pending' | 'sent' | 'error';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: number;
  status: MessageStatus;
  audioPath?: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  autoPlayEnabled: boolean;
}
