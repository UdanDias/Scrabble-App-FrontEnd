import axios from "axios"

const addPlayerUrl="http://localhost:8081/scrabbleapp2026/api/v1/player/addplayer"
const CreatePlayer=async(newPlayer:any)=>{
    try {
        const response=await axios.post(addPlayerUrl,newPlayer)
        return response.data
    } catch (error) {
        console.error("Error while creating player",error)
        throw error
    }
    
}
export default CreatePlayer