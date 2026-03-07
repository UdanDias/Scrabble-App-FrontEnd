// ── GetAllTeams.ts ────────────────────────────────────────────────────────────
import axios from "axios";
import FetchToken from "../auth/FetchToken";

const BASE = "http://localhost:8081/scrabbleapp2026/api/v1/team";

export const GetAllTeams = async () => {
    const res = await axios.get(`${BASE}/getallteams`, { headers: { Authorization: FetchToken() } });
    return res.data;
};

// ── CreateTeam.ts ─────────────────────────────────────────────────────────────
export const CreateTeam = async (data: { teamName: string; teamSize: number; playerIds: string[] }) => {
    const res = await axios.post(`${BASE}/createteam`, data, { headers: { Authorization: FetchToken() } });
    return res.data;
};

// ── UpdateTeam.ts ─────────────────────────────────────────────────────────────
export const UpdateTeam = async (teamId: string, data: { teamName: string; teamSize: number; playerIds: string[] }) => {
    const res = await axios.patch(`${BASE}/updateteam?teamId=${teamId}`, data, { headers: { Authorization: FetchToken() } });
    return res.data;
};

// ── DeleteTeam.ts ─────────────────────────────────────────────────────────────
export const DeleteTeam = async (teamId: string) => {
    const res = await axios.delete(`${BASE}/deleteteam?teamId=${teamId}`, { headers: { Authorization: FetchToken() } });
    return res.data;
};

// ── GetTeamLeaderboard.ts ─────────────────────────────────────────────────────
export const GetTeamLeaderboard = async (tournamentId: string) => {
    const res = await axios.get(`${BASE}/getteamleaderboard?tournamentId=${tournamentId}`, { headers: { Authorization: FetchToken() } });
    return res.data;
};

// ── GetTeamSwissPairings.ts ───────────────────────────────────────────────────
export const GetTeamSwissPairings = async (tournamentId: string) => {
    const res = await axios.get(`${BASE}/getteamswisspairing?tournamentId=${tournamentId}`, { headers: { Authorization: FetchToken() } });
    return res.data;
};