"use client";
import React, { useState } from "react";
import Image from "next/image";

interface SearchViewProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  leftImage?: {
    src: string;
    width: number;
    height: number;
  };
  rightImage?: {
    src: string;
    width: number;
    height: number;
  };
  className?: string;
  disabled?: boolean;
}

const SearchView: React.FC<SearchViewProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  leftImage,
  rightImage,
  className = "",
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(internalValue);
    }
  };

  const handleSearchClick = () => {
    onSearch?.(internalValue);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Left Image/Icon */}
      {leftImage && (
        <div className="absolute left-2 sm:left-3 z-10 flex items-center">
          <Image
            alt="search icon"
            className={`w-[${leftImage.width}px] h-[${leftImage.height}px] cursor-pointer`}
            height={leftImage.height}
            src={leftImage.src}
            width={leftImage.width}
            onClick={handleSearchClick}
          />
        </div>
      )}

      {/* Input Field */}
      <input
        className={`
          w-full
          h-[36px] sm:h-[40px] md:h-[44px]
          ${leftImage ? "pl-8 sm:pl-10" : "pl-3 sm:pl-4"}
          ${rightImage ? "pr-8 sm:pr-10" : "pr-3 sm:pr-4"}
          py-2 sm:py-[4px]
          text-[12px] sm:text-[13px] md:text-[14px]
          font-poppins
          font-normal
          leading-[18px] sm:leading-[21px]
          text-right sm:text-left
          text-primary-dark
          bg-transparent
          border-0
          outline-none
          placeholder:text-primary-dark
          placeholder:opacity-70
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
          transition-all
          duration-200
          focus:outline-none
          focus:ring-0
        `
          .trim()
          .replace(/\s+/g, " ")}
        disabled={disabled}
        placeholder={placeholder}
        type="text"
        value={value !== undefined ? value : internalValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />

      {/* Right Image/Icon */}
      {rightImage && (
        <div className="absolute right-2 sm:right-3 z-10 flex items-center">
          <Image
            alt="search action"
            className={`w-[${rightImage.width}px] h-[${rightImage.height}px] cursor-pointer`}
            height={rightImage.height}
            src={rightImage.src}
            width={rightImage.width}
            onClick={handleSearchClick}
          />
        </div>
      )}
    </div>
  );
};

export default SearchView;
