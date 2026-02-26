import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getPlayerIdFromToken } from "./service/auth/GetPlayerId";
import { getGamesByPlayer, getPlayer, getSelectedPlayer } from "./service/player/GetPlayer";
import { GetSelectedPerformance } from "./service/performance/GetPlayersByRank";


interface Player{
    playerId:string;
    firstName:string;
    lastName:string;
    age:number;
    gender:string;
    dob:string;
    email:string;
    phone:string;
    address:string;
    faculty:string;
    academicLevel:string;
    accountCreatedDate:string;
}
interface Game{
    gameId:string;
    player1Id:string;
    player2Id:string;
    score1:number;
    score2:number;
    margin:number;
    isgameTied:string;
    winnerId:string;
    gameDate:string;
    isByeGame:string;

}
interface Performance{
    playerId:string;
    totalWins:number;
    totalGamesPlayed:number;
    cumMargin:number;
    avgMargin:number;
    playerRank:number;
}
export function Profile(){
    const [player, SetPlayer] = useState<Player|null>({
    playerId: "",
    firstName: "",
    lastName: "",
    age: 0,
    gender: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    faculty: "",
    academicLevel: "",
    accountCreatedDate: ""
});

const [game, SetGames] = useState<Game[]|null>([]);

const [performance, SetPerformance] = useState<Performance|null>({
    playerId: "",
    totalWins: 0,
    totalGamesPlayed: 0,
    cumMargin: 0,
    avgMargin: 0,
    playerRank: 0
});

const fetchData=async()=>{
    const playerId= await getPlayerIdFromToken();
    if (playerId) {
        try {
            const selectedPlayer = await getSelectedPlayer(playerId);
            const selectedPerformance = await GetSelectedPerformance(playerId);
            const playerGames = await getGamesByPlayer(playerId);

            SetPlayer(selectedPlayer);
            SetPerformance(selectedPerformance);
            SetGames(playerGames);

        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    }
      
}

useEffect(()=>{
     fetchData()

},[])
    return(
        <>
            <div  className="d-flex justify-content-center p-4">
                <Card  style={{ width: '50rem' }}>
                    <Card.Body>
                        <Card.Title>Welcome</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            
        </>
    );
}