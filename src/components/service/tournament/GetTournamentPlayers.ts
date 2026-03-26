import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

 const GetTournamentPlayers = async (tournamentId: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/tournament/getplayers?tournamentId=${tournamentId}`,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while fetching tournament players", error);
        throw error;
    }
};
export default GetTournamentPlayers