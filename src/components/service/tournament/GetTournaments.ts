import axios from "axios"
import FetchToken from "../auth/FetchToken"

const getTournamentsUrl = "http://localhost:8081/scrabbleapp2026/api/v1/tournament/getalltournaments"

const GetTournaments = async () => {
    try {
        const response = await axios.get(getTournamentsUrl, {
            headers: { Authorization: FetchToken() }
        })
        return response.data
    } catch (error) {
        console.error("error fetching tournaments", error)
        throw error
    }
}

export default GetTournaments