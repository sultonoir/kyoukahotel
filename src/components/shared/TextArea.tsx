import React from "react";
import {
  type FieldErrors,
  type FieldValues,
  type UseFormRegister,
} from "react-hook-form";

interface TextAreaProps {
  id: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  disabled,
  required,
  register,
  errors,
}) => {
  return (
    <textarea
      maxLength={1000}
      id={id}
      placeholder={label}
      disabled={disabled}
      {...register(id, { required })}
      className={`
        ${errors[id] ? "border-rose-500" : ""}
        ${errors[id] ? "focus:border-rose-500" : ""}
        border-info h-80 w-full border p-2`}
    />
  );
};

export default TextArea;
