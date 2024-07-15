import React from "react";
import { Control, useController } from "react-hook-form";
import { Input as NextInput } from "@nextui-org/react";

type Props = {
  name: string;
  label?: string;
  className?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full" | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  placeholder?: string;
  type?: string;
  control: Control<any>;
  required?: string;
  endContent?: React.JSX.Element;
};

export const Input = ({
  name,
  label,
  className,
  placeholder,
  type,
  control,
  radius,
  size,
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
      className={className}
      type={type}
      radius={radius}
      size={size}
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
