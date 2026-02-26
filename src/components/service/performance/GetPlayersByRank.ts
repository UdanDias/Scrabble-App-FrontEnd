import axios from "axios"
import FetchToken from "../auth/FetchToken";

const getPlayersByRankUrl="http://localhost:8081/scrabbleapp2026/api/v1/performance/getrankedplayers"
const getSelectedPerformanceUrl="http://localhost:8081/scrabbleapp2026/api/v1/performance/getselectedperformance"

export const GetPlayersByRank=async()=>{
    try {
        
        const response= await axios.get(getPlayersByRankUrl,
            {headers:{
                Authorization:FetchToken()
            }}
        );
        return response.data

    } catch (error) {
        console.error("error while fetching ranked player data",error)
        throw error
    }
}
export const GetSelectedPerformance=async(playerId:string)=>{
    try {
        
        const response= await axios.get(`${getSelectedPerformanceUrl}?playerId=${playerId}`,
            {headers:{
                Authorization:FetchToken()
            }}
        );
        return response.data

    } catch (error) {
        console.error("error while fetching ranked player data",error)
        throw error
    }
}
