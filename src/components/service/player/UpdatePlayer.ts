import axios from "axios"
import FetchToken from "../auth/FetchToken";

const updatePlayerUrl="http://localhost:8081/scrabbleapp2026/api/v1/player/updateplayer"

const UpdatePlayer= async(playerDetails:any)=>{
    try {
        const response=await axios.patch(
            `${updatePlayerUrl}?playerId=${playerDetails.playerId}`,playerDetails,
            {headers:{
                Authorization:FetchToken()
            }}
        )
        return response.data;

        
    } catch (error) {
        console.error("Error updating player",error)
        throw error;
    }
}
export default UpdatePlayer