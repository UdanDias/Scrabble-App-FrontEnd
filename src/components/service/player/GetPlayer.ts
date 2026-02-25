import axios from "axios"
import FetchToken from "../auth/FetchToken"
const getPlayerUrl="http://localhost:8081/scrabbleapp2026/api/v1/player/getallplayers"
const getgamesByPlayerIdUrl="http://localhost:8081/scrabbleapp2026/api/v1/game/getplayergames"


export const getPlayer=async()=>{
    try {
        const response=await axios.get(getPlayerUrl,
            {headers:{
                Authorization:FetchToken()
            }}
        )
        return response.data;
    } catch (error) {
        console.error("failed to get the data",error)
        throw error
    }
    
}
export const getGamesByPlayer=async(playerId:string)=>{
    try {
        const response=await axios.get(`${getgamesByPlayerIdUrl}?playerId=${playerId}`,
            {headers:{
                Authorization:FetchToken()
            }})
        return response.data
    } catch (error) {
        console.error("error fetching games by playerId",error)
        throw error;
    }
}