export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  conversationIds: number[];
  conversations: Conversation[];
  messages: Message[];
};

export type Conversation = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  participantsIds: number[];
  participants: User[];
  messagesIds: number[];
  messages: Message[];
};

export type Message = {
  id: number;
  conversationId: number;
  conversation: Conversation;
  senderId: number;
  sender: User;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};
