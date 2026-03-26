import axios from "axios"
import FetchToken from "../auth/FetchToken"
import BASE_URL from "../../../config"

const getPlayerUrl = `${BASE_URL}/player/getallplayers`
const getgamesByPlayerIdUrl = `${BASE_URL}/game/getplayergames`
const getSelectedPlayerUrl = `${BASE_URL}/player/getselectedplayer`

export const getPlayer = async () => {
    try {
        const response = await axios.get(getPlayerUrl,
            {headers: {Authorization: FetchToken()}}
        )
        return response.data
    } catch (error) {
        console.error("failed to get the data", error)
        throw error
    }
}

export const getSelectedPlayer = async (playerId: string) => {
    try {
        const response = await axios.get(`${getSelectedPlayerUrl}?playerId=${playerId}`,
            {headers: {Authorization: FetchToken()}}
        )
        return response.data
    } catch (error) {
        console.error("failed to get the selected player", error)
        throw error
    }
}

 export const getGamesByPlayer = async (playerId: string) => {
    try {
        const response = await axios.get(`${getgamesByPlayerIdUrl}?playerId=${playerId}`,
            {headers: {Authorization: FetchToken()}}
        )
        return response.data
    } catch (error) {
        console.error("error fetching games by playerId", error)
        throw error
    }
}
