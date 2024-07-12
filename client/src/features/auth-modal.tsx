import React, { useState } from "react";
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
import { hasErrorField } from "../utils/has-error-field";
import { ErrorMessage } from "../components/error-message";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./userSlice";

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
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState("");
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

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: AuthFormValues) => {
    try {
      if (type === "register") {
        await register(data).unwrap();
      } else if (type === "login") {
        await login(data).unwrap();
      }
    } catch (error) {
      if (hasErrorField(error)) {
        setErrorMessage(error.data.error);
      }
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              {type === "register" ? "Зарегистрироваться" : "Войти"}
            </ModalHeader>
            <ModalBody>
              {type === "register" ? (
                <Input
                  name="email"
                  control={control}
                  radius="full"
                  label="Почта"
                  placeholder="Введите адрес электронной почты"
                  required="Обязятальное поле"
                />
              ) : (
                <Input
                  name="usernameOrEmail"
                  control={control}
                  radius="full"
                  label="Логин"
                  placeholder="Введите адрес электронной почты или никнейм"
                  required="Обязятальное поле"
                />
              )}
              {type === "register" && (
                <Input
                  name="username"
                  control={control}
                  radius="full"
                  label="Никнейм"
                  placeholder="Введите никнейм"
                  required="Обязятальное поле"
                />
              )}
              <Input
                name="password"
                control={control}
                radius="full"
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
                required="Обязятальное поле"
              />
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
              <ErrorMessage error={errorMessage} />
            </ModalBody>
            <ModalFooter>
              <Button className="h-10 rounded-3xl" onClick={onClose}>
                Закрыть
              </Button>
              <Button
                className="h-10 rounded-3xl bg-purple-600 text-white"
                type="submit"
                isLoading={type === "register" ? registerLoading : loginLoading}
              >
                {type === "register" ? "Зарегистрироваться" : "Войти"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
