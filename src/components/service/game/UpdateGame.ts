import axios from "axios"

const updateGameUrl="http://localhost:8081/scrabbleapp2026/api/v1/game/updategame"
const UpdateGame=async(updatedGame:any)=>{
    try {
        const response= await axios.patch(`${updateGameUrl}?gameId=${updatedGame.gameId}`)
        return response.data;
    } catch (error) {
        console.error("Error while updating game",error)
        throw error;
    }
}
export default UpdateGame