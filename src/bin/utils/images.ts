
export const buildImageUrl = (url: string | undefined): string => {
    if (!url) return "";

    if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("data:") ||
        url.startsWith("blob:")
    ) {
        return url;
    }

    if (url.includes("?v=")) return url;

    const version = __BUILD_TIME__;
    const separator = url.includes("?") ? "&" : "?";

    return `${url}${separator}v=${version}`;
};

declare const __BUILD_TIME__: string;