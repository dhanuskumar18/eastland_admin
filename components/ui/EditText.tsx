"use client";
import React, { useState, forwardRef } from "react";

interface EditTextProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  className?: string;
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "outlined" | "filled" | "standard";
}

const EditText = forwardRef<HTMLInputElement, EditTextProps>(
  (
    {
      value,
      defaultValue,
      placeholder = "",
      type = "text",
      disabled = false,
      readOnly = false,
      required = false,
      maxLength,
      minLength,
      pattern,
      autoComplete,
      autoFocus = false,
      name,
      id,
      className = "",
      onChange,
      onFocus,
      onBlur,
      onKeyPress,
      onKeyDown,
      onKeyUp,
      leftIcon,
      rightIcon,
      error = false,
      errorMessage,
      helperText,
      label,
      size = "md",
      variant = "outlined",
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue, e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Size variants
    const sizeClasses = {
      sm: "h-[32px] px-[8px] py-[6px] text-[12px] sm:text-[13px]",
      md: "h-[36px] sm:h-[40px] px-[10px] py-[8px] sm:py-[10px] text-[13px] sm:text-[14px]",
      lg: "h-[44px] sm:h-[48px] px-[12px] py-[10px] sm:py-[12px] text-[14px] sm:text-[16px]",
    };

    // Variant styles
    const variantClasses = {
      outlined: `border border-border ${
        error
          ? "border-red-500 focus:border-red-500"
          : isFocused
            ? "border-primary-blue"
            : "border-[#eaeaea]"
      } rounded-[6px] bg-transparent`,
      filled: `border-0 rounded-[6px] ${error ? "bg-red-50" : "bg-light-gray"}`,
      standard: `border-0 border-b border-solid ${
        error
          ? "border-red-500"
          : isFocused
            ? "border-primary-blue"
            : "border-border"
      } rounded-none bg-transparent`,
    };

    const inputValue = value !== undefined ? value : internalValue;

    return (
      <div className={`w-full ${className}`}>
        {/* Label */}
        {label && (
          <label
            className={`block text-[12px] sm:text-[13px] font-medium mb-1 sm:mb-2 ${
              error ? "text-red-500" : "text-gray-700"
            }`}
            htmlFor={id}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative flex items-center">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-2 sm:left-3 z-10 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            className={`
            w-full
            bg-background
            border border-border 
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${leftIcon ? "pl-8 sm:pl-10" : ""}
            ${rightIcon ? "pr-8 sm:pr-10" : ""}
            font-lexend
            font-normal
            leading-[18px] sm:leading-[20px]
            text-primary-dark
            placeholder:opacity-70
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-text"}
            ${readOnly ? "cursor-default" : ""}
            transition-all
            duration-200
            focus:outline-none
            focus:ring-2
            focus:ring-primary-light-blue
            focus:ring-opacity-20
            ${error ? "focus:ring-red-500 focus:ring-opacity-20" : ""}
          `
              .trim()
              .replace(/\s+/g, " ")}
            defaultValue={undefined}
            disabled={disabled}
            id={id}
            maxLength={maxLength}
            minLength={minLength}
            name={name}
            pattern={pattern}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            type={type}
            value={inputValue}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            onKeyPress={onKeyPress}
            onKeyUp={onKeyUp}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-2 sm:right-3 z-10 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || errorMessage) && (
          <div className="mt-1 sm:mt-2">
            <span
              className={`text-[11px] sm:text-[12px] ${
                error ? "text-red-500" : "text-gray-500"
              }`}
            >
              {error ? errorMessage : helperText}
            </span>
          </div>
        )}
      </div>
    );
  },
);

EditText.displayName = "EditText";

export default EditText;
