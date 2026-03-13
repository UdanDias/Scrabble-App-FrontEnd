import axios from "axios";
import FetchToken from "../auth/FetchToken";

const BASE_URL = "http://localhost:8081/scrabbleapp2026/api/v1";
const getLeaderBoardByTournamentUrl = `${BASE_URL}/performance/getrankedplayers/tournament`;
const recalculateUrl = `${BASE_URL}/performance/recalculate`;

export const GetLeaderBoardByTournament = async (tournamentId: string) => {
    try {
        const headers = { Authorization: FetchToken() };

        // ✅ Recalculate first so data is always fresh
        await axios.post(recalculateUrl, null, { headers });

        const response = await axios.get(
            `${getLeaderBoardByTournamentUrl}?tournamentId=${tournamentId}`,
            { headers }
        );

        return response.data;

    } catch (error: any) {
        console.log("Error status:", error?.response?.status);
        console.log("Error data:", error?.response?.data);
        console.error("Error while fetching leaderboard data", error);
        throw error;
    }
};