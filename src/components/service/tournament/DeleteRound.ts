import axios from "axios"
import FetchToken from "../auth/FetchToken"

const deleteRoundUrl = "http://localhost:8081/scrabbleapp2026/api/v1/round/deleteround"

const DeleteRound = async (roundId: string) => {
    try {
        const response = await axios.delete(`${deleteRoundUrl}?roundId=${roundId}`, {
            headers: { Authorization: FetchToken() }
        })
        return response.data
    } catch (error) {
        console.error("error deleting round", error)
        throw error
    }
}

export default DeleteRound