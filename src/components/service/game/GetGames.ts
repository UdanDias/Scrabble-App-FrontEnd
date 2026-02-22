import axios from "axios"

const getGamesUrl="http://localhost:8081/scrabbleapp2026/api/v1/game/getallgames"
const GetGames=async()=>{
    try {
        const response=await axios.get(getGamesUrl)
        return response.data

    } catch (error) {
        console.error("error Fetching game Data ",error)
        throw error
    }
}
export default GetGames