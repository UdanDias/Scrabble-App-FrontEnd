import axios from "axios"
import FetchToken from "../auth/FetchToken"

const getGamesByRoundUrl = "http://localhost:8081/scrabbleapp2026/api/v1/game/getgamesbyround"

const GetGamesByRound = async (roundId: string) => {
    try {
        const response = await axios.get(`${getGamesByRoundUrl}?roundId=${roundId}`, {
            headers: { Authorization: FetchToken() }
        })
        return response.data
    } catch (error) {
        console.error("error fetching games by round", error)
        throw error
    }
}

export default GetGamesByRound