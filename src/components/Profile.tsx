import { useEffect, useState } from "react";
import { Accordion, Card } from "react-bootstrap";
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
    return (
        <>
            <div
                className="mx-auto mt-4 p-4"
                style={{
                    width: "70%",
                    border: "2px solid #ccc",
                    borderRadius: "10px",
                    backgroundColor: "#f8f9fa"
                }}
            >

                {/* Player Profile Card */}
                <div className="d-flex justify-content-center mb-4">
                    <Card style={{ width: "100%" }} className="shadow">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center fs-3">
                                Player Profile
                            </Card.Title>

                            <div className="row px-4" style={{ marginLeft: "70px" }}>
                                <div className="col-md-5 offset-md-1">
                                    <p><strong>First Name:</strong> {player?.firstName}</p>
                                    <p><strong>Last Name:</strong> {player?.lastName}</p>
                                    <p><strong>Age:</strong> {player?.age}</p>
                                    <p><strong>Gender:</strong> {player?.gender}</p>
                                    <p><strong>Date of Birth:</strong> {player?.dob}</p>
                                </div>

                                <div className="col-md-5 offset-md-1">
                                    <p><strong>Email:</strong> {player?.email}</p>
                                    <p><strong>Phone:</strong> {player?.phone}</p>
                                    <p><strong>Address:</strong> {player?.address}</p>
                                    <p><strong>Faculty:</strong> {player?.faculty}</p>
                                    <p><strong>Academic Level:</strong> {player?.academicLevel}</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                {/* Bottom Section - Two Cards Side by Side */}
                <div className="d-flex justify-content-center gap-4 mb-4">

                    <Card style={{ width: "50%" }} className="shadow">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center fs-3">
                                Performance 
                            </Card.Title>

                            <div className="row text-center px-4">
                                <div className="text-center">
                                    <p className="mt-3"><strong>Player ID : </strong>{performance?.playerId}</p>
                                </div>
                                {/* Left Column */}
                                <div className="col-md-6">

                                    <p className="mt-3"><strong>Cum Margin : </strong>{performance?.cumMargin}</p>
                                    <p><strong>Avg Margin : </strong>{performance?.avgMargin}</p>
                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">
                                    

                                    <p className="mt-3"><strong>Total Games : </strong>{performance?.totalGamesPlayed}</p>

                                    <p className="mt-3"><strong>Total Wins : </strong>{performance?.totalWins}</p>

                                </div>
                                <div className="text-center mt-2">
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
                        </Card.Body>
                    </Card>

                    <Card style={{ width: "50%" }} className="shadow">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center fs-3">
                                Games 
                            </Card.Title>

                            <div className="px-3">

                                {game && game.length === 0 ? (
                                    <p className="text-center">No games found.</p>
                                ) : (
                                    <Accordion >

                                        {game?.map((g, index) => (
                                            <Accordion.Item eventKey={String(index)} key={g.gameId}>
                                                <Accordion.Header>
                                                    Game {index + 1}
                                                </Accordion.Header>

                                                <Accordion.Body>
                                                    <div className="row">

                                                        <div className="col-6">
                                                            <p><strong>Date:</strong> {g.gameDate}</p>
                                                            <p><strong>Score:</strong> {g.score1} - {g.score2}</p>
                                                            <p><strong>Margin:</strong> {g.margin}</p>
                                                        </div>

                                                        <div className="col-6">
                                                            <p><strong>Winner:</strong> {g.winnerId}</p>
                                                            <p><strong>Tied:</strong> {g.isgameTied}</p>
                                                            <p><strong>Bye:</strong> {g.isByeGame}</p>
                                                        </div>

                                                    </div>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}

                                    </Accordion>
                                )}

                            </div>
                        </Card.Body>
                    </Card>

                </div>
            </div>
        </>
    );
}