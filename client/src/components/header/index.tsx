import React, { useContext } from "react";
import {
  Button,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  useDisclosure,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { ThemeContext } from "../theme-provider";
import { PiMoonLight, PiSunLight } from "react-icons/pi";
import { AuthModal } from "../auth-modal";

export const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [type, setType] = React.useState<"login" | "register">("register");

  const handleOpen = (type: "login" | "register") => {
    setType(type);
    onOpen();
  };

  return (
    <Navbar>
      <NavbarBrand>
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
      </NavbarContent>
      <NavbarContent justify="end">
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
