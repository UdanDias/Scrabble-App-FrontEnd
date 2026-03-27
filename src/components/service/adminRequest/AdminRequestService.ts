import BASE_URL from "../../../config";

const BASE = `${BASE_URL}/admin-request`;
const getToken = () => localStorage.getItem("scrblToken");
const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
});

export const requestAdminAccess = async (email: string) => {
    const encodedEmail = encodeURIComponent(email);
    const res = await fetch(`${BASE}?email=${encodedEmail}`, { method: "POST", headers: headers() });
    if (!res.ok) throw new Error("Failed to submit request");
    return res;
};

export const getAdminRequestStatus = (email: string): Promise<string> => {
    const encodedEmail = encodeURIComponent(email);
    return fetch(`${BASE}/status?email=${encodedEmail}`, { headers: headers() }).then(r => r.text());
};

export const getPendingAdminRequests = async (): Promise<any[]> => {
    const res = await fetch(`${BASE}/pending`, { headers: headers() });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

export const resolveAdminRequest = (requestId: string, status: "APPROVED" | "REJECTED") =>
    fetch(`${BASE}/resolve?requestId=${requestId}&status=${status}`, {
        method: "PATCH", headers: headers()
    });