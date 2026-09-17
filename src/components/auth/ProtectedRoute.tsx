import type { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type ProtectedRouteProps = {
    children: ReactNode;
    redirectTo?: string;
    reason?: string;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
    children,
    redirectTo = "/auth",
}) => {
    const { isAuthenticated, isReady } = useAuth();
    const location = useLocation();

    if (!isReady) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-lurevia-orange rounded-full animate-spin" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Chargement…
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to={redirectTo}
                replace
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    return <>{children}</>;
};