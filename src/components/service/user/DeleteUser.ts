import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const DeleteUser = async (userId: string) => {
    try {
        const res = await axios.delete(
            `${BASE_URL}/auth/deleteuser?userId=${userId}`,
            {
                headers: { Authorization: FetchToken() }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error while deleting user", error);
        throw error;
    }
};