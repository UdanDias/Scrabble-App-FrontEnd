import axios from "axios"
import FetchToken from "../auth/FetchToken"

const registerPlayerUrl = "http://localhost:8081/scrabbleapp2026/api/v1/tournament/registerplayer"

const RegisterTournamentPlayer = async (tournamentId: string, playerId: string) => {
    try {
        const response = await axios.post(
            `${registerPlayerUrl}?tournamentId=${tournamentId}&playerId=${playerId}`,
            {},
            { headers: { Authorization: FetchToken() } }
        )
        return response.data
    } catch (error) {
        console.error("error registering player to tournament", error)
        throw error
    }
}

export default RegisterTournamentPlayer