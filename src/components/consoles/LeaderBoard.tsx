import { useEffect, useEffectEvent, useState } from "react";
import { Accordion, Table } from "react-bootstrap";
import {GetPlayersByRank} from "../service/performance/GetPlayersByRank";



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
            <div className="leaderboard-page">
                <div className="console-table-container">
                    <div className="console-table-wrapper">
                        <Table className="leaderboard-header-table" bordered>
                            <thead>
                                <tr>
                                    <th style={{width: "60px"}}>#Rank</th>
                                    <th style={{paddingRight: "90px", textAlign: "center"}}>Player</th>
                                </tr>
                            </thead>
                        </Table>
                        <Accordion className="leaderboard-accordion">
                            {rankedPlayerData.map((player, index) => (
                                <Accordion.Item eventKey={String(index)} key={player.playerId}>
                                    <Accordion.Header>
                                        <div className="d-flex w-100 pe-3 position-relative">
                                            <div className="rank-divider" style={{width: "45px"}}>
                                                #{player.playerRank}
                                            </div>
                                            <div className="position-absolute start-50 translate-middle-x">
                                                {player.firstName} {player.lastName}
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    {/* <Accordion.Body>
                                        <div className="card p-3">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-6 text-start">
                                                        <p><strong>Total Games Played:</strong> {player.totalGamesPlayed}</p>
                                                        <p><strong>Total Wins:</strong> {player.totalWins}</p>
                                                    </div>
                                                    <div className="col-6 text-start">
                                                        <p><strong>Cum Margin:</strong> {player.cumMargin}</p>
                                                        <p><strong>Avg Margin:</strong> {player.avgMargin}</p>
                                                    </div>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <span className={`badge fs-6 ${
                                                        player.playerRank === 1 ? "bg-warning text-dark" :
                                                        player.playerRank === 2 ? "bg-secondary" :
                                                        player.playerRank === 3 ? "bg-danger" :
                                                        "bg-primary"
                                                    }`}>
                                                        Rank #{player.playerRank}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Accordion.Body> */}
                                    <Accordion.Body>
                                        <div className="leaderboard-inner-table-wrapper">
                                        <table className="leaderboard-inner-table w-100">
                                            <tbody>
                                                <tr>
                                                    <th>Total Games Played</th>
                                                    <td>{player.totalGamesPlayed}</td>
                                                    <th>Total Wins</th>
                                                    <td>{player.totalWins}</td>
                                                </tr>
                                                <tr>
                                                    <th>Cum Margin</th>
                                                    <td>{player.cumMargin}</td>
                                                    <th>Avg Margin</th>
                                                    <td>{player.avgMargin}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </div>
                                        <div className="leaderboard-rank-badge">
                                            <span className={`badge fs-6 ${
                                                player.playerRank === 1 ? "bg-warning text-dark" :
                                                player.playerRank === 2 ? "bg-secondary" :
                                                player.playerRank === 3 ? "bg-danger" :
                                                "bg-primary"
                                            }`}>
                                                Rank #{player.playerRank}
                                            </span>
                                    </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                    
                </div>
            </div>
        </>
    );
}