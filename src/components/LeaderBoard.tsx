import { useEffect, useEffectEvent, useState } from "react";
import { Accordion } from "react-bootstrap";
import GetPlayersByRank from "./service/performance/GetPlayersByRank";



interface RankedPlayerData{
    playerId:string;
    firstName:string;
    lastName:string;
    playerRank:number;
    totalWins:number;
    totalGamesPlayed:number;
    avgMargin:number;
    cumMargin:number;
}
export function LeaderBoard(){

    const [rankedPlayerData,SetRankedPlayerData]=useState<RankedPlayerData[]>([])

    const handlePopulateLeaderBoard=async()=>{
        try {
            const rankedPlayerDetails=await GetPlayersByRank();
            if(rankedPlayerDetails && rankedPlayerDetails.length>0){
                SetRankedPlayerData(rankedPlayerDetails)
            }else{
                SetRankedPlayerData([])
            }
        } catch (error) {
            console.error("Error fetching ranked player data",error)
            throw error ;
        }
    }

    useEffect(()=>{
        handlePopulateLeaderBoard()
    })
    return(
        <>
            <Accordion>
                {rankedPlayerData.map((game, index) => (
                    <Accordion.Item eventKey={String(index)} key={game.gameId} >
                        <Accordion.Header >
                            Game {String(index + 1).padStart(2, "0")}
                        </Accordion.Header>
                                    
                        <Accordion.Body>
                            <div className="card p-3">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-6 text-start">
                                            <p><strong>Gam ID:</strong> {game.gameId}</p>
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
                                        {/* {getGameResult(game)} */}
                                    </div>
                                </div>
                            </div>
                        </Accordion.Body>

                    </Accordion.Item>
                ))}
            </Accordion>
        </>
    );
}