"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface AuthInputProps {
  label: string;
  type?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export function AuthInput({
  label,
  type = "text",
  registration,
  error,
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium">{label}</label>
      <input
        {...registration}
        type={type}
        aria-invalid={!!error}
        className="border p-2 rounded focus:outline-none focus:ring"
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
