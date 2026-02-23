import React,{ useEffect, useState } from "react";
import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
import { CreateByeGame } from "./CreateGame";

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
    playerId: string   
    gameDate: string
}
interface AddByeGameprops{
    show : boolean;
    handleClose : ()=>void;
    handleAdd :(newByeGame:Game)=>void
}
export function AddByeGame({show,handleClose,handleAdd}:AddByeGameprops){
    const [byeGameData,SetByeGameData]= useState<ByeGame>({
        playerId:"",
        gameDate:""
    })

    const handleOnChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        SetByeGameData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    useEffect(()=>{
        if(show){
            SetByeGameData({
                playerId:"",
                gameDate:""

            })
        }
    },[show])
    const handleSave=async()=>{
        try {
            console.log("Sending:", byeGameData) 
            const byeGameDetails=await CreateByeGame(byeGameData)
            handleAdd(byeGameDetails)
            handleClose()
        } catch (error) {
            console.error("Error while creating a Bye game",error)
            throw error;
        }
        
    }
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    
                    <FloatingLabel controlId="floatingInput" label="Player Id" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="playerId" 
                        placeholder="Player Id"
                        value={byeGameData.playerId?? ""}
                        onChange={handleOnChange} />
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
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>handleSave()}>
                    Save Bye Game
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}