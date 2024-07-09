import React from "react";

type Props = {
  children: React.ReactElement[] | React.ReactElement;
};

export const Container = ({ children }: Props) => {
  return (
    <main className="flex max-w-screen-2xl mx-auto mt-10">{children}</main>
  );
};
