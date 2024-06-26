import React, { InputHTMLAttributes } from "react";

type Input = {
  value: string | number;
  setValue: any;
  placeholder?: string;
  label?: string;
  type: "text" | "number";
  error?: string;
  setError?: any;
};

export default function Input({
  setValue,
  type,
  value,
  label,
  placeholder,
  error,
  setError,
}: Input) {
  return (
    <div className="relative flex flex-col gap-2">
      <label htmlFor={label} className={`${error && "text-red-500"}`}>
        {label}
      </label>
      <input
        id={label}
        type={type}
        onChange={(e) => {
          setError?.("");
          setValue(
            type == "number" ? parseInt(e.target.value) : e.target.value
          );
        }}
        value={value}
        placeholder={placeholder}
        className={`bg-gray-200 text-black border ${
          error ? "border-red-500" : "border-transparent"
        }`}
      />
      <p className="absolute text-[8px] -bottom-4 left-0 text-red-500">
        {error}
      </p>
    </div>
  );
}
