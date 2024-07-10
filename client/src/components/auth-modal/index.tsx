import React from "react";
import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

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
              {type === "register" ? (
                <Input
                  radius="full"
                  autoFocus
                  label="Почта"
                  placeholder="Введите адрес электронной почты"
                  variant="bordered"
                />
              ) : (
                <Input
                  radius="full"
                  autoFocus
                  label="Логин"
                  placeholder="Введите адрес электронной почты или логин"
                  variant="bordered"
                />
              )}
              {type === "register" && (
                <Input
                  radius="full"
                  label="Имя пользователя"
                  placeholder="Введите имя пользователя"
                  variant="bordered"
                />
              )}
              <Input
                radius="full"
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
                variant="bordered"
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
            </ModalBody>
            <ModalFooter>
              <Button className="h-10 rounded-3xl" onClick={onClose}>
                Закрыть
              </Button>
              <Button className="h-10 rounded-3xl bg-purple-600 text-white">
                {type === "register" ? "Зарегистрироваться" : "Войти"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
