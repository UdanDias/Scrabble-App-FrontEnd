import axios from "axios"
const getPlayerUrl="http://localhost:8081/scrabbleapp2026/api/v1/player/getallplayers"
const getgamesByPlayerIdUrl="http://localhost:8081/scrabbleapp2026/api/v1/game/getplayergames"


export const getPlayer=async()=>{
    try {
        const response=await axios.get(getPlayerUrl)
        return response.data;
    } catch (error) {
        console.error("failed to get the data",error)
        throw error
    }
    
}
export const getGamesByPlayer=async(playerId:string)=>{
    try {
        const response=await axios.get(`${getgamesByPlayerIdUrl}?playerId=${playerId}`)
        return response.data
    } catch (error) {
        console.error("error fetching games by playerId",error)
        throw error;
    }
}