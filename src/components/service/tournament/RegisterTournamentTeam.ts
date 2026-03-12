import axios from "axios"
import FetchToken from "../auth/FetchToken"

const registerTeamUrl = "http://localhost:8081/scrabbleapp2026/api/v1/team/registerteam"

const RegisterTournamentTeam = async (tournamentId: string, TeamId: string) => {
    try {
        const response = await axios.post(
            `${registerTeamUrl}?tournamentId=${tournamentId}&playerId=${TeamId}`,
            {},
            { headers: { Authorization: FetchToken() } }
        )
        return response.data
    } catch (error) {
        console.error("error registering Team to tournament", error)
        throw error
    }
}

export default RegisterTournamentTeam