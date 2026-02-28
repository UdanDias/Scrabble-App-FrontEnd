import { SetStateAction, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import GetGames from "../service/game/GetGames";
import EditGame from "../service/game/EditGame";
import DeleteGame from "../service/game/DeleteGame";
import { AddGame } from "../service/game/AddGame";
import Swal from "sweetalert2";
import { AddByeGame } from "../service/game/AddByeGame";
import GetTournaments from "../service/tournament/GetTournaments";
import GetRoundsByTournament from "../service/tournament/GetRoundsByTournament";
import { getPlayer } from "../service/player/GetPlayer";

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
interface PlayerIdToName {
    playerId: string;
    firstName: string;
    lastName: string;
}

// const loadGameData = async (SetGameData: React.Dispatch<SetStateAction<Game[]>>) => {
//     try {
//         const gameDetails = await GetGames();
//         SetGameData(gameDetails)
//     } catch (error) {
//         console.error("Error while fetching game Data", error)
//         throw error;
//     }
// }
    const loadGameData = async (
        SetGameData: React.Dispatch<SetStateAction<Game[]>>,
        players: PlayerIdToName[]
    ) => {
        try {
            const gameDetails = await GetGames();
            
            const resolvedGames = gameDetails.map((game: Game) => {
                const player1 = players.find(p => p.playerId === game.player1Id);
                const player2 = players.find(p => p.playerId === game.player2Id);
                const winner  = players.find(p => p.playerId === game.winnerId);
                return {
                    ...game,
                    player1Id: player1 ? `${player1.firstName} ${player1.lastName}` : game.player1Id,
                    player2Id: player2 ? `${player2.firstName} ${player2.lastName}` : game.player2Id,
                    winnerId:  winner  ? `${winner.firstName}  ${winner.lastName}`  : game.winnerId,
                };
            });

            SetGameData(resolvedGames);
        } catch (error) {
            console.error("Error while fetching game Data", error);
        }
    };

export function GameConsole() {
    const [gameData, SetGameData] = useState<Game[]>([]);
    const [showEditGameModal, SetShowEditGameModal] = useState(false)
    const [selectedRow, SetSelectedRow] = useState<Game | null>(null)
    const [showAddGameModal, SetShowAddGameModal] = useState(false)
    const [showAddByeGameModal, SetShowAddByeGameModal] = useState(false)
    const [selectedRoundId, SetSelectedRoundId] = useState<string | null>(null)  // ← new
    const [players, setPlayers] = useState<PlayerIdToName[]>([]);



    const resolveNames = (game: Game) => {
        const player1 = players.find(p => p.playerId === game.player1Id);
        const player2 = players.find(p => p.playerId === game.player2Id);
        const winner  = players.find(p => p.playerId === game.winnerId);
        return {
            ...game,
            player1Id: player1 ? `${player1.firstName} ${player1.lastName}` : game.player1Id,
            player2Id: player2 ? `${player2.firstName} ${player2.lastName}` : game.player2Id,
            winnerId:  winner  ? `${winner.firstName} ${winner.lastName}`   : game.winnerId,
        };
    };

    const handleUpdate = (updatedGame: Game) => {
        const resolved = resolveNames(updatedGame);
        SetGameData(gameData.map(game => game.gameId === resolved.gameId ? resolved : game));
        refreshTable()
    };

    const handleOnAdd = (newGame: Game) => {
        const resolved = resolveNames(newGame);
        SetGameData(prev => ([...prev, resolved]));
        refreshTable()
    };

    const handleOnAddBye = (newByeGame: Game) => {
        const resolved = resolveNames(newByeGame);
        SetGameData(prev => ([...prev, resolved]));
        refreshTable()
    };
    useEffect(() => {
        const init = async () => {
            try {
                const playersList = await getPlayer();  // wait for players
                setPlayers(playersList);                // set state
                loadGameData(SetGameData, playersList); // pass directly, don't rely on state
            } catch (error) {
                console.error("error during init", error);
            }
        };
        init();
    }, []);

    const refreshTable = async () => {
        const playersList = await getPlayer();
        loadGameData(SetGameData, playersList);
    };

    const handleEdit = (row: Game) => {
        SetSelectedRow(null)
        SetSelectedRow(row)
        SetShowEditGameModal(true)
    }

    const handleOnCloseEdit = () => {
        SetShowEditGameModal(false)
        SetSelectedRow(null)
    }

    // const handleUpdate = (updatedGame: Game) => {
    //     SetGameData(gameData.map(game => game.gameId === updatedGame.gameId ? updatedGame : game))
    // }

    const handleDelete = async (gameId: string) => {
        try {
            const confirm = await Swal.fire({
            title: "Are You Sure?",
            text: `This Will Delete The Game.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, Delete It!"
        })
            if (!confirm.isConfirmed) return;

            await DeleteGame(gameId);
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
            Toast.fire({ icon: "success", title: "Deleted Game Successfully" });
            SetGameData(gameData.filter(game => game.gameId !== gameId))
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
            Toast.fire({ icon: "error", title: "Game Deletion Failed" });
        }
    }

    // const handleOnAdd = (newGame: Game) => {
    //     SetGameData(prev => ([...prev, newGame]))
    //     refreshTable()
    // }

    // const handleOnAddBye = (newByeGame: Game) => {
    //     SetGameData(prev => ([...prev, newByeGame]))
    //     refreshTable()
    // }

    // Step 1: select tournament
    // Step 2: select round
    // Step 3: select game type
    // const handleAddClick = async () => {

    //     // Step 1 — pick tournament (optional, can cancel to skip)
    //     let roundId: string | null = null

    //     try {
    //         const tournaments: Tournament[] = await GetTournaments()

    //         if (tournaments.length > 0) {
    //             const tournamentOptions: Record<string, string> = {}
    //             tournaments.forEach(t => { tournamentOptions[t.tournamentId] = t.tournamentName })

    //             const { value: tournamentId, isDismissed: tournamentSkipped } = await Swal.fire({
    //                 title: "Select Tournament",
    //                 html: `<p style="color:#bfd0e1d1;margin:0"> Select a tournament for this game</p>`,
    //                 input: "select",
    //                 inputOptions: tournamentOptions,
    //                 inputPlaceholder: "Select a tournament",
    //                 showCancelButton: true,
    //                 confirmButtonText: "Next",
    //                 cancelButtonText: "Skip",
    //                 customClass: { popup: 'swal-dark' }
    //             })

    //             if (!tournamentSkipped && tournamentId) {
    //                 // Step 2 — pick round
    //                 const rounds: Round[] = await GetRoundsByTournament(tournamentId)

    //                 if (rounds.length > 0) {
    //                     const roundOptions: Record<string, string> = {}
    //                     rounds.forEach(r => {
    //                         roundOptions[r.roundId] = `Round ${r.roundNumber}${r.roundName ? ` — ${r.roundName}` : ""}`
    //                     })

    //                     const { value: selectedRoundId, isDismissed: roundSkipped } = await Swal.fire({
    //                         title: "Select Round",
    //                         html: `<p style="color:#bfd0e1d1;margin:0" >Select a round for this game, or cancel to skip</p>`,
    //                         input: "select",
    //                         inputOptions: roundOptions,
    //                         inputPlaceholder: "Select a round",
    //                         showCancelButton: true,
    //                         confirmButtonText: "Next",
    //                         cancelButtonText: "Skip",
    //                         customClass: { popup: 'swal-dark' }
    //                     })

    //                     if (!roundSkipped && selectedRoundId) {
    //                         roundId = selectedRoundId
    //                     }
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error fetching tournaments/rounds", error)
    //     }

    //     // Step 3 — pick game type
    //     const result = await Swal.fire({
    //         title: 'Select Game Type',
    //         icon: 'question',
    //         showConfirmButton: true,
    //         showDenyButton: true,
    //         showCancelButton: true,
    //         confirmButtonText: 'Regular Game',
    //         denyButtonText: 'Bye Game',
    //         cancelButtonText: 'Cancel',
    //         confirmButtonColor: '#510dfd',
    //         denyButtonColor: '#19876f',
    //         cancelButtonColor: '#6c757d',
    //         customClass: {
    //         icon: 'custom-swal-icon',
    //         confirmButton: 'swal2-confirm',   /* ← add these */
    //         denyButton: 'swal2-deny',
    //         cancelButton: 'swal2-cancel'
    //     },
    //         didOpen: () => {
    //             const icon = document.querySelector('.custom-swal-icon')
    //             if (icon) {
    //                 (icon as HTMLElement).style.borderColor = '#fcad2d'
    //                 ;(icon as HTMLElement).style.color = '#f4b339'
    //             }
    //         }
    //     })

    //     // Save roundId to state before opening modal
    //     SetSelectedRoundId(roundId)

    //     if (result.isConfirmed) {
    //         SetShowAddGameModal(true)
    //     } else if (result.isDenied) {
    //         SetShowAddByeGameModal(true)
    //     }
    // }
    const handleAddClick = async () => {
        let roundId: string | null = null

        try {
            const tournaments: Tournament[] = await GetTournaments()

            if (tournaments.length === 0) {
                Swal.fire({
                    title: "No Tournaments",
                    text: "Please create a tournament and a round before adding a game.",
                    icon: "warning"
                })
                return
            }

            const tournamentOptions: Record<string, string> = {}
            tournaments.forEach(t => { tournamentOptions[t.tournamentId] = t.tournamentName })

            const { value: tournamentId, isDismissed: tournamentSkipped } = await Swal.fire({
                title: "Select Tournament",
                html: `<p style="color:#bfd0e1d1;margin:0">Select a tournament for this game</p>`,
                input: "select",
                inputOptions: tournamentOptions,
                inputPlaceholder: "Select a tournament",
                showCancelButton: true,
                confirmButtonText: "Next",
                cancelButtonText: "Cancel",
            })

            // Block if skipped or cancelled
            if (tournamentSkipped || !tournamentId) {
                Swal.fire({
                    title: "Tournament Required",
                    text: "You must select a tournament to add a game.",
                    icon: "error"
                })
                return
            }

            const rounds: Round[] = await GetRoundsByTournament(tournamentId)

            if (rounds.length === 0) {
                Swal.fire({
                    title: "No Rounds",
                    text: "This tournament has no rounds. Please add a round first.",
                    icon: "warning"
                })
                return
            }

            const roundOptions: Record<string, string> = {}
            rounds.forEach(r => {
                roundOptions[r.roundId] = `Round ${r.roundNumber}${r.roundName ? ` — ${r.roundName}` : ""}`
            })

            const { value: selectedRoundId, isDismissed: roundSkipped } = await Swal.fire({
                title: "Select Round",
                html: `<p style="color:#bfd0e1d1;margin:0">Select a round for this game</p>`,
                input: "select",
                inputOptions: roundOptions,
                inputPlaceholder: "Select a round",
                showCancelButton: true,
                confirmButtonText: "Next",
                cancelButtonText: "Cancel",
            })

            // Block if skipped or cancelled
            if (roundSkipped || !selectedRoundId) {
                Swal.fire({
                    title: "Round Required",
                    text: "You must select a round to add a game.",
                    icon: "error"
                })
                return
            }

            roundId = selectedRoundId

        } catch (error) {
            console.error("Error fetching tournaments/rounds", error)
            return
        }

        // Step 3 — pick game type (only reached if tournament + round selected)
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
            customClass: {
                icon: 'custom-swal-icon',
                confirmButton: 'swal2-confirm',
                denyButton: 'swal2-deny',
                cancelButton: 'swal2-cancel'
            },
            didOpen: () => {
                const icon = document.querySelector('.custom-swal-icon')
                if (icon) {
                    (icon as HTMLElement).style.borderColor = '#fcad2d';
                    (icon as HTMLElement).style.color = '#f4b339';
                }
            }
        })

        SetSelectedRoundId(roundId)

        if (result.isConfirmed) {
            SetShowAddGameModal(true)
        } else if (result.isDenied) {
            SetShowAddByeGameModal(true)
        }
    }

    const theads: string[] = [
        "Game Id",
        "Player1 Name", 
        "Player2 Name",
        "Score 1", 
        "Score 2", 
        "Margin",
        "Game Tied", 
        "Winner Id", 
        "Game Date", 
        "Is Bye Game","Round Id", 
        "Action"
    ]

    return ( 
        <>
        <div className="console-page">
            <div className="create-button d-flex justify-content-end p-2">
                <Button className="btn-create" variant="success" onClick={handleAddClick}>+ Add Game</Button>
            </div>
            <div className="console-table-container">
                <div className="console-table-wrapper">
                    <Table striped bordered hover className="console-table">
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
                                            <Button className="btn-edit" variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
                                            <Button className="btn-delete" variant="danger" onClick={() => handleDelete(row.gameId)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            
            

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
        </div>
        </>
    );
}