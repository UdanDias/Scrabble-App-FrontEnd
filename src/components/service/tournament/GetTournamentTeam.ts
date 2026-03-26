import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const GetTournamentTeam = async (tournamentId: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/tournament/getteams?tournamentId=${tournamentId}`,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while fetching tournament teams", error);
        throw error;
    }
};