import axios from "axios"
import FetchToken from "../auth/FetchToken"

const createTournamentUrl = "http://localhost:8081/scrabbleapp2026/api/v1/tournament/addtournament"

const CreateTournament = async (tournamentData: any) => {
    try {
        const response = await axios.post(createTournamentUrl, tournamentData, {
            headers: { Authorization: FetchToken() }
        })
        return response.data
    } catch (error) {
        console.error("error creating tournament", error)
        throw error
    }
}

export default CreateTournament