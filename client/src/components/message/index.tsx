import React from "react";
import { Message as MessageType, User } from "../../app/types";
import { Avatar } from "@nextui-org/react";
import { selectUser } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../app/constants";
import { extractTime } from "../../utils/extract-time";

export const Message = ({
  message,
  selectedConversation,
}: {
  message: MessageType;
  selectedConversation: Partial<User>;
}) => {
  const authUser = useSelector(selectUser);

  const fromMe = message?.senderId === authUser?.id;
  const img = fromMe
    ? `${BASE_URL}${authUser?.avatarUrl}`
    : `${BASE_URL}${selectedConversation?.avatarUrl}`;
  const chatClass = fromMe ? "flex-row-reverse " : "justify-start";

  return (
    <div className={`flex p-4 items-center ${chatClass}`}>
      {!fromMe && <Avatar src={img} className="mr-5" />}
      <p
        className={`text-sm ${fromMe ? "bg-purple-600 text-white" : "bg-divider"} p-3 rounded-full md:text-md`}
      >
        {message.body}
      </p>
      <span
        className={`${fromMe ? "mr-3" : "ml-3"} opacity-50 text-xs flex gap-1 items-center text-foreground`}
      >
        {extractTime(message.createdAt)}
      </span>
    </div>
  );
};
