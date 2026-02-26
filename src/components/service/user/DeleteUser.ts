import axios from "axios"
import FetchToken from "../auth/FetchToken"

const deleteUserUrl="http://localhost:8081/scrabbleapp2026/api/v1/auth/deleteuser"
const DeleteUser=async(userId:string)=>{
    try {
        const response=await axios.delete(`${deleteUserUrl}?userId=${userId}`,
            {headers:{
                Authorization:FetchToken()
            }})
        return response.data

    } catch (error) {
        console.error("error Deleting user Data ",error)
        throw error
    }
}
export default DeleteUser