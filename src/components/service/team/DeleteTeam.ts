import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

 const DeleteTeam = async (teamId: string) => {
    try {
        const res = await axios.delete(`${BASE_URL}/team/deleteteam?teamId=${teamId}`,
            { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("error while deleting team", error);
        throw error;
    }
};
export default DeleteTeam