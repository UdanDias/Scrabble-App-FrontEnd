import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const RegisterTournamentTeam = async (tournamentId: string, teamId: string) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/tournament/registerteam?tournamentId=${tournamentId}&teamId=${teamId}`,
            {},
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while registering team", error);
        throw error;
    }
};