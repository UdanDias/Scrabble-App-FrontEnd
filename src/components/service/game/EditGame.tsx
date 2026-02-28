// import React, { useEffect, useState } from "react";
// import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
// import UpdateGame from "./UpdateGame";
// import { getPlayer } from "../player/GetPlayer";

// interface Game {
//     gameId: string;
//     player1Id: string;
//     player2Id: string;
//     score1: number;
//     score2: number;
//     margin: number;
//     isgameTied: string;
//     winnerId: string;
//     gameDate: string;
//     isByeGame: string;
// }

// interface PlayerIdToName {
//     playerId: string;
//     firstName: string;
//     lastName: string;
// }

// interface GameEditProps {
//     show: boolean;
//     selectedRow: Game | null;
//     handleClose: () => void;
//     handleUpdate: (updatedGame: Game) => void;
//     refreshTable: () => void;
// }

// function EditGame({ show, selectedRow, handleClose, handleUpdate, refreshTable }: GameEditProps) {
//     const [gameData, SetGameData] = useState<Omit<Game, "isgameTied" | "isByeGame" | "margin" | "winnerId">>({
//         gameId: "",
//         player1Id: "",
//         player2Id: "",
//         score1: 0,
//         score2: 0,
//         gameDate: ""
//     });

//     const [players, setPlayers] = useState<PlayerIdToName[]>([]);

//     // Fetch players when modal opens
//     useEffect(() => {
//         if (show) {
//             const init = async () => {
//                 const playersList = await getPlayer();
//                 setPlayers(playersList);
//             };
//             init();
//         }
//     }, [show]);

//     useEffect(() => {
//         if (selectedRow) {
//             const { isgameTied, isByeGame, margin, winnerId, ...rest } = selectedRow;
//             SetGameData(rest);
//         } else {
//             SetGameData({
//                 gameId: "",
//                 player1Id: "",
//                 player2Id: "",
//                 score1: 0,
//                 score2: 0,
//                 gameDate: ""
//             });
//         }
//     }, [selectedRow]);

//     const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         SetGameData({ ...gameData, [e.target.name]: e.target.value });
//     };

//     const handleSave = async (updatedGame: Omit<Game, "isgameTied" | "isByeGame" | "margin" | "winnerId">) => {
//         try {
//             const updatedGameDetails = await UpdateGame(updatedGame);
//             SetGameData(updatedGameDetails);
//             handleClose();
//             handleUpdate(updatedGameDetails);
//         } catch (error) {
//             console.error("Error occurred while fetching updated game details", error);
//             throw error;
//         }
//     };

//     return (
//         <Modal show={show} onHide={handleClose} className="dark-modal">
//             <Modal.Header closeButton>
//                 <Modal.Title>Edit Game</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>

//                 <FloatingLabel label="Game Id" className="mb-3">
//                     <Form.Control
//                         readOnly
//                         type="text"
//                         name="gameId"
//                         placeholder="Game Id"
//                         value={gameData.gameId ?? ""}
//                         onChange={handleOnChange}
//                     />
//                 </FloatingLabel>

//                 {/* Player 1 Dropdown */}
//                 <FloatingLabel label="Player 1" className="mb-3">
//                     <Form.Select
//                         name="player1Id"
//                         value={gameData.player1Id ?? ""}
//                         onChange={handleOnChange}
//                     >
//                         <option value="" disabled>Select Player 1</option>
//                         {players.map((p) => (
//                             <option key={p.playerId} value={p.playerId}>
//                                 {p.firstName} {p.lastName}
//                             </option>
//                         ))}
//                     </Form.Select>
//                 </FloatingLabel>

//                 {/* Player 2 Dropdown */}
//                 <FloatingLabel label="Player 2" className="mb-3">
//                     <Form.Select
//                         name="player2Id"
//                         value={gameData.player2Id ?? ""}
//                         onChange={handleOnChange}
//                     >
//                         <option value="" disabled>Select Player 2</option>
//                         {players
//                             .filter((p) => p.playerId !== gameData.player1Id)
//                             .map((p) => (
//                                 <option key={p.playerId} value={p.playerId}>
//                                     {p.firstName} {p.lastName}
//                                 </option>
//                             ))}
//                     </Form.Select>
//                 </FloatingLabel>

//                 <FloatingLabel label="Score 1" className="mb-3">
//                     <Form.Control
//                         type="number"
//                         name="score1"
//                         placeholder="Score 1"
//                         value={gameData.score1 ?? ""}
//                         onChange={handleOnChange}
//                     />
//                 </FloatingLabel>

//                 <FloatingLabel label="Score 2" className="mb-3">
//                     <Form.Control
//                         type="number"
//                         name="score2"
//                         placeholder="Score 2"
//                         value={gameData.score2 ?? ""}
//                         onChange={handleOnChange}
//                     />
//                 </FloatingLabel>

//                 <FloatingLabel label="Game Date" className="mb-3">
//                     <Form.Control
//                         type="date"
//                         name="gameDate"
//                         placeholder="Game Date"
//                         value={gameData.gameDate ?? ""}
//                         onChange={handleOnChange}
//                     />
//                 </FloatingLabel>

//             </Modal.Body>
//             <Modal.Footer>
//                 <Button className="btn-edit" onClick={handleClose}>Close</Button>
//                 <Button className="btn-create" onClick={() => handleSave(gameData)}>Update</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }

// export default EditGame;

import React, { useEffect, useState } from "react";
import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
import UpdateGame from "./UpdateGame";
import { getPlayer } from "../player/GetPlayer";

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

interface PlayerIdToName {
    playerId: string;
    firstName: string;
    lastName: string;
}

interface GameEditProps {
    show: boolean;
    selectedRow: Game | null;
    handleClose: () => void;
    handleUpdate: (updatedGame: Game) => void;
    refreshTable: () => void;
}

function EditGame({ show, selectedRow, handleClose, handleUpdate, refreshTable }: GameEditProps) {
    const [players, setPlayers] = useState<PlayerIdToName[]>([]);
    const [gameData, SetGameData] = useState<Omit<Game, "isgameTied" | "isByeGame" | "margin" | "winnerId">>({
        gameId: "",
        player1Id: "",
        player2Id: "",
        score1: 0,
        score2: 0,
        gameDate: ""
    });

    // Fetch players once on mount (same as AddGame)
    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const playersList = await getPlayer();
            setPlayers(playersList);
        } catch (error) {
            console.error("Error while fetching players", error);
        }
    };

    // Populate form when selectedRow changes (edit-specific logic)
    useEffect(() => {
        if (selectedRow) {
            const { isgameTied, isByeGame, margin, winnerId, ...rest } = selectedRow;
            SetGameData(rest);
        } else {
            SetGameData({
                gameId: "",
                player1Id: "",
                player2Id: "",
                score1: 0,
                score2: 0,
                gameDate: ""
            });
        }
    }, [selectedRow]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        SetGameData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            const updatedGameDetails = await UpdateGame(gameData);
            handleClose();
            handleUpdate(updatedGameDetails);
        } catch (error) {
            console.error("Error occurred while updating game", error);
            throw error;
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="dark-modal">
            <Modal.Header closeButton>
                <Modal.Title>Edit Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <FloatingLabel label="Game Id" className="mb-3">
                    <Form.Control
                        readOnly
                        type="text"
                        name="gameId"
                        placeholder="Game Id"
                        value={gameData.gameId ?? ""}
                        onChange={handleOnChange}
                    />
                </FloatingLabel>

                <FloatingLabel label="Player 1" className="mb-3">
                    <Form.Select
                        name="player1Id"
                        value={gameData.player1Id ?? ""}
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

                <FloatingLabel label="Player 2" className="mb-3">
                    <Form.Select
                        name="player2Id"
                        value={gameData.player2Id ?? ""}
                        onChange={handleOnChange}
                    >
                        <option value="">Select Player 2</option>
                        {players
                            .filter((p) => p.playerId !== gameData.player1Id)
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
                        value={gameData.score1 ?? ""}
                        onChange={handleOnChange}
                    />
                </FloatingLabel>

                <FloatingLabel label="Score 2" className="mb-3">
                    <Form.Control
                        type="number"
                        name="score2"
                        placeholder="Score 2"
                        value={gameData.score2 ?? ""}
                        onChange={handleOnChange}
                    />
                </FloatingLabel>

                <FloatingLabel label="Game Date" className="mb-3">
                    <Form.Control
                        type="date"
                        name="gameDate"
                        placeholder="Game Date"
                        value={gameData.gameDate ?? ""}
                        onChange={handleOnChange}
                    />
                </FloatingLabel>

            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-edit" onClick={handleClose}>Close</Button>
                <Button className="btn-create" onClick={handleSave}>Update</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditGame;