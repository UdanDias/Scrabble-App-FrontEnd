

import React, { useEffect, useState } from "react";
import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
import UpdateGame from "./UpdateGame";
import { getPlayer } from "../player/GetPlayer";
import Swal from "sweetalert2";

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
    const [loadingPlayers, setLoadingPlayers] = useState(true);

    // Fetch players once on mount (same as AddGame)
    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const playersList = await getPlayer();
            setPlayers(playersList);
            setLoadingPlayers(false);
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
            Toast.fire({ icon: "error", title: " Failed to Fetch Players" });
            setLoadingPlayers(false);
        }
    };

    // Populate form when selectedRow changes (edit-specific logic)
  useEffect(() => {
    if (selectedRow && players.length > 0) {
        // selectedRow has resolved names, find back the IDs
        const player1 = players.find(p => 
            `${p.firstName} ${p.lastName}` === selectedRow.player1Id
        );
        const player2 = players.find(p => 
            `${p.firstName} ${p.lastName}` === selectedRow.player2Id
        );

        const { isgameTied, isByeGame, margin, winnerId, ...rest } = selectedRow;
        SetGameData({
            ...rest,
            player1Id: player1?.playerId ?? selectedRow.player1Id,
            player2Id: player2?.playerId ?? selectedRow.player2Id,
        });
    } else if (!selectedRow) {
        SetGameData({
            gameId: "",
            player1Id: "",
            player2Id: "",
            score1: 0,
            score2: 0,
            gameDate: ""
        });
    }
}, [selectedRow, players]); // ← also add players as dependency

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        SetGameData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            const updatedGameDetails = await UpdateGame(gameData);
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
            Toast.fire({ icon: "success", title: "Game Updated Successfully" });
            handleClose();
            handleUpdate(updatedGameDetails);
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
            Toast.fire({ icon: "error", title: "Updating Game Failed" });
        }
    };
    const selectedPlayer1 = players.find(p => p.playerId === gameData.player1Id);
    const selectedPlayer2 = players.find(p => p.playerId === gameData.player2Id);
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
                {!loadingPlayers && players.length > 0 && gameData.player1Id !== undefined ? (
                <FloatingLabel label="Player 1" className="mb-3">
                    <Form.Select
                    name="player1Id"
                    value={gameData.player1Id}
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
                ) : (
                <div>Loading players...</div>
                )}

                {!loadingPlayers && players.length > 0 && gameData.player2Id !== undefined && (
                <FloatingLabel label="Player 2" className="mb-3">
                    <Form.Select
                    name="player2Id"
                    value={gameData.player2Id}
                    onChange={handleOnChange}
                    >
                    <option value="">Select Player 2</option>
                    {players.map((p) => (
                        <option
                        key={p.playerId}
                        value={p.playerId}
                        disabled={p.playerId === gameData.player1Id}
                        >
                        {p.firstName} {p.lastName}
                        </option>
                    ))}
                    </Form.Select>
                </FloatingLabel>
                )}

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