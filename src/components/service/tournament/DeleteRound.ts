import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

 const DeleteRound = async (roundId: string) => {
    try {
        const res = await axios.delete(
            `${BASE_URL}/round/deleteround?roundId=${roundId}`,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while deleting round", error);
        throw error;
    }
};
export default DeleteRound