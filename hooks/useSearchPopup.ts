import { useState, useCallback } from 'react';

export function useSearchPopup() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openSearch = useCallback((query?: string) => {
    setSearchQuery(query || '');
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
  }, []);

  const toggleSearch = useCallback((query?: string) => {
    if (isSearchOpen) {
      closeSearch();
    } else {
      openSearch(query);
    }
  }, [isSearchOpen, openSearch, closeSearch]);

  return {
    isSearchOpen,
    searchQuery,
    openSearch,
    closeSearch,
    toggleSearch
  };
}
