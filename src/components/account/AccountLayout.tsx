import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { AccountSidebar } from "./AccountSidebar";

export const AccountLayout: FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-28 md:pb-16">
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
      <AccountSidebar />
      <div className="space-y-6">
        <Outlet />
      </div>
    </div>
  </div>
);