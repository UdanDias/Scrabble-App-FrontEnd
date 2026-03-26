import axios from "axios"
import FetchToken from "../auth/FetchToken"
import BASE_URL from "../../../config"

const updatePlayerUrl = `${BASE_URL}/player/updateplayer`

const UpdatePlayer = async (playerDetails: any) => {
    try {
        const response = await axios.patch(
            `${updatePlayerUrl}?playerId=${playerDetails.playerId}`, playerDetails,
            {headers: {Authorization: FetchToken()}}
        )
        return response.data
    } catch (error) {
        console.error("Error updating player", error)
        throw error
    }
}

export default UpdatePlayer