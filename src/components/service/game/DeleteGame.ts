import axios from "axios"

const deleteGameUrl="http://localhost:8081/scrabbleapp2026/api/v1/game/deletegame"
const DeleteGame=async(gameId:string)=>{
    try {
        await axios.delete(`${deleteGameUrl}?gameId=${gameId}`)
       

    } catch (error) {
        console.error("error deleting game Data ",error)
        throw error
    }
}
export default DeleteGame