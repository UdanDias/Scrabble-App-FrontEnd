import { SetStateAction, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import GetGames from "./service/game/GetGames";


interface Game{
    gameId:string;
    player1Id:string;
    player2Id:string;
    score1:number;
    score2:number;
    margin:number;
    isgameTied:boolean;
    winnerId:string;
    gameDate:string;
    isByeGame:boolean;

}
const loadGameData=async(SetGameData:React.Dispatch<SetStateAction<Game[]>>)=>{
    try {
        const gameDetails=await GetGames();
        console.log(gameDetails);
        SetGameData(gameDetails)
    } catch (error) {
        console.error("Error while fetching game Data",error)
        throw error;
    }
    
}
    



export function GameConsole(){
    const [gameData,SetGameData]=useState<Game[]>([]);

    useEffect(()=>{
        loadGameData(SetGameData)
    },[])

    const theads:string[]=[
        "Game Id",
        "Player1 Id",
        "Player2 Id",
        "Score 1",
        "Score 2",
        "Margin",
        "Is Game Tied",
        "Winner Id",
        "Game Date",
        "Is Bye Game",
        "Action"
    ]
    return (
        <>
             <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        {theads.map((tHead,index)=>(
                            <th key={index}>{tHead}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <td>3</td>
                    <td colSpan={2}>Larry the Bird</td>
                    <td>@twitter</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
}