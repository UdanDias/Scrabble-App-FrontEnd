import axios from "axios";
import FetchToken from "../auth/FetchToken";


const BASE = "http://localhost:8081/scrabbleapp2026/api/v1/team";

export const GetAllTeams = async () => {
    try {
        const res = await axios.get(`${BASE}/getallteams`,
            { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("error while fetching team data",error)
        throw error;
    }
   
};