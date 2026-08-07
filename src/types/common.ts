export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  isThinking?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
  expiryDate?: string;
}

/** Delivery zone returned by the serviceability check. */
export interface Zone {
  id?: string;
  name?: string;
}

/** Curated collection shown on the home feed (title/subtitle/image card). */
export interface Collection {
  id: string;
  title?: string;
  subtitle?: string;
  image?: string;
}
