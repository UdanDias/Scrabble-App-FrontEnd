import axios from "axios";
import FetchToken from "../auth/FetchToken";

const BASE = "http://localhost:8081/scrabbleapp2026/api/v1/team";

export const CreateTeam = async (data: { teamName: string; teamSize: number; playerIds: string[] }) => {
    try {
        const res = await axios.post(`${BASE}/createteam`, data, 
            { headers: { Authorization: FetchToken() } });
        return res.data;
    } catch (error) {
        console.error("error while creating team",error)
        throw error;
    }
    
};