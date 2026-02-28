// import { useState, ChangeEvent, useEffect } from "react";
// import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
// import CreateGame from "./CreateGame";

// interface Game{
//     gameId:string;
//     player1Id:string;
//     player2Id:string;
//     score1:number;
//     score2:number;
//     margin:number;
//     isgameTied:string;
//     winnerId:string;
//     gameDate:string;
//     isByeGame:string;

// }
// interface AddGameProps{
//     show : boolean;
//     handleClose : ()=>void;
//     handleAdd :(newGame:Game)=>void
//     roundId:string|null;
// }
// export function AddGame({show,handleClose,handleAdd,roundId}:AddGameProps){

//     const [newGameData,SetNewGameData] = useState<Omit<Game,"gameId"|"margin"|"winnerId"|"isgameTied"|"isByeGame">>({
       
//         player1Id:"",
//         player2Id:"",
//         score1:0,
//         score2:0,
//         gameDate:""
//     })
//     const handleOnChange=(e:ChangeEvent<HTMLInputElement>)=>{
//         SetNewGameData((prev)=>({...prev,[e.target.name]:e.target.value}))
//     }
  
//     const handleSave=async()=>{
//         const newGameDetails=await CreateGame({...newGameData,roundId})
//         handleAdd(newGameDetails)
//         handleClose()
//     }
//     useEffect(()=>{
//         if(show){
//             SetNewGameData({
//             player1Id:"",
//             player2Id:"",
//             score1:0,
//             score2:0,
//             gameDate:"" 
//             })
//         }
//     },[show])
//     return (
//         <>
//             <Modal show={show} onHide={handleClose} className="dark-modal">
//                 <Modal.Header closeButton>
//                 <Modal.Title>Add Game</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
                    
                    
//                     <FloatingLabel controlId="floatingInput" label="Player 1 Id" className="mb-3">
//                         <Form.Control 
//                         type="text" 
//                         name="player1Id" 
//                         placeholder="Player 1 Id"
//                         value={newGameData.player1Id?? ""}
//                         onChange={handleOnChange} />
//                     </FloatingLabel>

//                     <FloatingLabel controlId="floatingInput" label="Player 2 Id" className="mb-3">
//                         <Form.Control 
//                         type="text" 
//                         name="player2Id" 
//                         placeholder="Player 2 Id"
//                         value={newGameData.player2Id?? ""}
//                         onChange={handleOnChange} />
//                     </FloatingLabel>
                    
//                     <FloatingLabel controlId="floatingInput" label="Score 1" className="mb-3">
//                         <Form.Control 
//                         type="number" 
//                         name="score1" 
//                         placeholder="Score 1"
//                         value={newGameData.score1?? ""}
//                         onChange={handleOnChange} />
//                     </FloatingLabel>

//                     <FloatingLabel controlId="floatingInput" label="Score 2" className="mb-3">
//                         <Form.Control 
//                         type="number" 
//                         name="score2" 
//                         placeholder="Score 2" 
//                         value={newGameData.score2?? ""}
//                         onChange={handleOnChange}/>
//                     </FloatingLabel>
                    
                    

//                     <FloatingLabel controlId="floatingInput" label="Game Date" className="mb-3">
//                         <Form.Control 
//                         type="date" 
//                         name="gameDate"
//                         placeholder="Game Date"
//                         value={newGameData.gameDate ?? ""}
//                         onChange={handleOnChange} />
//                     </FloatingLabel>
                   

//                 </Modal.Body>
//                 <Modal.Footer>
//                 <Button className="btn-edit" onClick={handleClose}>
//                     Close
//                 </Button>
//                 <Button className="btn-create" onClick={()=>handleSave()}>
//                     Save Game
//                 </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// }
import { useState, ChangeEvent, useEffect } from "react";
import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
import CreateGame from "./CreateGame";
import { getPlayer } from "../player/GetPlayer";

interface Player {
    playerId: string;
    firstName: string;
    lastName: string;
}

interface Game {
    gameId: string;
    player1Id: string;
    player2Id: string;
    score1: number;
    score2: number;
    margin: number;
    isgameTied: string;
    winnerId: string;
    gameDate: string;
    isByeGame: string;
}

interface AddGameProps {
    show: boolean;
    handleClose: () => void;
    handleAdd: (newGame: Game) => void;
    roundId: string | null;
}

export function AddGame({ show, handleClose, handleAdd, roundId }: AddGameProps) {
    const [players, SetPlayers] = useState<Player[]>([]);

    const [newGameData, SetNewGameData] = useState<Omit<Game, "gameId" | "margin" | "winnerId" | "isgameTied" | "isByeGame">>({
        player1Id: "",
        player2Id: "",
        score1: 0,
        score2: 0,
        gameDate: ""
    });
    const  fetchPlayers=async()=>{
        try {
            const playersList=await getPlayer();
            SetPlayers(playersList);
        } catch (error) {
            console.error("Error while fetching players",error);
            throw error
        }
        
    }
    

    // Fetch all players on mount
    useEffect(() => {
       
        fetchPlayers();
    }, []);

    // Reset form when modal opens
    useEffect(() => {
        if (show) {
            SetNewGameData({
                player1Id: "",
                player2Id: "",
                score1: 0,
                score2: 0,
                gameDate: ""
            });
        }
    }, [show]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement|HTMLTextAreaElement>) => {
        SetNewGameData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const newGameDetails = await CreateGame({ ...newGameData, roundId });
        handleAdd(newGameDetails);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} className="dark-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                {/* Player 1 Dropdown */}
                <FloatingLabel label="Player 1" className="mb-3">
                    <Form.Select
                        name="player1Id"
                        value={newGameData.player1Id}
                        onChange={handleOnChange}
                    >
                        <option value="">Select Player 1</option>
                        {players.map((p) => (
                            <option key={p.playerId} value={p.playerId}>
                                {p.firstName} {p.lastName}
                            </option>
                        ))}
                    </Form.Select>
                </FloatingLabel>

                {/* Player 2 Dropdown */}
                <FloatingLabel label="Player 2" className="mb-3">
                    <Form.Select
                        name="player2Id"
                        value={newGameData.player2Id}
                        onChange={handleOnChange}
                    >
                        <option value="">Select Player 2</option>
                        {players
                            .filter((p) => p.playerId !== newGameData.player1Id) // prevent same player twice
                            .map((p) => (
                                <option key={p.playerId} value={p.playerId}>
                                    {p.firstName} {p.lastName}
                                </option>
                            ))}
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel label="Score 1" className="mb-3">
                    <Form.Control
                        type="number"
                        name="score1"
                        placeholder="Score 1"
                        value={newGameData.score1 ?? ""}
                        onChange={handleOnChange}
                    />
                </FloatingLabel>

                <FloatingLabel label="Score 2" className="mb-3">
                    <Form.Control
                        type="number"
                        name="score2"
                        placeholder="Score 2"
                        value={newGameData.score2 ?? ""}
                        onChange={handleOnChange}
                    />
                </FloatingLabel>

                <FloatingLabel label="Game Date" className="mb-3">
                    <Form.Control
                        type="date"
                        name="gameDate"
                        placeholder="Game Date"
                        value={newGameData.gameDate ?? ""}
                        onChange={handleOnChange}
                    />
                </FloatingLabel>

            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-edit" onClick={handleClose}>Close</Button>
                <Button className="btn-create" onClick={handleSave}>Save Game</Button>
            </Modal.Footer>
        </Modal>
    );
}