import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "../container";
import { Header } from "../header";

export const Layout = () => {
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};
