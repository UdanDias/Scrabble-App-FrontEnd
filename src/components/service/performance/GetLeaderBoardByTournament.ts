import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

const getLeaderBoardByTournamentUrl = `${BASE_URL}/performance/getrankedplayers/tournament`;
const recalculateUrl = `${BASE_URL}/performance/recalculate`;

 export const GetLeaderBoardByTournament = async (tournamentId: string) => {
    try {
        const headers = { Authorization: FetchToken() };

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
