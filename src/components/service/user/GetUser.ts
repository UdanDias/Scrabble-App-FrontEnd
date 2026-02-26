import axios from "axios"
import FetchToken from "../auth/FetchToken"

const getUserUrl="http://localhost:8081/scrabbleapp2026/api/v1/auth/getallusers"
const GetUsers=async()=>{
    try {
        const response=await axios.get(getUserUrl,
            {headers:{
                Authorization:FetchToken()
            }})
        return response.data

    } catch (error) {
        console.error("error Fetching user Data ",error)
        throw error
    }
}
export default GetUsers