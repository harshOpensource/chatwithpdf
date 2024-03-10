export interface Chat {
  id: number;
  pdfName: string;
  pdfUrl: string;
  createdAt: Date;
  userId: string;
  fileKey: string;
}

export interface Message {
  id: number;
  chatId: number;
  content: string;
  createdAt: Date;
  role: "system" | "user";
}

export interface UserSubscription {
  id: number;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
}

export interface uploadFile {
  key: string;
  name: string;
  url: string;
}
