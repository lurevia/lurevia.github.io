import { useEffect, useRef, useState } from "react";
import type { FC, ChangeEvent, KeyboardEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import { SearchSuggestions } from "./SearchSuggestions";
import { useSearchSuggestions } from "../../../hooks/useSearchSuggestions";

type NavbarSearchProps = {
  variant?: "desktop" | "mobile";
  placeholder?: string;
  onSearch?: () => void;
};

export const NavbarSearch: FC<NavbarSearchProps> = ({
  variant = "desktop",
  placeholder = "Rechercher un produit, une catégorie…",
  onSearch,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { suggestions, totalResults } = useSearchSuggestions(query);

  const showSuggestions = isOpen && query.trim().length >= 2;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[activeIndex];
      if (selected) {
        navigate(`/produit/${selected.id}`);
        handleClose();
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    handleClose();
  };

  const handleClear = () => {
    setQuery("");
    setActiveIndex(-1);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveIndex(-1);
    onSearch?.();
  };

  const wrapperClass =
    variant === "mobile"
      ? "relative flex items-center bg-[#F7F5F3] border border-slate-100 rounded-2xl w-full h-11 pl-3.5 pr-2 gap-2 transition-colors focus-within:bg-white focus-within:border-lurevia-cyan"
      : "relative flex items-center bg-slate-50/80 border border-slate-200/80 rounded-full w-full h-11 pl-5 pr-2 gap-2 transition-all focus-within:bg-white focus-within:border-lurevia-cyan focus-within:ring-1 focus-within:ring-lurevia-cyan";

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search">
        <div className={wrapperClass}>
          <Search
            size={variant === "mobile" ? 16 : 18}
            className="text-slate-400 shrink-0 pointer-events-none"
            aria-hidden="true"
          />

          <input
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setIsOpen(true)}
            placeholder={placeholder}
            aria-label="Rechercher"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            autoComplete="off"
            className={`w-full bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none ${
              variant === "mobile" ? "text-xs" : "text-sm"
            }`}
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Effacer la recherche"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full transition-colors shrink-0"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && (
        <SearchSuggestions
          query={query.trim()}
          suggestions={suggestions}
          totalResults={totalResults}
          activeIndex={activeIndex}
          onSelect={handleClose}
        />
      )}
    </div>
  );
};