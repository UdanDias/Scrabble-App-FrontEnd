import axios from "axios"
import FetchToken from "../auth/FetchToken"
import BASE_URL from "../../../config"

const deletePlayerUrl = `${BASE_URL}/player/deleteplayer`

const DeletePlayer = async (playerId: string) => {
    try {
        await axios.delete(`${deletePlayerUrl}?playerId=${playerId}`,
            {headers: {Authorization: FetchToken()}}
        )
    } catch (error) {
        console.error("Error occurred while deleting player", error)
        throw error
    }
}

export default DeletePlayer