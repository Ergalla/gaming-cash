import React from "react";
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { Input } from "../components/input";
import { useLoginMutation, useRegisterMutation } from "../app/services/authApi";

type AuthFormValues = {
  email: string;
  username: string;
  usernameOrEmail: string;
  password: string;
};

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  theme: string;
  type: "register" | "login";
  setType: (type: "register" | "login") => void;
};

export const AuthModal = ({
  isOpen,
  onOpenChange,
  theme,
  type,
  setType,
}: Props) => {
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const { handleSubmit, control } = useForm<AuthFormValues>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      username: "",
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    try {
      if (type === "register") {
        await register(data).unwrap();
      } else if (type === "login") {
        console.log(data);
        await login(data).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      className={`${theme} text-foreground`}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {type === "register" ? "Зарегистрироваться" : "Войти"}
            </ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-3">
                {type === "register" ? (
                  <Input
                    name="email"
                    control={control}
                    radius="full"
                    label="Почта"
                    placeholder="Введите адрес электронной почты"
                  />
                ) : (
                  <Input
                    name="usernameOrEmail"
                    control={control}
                    radius="full"
                    label="Логин"
                    placeholder="Введите адрес электронной почты или никнейм"
                  />
                )}
                {type === "register" && (
                  <Input
                    name="username"
                    control={control}
                    radius="full"
                    label="Никнейм"
                    placeholder="Введите никнейм"
                  />
                )}
                <Input
                  name="password"
                  control={control}
                  radius="full"
                  label="Пароль"
                  placeholder="Введите пароль"
                  type="password"
                />
              </form>
              <div className="flex py-2 px-1 justify-between">
                <Link
                  color="primary"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() =>
                    setType(type === "register" ? "login" : "register")
                  }
                >
                  {type === "register"
                    ? "Уже есть аккаунт?"
                    : "Еще нет аккаунта?"}
                </Link>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button className="h-10 rounded-3xl" onClick={onClose}>
                Закрыть
              </Button>
              <Button
                className="h-10 rounded-3xl bg-purple-600 text-white"
                onClick={handleSubmit(onSubmit)}
                isLoading={type === "register" ? registerLoading : loginLoading}
              >
                {type === "register" ? "Зарегистрироваться" : "Войти"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
