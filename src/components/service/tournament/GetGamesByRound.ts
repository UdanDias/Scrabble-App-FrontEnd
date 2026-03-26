import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

 const GetGamesByRound = async (roundId: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/game/getgamesbyround?roundId=${roundId}`,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while fetching games", error);
        throw error;
    }
};
export default GetGamesByRound