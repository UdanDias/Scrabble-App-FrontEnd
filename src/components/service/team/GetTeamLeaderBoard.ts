// ── GetTeamLeaderboard.ts ─────────────────────────────────────────────────────

import axios from "axios";
import FetchToken from "../auth/FetchToken";

const BASE = "http://localhost:8081/scrabbleapp2026/api/v1/team";

export const GetTeamLeaderboard = async (tournamentId: string) => {
    try {
        const res = await axios.get(`${BASE}/getteamleaderboard?tournamentId=${tournamentId}`, 
            {
             headers: { Authorization: FetchToken() } 
            });
        return res.data;
    } catch (error) {
        console.error ("error while getting leaderboard for teams",error)
        throw error;
    }
    
};