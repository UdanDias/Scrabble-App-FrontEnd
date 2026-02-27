import { useEffect, useState } from "react";
import { Accordion, Card } from "react-bootstrap";
import { getPlayerIdFromToken } from "../service/auth/GetPlayerId";
import { getGamesByPlayer, getPlayer, getSelectedPlayer } from "../service/player/GetPlayer";
import { GetSelectedPerformance } from "../service/performance/GetPlayersByRank";


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
interface PlayerGame {
    gameId: string;
    player1Id: string;
    player2Id: string;
    player1Name: string;
    player2Name: string;
    winnerName: string;
    score1: number;
    score2: number;
    margin: number;
    gameTied: boolean;
    winnerId: string;
    gameDate: string;
    bye: boolean;
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

const [games, SetGames] = useState<PlayerGame[]|null>([]);

const [performance, SetPerformance] = useState<Performance|null>({
    playerId: "",
    totalWins: 0,
    totalGamesPlayed: 0,
    cumMargin: 0,
    avgMargin: 0,
    playerRank: 0
});

const fetchData=async()=>{
    const playerId = getPlayerIdFromToken();
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

const getGameResult = (game: PlayerGame) => {
        if (game.bye) {
            return <span className="badge bg-secondary fs-6 " style={{marginRight: "50px"}} >Bye Game</span>
        }
        if (game.gameTied) {
            return <span className="badge bg-warning text-dark fs-6"style={{marginRight: "50px"}}>Game Tied</span>
        }
        if (game.winnerId === player?.playerId) {
            return <span className="badge bg-success fs-6 " style={{marginRight: "50px"}}>Won the Game</span>
        }
        return <span className="badge bg-danger fs-6" style={{marginRight: "50px"}}>Lost the Game</span>
    } 
    return (
        <>
            <div className="console-page">
                <div className="console-table-container" style={{width: '70%'}}>

                    {/* Player Profile Card */}
                    <div className="profile-card mb-4">
                        <h3 className="profile-card-title">Player Profile</h3>
                        <div className="row px-4">
                            <div className="col-md-6">
                                <p><span className="profile-label">First Name:</span> {player?.firstName}</p>
                                <p><span className="profile-label">Last Name:</span> {player?.lastName}</p>
                                <p><span className="profile-label">Age:</span> {player?.age}</p>
                                <p><span className="profile-label">Gender:</span> {player?.gender}</p>
                                <p><span className="profile-label">Date of Birth:</span> {player?.dob}</p>
                            </div>
                            <div className="col-md-6">
                                <p><span className="profile-label">Email:</span> {player?.email}</p>
                                <p><span className="profile-label">Phone:</span> {player?.phone}</p>
                                <p><span className="profile-label">Address:</span> {player?.address}</p>
                                <p><span className="profile-label">Faculty:</span> {player?.faculty}</p>
                                <p><span className="profile-label">Academic Level:</span> {player?.academicLevel}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="d-flex gap-4 align-items-stretch">

                        {/* Performance Card */}
                        <div className="profile-card" style={{width: '50%'}}>
                            <h3 className="profile-card-title">Performance</h3>
                            <div className="text-center mb-2">
                                <span className="profile-label">Player ID:</span>
                                <span className="profile-value"> {performance?.playerId}</span>
                            </div>
                            <div className="row text-center">
                                <div className="col-6">
                                    <p><span className="profile-label">Cum Margin:</span> <span className="profile-value">{performance?.cumMargin}</span></p>
                                    <p><span className="profile-label">Avg Margin:</span> <span className="profile-value">{performance?.avgMargin}</span></p>
                                </div>
                                <div className="col-6">
                                    <p><span className="profile-label">Total Games:</span> <span className="profile-value">{performance?.totalGamesPlayed}</span></p>
                                    <p><span className="profile-label">Total Wins:</span> <span className="profile-value">{performance?.totalWins}</span></p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mt-2">
                                <span className={`badge fs-6 ${
                                    performance?.playerRank === 1 ? "bg-warning text-dark" :
                                    performance?.playerRank === 2 ? "bg-secondary" :
                                    performance?.playerRank === 3 ? "bg-danger" :
                                    "bg-primary"
                                }`}>
                                    Rank #{performance?.playerRank}
                                </span>
                            </div>
                        </div>

                        {/* Games Card */}
                        <div className="profile-card d-flex flex-column" style={{width: '50%'}}>
                            <h3 className="profile-card-title">Games</h3>
                            <div className="console-table-wrapper" style={{flex: 1, maxHeight: 'none', overflow: 'visible'}}>
                                {games && games.length === 0 ? (
                                    <p className="text-center profile-value">No games found.</p>
                                ) : (
                                    <Accordion className="leaderboard-accordion">
                                        {games?.map((game, index) => (
                                            <Accordion.Item eventKey={String(index)} key={game.gameId}>
                                                <Accordion.Header>Game {index + 1}</Accordion.Header>
                                                <Accordion.Body>
                                                    <div className="leaderboard-inner-table-wrapper">
                                                        <table className="profile-games-table w-100">
                                                            <tbody>
                                                                <tr>
                                                                    <th>Game ID</th>
                                                                    <td >{game.gameId}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Date</th>
                                                                    <td >{game.gameDate}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Player 1</th>
                                                                    <td>{game.player1Name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Player 2</th>
                                                                    <td>{game.player2Name}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Score</th>
                                                                    <td>{game.score1} - {game.score2}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Margin</th>
                                                                    <td>{game.margin}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Winner</th>
                                                                    <td>{game.winnerName}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Tied</th>
                                                                    <td>{game.gameTied ? "Yes" : "No"}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}