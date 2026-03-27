export const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("token"); // adjust key if needed
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.userId ?? null; // match your JWT claim name
    } catch {
        return null;
    }
};