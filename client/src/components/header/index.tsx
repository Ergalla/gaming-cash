import React, { useContext } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { ThemeContext } from "../theme-provider";
import { PiChatsCircleLight, PiMoonLight, PiSunLight } from "react-icons/pi";
import { AuthModal } from "../../features/auth-modal";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../features/userSlice";
import { BASE_URL } from "../../app/constants";
import { useLogoutMutation } from "../../app/services/authApi";
import { hasErrorField } from "../../utils/has-error-field";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [type, setType] = React.useState<"login" | "register">("register");

  const handleOpen = (type: "login" | "register") => {
    setType(type);
    onOpen();
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      if (hasErrorField(error)) {
        console.error(error.data.error);
      }
    }
  };

  return (
    <Navbar>
      <NavbarBrand onClick={() => navigate("/")} className="cursor-pointer">
        <p className="text-2xl font-semibold">Gaming</p>
        <span className="text-purple-600 text-2xl font-semibold">Cash</span>
      </NavbarBrand>
      <NavbarContent justify="center">
        <Input
          radius="full"
          type="search"
          placeholder="Поиск"
          className="h-11 w-[380px]"
          startContent={<CiSearch />}
        />
        <NavbarItem
          className="lg:flex text-2xl cursor-pointer"
          onClick={() => toggleTheme()}
        >
          {theme === "light" ? <PiMoonLight /> : <PiSunLight />}
        </NavbarItem>
        {isAuthenticated && (
          <NavbarItem
            className="lg:flex items-center text-2xl cursor-pointer"
            onClick={() => navigate("/messages")}
          >
            <PiChatsCircleLight />
            <p className="text-small ml-2">Сообщения</p>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        {!isAuthenticated ? (
          <>
            <Button
              className="h-10 rounded-3xl bg-purple-600 text-white"
              onClick={() => handleOpen("register")}
            >
              Зарегистрироваться
            </Button>
            <Button
              className="h-10 rounded-3xl"
              onClick={() => handleOpen("login")}
            >
              Войти
            </Button>
          </>
        ) : (
          <Dropdown
            placement="bottom-end"
            className={`${theme}  text-foreground`}
          >
            <DropdownTrigger>
              <User
                name={user?.username}
                description="Баланс: 0 ₽"
                avatarProps={{ src: `${BASE_URL}${user?.avatarUrl}` }}
                className="cursor-pointer"
                as="button"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Вошли как</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">Настройки</DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                Выйти
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
      <AuthModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        theme={theme}
        type={type}
        setType={setType}
      />
    </Navbar>
  );
};
