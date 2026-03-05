// GetSwissPairings.ts
import axios from "axios"
import FetchToken from "../auth/FetchToken"

const getSwissPairingsUrl = "http://localhost:8081/scrabbleapp2026/api/v1/performance/getswisspairing"

const GetSwissPairings = async (tournamentId: string) => {
    try {
        const response = await axios.get(getSwissPairingsUrl, {
            headers: { Authorization: FetchToken() },
            params: { tournamentId }
        })
        return response.data
    } catch (error) {
        console.error("error fetching swiss pairings", error)
        throw error
    }
}

export default GetSwissPairings