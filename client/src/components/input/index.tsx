import React from "react";
import { Control, useController } from "react-hook-form";
import { Input as NextInput } from "@nextui-org/react";

type Props = {
  name: string;
  label: string;
  radius?: "none" | "sm" | "md" | "lg" | "full" | undefined;
  placeholder?: string;
  type?: string;
  control: Control<any>;
  required?: string;
  endContent?: React.JSX.Element;
};

export const Input = ({
  name,
  label,
  placeholder,
  type,
  control,
  radius,
  required = "",
  endContent,
}: Props) => {
  const {
    field,
    fieldState: { invalid },
    formState: { errors },
  } = useController({
    name,
    control,
    rules: { required },
  });

  return (
    <NextInput
      id={name}
      label={label}
      type={type}
      radius={radius}
      placeholder={placeholder}
      value={field.value}
      name={field.name}
      isInvalid={invalid}
      onChange={field.onChange}
      onBlur={field.onBlur}
      errorMessage={`${errors[name]?.message ?? ""}`}
      endContent={endContent}
    />
  );
};
