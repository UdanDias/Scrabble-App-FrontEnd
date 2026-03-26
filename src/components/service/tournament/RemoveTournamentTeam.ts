import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const RemoveTournamentTeam = async (tournamentTeamId: string) => {
    try {
        const res = await axios.delete(
            `${BASE_URL}/tournament/removeteam?tournamentPlayerId=${tournamentTeamId}`,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while removing team", error);
        throw error;
    }
};