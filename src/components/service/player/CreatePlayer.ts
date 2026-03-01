import axios from "axios"
import FetchToken from "../auth/FetchToken"

const addPlayerUrl="http://localhost:8081/scrabbleapp2026/api/v1/player/addplayer"
const CreatePlayer=async(newPlayer:any)=>{
    try {
        const response=await axios.post(addPlayerUrl,newPlayer,
            {headers:{
                Authorization:FetchToken()
            }}
        )
        return response.data
    } catch (error) {
        console.error("Error while creating player",error)
        throw error
    }
    
}

export default CreatePlayer