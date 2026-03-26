import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const GetTeamSwissPairings = async (tournamentId: string) => {
    try {
        const res = await axios.get(`${BASE_URL}/team/getteamswisspairing?tournamentId=${tournamentId}`,
            { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("Error while getting pairings", error)
        throw error;
    }
};