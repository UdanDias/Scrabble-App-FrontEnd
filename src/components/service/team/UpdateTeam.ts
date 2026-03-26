import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const UpdateTeam = async (teamId: string, data: { teamName: string; teamSize: number; playerIds: string[] }) => {
    try {
        const res = await axios.patch(`${BASE_URL}/team/updateteam?teamId=${teamId}`, data,
            { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("Error while updating team", error)
        throw error;
    }
};