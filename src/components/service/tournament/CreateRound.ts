import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

const CreateRound = async (roundData: any) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/round/addround`,
            roundData,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while creating round", error);
        throw error;
    }
};
export default CreateRound