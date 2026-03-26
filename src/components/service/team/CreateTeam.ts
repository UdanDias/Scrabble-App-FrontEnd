import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const CreateTeam = async (data: { teamName: string; teamSize: number; playerIds: string[] }) => {
    try {
        const res = await axios.post(`${BASE_URL}/team/createteam`, data,
            { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("error while creating team", error)
        throw error;
    }
};