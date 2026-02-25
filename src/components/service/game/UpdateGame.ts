import axios from "axios"
import FetchToken from "../auth/FetchToken";

const updateGameUrl="http://localhost:8081/scrabbleapp2026/api/v1/game/updategame"
const UpdateGame=async(updatedGame:any)=>{
    try {
        const response= await axios.patch(`${updateGameUrl}?gameId=${updatedGame.gameId}`,updatedGame,
            {headers:{
                Authorization:FetchToken()
            }})
        return response.data;
    } catch (error) {
        console.error("Error while updating game",error)
        throw error;
    }
}
export default UpdateGame