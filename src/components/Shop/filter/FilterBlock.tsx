import type { FC, ReactNode } from "react";

type FilterBlockProps = {
  title: string;
  children: ReactNode;
};

export const FilterBlock: FC<FilterBlockProps> = ({ title, children }) => (
  <div className="border-b border-slate-50 pb-5 last:border-0 last:pb-0">
    <h3 className="text-xs font-black text-lurevia-dark uppercase tracking-wider mb-3">
      {title}
    </h3>
    {children}
  </div>
);