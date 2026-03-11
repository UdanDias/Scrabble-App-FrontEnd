import axios from "axios"
import FetchToken from "../auth/FetchToken"

const removePlayerUrl = "http://localhost:8081/scrabbleapp2026/api/v1/tournament/removeplayer"

const RemoveTournamentPlayer = async (tournamentPlayerId: string) => {
    try {
        const response = await axios.delete(
            `${removePlayerUrl}?tournamentPlayerId=${tournamentPlayerId}`,
            { headers: { Authorization: FetchToken() } }
        )
        return response.data
    } catch (error) {
        console.error("error removing player from tournament", error)
        throw error
    }
}

export default RemoveTournamentPlayer