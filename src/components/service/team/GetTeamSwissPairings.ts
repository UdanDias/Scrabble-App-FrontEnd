import axios from "axios";
import FetchToken from "../auth/FetchToken";

const BASE = "http://localhost:8081/scrabbleapp2026/api/v1/team";


// ── GetTeamSwissPairings.ts ───────────────────────────────────────────────────
export const GetTeamSwissPairings = async (tournamentId: string) => {
    try {
        const res = await axios.get(`${BASE}/getteamswisspairing?tournamentId=${tournamentId}`, { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("Error while getting pairings",error)
        throw error;
    }
    
};