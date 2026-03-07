import axios from "axios";
import FetchToken from "../auth/FetchToken";
const BASE = "http://localhost:8081/scrabbleapp2026/api/v1/team";
// ── DeleteTeam.ts ─────────────────────────────────────────────────────────────
export const DeleteTeam = async (teamId: string) => {
    try {
        const res = await axios.delete(`${BASE}/deleteteam?teamId=${teamId}`, 
            { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("error while deleting team",error);
        throw error;
    }
    
};