import axios from "axios"
import FetchToken from "../auth/FetchToken"

const getRoundsUrl = "http://localhost:8081/scrabbleapp2026/api/v1/round/getroundsbytournament"

const GetRoundsByTournament = async (tournamentId: string) => {
    try {
        const response = await axios.get(`${getRoundsUrl}?tournamentId=${tournamentId}`, {
            headers: { Authorization: FetchToken() }
        })
        return response.data
    } catch (error) {
        console.error("error fetching rounds", error)
        throw error
    }
}

export default GetRoundsByTournament