import React,{ useEffect, useState } from "react";
import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
import { CreateByeGame } from "./CreateGame";
import { getPlayer } from "../player/GetPlayer";

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
interface ByeGame {
    playerId: string; 
    gameDate: string;
    
    
}
interface AddByeGameprops{
    show : boolean;
    handleClose : ()=>void;
    handleAdd :(newByeGame:Game)=>void;
    roundId:string|null;
}

interface PlayerIdToName {
    playerId: string;
    firstName: string;
    lastName: string;
}
export function AddByeGame({show,handleClose,handleAdd,roundId}:AddByeGameprops){
    const [byeGameData,SetByeGameData]= useState<ByeGame>({
        playerId:"",
        gameDate:"",
        
    })
    const [players,SetPlayers]=useState<PlayerIdToName[]>([]);

    const fetchPlayers=async()=>{
        const playersList=await getPlayer();
        SetPlayers(playersList);
    }
    const handleOnChange=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        SetByeGameData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    useEffect(()=>{
        if(show){
            fetchPlayers();
            SetByeGameData({
                playerId:"",
                gameDate:"",
                

            })
        }
    },[show])
    const handleSave=async()=>{
        try {
            console.log("Sending:", byeGameData) 
            const byeGameDetails=await CreateByeGame({...byeGameData,roundId})
            handleAdd(byeGameDetails)
            handleClose()
        } catch (error) {
            console.error("Error while creating a Bye game",error)
            throw error;
        }
        
    }
    return (
        <>
            <Modal show={show} onHide={handleClose} className="dark-modal">
                <Modal.Header closeButton>
                <Modal.Title>Add Bye Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    
                    <FloatingLabel label="Player" className="mb-3">
                        <Form.Select
                            name="playerId"
                            value={byeGameData.playerId ?? ""}
                            onChange={handleOnChange}
                        >
                            <option value="" disabled>Select Player</option>
                            {players.map((player) => (
                                <option key={player.playerId} value={player.playerId}>
                                    {player.firstName} {player.lastName}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Game Date" className="mb-3">
                        <Form.Control 
                        type="date" 
                        name="gameDate"
                        placeholder="Game Date"
                        value={byeGameData.gameDate ?? ""}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    

                </Modal.Body>
                <Modal.Footer>
                <Button className="btn-edit" onClick={handleClose}>
                    Close
                </Button>
                <Button className="btn-create" onClick={()=>handleSave()}>
                    Save Bye Game
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}