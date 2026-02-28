import axios from "axios";
import FetchToken from "../auth/FetchToken";

const getLeaderBoardByTournamentUrl="http://localhost:8081/scrabbleapp2026/api/v1/performance/getrankedplayers/tournament"

export const GetLeaderBoardByTournament=async(tournamentId:string)=>{
    try {
        
        const response= await axios.get(`${getLeaderBoardByTournamentUrl}?tournamentId=${tournamentId}`,
            {headers:{
                Authorization:FetchToken()
            }}
        );
        return response.data

    } catch (error) {
        console.error("error while fetching leaderboard data",error)
        throw error
    }
}
