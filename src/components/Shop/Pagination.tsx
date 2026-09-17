import type { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onChange,
}) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 mt-8 md:mt-12 select-none"
    >
      <Button
        type="button"
        variant="primary"
        icon={ChevronLeft}
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
        aria-label="Page précédente"
        className="w-8! h-8! p-0! rounded-full! border-slate-100! bg-slate-50! text-slate-600! hover:bg-slate-100! shadow-none flex items-center justify-center transition-all cursor-pointer active:scale-90"
      />

      {pages.map((page) => {
        const isActive = page === currentPage;
        
        return (
          <Button
            key={page}
            type="button"
            variant={isActive ? "primary" : "secondary"}
            onClick={() => onChange(page)}
            aria-label={`Aller à la page ${page}`}
            className={`w-8! h-8! p-0! rounded-full! text-xs font-black transition-all flex items-center justify-center cursor-pointer shadow-none ${
              isActive
                ? "bg-lurevia-dark! text-white! shadow-md! shadow-lurevia-dark/20 scale-105"
                : "bg-slate-100! text-slate-600! border-transparent! hover:bg-slate-200!"
            }`}
          >
            {page}
          </Button>
        );
      })}

      <Button
        type="button"
        variant="primary"
        icon={ChevronRight}
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
        aria-label="Page suivante"
        className="w-8! h-8! p-0! rounded-full! border-slate-100! bg-slate-50! text-slate-600! hover:bg-slate-100! shadow-none flex items-center justify-center transition-all cursor-pointer active:scale-90"
      />
    </nav>
  );
};
