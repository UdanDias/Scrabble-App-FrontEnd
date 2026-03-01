import React,{ useEffect, useState } from "react";
import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
import { CreateByeGame } from "./CreateGame";
import { getPlayer } from "../player/GetPlayer";
import Swal from "sweetalert2";
import ReactSelect from "react-select";
import { customStyles } from "../styles/CustomStyles";

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
             
            const byeGameDetails=await CreateByeGame({...byeGameData,roundId})
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({ icon: "success", title: "Added Bye Game Successfully" });
            handleAdd(byeGameDetails)
            handleClose()
        } catch (error) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({ icon: "error", title: "Bye Game Addition Failed" });

        }
        
    }
    const playerOptions = players.map(p => ({
        value: p.playerId,
        label: `${p.firstName} ${p.lastName}`
    }));
    return (
        <>
            <Modal show={show} onHide={handleClose} className="dark-modal">
                <Modal.Header closeButton>
                <Modal.Title>Add Bye Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    
                    {/* <FloatingLabel label="Player" className="mb-3">
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
                    </FloatingLabel> */}
                    <div className="mb-3">
                        <ReactSelect
                            options={playerOptions}
                            styles={customStyles}
                            placeholder="Select Player "
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            value={playerOptions.find(o => o.value === byeGameData.playerId) ?? null}
                            onChange={(selected) =>
                                SetByeGameData(prev => ({ ...prev, playerId: selected?.value ?? "" }))
                            }
                        />
                    </div>

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