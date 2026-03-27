export const getUserEmailFromToken = (): string | null => {
    const token = localStorage.getItem("scrblToken");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub ?? null;
    } catch {
        return null;
    }
};
