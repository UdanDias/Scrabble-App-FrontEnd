import axios from "axios"

const getPlayersByRankUrl="http://localhost:8081/scrabbleapp2026/api/v1/performance/getrankedplayers"
const GetPlayersByRank=async()=>{
    try {
        const response= await axios.get(getPlayersByRankUrl);
        return response.data

    } catch (error) {
        console.error("error while fetching ranked player data",error)
        throw error
    }
}
export default GetPlayersByRank;