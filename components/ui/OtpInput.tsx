"use client";

import React, { useRef, useState } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  errorMessage,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (digit.length > 1) return; // Only allow single digits

    const newValue = value.split("");

    newValue[index] = digit;
    const newOtp = newValue.join("");

    onChange(newOtp);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        // Clear current input
        const newValue = value.split("");

        newValue[index] = "";
        onChange(newValue.join(""));
      } else if (index > 0) {
        // Move to previous input
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4 justify-center">
        {Array.from({ length }, (_, index) => (
          <div key={index} className="relative">
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={value[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              disabled={disabled}
              className={`
               text-black w-12 h-12 text-center text-2xl font-semibold bg-transparent border-none outline-none
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text'}
                ${error ? 'text-red-500' : 'text-gray-900'}
              `}
            />
            <div 
              className={`
                absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200
                ${focusedIndex === index 
                  ? 'bg-primary-blue' 
                  : value[index] 
                    ? 'bg-gray-400' 
                    : 'bg-gray-300'
                }
                ${error ? 'bg-red-500' : ''}
              `}
            />
          </div>
        ))}
      </div>
      {error && errorMessage && (
        <p className="text-sm text-red-600 text-center">{errorMessage}</p>
      )}
    </div>
  );
};
