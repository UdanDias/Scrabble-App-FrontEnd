import axios from "axios"
import FetchToken from "../auth/FetchToken"

const createRoundUrl = "http://localhost:8081/scrabbleapp2026/api/v1/round/addround"

const CreateRound = async (roundData: any) => {
    try {
        const response = await axios.post(createRoundUrl, roundData, {
            headers: { Authorization: FetchToken() }
        })
        return response.data
    } catch (error) {
        console.error("error creating round", error)
        throw error
    }
}

export default CreateRound