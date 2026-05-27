export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  expiryDate?: string;
}
