import axios from "axios"
import FetchToken from "../auth/FetchToken"

const deletePlayerUrl="http://localhost:8081/scrabbleapp2026/api/v1/player/deleteplayer"
const DeletePlayer=async(playerId:string)=>{
    try {
        await axios.delete(`${deletePlayerUrl}?playerId=${playerId}`,
            {headers:{
                Authorization:FetchToken()
            }})
    } catch (error) {
        console.error("Error occurred while deleting player",error)
        throw error;
    }
}
export default DeletePlayer;