import axios from "axios";
import FetchToken from "../auth/FetchToken";
import BASE_URL from "../../../config";

 const UpdateUser = async (userDetails: any) => {
    try {
        const res = await axios.patch(
            `${BASE_URL}/auth/updateuser?userId=${userDetails.userId}`,
            userDetails,
            {
                headers: { Authorization: FetchToken() }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error while updating user", error);
        throw error;
    }
};
export default UpdateUser