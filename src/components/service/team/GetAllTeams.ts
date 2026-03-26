import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const GetAllTeams = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/team/getallteams`,
            { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("error while fetching team data", error)
        throw error;
    }
};
