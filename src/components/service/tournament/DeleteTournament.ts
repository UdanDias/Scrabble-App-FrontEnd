import axios from "axios"
import FetchToken from "../auth/FetchToken"

const deleteTournamentUrl = "http://localhost:8081/scrabbleapp2026/api/v1/tournament/deletetournament"

const DeleteTournament = async (tournamentId: string) => {
    try {
        const response = await axios.delete(`${deleteTournamentUrl}?tournamentId=${tournamentId}`, {
            headers: { Authorization: FetchToken() }
        })
        return response.data
    } catch (error) {
        console.error("error deleting tournament", error)
        throw error
    }
}

export default DeleteTournament