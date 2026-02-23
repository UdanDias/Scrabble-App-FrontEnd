import { SetStateAction, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import GetGames from "./service/game/GetGames";
import EditGame from "./service/game/EditGame";
import DeleteGame from "./service/game/DeleteGame";
import { AddGame } from "./service/game/AddGame";


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
    const [showEditGameModal,SetShowEditGameModal]=useState(false)
    const [selectedRow,SetSelectedRow]=useState<Game|null>(null)
    const [showAddGameModal,SetShowAddGameModal]=useState(false)

    useEffect(()=>{
        loadGameData(SetGameData)
    },[])

    const refreshTable=()=>{
        loadGameData(SetGameData)
    }
    const handleEdit=(row:Game)=>{
        SetSelectedRow(null) 
        SetSelectedRow(row)
        SetShowEditGameModal(true)
    }
    const handleOnCloseEdit=()=>{
        SetShowEditGameModal(false)
        SetSelectedRow(null) 
    }
    const handleUpdate=(updatedGame:Game)=>{
        const updatedGameData= gameData.map((game)=>(
            game.gameId===updatedGame.gameId?updatedGame:game
        ))
        SetGameData(updatedGameData)
        
    }
    const handleDelete=async(gameId:string)=>{
        try {
            await DeleteGame(gameId);
            SetGameData(gameData.filter((game)=>(game.gameId!==gameId)))
        } catch (error) {
            console.error("error while deleting game",error)
            throw error
        }

    }
    const handleOnCloseAdd=()=>{
        SetShowAddGameModal(false)
    }
    const handleOnAdd=(newGame:Game)=>{
        SetGameData((prev)=>([...prev,newGame]))
        refreshTable()
    }

    const theads:string[]=[
        "Game Id",
        "Player1 Id",
        "Player2 Id",
        "Score 1",
        "Score 2",
        "Margin",
        "Game Tied",
        "Winner Id",
        "Game Date",
        "Is Bye Game",
        "Action"
    ]
    return (
        <>
            <div className="d-flex justify-content-end p-2">
                <Button variant="success" onClick={() => SetShowAddGameModal(true)}>Add Game</Button>
            </div>
             <Table striped bordered hover >
                
                <thead>
                    <tr>
                        {theads.map((tHead)=>(
                            <th className="text-center" key={tHead}>{tHead}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {gameData.map((row,index)=>(
                        <tr key={row.gameId||index}>
                            {Object.values(row).map((cell,index)=>(
                                <td className="text-center" key={index}>{String(cell ?? '')}</td>
                            ))}
                            <td>
                                <div className="d-flex justify-content-center p-2 gap-2">
                                    <Button variant="secondary" onClick={()=>handleEdit(row)}>Edit</Button>
                                    <Button variant="danger" onClick={()=>handleDelete(row.gameId)}>Delete</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <EditGame
            show={showEditGameModal}
            selectedRow={selectedRow}
            handleClose={handleOnCloseEdit}
            handleUpdate={handleUpdate}
            refreshTable={refreshTable}

            />
            <AddGame
            show={showAddGameModal}
            handleClose={handleOnCloseAdd}
            handleAdd={handleOnAdd}
            />
        </>
    );
}