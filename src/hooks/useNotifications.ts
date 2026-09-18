import { useContext } from "react";
import { NotificationsContext } from "../context/notificationsContextDefinition";

export const useNotifications = () => {
    const ctx = useContext(NotificationsContext);
    if (!ctx)
        throw new Error("useNotifications doit être utilisé dans un NotificationsProvider");
    return ctx;
};