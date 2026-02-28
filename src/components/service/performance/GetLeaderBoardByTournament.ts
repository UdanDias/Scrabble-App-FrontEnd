import axios from "axios";
import FetchToken from "../auth/FetchToken";

const getLeaderBoardByTournamentUrl="http://localhost:8081/scrabbleapp2026/api/v1/performance/getrankedplayers/tournament"

export const GetLeaderBoardByTournament=async(tournamentId:string)=>{
    try {
        console.log("Fetching leaderboard for tournament:", tournamentId);
        const response= await axios.get(`${getLeaderBoardByTournamentUrl}?tournamentId=${tournamentId}`,
            {headers:{
                Authorization:FetchToken()
            }}
        );
        console.log("Response:", response.data);
        return response.data

    } catch (error:any) {
        console.log("Error status:", error?.response?.status);
        console.log("Error data:", error?.response?.data);
        console.error("error while fetching leaderboard data",error)
        throw error
    }
}
