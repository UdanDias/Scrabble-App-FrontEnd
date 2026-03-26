import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const GetRoundsByTournament = async (tournamentId: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/round/getroundsbytournament?tournamentId=${tournamentId}`,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while fetching rounds", error);
        throw error;
    }
};