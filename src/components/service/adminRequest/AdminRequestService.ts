const BASE = "/api/v1/admin-request";
const getToken = () => localStorage.getItem("token");
const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
});

export const requestAdminAccess = (userId: string) =>
    fetch(`${BASE}/${userId}`, { method: "POST", headers: headers() });

export const getAdminRequestStatus = (userId: string): Promise<string> =>
    fetch(`${BASE}/status/${userId}`, { headers: headers() }).then(r => r.text());

export const getPendingAdminRequests = () =>
    fetch(`${BASE}/pending`, { headers: headers() }).then(r => r.json());

export const resolveAdminRequest = (requestId: string, status: "APPROVED" | "REJECTED") =>
    fetch(`${BASE}/${requestId}/resolve?status=${status}`, {
        method: "PATCH", headers: headers()
    });