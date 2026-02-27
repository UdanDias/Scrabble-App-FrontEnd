import { useEffect, useState } from "react";
import { Modal, Accordion, Button } from "react-bootstrap";
import { getGamesByPlayer } from "./GetPlayer";

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
interface GetGamesByPlayerprops{
    show:boolean;
    handleClose:()=>void
    selectedRow:Player|null;
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
export function GamesByPlayer({show,handleClose,selectedRow}:GetGamesByPlayerprops){
    const [games,SetGames]=useState<PlayerGame[]>([])

    const fetchgames=async(playerId:string)=>{
        try {
            const gameData=await getGamesByPlayer(playerId)
            SetGames(gameData)
        } catch (error) {
            console.error("error while fetching game data",error)
            throw error
        }
    }

    useEffect(()=>{
        if(selectedRow){
            SetGames([])
            fetchgames(selectedRow.playerId)
        }
    },[selectedRow])
    {/* Helper function — add this inside the component before return */}
    const getGameResult = (game: PlayerGame) => {
        if (game.bye) {
            return <span className="badge bg-secondary fs-6 " style={{marginRight: "50px"}} >Bye Game</span>
        }
        if (game.gameTied) {
            return <span className="badge bg-warning text-dark fs-6"style={{marginRight: "50px"}}>Game Tied</span>
        }
        if (game.winnerId === selectedRow?.playerId) {
            return <span className="badge bg-success fs-6 " style={{marginRight: "50px"}}>Won the Game</span>
        }
        return <span className="badge bg-danger fs-6" style={{marginRight: "50px"}}>Lost the Game</span>
    }

    return(
        <>
            <Modal show={show} onHide={handleClose} size="lg" className="dark-modal">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Games for {selectedRow ? `${selectedRow.firstName} ${selectedRow.lastName}` : ""}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {games.length === 0 ? (
                        <p className="text-center profile-value">No games found for this player.</p>
                    ) : (
                        <Accordion className="leaderboard-accordion">
                            {games.map((game, index) => (
                                <Accordion.Item eventKey={String(index)} key={game.gameId}>
                                    <Accordion.Header>
                                        Game {String(index + 1).padStart(2, "0")}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className="card p-3">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-6 text-start">
                                                        <p><strong>Game ID:</strong> {game.gameId}</p>
                                                        <p><strong>Player 1:</strong> {game.player1Name}</p>
                                                        <p><strong>Player 2:</strong> {game.player2Name}</p>
                                                        <p><strong>Date:</strong> {game.gameDate}</p>
                                                    </div>
                                                    <div className="col-6 text-start">
                                                        <p><strong>Bye:</strong> {game.bye ? "Yes" : "No"}</p>
                                                        <p><strong>Score:</strong> {game.score1} - {game.score2}</p>
                                                        <p><strong>Margin:</strong> {game.margin}</p>
                                                        <p><strong>Tied:</strong> {game.gameTied ? "Yes" : "No"}</p>
                                                        <p><strong>Winner:</strong> {game.winnerName}</p>
                                                    </div>
                                                </div>
                                                <div className="text-center mt-2">
                                                    {getGameResult(game)}
                                                </div>
                                            </div>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn-edit" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}