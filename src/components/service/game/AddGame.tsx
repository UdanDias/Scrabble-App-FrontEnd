import { useState, ChangeEvent, useEffect } from "react";
import { Modal, FloatingLabel, Form, Button } from "react-bootstrap";
import CreateGame from "./CreateGame";
import { getPlayer } from "../player/GetPlayer";
import Swal from "sweetalert2";
import ReactSelect from "react-select";
import { customStyles } from "../styles/CustomStyles";
import { OverlaySpinner } from "../../utils/OverlaySpinner";

interface PlayerIdToName {
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
    const [players, SetPlayers] = useState<PlayerIdToName[]>([]);
    const [isFetchingPlayers, setIsFetchingPlayers] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [newGameData, SetNewGameData] = useState<Omit<Game, "gameId" | "margin" | "winnerId" | "isgameTied" | "isByeGame">>({
        player1Id: "",
        player2Id: "",
        score1: 0,
        score2: 0,
        gameDate: ""
    });

    const fetchPlayers = async () => {
        try {
            setIsFetchingPlayers(true);
            const playersList = await getPlayer();
            SetPlayers(playersList);
        } catch (error) {
            console.error("Error while fetching players", error);
            throw error;
        } finally {
            setIsFetchingPlayers(false);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

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

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        SetNewGameData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
    const startTime = Date.now();
    try {
        setIsSaving(true);
        const newGameDetails = await CreateGame({ ...newGameData, roundId });

        // Ensure we wait at least 800ms so the user sees the "Saving" state
        const duration = Date.now() - startTime;
        const minWait = 800;
        
        const finalize = () => {
            setIsSaving(false);
            // ... the rest of your Swal and success logic
        };

        if (duration < minWait) {
            setTimeout(finalize, minWait - duration);
        } else {
            finalize();
        }

    } catch (error) {
        setIsSaving(false);
        // ... error logic
    }
};

    const playerOptions = players
        .map(p => ({
            value: p.playerId,
            label: `${p.firstName} ${p.lastName}`
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    return (
        <>
            {/* Full-viewport overlay while fetching players or saving */}
            {(isFetchingPlayers || isSaving) && (
                <OverlaySpinner message={isSaving ? "Saving game..." : "Loading players..."} />
            )}

            <Modal show={show} onHide={handleClose} className="dark-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Add Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="mb-3">
                        <ReactSelect
                            options={playerOptions}
                            styles={customStyles}
                            placeholder={isFetchingPlayers ? "Loading players..." : "Select Player 1"}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            isSearchable={true}
                            isDisabled={isFetchingPlayers}
                            value={playerOptions.find(o => o.value === newGameData.player1Id) ?? null}
                            onChange={(selected) =>
                                SetNewGameData(prev => ({ ...prev, player1Id: selected?.value ?? "" }))
                            }
                        />
                    </div>

                    <div className="mb-3">
                        <ReactSelect
                            options={playerOptions.filter(o => o.value !== newGameData.player1Id)}
                            styles={customStyles}
                            placeholder={isFetchingPlayers ? "Loading players..." : "Select Player 2"}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            isSearchable={true}
                            isDisabled={isFetchingPlayers}
                            value={playerOptions.find(o => o.value === newGameData.player2Id) ?? null}
                            onChange={(selected) =>
                                SetNewGameData(prev => ({ ...prev, player2Id: selected?.value ?? "" }))
                            }
                        />
                    </div>

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
                    <Button className="btn-edit" onClick={handleClose} disabled={isSaving}>Close</Button>
                    <Button className="btn-create" onClick={handleSave} disabled={isSaving || isFetchingPlayers}>
                        {isSaving ? "Saving..." : "Save Game"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}