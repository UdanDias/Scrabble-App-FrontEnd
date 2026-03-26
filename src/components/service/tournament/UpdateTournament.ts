import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const UpdateTournament = async (tournamentData: any) => {
    try {
        const res = await axios.patch(
            `${BASE_URL}/tournament/updatetournament?tournamentId=${tournamentData.tournamentId}`,
            tournamentData,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while updating tournament", error);
        throw error;
    }
};