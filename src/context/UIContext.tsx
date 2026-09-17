import { createContext, useContext, useMemo, useState } from "react";
import type { FC, ReactNode } from "react";

type UIContextType = {
    isOverlayOpen: boolean;
    setOverlay: (open: boolean) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const value = useMemo(
        () => ({
            isOverlayOpen,
            setOverlay: (open: boolean) => setIsOverlayOpen(open),
        }),
        [isOverlayOpen]
    );

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUIOverlay = (): UIContextType => {
    const ctx = useContext(UIContext);
    if (!ctx)
        throw new Error("useUIOverlay doit être utilisé dans un UIProvider");
    return ctx;
};