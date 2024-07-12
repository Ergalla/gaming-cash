import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

export const GoBack = () => {
  const navigate = useNavigate();

  return (
    <div
      className="text-default-500 flex items-center gap-2 mb-10 cursor-pointer"
      onClick={() => navigate(-1)}
    >
      <FaRegArrowAltCircleLeft />
      Назад
    </div>
  );
};
