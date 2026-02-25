import axios from "axios";

const baseAuthUrl="http://localhost:8081/scrabbleapp2026/api/v1/auth";
const SignUpTask=async(signUp:any)=>{
    console.log(signUp);
    try {
        const signUpResponse= await axios.post(
            `${baseAuthUrl}/signup`,signUp
        )
        return signUpResponse.data.token
    } catch (error) {
        console.error("Error while sending signUp data ",error)
        throw error;
    }
}

const SignInTask=async(signIn:any)=>{
    console.log(signIn);
    try {
        const signInResponse= await axios.post(
            `${baseAuthUrl}/signin`,signIn
        )
        return signInResponse.data.token
    } catch (error) {
        console.error("Error while sending signIn data ",error)
        throw error;
    }
}
export default {SignUpTask,SignInTask};
