import { useState, ChangeEvent, useEffect } from "react";
import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
import CreateGame from "./CreateGame";

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
interface AddGameProps{
    show : boolean;
    handleClose : ()=>void;
    handleAdd :(newGame:Game)=>void
    roundId:string|null;
}
export function AddGame({show,handleClose,handleAdd,roundId}:AddGameProps){

    const [newGameData,SetNewGameData] = useState<Omit<Game,"gameId"|"margin"|"winnerId"|"isgameTied"|"isByeGame">>({
       
        player1Id:"",
        player2Id:"",
        score1:0,
        score2:0,
        gameDate:""
    })
    const handleOnChange=(e:ChangeEvent<HTMLInputElement>)=>{
        SetNewGameData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
  
    const handleSave=async()=>{
        const newGameDetails=await CreateGame({...newGameData,roundId})
        handleAdd(newGameDetails)
        handleClose()
    }
    useEffect(()=>{
        if(show){
            SetNewGameData({
            player1Id:"",
            player2Id:"",
            score1:0,
            score2:0,
            gameDate:"" 
            })
        }
    },[show])
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <FloatingLabel controlId="floatingInput" label="Game Id" className="mb-3">
                        <Form.Control 
                        readOnly
                        type="text" 
                        name="gameId" 
                        placeholder="Game Id"
                        value={newGameData.gameId?? ""}
                        onChange={handleOnChange} />
                    </FloatingLabel> */}
                    
                    <FloatingLabel controlId="floatingInput" label="Player 1 Id" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="player1Id" 
                        placeholder="Player 1 Id"
                        value={newGameData.player1Id?? ""}
                        onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Player 2 Id" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="player2Id" 
                        placeholder="Player 2 Id"
                        value={newGameData.player2Id?? ""}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Score 1" className="mb-3">
                        <Form.Control 
                        type="number" 
                        name="score1" 
                        placeholder="Score 1"
                        value={newGameData.score1?? ""}
                        onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Score 2" className="mb-3">
                        <Form.Control 
                        type="number" 
                        name="score2" 
                        placeholder="Score 2" 
                        value={newGameData.score2?? ""}
                        onChange={handleOnChange}/>
                    </FloatingLabel>
                    
                    {/* <FloatingLabel controlId="floatingInput" label="margin" className="mb-3">
                        <Form.Control 
                        type="number" 
                        name="margin"
                        placeholder="Margin" 
                        value={gameData.margin}
                        onChange={handleOnChange}/>
                    </FloatingLabel> */}

                    {/* <FloatingLabel controlId="floatingInput" label="Is Game Tied" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="isGameTied"
                        placeholder="Is Game Tied"
                        value={gameData.isgameTied}
                        onChange={handleOnChange} />
                    </FloatingLabel> */}
                    
                    {/* <FloatingLabel controlId="floatingInput" label="Winner Id" className="mb-3">
                        <Form.Control 
                        
                        type="text" 
                        name="winnerId"
                        placeholder="Winner Id"
                        value={gameData.winnerId}
                        onChange={handleOnChange}/>
                    </FloatingLabel> */}

                    <FloatingLabel controlId="floatingInput" label="Game Date" className="mb-3">
                        <Form.Control 
                        type="date" 
                        name="gameDate"
                        placeholder="Game Date"
                        value={newGameData.gameDate ?? ""}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    {/* <FloatingLabel controlId="floatingInput" label="Is Game a Bye" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="isByeGame"
                        placeholder="Is Game a Bye"
                        value={gameData.isByeGame}
                        onChange={handleOnChange} />
                    </FloatingLabel> */}

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>handleSave()}>
                    Save Game
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}