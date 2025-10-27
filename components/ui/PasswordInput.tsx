"use client";
import React, { useState } from "react";
import { Key } from "lucide-react";

interface PasswordInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  label?: string;
  iconVariant?: "eye" | "key";
  size?: "sm" | "md" | "lg";
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder = "",
  value = "",
  onChange,
  disabled = false,
  required = false,
  className = "",
  id,
  name,
  label = "",
  iconVariant = "eye",
  size = "md",
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Size variants
  const sizeClasses = {
    sm: "h-[32px] px-2 py-1 text-xs pr-10",
    md: "h-[40px] px-3 py-2 text-sm pr-10",
    lg: "h-[48px] px-4 py-3 text-base pr-12",
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className="block text-sm font-lexend font-normal text-global-1 mb-2"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full
            ${sizeClasses[size]}
            bg-background
            border border-solid border-border
            rounded-md
            shadow-[0px_1px_2px_#0000000c]
            focus:outline-none
            focus:ring-1
            focus:ring-global-text2
            focus:border-global-text2
            transition-all
            duration-200
            ease-in-out
            disabled:opacity-50
            disabled:cursor-not-allowed
          `
            .trim()
            .replace(/\s+/g, " ")}
          disabled={disabled}
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
        />
        <button
          className={`absolute top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600 transition-colors duration-200 ${
            size === "sm" ? "right-2" : size === "md" ? "right-3" : "right-4"
          }`}
          disabled={disabled}
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={togglePasswordVisibility}
        >
          {iconVariant === "key" ? (
            <Key className={`${
              size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"
            } ${showPassword ? "text-gray-600" : "text-black"}`} />
          ) : showPassword ? (
            <svg
              fill="none"
              height={size === "sm" ? "16" : size === "md" ? "20" : "24"}
              viewBox="0 0 24 24"
              width={size === "sm" ? "16" : size === "md" ? "20" : "24"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <svg
              fill="none"
              height={size === "sm" ? "16" : size === "md" ? "20" : "24"}
              viewBox="0 0 24 24"
              width={size === "sm" ? "16" : size === "md" ? "20" : "24"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M2.458 12C3.732 7.943 7.523 5 12 5C16.478 5 20.268 7.943 21.542 12C20.268 16.057 16.478 19 12 19C7.523 19 3.732 16.057 2.458 12Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
