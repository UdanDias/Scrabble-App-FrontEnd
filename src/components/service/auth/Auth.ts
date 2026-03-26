import axios from "axios";
import BASE_URL from "../../../config";

const baseAuthUrl = `${BASE_URL}/auth`;

export const SignUpTask = async (signUp: any) => {
    console.log(signUp);
    try {
        const signUpResponse = await axios.post(
            `${baseAuthUrl}/signup`, signUp
        )
        return signUpResponse.data.token
    } catch (error) {
        console.error("Error while sending signUp data ", error)
        throw error;
    }
}

export const SignInTask = async (signIn: any) => {
    console.log(signIn);
    try {
        const signInResponse = await axios.post(
            `${baseAuthUrl}/signin`, signIn
        )
        return signInResponse.data.token
    } catch (error) {
        console.error("Error while sending signIn data ", error)
        throw error;
    }
}