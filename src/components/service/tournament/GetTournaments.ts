import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const GetTournaments = async () => {
    try {
        const res = await axios.get(
            `${BASE_URL}/tournament/getalltournaments`,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while fetching tournaments", error);
        throw error;
    }
};