import axios from "axios"
const getPlayerUrl="http://localhost:8081/scrabbleapp2026/api/v1/player/getallplayers"

export const getPlayer=async()=>{
    try {
        const response=await axios.get(getPlayerUrl)
        return response.data;
    } catch (error) {
        console.error("failed to get the data",error)
        throw error
    }
    
}