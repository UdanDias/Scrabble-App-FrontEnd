import axios from "axios"
import FetchToken from "../auth/FetchToken"

const getAllPlayersUrl = "http://localhost:8081/scrabbleapp2026/api/v1/player/getallplayers"

const GetAllPlayers = async () => {
    try {
        const response = await axios.get(getAllPlayersUrl, {
            headers: { Authorization: FetchToken() }
        })
        return response.data
    } catch (error) {
        console.error("error fetching all players", error)
        throw error
    }
}

export default GetAllPlayers