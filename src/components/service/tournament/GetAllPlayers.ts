import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const GetAllPlayers = async () => {
    try {
        const res = await axios.get(
            `${BASE_URL}/player/getallplayers`,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while fetching players", error);
        throw error;
    }
};