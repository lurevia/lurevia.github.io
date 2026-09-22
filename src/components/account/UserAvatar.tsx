import type { FC } from "react";
import { useAuth } from "../../hooks/useAuth";
import { buildImageUrl } from "../../bin/utils/images";

type UserAvatarProps = {
    size?: number;
    showRing?: boolean;
    className?: string;
};

export const UserAvatar: FC<UserAvatarProps> = ({
    size = 36,
    showRing = false,
    className = "",
}) => {
    const { user } = useAuth();

    if (!user) return null;

    const initials = user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const ringClass = showRing
        ? "ring-2 ring-lurevia-orange ring-offset-2"
        : "";

    if (user.avatarUrl) {
        return (
            <img
                src={buildImageUrl(user.avatarUrl)}
                alt={user.fullName}
                width={size}
                height={size}
                style={{ width: size, height: size }}
                className={`rounded-full object-cover border border-slate-200 shrink-0 ${ringClass} ${className}`}
            />
        );
    }

    return (
        <div
            style={{ width: size, height: size, fontSize: size * 0.36 }}
            className={`rounded-full bg-lurevia-dark text-white flex items-center justify-center font-black shrink-0 select-none ${ringClass} ${className}`}
            aria-label={user.fullName}
        >
            {initials || "?"}
        </div>
    );
};