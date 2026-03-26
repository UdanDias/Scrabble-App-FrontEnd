import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const RegisterTournamentPlayer = async (tournamentId: string, playerId: string) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/tournament/registerplayer?tournamentId=${tournamentId}&playerId=${playerId}`,
            {},
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while registering player", error);
        throw error;
    }
};