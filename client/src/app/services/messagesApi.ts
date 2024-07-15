import { api } from "./api";
import { User, Message } from "../types";

export const messagesApi = api.injectEndpoints({
  endpoints: builder => ({
    getConversations: builder.query<
      { messages: Message[]; participants: User[] }[],
      void
    >({
      query: () => ({
        url: "/messages/conversations",
        method: "get",
      }),
    }),
    getMessages: builder.query<Message[], number>({
      query: userToChatId => ({
        url: `/messages/${userToChatId}`,
        method: "get",
      }),
    }),
    sendMessage: builder.mutation<
      void,
      { receiverId: number; message: string }
    >({
      query: ({ receiverId, message }) => ({
        url: `/messages/send/${receiverId}`,
        method: "post",
        body: { message },
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useLazyGetConversationsQuery,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
} = messagesApi;

export const {
  endpoints: { getConversations, getMessages, sendMessage },
} = messagesApi;
