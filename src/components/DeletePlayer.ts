import axios from "axios"

const deletePlayerUrl="http://localhost:3000/scrabbleapp2026/api/v1/player/deleteplayer"
const DeletePlayer=async(playerId:string)=>{
    try {
        await axios.delete(`${deletePlayerUrl}?playerId=${playerId}`)
    } catch (error) {
        console.error("Error occurred while deleting player",error)
        throw error;
    }
}