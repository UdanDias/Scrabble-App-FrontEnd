import axios from "axios"
import FetchToken from "../auth/FetchToken"
import BASE_URL from "../../../config"

const deleteGameUrl = `${BASE_URL}/game/deletegame`

const DeleteGame = async (gameId: string) => {
    try {
        await axios.delete(`${deleteGameUrl}?gameId=${gameId}`,
            {headers: {Authorization: FetchToken()}}
        )
    } catch (error) {
        console.error("error deleting game Data ", error)
        throw error
    }
}

export default DeleteGame