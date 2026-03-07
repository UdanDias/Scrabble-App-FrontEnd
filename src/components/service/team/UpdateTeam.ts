// ── UpdateTeam.ts ─────────────────────────────────────────────────────────────

import axios from "axios";
import FetchToken from "../auth/FetchToken";

const BASE = "http://localhost:8081/scrabbleapp2026/api/v1/team";

export const UpdateTeam = async (teamId: string, data: { teamName: string; teamSize: number; playerIds: string[] }) => {
    try {
        const res = await axios.patch(`${BASE}/updateteam?teamId=${teamId}`, data, { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("Error while updating team",error)
        throw error ;
    }
    
};