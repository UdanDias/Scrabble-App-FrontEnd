import axios from "axios"
import FetchToken from "../auth/FetchToken"

const updateUserUrl="http://localhost:8081/scrabbleapp2026/api/v1/auth/updateuser"
const UpdateUser=async(userDetails:any)=>{
    try {
        const response=await axios.patch(`${updateUserUrl}?userId=${userDetails.userId}`,userDetails,
            {headers:{
                Authorization:FetchToken()
            }})
        return response.data

    } catch (error) {
        console.error("error Updating user Data ",error)
        throw error
    }
}
export default UpdateUser