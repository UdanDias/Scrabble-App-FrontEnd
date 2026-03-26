import axios from "axios"
import FetchToken from "../auth/FetchToken"
import BASE_URL from "../../../config"

const getGamesUrl = `${BASE_URL}/game/getallgames`

const GetGames = async () => {
    try {
        const response = await axios.get(getGamesUrl,
            {headers: {Authorization: FetchToken()}}
        )
        return response.data
    } catch (error) {
        console.error("error Fetching game Data ", error)
        throw error
    }
}

export default GetGames