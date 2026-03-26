import axios from "axios"
import FetchToken from "../auth/FetchToken"
import BASE_URL from "../../../config"

const updateGameUrl = `${BASE_URL}/game/updategame`

const UpdateGame = async (updatedGame: any) => {
    try {
        console.log("Sending update:", JSON.stringify(updatedGame, null, 2))
        const response = await axios.patch(`${updateGameUrl}?gameId=${updatedGame.gameId}`, updatedGame,
            {headers: {Authorization: FetchToken()}}
        )
        return response.data
    } catch (error) {
        console.error("Error while updating game", error)
        throw error
    }
}

export default UpdateGame