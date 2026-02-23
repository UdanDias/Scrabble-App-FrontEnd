import React, { useEffect, useState } from "react";
import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
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

interface GameEditProps{
    show:boolean;
    selectedRow:Game|null;
    handleClose:()=>void;
    handleUpdate:(updatedGame:Game)=>void;
    refreshTable:()=>void;
}
function EditGame({show,selectedRow,handleClose,handleUpdate,refreshTable}:GameEditProps){
    const [gameData,SetGameData]=useState<Game>({
        gameId:"",
        player1Id:"",
        player2Id:"",
        score1:0,
        score2:0,
        margin:0,
        isgameTied:"",
        winnerId:"",
        gameDate:"",
        isByeGame:""
    })
    useEffect(()=>{
        if(selectedRow){
            SetGameData(selectedRow)
        }
        
    },[selectedRow])
    const handleOnChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        SetGameData({...gameData,[e.target.name]:e.target.value})

    }
    const handleSave=(updatedGame:Game)=>{

    }
    return(
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingInput" label="Game Id" className="mb-3">
                        <Form.Control 
                        readOnly
                        type="text" 
                        name="gameId" 
                        placeholder="Game Id"
                        value={gameData.gameId}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Player 1 Id" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="playe1Id" 
                        placeholder="Player 1 Id"
                        value={gameData.player1Id}
                        onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Player 2 Id" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="player2Id" 
                        placeholder="Player 2 Id"
                        value={gameData.player2Id}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Score 1" className="mb-3">
                        <Form.Control 
                        type="number" 
                        name="score1" 
                        placeholder="Score 1"
                        value={gameData.score1}
                        onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Score 2" className="mb-3">
                        <Form.Control 
                        type="number" 
                        name="score2" 
                        placeholder="Score 2" 
                        value={gameData.score2}
                        onChange={handleOnChange}/>
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="margin" className="mb-3">
                        <Form.Control 
                        type="number" 
                        name="margin"
                        placeholder="Margin" 
                        value={gameData.margin}
                        onChange={handleOnChange}/>
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Is Game Tied" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="isGameTied"
                        placeholder="Is Game Tied"
                        value={gameData.isgameTied}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Winner Id" className="mb-3">
                        <Form.Control 
                        
                        type="text" 
                        name="winnerId"
                        placeholder="Winner Id"
                        value={gameData.winnerId}
                        onChange={handleOnChange}/>
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Game Date" className="mb-3">
                        <Form.Control 
                        type="date" 
                        name="gameDate"
                        placeholder="Game Date"
                        value={gameData.gameDate}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Is Game a Bye" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="isByeGame"
                        placeholder="Is Game a Bye"
                        value={gameData.isByeGame}
                        onChange={handleOnChange} />
                    </FloatingLabel>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Update
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default EditGame