import axios from "axios"
import FetchToken from "../auth/FetchToken"

const completeRoundUrl = "http://localhost:8081/scrabbleapp2026/api/v1/round/completeround"

const CompleteRound = async (roundId: string) => {
    try {
        const response = await axios.patch(
            `${completeRoundUrl}?roundId=${roundId}`,
            {},
            { headers: { Authorization: FetchToken() } }
        )
        return response.data
    } catch (error) {
        console.error("error completing round", error)
        throw error
    }
}

export default CompleteRound