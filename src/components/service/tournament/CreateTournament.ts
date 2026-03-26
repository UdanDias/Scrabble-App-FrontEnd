import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

const CreateTournament = async (tournamentData: any) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/tournament/addtournament`,
            tournamentData,
            { headers: { Authorization: FetchToken() } }
        );
        return res.data;
    } catch (error) {
        console.error("Error while creating tournament", error);
        throw error;
    }
};
export default CreateTournament