import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getPlayerIdFromToken } from "./service/auth/GetPlayerId";
import { getPlayer, getSelectedPlayer } from "./service/player/GetPlayer";


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
    const [player, SetPlayer] = useState<Player>({
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

const [game, SetGame] = useState<Game>({
    gameId: "",
    player1Id: "",
    player2Id: "",
    score1: 0,
    score2: 0,
    margin: 0,
    isgameTied: "",
    winnerId: "",
    gameDate: "",
    isByeGame: ""
});

const [performance, SetPerformance] = useState<Performance>({
    playerId: "",
    totalWins: 0,
    totalGamesPlayed: 0,
    cumMargin: 0,
    avgMargin: 0,
    playerRank: 0
});

useEffect(()=>{
    const playerId=getPlayerIdFromToken();
    if (playerId) {
        // use playerId to fetch player data, performance etc
        getSelectedPlayer(playerId);
        fetchPerformance(playerId);
    }

})
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