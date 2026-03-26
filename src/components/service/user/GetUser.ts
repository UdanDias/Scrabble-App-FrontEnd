import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

export const GetUsers = async () => {
    try {
        const res = await axios.get(
            `${BASE_URL}/auth/getallusers`,
            {
                headers: { Authorization: FetchToken() }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error while fetching users", error);
        throw error;
    }
};