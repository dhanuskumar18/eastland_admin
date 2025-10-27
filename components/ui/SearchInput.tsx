'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

// Search result interface
interface SearchResult {
  id: string;
  label: string;
  description?: string;
  type?: string;
}

// Props interface for the search component
interface SearchInputProps {
  placeholder?: string;
  value?: string; // Add controlled value
  onInputChange?: (value: string) => void; // Add input change handler
  onSearch: (query: string) => void;
  onClear?: () => void;
  suggestions?: SearchResult[];
  onSuggestionSelect?: (suggestion: SearchResult) => void;
  debounceMs?: number;
  className?: string;
  showSuggestions?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export const SearchInput = ({
  placeholder = "Search...",
  value: controlledValue, // Add controlled value
  onInputChange, // Add input change handler
  onSearch,
  onClear,
  suggestions = [],
  onSuggestionSelect,
  debounceMs = 300,
  className = "",
  showSuggestions = true,
  loading = false,
  disabled = false
}: SearchInputProps) => {
  const { resolvedTheme } = useTheme()
  const [internalQuery, setInternalQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Use controlled value if provided, otherwise use internal state
  const query = controlledValue !== undefined ? controlledValue : internalQuery
  const setQuery = controlledValue !== undefined ? onInputChange || (() => {}) : setInternalQuery

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(value.length > 0 && showSuggestions);
  };

  // Handle clear
  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setShowDropdown(false);
    onClear?.();
  }, [onClear, setQuery]);

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((suggestion: SearchResult) => {
    setQuery(suggestion.label);
    setDebouncedQuery(suggestion.label);
    setShowDropdown(false);
    onSuggestionSelect?.(suggestion);
    inputRef.current?.blur();
  }, [onSuggestionSelect, setQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on query
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.label.toLowerCase().includes(query.toLowerCase()) ||
    suggestion.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className={`
        relative bg-dark2 rounded-lg border border-gray-300 dark:border-gray-600 
        transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400
        ${isFocused ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="
            w-full bg-transparent outline-none text-gray-700 dark:text-gray-300 text-base 
            placeholder-gray-500 dark:placeholder-gray-400 px-10 py-2 pr-10
            transition-colors duration-300
          "
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="
              absolute right-3 top-1/2 transform -translate-y-1/2 
              text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
              transition-colors duration-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600
            "
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showDropdown && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="
            absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg 
            max-h-64 overflow-y-auto z-50
          "
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.id}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="
                px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer
                transition-colors duration-200 border-b border-gray-100 dark:border-gray-700
                last:border-b-0
              "
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {suggestion.label}
                  </div>
                  {suggestion.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {suggestion.description}
                    </div>
                  )}
                </div>
                {suggestion.type && (
                  <span className="
                    text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 
                    text-blue-800 dark:text-blue-200
                  ">
                    {suggestion.type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showDropdown && query && filteredSuggestions.length === 0 && !loading && (
        <div className="
          absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50
        ">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found for "{query}"</p>
            <p className="text-xs mt-1">Try different keywords or check your spelling</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
