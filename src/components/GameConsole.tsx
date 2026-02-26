import { SetStateAction, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import GetGames from "./service/game/GetGames";
import EditGame from "./service/game/EditGame";
import DeleteGame from "./service/game/DeleteGame";
import { AddGame } from "./service/game/AddGame";
import Swal from "sweetalert2";
import { AddByeGame } from "./service/game/AddByeGame";
import GetTournaments from "./service/tournament/GetTournaments";
import GetRoundsByTournament from "./service/tournament/GetRoundsByTournament";

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

interface Tournament {
    tournamentId: string;
    tournamentName: string;
}

interface Round {
    roundId: string;
    tournamentId: string;
    roundNumber: number;
    roundName: string;
}

const loadGameData = async (SetGameData: React.Dispatch<SetStateAction<Game[]>>) => {
    try {
        const gameDetails = await GetGames();
        SetGameData(gameDetails)
    } catch (error) {
        console.error("Error while fetching game Data", error)
        throw error;
    }
}

export function GameConsole() {
    const [gameData, SetGameData] = useState<Game[]>([]);
    const [showEditGameModal, SetShowEditGameModal] = useState(false)
    const [selectedRow, SetSelectedRow] = useState<Game | null>(null)
    const [showAddGameModal, SetShowAddGameModal] = useState(false)
    const [showAddByeGameModal, SetShowAddByeGameModal] = useState(false)
    const [selectedRoundId, SetSelectedRoundId] = useState<string | null>(null)  // ← new

    useEffect(() => {
        loadGameData(SetGameData)
    }, [])

    const refreshTable = () => { loadGameData(SetGameData) }

    const handleEdit = (row: Game) => {
        SetSelectedRow(null)
        SetSelectedRow(row)
        SetShowEditGameModal(true)
    }

    const handleOnCloseEdit = () => {
        SetShowEditGameModal(false)
        SetSelectedRow(null)
    }

    const handleUpdate = (updatedGame: Game) => {
        SetGameData(gameData.map(game => game.gameId === updatedGame.gameId ? updatedGame : game))
    }

    const handleDelete = async (gameId: string) => {
        try {
            await DeleteGame(gameId);
            SetGameData(gameData.filter(game => game.gameId !== gameId))
        } catch (error) {
            console.error("error while deleting game", error)
            throw error
        }
    }

    const handleOnAdd = (newGame: Game) => {
        SetGameData(prev => ([...prev, newGame]))
        refreshTable()
    }

    const handleOnAddBye = (newByeGame: Game) => {
        SetGameData(prev => ([...prev, newByeGame]))
        refreshTable()
    }

    // Step 1: select tournament
    // Step 2: select round
    // Step 3: select game type
    const handleAddClick = async () => {

        // Step 1 — pick tournament (optional, can cancel to skip)
        let roundId: string | null = null

        try {
            const tournaments: Tournament[] = await GetTournaments()

            if (tournaments.length > 0) {
                const tournamentOptions: Record<string, string> = {}
                tournaments.forEach(t => { tournamentOptions[t.tournamentId] = t.tournamentName })

                const { value: tournamentId, isDismissed: tournamentSkipped } = await Swal.fire({
                    title: "Select Tournament",
                    html: `<p class="text-muted mb-0">Select a tournament for this game, or cancel to skip</p>`,
                    input: "select",
                    inputOptions: tournamentOptions,
                    inputPlaceholder: "Select a tournament",
                    showCancelButton: true,
                    confirmButtonText: "Next",
                    cancelButtonText: "Skip"
                })

                if (!tournamentSkipped && tournamentId) {
                    // Step 2 — pick round
                    const rounds: Round[] = await GetRoundsByTournament(tournamentId)

                    if (rounds.length > 0) {
                        const roundOptions: Record<string, string> = {}
                        rounds.forEach(r => {
                            roundOptions[r.roundId] = `Round ${r.roundNumber}${r.roundName ? ` — ${r.roundName}` : ""}`
                        })

                        const { value: selectedRoundId, isDismissed: roundSkipped } = await Swal.fire({
                            title: "Select Round",
                            html: `<p class="text-muted mb-0">Select a round for this game, or cancel to skip</p>`,
                            input: "select",
                            inputOptions: roundOptions,
                            inputPlaceholder: "Select a round",
                            showCancelButton: true,
                            confirmButtonText: "Next",
                            cancelButtonText: "Skip"
                        })

                        if (!roundSkipped && selectedRoundId) {
                            roundId = selectedRoundId
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching tournaments/rounds", error)
        }

        // Step 3 — pick game type
        const result = await Swal.fire({
            title: 'Select Game Type',
            icon: 'question',
            showConfirmButton: true,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Regular Game',
            denyButtonText: 'Bye Game',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#510dfd',
            denyButtonColor: '#19876f',
            cancelButtonColor: '#6c757d',
            customClass: { icon: 'custom-swal-icon' },
            didOpen: () => {
                const icon = document.querySelector('.custom-swal-icon')
                if (icon) {
                    (icon as HTMLElement).style.borderColor = '#fcad2d'
                    ;(icon as HTMLElement).style.color = '#f4b339'
                }
            }
        })

        // Save roundId to state before opening modal
        SetSelectedRoundId(roundId)

        if (result.isConfirmed) {
            SetShowAddGameModal(true)
        } else if (result.isDenied) {
            SetShowAddByeGameModal(true)
        }
    }

    const theads: string[] = [
        "Game Id", "Player1 Id", "Player2 Id",
        "Score 1", "Score 2", "Margin",
        "Game Tied", "Winner Id", "Game Date", "Is Bye Game", "Action"
    ]

    return (
        <>
            <div className="d-flex justify-content-end p-2">
                <Button variant="success" onClick={handleAddClick}>Add Game</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {theads.map(tHead => (
                            <th className="text-center" key={tHead}>{tHead}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {gameData.map((row, index) => (
                        <tr key={row.gameId || index}>
                            {Object.values(row).map((cell, index) => (
                                <td className="text-center" key={index}>{String(cell ?? '')}</td>
                            ))}
                            <td>
                                <div className="d-flex justify-content-center p-2 gap-2">
                                    <Button variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(row.gameId)}>Delete</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <EditGame
                show={showEditGameModal}
                selectedRow={selectedRow}
                handleClose={handleOnCloseEdit}
                handleUpdate={handleUpdate}
                refreshTable={refreshTable}
            />
            <AddGame
                show={showAddGameModal}
                handleClose={() => SetShowAddGameModal(false)}
                handleAdd={handleOnAdd}
                roundId={selectedRoundId}   // ← pass roundId
            />
            <AddByeGame
                show={showAddByeGameModal}
                handleClose={() => SetShowAddByeGameModal(false)}
                handleAdd={handleOnAddBye}
                roundId={selectedRoundId}   // ← pass roundId
            />
        </>
    );
}