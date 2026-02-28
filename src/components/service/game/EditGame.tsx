

import React, { useEffect, useState } from "react";
import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
import UpdateGame from "./UpdateGame";
import { getPlayer } from "../player/GetPlayer";
import Swal from "sweetalert2";
import ReactSelect from "react-select";
import { customStyles } from "../styles/CustomStyles";

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
        const player1 = players.find(p =>
            `${p.firstName} ${p.lastName}` === selectedRow.player1Id
        );
        const player2 = players.find(p =>
            `${p.firstName} ${p.lastName}` === selectedRow.player2Id
        );

        const { isgameTied, isByeGame, margin, winnerId, ...rest } = selectedRow;
        
        // Store raw roundId separately — selectedRow.roundId is already resolved to display name
        // We need to get the real roundId from somewhere else
        setRawRoundId((selectedRow as any).roundId ?? "");
        
        SetGameData({
            ...rest,
            player1Id: player1?.playerId ?? selectedRow.player1Id,
            player2Id: player2?.playerId ?? selectedRow.player2Id,
        });
    }
}, [selectedRow, players]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        SetGameData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            const { ...dataToSend } = gameData as any;
        delete dataToSend.roundId;  // ← remove resolved display name
        delete dataToSend.bye;
        delete dataToSend.gameTied;

        const updatedGameDetails = await UpdateGame(dataToSend);
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

    const [rawRoundId, setRawRoundId] = useState<string>("");
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
                    <div className="mb-3">
                        <ReactSelect
                            options={players.map(p => ({ value: p.playerId, label: `${p.firstName} ${p.lastName}` }))}
                            styles={customStyles}
                            placeholder="Select Player 1"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            value={
                                gameData.player1Id
                                    ? { value: gameData.player1Id, label: `${players.find(p => p.playerId === gameData.player1Id)?.firstName} ${players.find(p => p.playerId === gameData.player1Id)?.lastName}` }
                                    : null
                            }
                            onChange={(selected) =>
                                SetGameData(prev => ({ ...prev, player1Id: selected?.value ?? "" }))
                            }
                        />
                    </div>
                ) : (
                    <div>Loading players...</div>
                )}
                {!loadingPlayers && players.length > 0 && gameData.player2Id !== undefined && (
                    <div className="mb-3">
                        <ReactSelect
                            options={players
                                .filter(p => p.playerId !== gameData.player1Id)
                                .map(p => ({ value: p.playerId, label: `${p.firstName} ${p.lastName}` }))}
                            styles={customStyles}
                            placeholder="Select Player 2"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            value={
                                gameData.player2Id
                                    ? { value: gameData.player2Id, label: `${players.find(p => p.playerId === gameData.player2Id)?.firstName} ${players.find(p => p.playerId === gameData.player2Id)?.lastName}` }
                                    : null
                            }
                            onChange={(selected) =>
                                SetGameData(prev => ({ ...prev, player2Id: selected?.value ?? "" }))
                            }
                        />
                    </div>
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