import React from "react";
import {
  Button,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";

export const Header = () => {
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
      </NavbarContent>
      <NavbarContent justify="end">
        <Button className="h-10 rounded-3xl bg-purple-600 text-white">
          Зарегистрироваться
        </Button>
        <Button className="h-10 rounded-3xl">Войти</Button>
      </NavbarContent>
    </Navbar>
  );
};
