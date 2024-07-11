import React from "react";
import { useGetMeQuery } from "../app/services/authApi";
import { Spinner } from "@nextui-org/react";

export const AuthGuard = ({ children }: { children: React.JSX.Element }) => {
  const { isLoading } = useGetMeQuery();

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner color="default" size="lg" label="Загрузка..." />
      </div>
    );

  return children;
};
