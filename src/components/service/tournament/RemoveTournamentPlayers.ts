import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const RemoveTournamentPlayer = async (tournamentPlayerId: string) => {
    try {
        const res = await axios.delete(
            `${BASE_URL}/tournament/removeplayer?tournamentPlayerId=${tournamentPlayerId}`,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while removing player", error);
        throw error;
    }
};
export default RemoveTournamentPlayer