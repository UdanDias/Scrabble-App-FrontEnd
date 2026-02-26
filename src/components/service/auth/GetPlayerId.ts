// TokenUtils.ts
export const getPlayerIdFromToken = (): string | null => {
    const token = localStorage.getItem("scrblToken");
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.playerId;
    } catch (error) {
        console.error("Error decoding token", error);
        return null;
    }
}