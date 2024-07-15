import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  User,
} from "@nextui-org/react";
import { GoBack } from "../../components/go-back";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../../app/services/messagesApi";
import { BASE_URL } from "../../app/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserByIdQuery } from "../../app/services/userApi";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../features/userSlice";
import { Message } from "../../components/message";
import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { hasErrorField } from "../../utils/has-error-field";
import { IoIosSend } from "react-icons/io";

type messageFormValues = {
  receiverId: number;
  message: string;
};

export const Messages = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const { handleSubmit, control, reset } = useForm<messageFormValues>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      message: "",
    },
  });
  const { data: conversations } = useGetConversationsQuery();
  const { data: messages, isLoading } = useGetMessagesQuery(Number(params.id));
  const { data: user } = useGetUserByIdQuery(Number(params.id));
  const [sendMessage] = useSendMessageMutation();

  if (!isAuthenticated) {
    navigate("/");
  }

  const onSubmit = async (data: messageFormValues) => {
    try {
      data.receiverId = Number(params.id);
      await sendMessage(data).unwrap();
      reset();
    } catch (error) {
      if (hasErrorField(error)) {
        console.log(error.data.error);
      }
    }
  };

  return (
    <>
      <div className="flex-row justify-start mt-3">
        <GoBack />
        {conversations && conversations.length > 0 ? (
          conversations.map(conversation => (
            <User
              key={conversation.participants[0].id}
              onClick={() =>
                navigate(`/messages/${conversation.participants[0].id}`)
              }
              className="cursor-pointer mb-5 w-full justify-start"
              name={conversation.participants[0].username}
              avatarProps={{
                src: `${BASE_URL}${conversation.participants[0].avatarUrl}`,
              }}
              description={
                conversation.messages[0].body.length > 10
                  ? conversation.messages[0].body.slice(0, 10) + "..."
                  : conversation.messages[0].body.slice(0, 10)
              }
            />
          ))
        ) : (
          <p>Нет диалогов</p>
        )}
      </div>
      {user && (
        <Card className="w-full h-[740px]">
          <CardHeader className="w-full ">
            <User
              name={user.username}
              avatarProps={{
                src: `${BASE_URL}${user.avatarUrl}`,
              }}
              description="Чат"
            />
          </CardHeader>
          <Divider />
          <CardBody>
            {!isLoading &&
              messages &&
              messages.map(message => (
                <Message
                  key={message.id}
                  message={message}
                  selectedConversation={user}
                />
              ))}
          </CardBody>
          <Divider />
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Input
              name="message"
              control={control}
              radius="none"
              size="lg"
              placeholder="Введите ваше сообщение...."
              className="w-full"
              endContent={
                <Button
                  type="submit"
                  className="h-full bg-purple-600 text-white"
                  isLoading={isLoading}
                  startContent={<IoIosSend className="text-xl" />}
                >
                  ENTER
                </Button>
              }
            />
          </form>
        </Card>
      )}
    </>
  );
};
