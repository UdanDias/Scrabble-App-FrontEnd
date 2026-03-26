import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const DeleteTournament = async (tournamentId: string) => {
    try {
        const res = await axios.delete(
            `${BASE_URL}/tournament/deletetournament?tournamentId=${tournamentId}`,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while deleting tournament", error);
        throw error;
    }
};