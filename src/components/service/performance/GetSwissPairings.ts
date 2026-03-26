import axios from "axios"
import FetchToken from "../auth/FetchToken"
import BASE_URL from "../../../config"

const getSwissPairingsUrl = `${BASE_URL}/performance/getswisspairing`

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