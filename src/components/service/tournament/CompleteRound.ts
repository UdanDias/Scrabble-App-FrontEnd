import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const CompleteRound = async (roundId: string) => {
    try {
        const res = await axios.patch(
            `${BASE_URL}/round/completeround?roundId=${roundId}`,
            {},
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while completing round", error);
        throw error;
    }
};