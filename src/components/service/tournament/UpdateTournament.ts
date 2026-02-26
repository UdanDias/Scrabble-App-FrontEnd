import axios from "axios"
import FetchToken from "../auth/FetchToken"

const updateTournamentUrl = "http://localhost:8081/scrabbleapp2026/api/v1/tournament/updatetournament"

const UpdateTournament = async (tournamentData: any) => {
    try {
        const response = await axios.patch(
            `${updateTournamentUrl}?tournamentId=${tournamentData.tournamentId}`,
            tournamentData,
            { headers: { Authorization: FetchToken() } }
        )
        return response.data
    } catch (error) {
        console.error("error updating tournament", error)
        throw error
    }
}

export default UpdateTournament