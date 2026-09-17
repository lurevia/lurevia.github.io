import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../../ui/Button";

export const NavbarSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative hidden sm:block mx-4">
      <div className="relative flex items-center w-full">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50/80 text-sm text-slate-800 placeholder-slate-400 pl-5 pr-12 py-2.5 rounded-full border border-slate-200/80 focus:bg-white focus:border-lurevia-cyan focus:ring-1 focus:ring-lurevia-cyan focus:outline-none transition-all shadow-xs"
        />
        
        <Button
          type="submit"
          variant="secondary"
          icon={Search}
          aria-label="Lancer la recherche"
          className="absolute right-1.5 bg-transparent! border-0! p-2! hover:bg-slate-100! text-slate-500 hover:text-slate-800 rounded-full! transition-colors"
        />
      </div>
    </form>
  );
};
