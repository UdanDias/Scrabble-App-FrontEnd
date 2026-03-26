import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

 const GetTeamLeaderboard = async (tournamentId: string) => {
    try {
        const res = await axios.get(`${BASE_URL}/team/getteamleaderboard?tournamentId=${tournamentId}`,
            { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("error while getting leaderboard for teams", error)
        throw error;
    }
};
export default GetTeamLeaderboard