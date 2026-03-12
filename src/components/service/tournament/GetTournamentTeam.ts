import axios from "axios"
import FetchToken from "../auth/FetchToken"

const getTournamentTeamsUrl = "http://localhost:8081/scrabbleapp2026/api/v1/team/getteams"

const GetTournamentTeam = async (tournamentId: string) => {
    try {
        const response = await axios.get(
            `${getTournamentTeamsUrl}?tournamentId=${tournamentId}`,
            { headers: { Authorization: FetchToken() } }
        )
        return response.data
    } catch (error) {
        console.error("error fetching tournament teams", error)
        throw error
    }
}

export default GetTournamentTeam