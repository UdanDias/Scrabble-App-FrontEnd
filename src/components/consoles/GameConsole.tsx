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
import { SelectModal } from "./Selectmodal";
import { ConsoleHeader } from "./ConsoleHeader";
import { sortByNumberAsc } from "../utils/Sorters";
import { BulkAddGame } from "../service/game/BulkAddGame";
import { OverlaySpinner } from "../utils/OverlaySpinner";
import { DataCount } from "../utils/DataCount";
import { SearchBar } from "../utils/SearchBar";



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

interface GameWithRoundId extends Game {
    roundId: string;
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

/* ===========================
   LOAD GAME DATA
=========================== */
const loadGameData = async (
    SetGameData: React.Dispatch<SetStateAction<GameWithRoundId[]>>,
    players: PlayerIdToName[]
) => {
    try {
        const gameDetails: GameWithRoundId[] = await GetGames();
        const tournaments: Tournament[] = await GetTournaments();
        const roundMap: Record<string, string> = {};

        for (const t of tournaments) {
            const rounds: Round[] = await GetRoundsByTournament(t.tournamentId);
            rounds.forEach(r => {
                roundMap[r.roundId] = `${t.tournamentName} - Round ${r.roundNumber}`;
            });
        }

        const resolvedGames: GameWithRoundId[] = gameDetails.map(game => {
            const player1 = players.find(p => p.playerId === game.player1Id);
            const player2 = players.find(p => p.playerId === game.player2Id);
            const winner  = players.find(p => p.playerId === game.winnerId);
            return {
                ...game,
                player1Id: player1 ? `${player1.firstName} ${player1.lastName}` : game.player1Id,
                player2Id: player2 ? `${player2.firstName} ${player2.lastName}` : game.player2Id,
                winnerId:  winner  ? `${winner.firstName} ${winner.lastName}`   : game.winnerId,
                roundId:   roundMap[game.roundId] ?? game.roundId,
            };
        });

        SetGameData(resolvedGames);
    } catch (error) {
        console.error("Error while fetching game Data", error);
    }
};

/* ===========================
   COMPONENT
=========================== */
export function GameConsole() {

    const [gameData, SetGameData] = useState<GameWithRoundId[]>([]);
    const [showEditGameModal, SetShowEditGameModal] = useState(false);
    const [selectedRow, SetSelectedRow] = useState<GameWithRoundId | null>(null);
    const [showAddGameModal, SetShowAddGameModal] = useState(false);
    const [showAddByeGameModal, SetShowAddByeGameModal] = useState(false);
    const [selectedRoundId, SetSelectedRoundId] = useState<string | null>(null);
    const [players, setPlayers] = useState<PlayerIdToName[]>([]);
    const [showBulkAddGameModal, setShowBulkAddGameModal] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ FILTER GAMES BY PLAYER NAME
    const filteredGames = gameData.filter(game => {
        const player1Id = game.player1Id?.toLowerCase() || '';
        const player2Id = game.player2Id?.toLowerCase() || '';
        const winnerId = game.winnerId?.toLowerCase() || '';

        const query = searchQuery.toLowerCase();

        return (
            player1Id.includes(query) ||
            player2Id.includes(query) ||
            winnerId.includes(query)
        );
    });

    useEffect(() => {
        const init = async () => {
            const startTime = Date.now();
            setIsInitialLoading(true);

            try {
                const playersList = await getPlayer();
                setPlayers(playersList);
                await loadGameData(SetGameData, playersList);

                const duration = Date.now() - startTime;
                const minWait = 1000;

                if (duration < minWait) {
                    setTimeout(() => setIsInitialLoading(false), minWait - duration);
                } else {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => setIsInitialLoading(false));
                    });
                }
            } catch (error) {
                console.error("error during init", error);
                setIsInitialLoading(false);
            }
        };
        init();
    }, []);

    const [selectModal, setSelectModal] = useState<{
        show: boolean;
        title: string;
        subtitle?: string;
        options: { value: string; label: string }[];
        placeholder: string;
        confirmText: string;
        onConfirm: (value: string) => void;
    }>({
        show: false,
        title: "",
        options: [],
        placeholder: "",
        confirmText: "Next",
        onConfirm: () => {},
    });

    const closeSelectModal = () => setSelectModal(prev => ({ ...prev, show: false }));

    const refreshTable = async () => {
        const playersList = await getPlayer();
        await loadGameData(SetGameData, playersList);
    };

    /* ===========================
       CRUD HANDLERS
    =========================== */
    const handleUpdate = async () => { await refreshTable(); };
    const handleOnAdd = async () => { await refreshTable(); };
    const handleOnAddBye = async () => { await refreshTable(); };

    const handleEdit = (row: GameWithRoundId) => {
        SetSelectedRow(row);
        SetShowEditGameModal(true);
    };

    const handleDelete = async (gameId: string) => {
        try {
            const confirm = await Swal.fire({
                title: "Are You Sure?",
                text: "This Will Delete The Game.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Yes, Delete It!"
            });
            if (!confirm.isConfirmed) return;
            await DeleteGame(gameId);
            await refreshTable();
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Deleted Game Successfully", showConfirmButton: false, timer: 3000 });
        } catch {
            Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Game Deletion Failed", showConfirmButton: false, timer: 3000 });
        }
    };

    /* ===========================
       ADD GAME FLOW
       Step 1 → Tournament
       Step 2 → Round
       Step 3 → Game Type
    =========================== */
    const handleAddClick = async () => {
        setIsInitialLoading(true);

        let tournaments: Tournament[] = [];
        try {
            tournaments = await GetTournaments();
        } catch (error) {
            console.error("Failed to fetch tournaments", error);
            Swal.fire("Error", "Failed to fetch tournaments.", "error");
            setIsInitialLoading(false);
            return;
        }

        setIsInitialLoading(false);

        if (tournaments.length === 0) {
            Swal.fire("No Tournaments", "Please create a tournament and a round before adding a game.", "warning");
            return;
        }

        const tournamentOptions = tournaments.map(t => ({ value: t.tournamentId, label: t.tournamentName }));

        setSelectModal({
            show: true,
            title: "Select Tournament",
            subtitle: "Select a tournament for this game",
            options: tournamentOptions,
            placeholder: "Select a tournament",
            confirmText: "Next",
            onConfirm: async (tournamentId) => {
                closeSelectModal();

                setIsInitialLoading(true);

                let rounds: Round[] = [];
                try {
                    rounds = await GetRoundsByTournament(tournamentId);
                } catch (error) {
                    console.error("Failed to fetch rounds", error);
                    Swal.fire("Error", "Failed to fetch rounds.", "error");
                    setIsInitialLoading(false);
                    return;
                }

                setIsInitialLoading(false);

                if (rounds.length === 0) {
                    Swal.fire("No Rounds", "This tournament has no rounds. Please add a round first.", "warning");
                    return;
                }

                const roundOptions = sortByNumberAsc(
                    rounds.map(r => ({
                        value: r.roundId,
                        label: `Round ${r.roundNumber}${r.roundName ? ` — ${r.roundName}` : ""}`,
                        roundNumber: r.roundNumber,
                    })),
                    "roundNumber"
                );

                setSelectModal({
                    show: true,
                    title: "Select Round",
                    subtitle: "Select a round for this game",
                    options: roundOptions,
                    placeholder: "Select a round",
                    confirmText: "Next",
                    onConfirm: async (roundId) => {
                        closeSelectModal();
                        SetSelectedRoundId(roundId);

                        const result = await Swal.fire({
                            title: "Select Game Type",
                            icon: "question",
                            showConfirmButton: true,
                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonText: "Regular Game",
                            denyButtonText: "Bye Game",
                            cancelButtonText: "Cancel",
                            footer: `<button id="bulk-btn" class="swal2-confirm swal2-styled" 
                                style="background:#e0a918;color:#000;margin-top:6px;width:100%">
                                ⚡ Bulk Add Games
                            </button>`,
                            didOpen: () => {
                                document.getElementById("bulk-btn")?.addEventListener("click", () => {
                                    Swal.close();
                                    setShowBulkAddGameModal(true);
                                });
                            },
                            confirmButtonColor: "#510dfd",
                            denyButtonColor: "#19876f",
                            cancelButtonColor: "#6c757d",
                        });

                        if (result.isConfirmed) SetShowAddGameModal(true);
                        else if (result.isDenied) SetShowAddByeGameModal(true);
                    },
                });
            },
        });
    };

    /* ===========================
       TABLE HEADERS
    =========================== */
    const theads: string[] = [
        "Game Id", "Player1 Name", "Player2 Name",
        "Score 1", "Score 2", "Margin",
        "Game Tied", "Winner", "Game Date",
        "Is Bye Game", "Round", "Action"
    ];

    /* ===========================
       RENDER
    =========================== */
    return (
        <div className="console-page">
            {isInitialLoading && <OverlaySpinner message="Synchronizing Tournament Data..." />}
            <ConsoleHeader
                title="Game Console"
                subtitle="Manage and track all tournament games"
            />

            <div className="create-button d-flex justify-content-end p-2">
                <Button className="btn-create" onClick={handleAddClick}>
                    + Add Game
                </Button>
            </div>

            <div className="console-table-container">
                {/* ✅ GAME COUNT & SEARCH BAR */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '20px',
                    gap: '20px',
                    flexWrap: 'wrap'
                }}>
                    <DataCount 
                        label="Total Games Recorded"
                        totalCount={gameData.length}
                        filteredCount={filteredGames.length}
                        showFiltered={!!searchQuery}
                    />

                    <SearchBar 
                        placeholder="Search by player name..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </div>

                <div className="console-table-wrapper">
                    <div className="table-responsive">
                        {filteredGames.length === 0 ? (
                            <div style={{ textAlign: "center", color: "#bfd0e150", padding: "40px" }}>
                                <p style={{ fontSize: "0.9rem", letterSpacing: "1px", margin: 0 }}>
                                    {searchQuery ? `No games found for player "${searchQuery}"` : 'No games recorded yet.'}
                                </p>
                            </div>
                        ) : (
                            <Table striped bordered hover className="console-table text-center align-middle">
                                <thead>
                                    <tr>
                                        {theads.map(head => <th key={head}>{head}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGames.map(row => (
                                        <tr key={row.gameId}>
                                            <td data-label="Game Id">{row.gameId}</td>
                                            <td data-label="Player1 Name">{row.player1Id}</td>
                                            <td data-label="Player2 Name">{row.player2Id}</td>
                                            <td data-label="Score 1">{row.score1}</td>
                                            <td data-label="Score 2">{row.score2}</td>
                                            <td data-label="Margin">{row.margin}</td>
                                            <td data-label="Game Tied">{row.isgameTied ? "Yes" : "No"}</td>
                                            <td data-label="Winner">{row.winnerId}</td>
                                            <td data-label="Game Date">{row.gameDate}</td>
                                            <td data-label="Is Bye Game">{row.isByeGame ? "Yes" : "No"}</td>
                                            <td data-label="Round">{row.roundId}</td>
                                            <td data-label="Action">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Button className="btn-edit" onClick={() => handleEdit(row)}>Edit</Button>
                                                    <Button className="btn-delete" onClick={() => handleDelete(row.gameId)}>Delete</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </div>
            </div>

            <EditGame
                show={showEditGameModal}
                selectedRow={selectedRow}
                handleClose={() => SetShowEditGameModal(false)}
                handleUpdate={handleUpdate}
                refreshTable={refreshTable}
            />
            <AddGame
                show={showAddGameModal}
                handleClose={() => SetShowAddGameModal(false)}
                handleAdd={handleOnAdd}
                roundId={selectedRoundId}
            />
            <AddByeGame
                show={showAddByeGameModal}
                handleClose={() => SetShowAddByeGameModal(false)}
                handleAdd={handleOnAddBye}
                roundId={selectedRoundId}
            />
            <BulkAddGame
                show={showBulkAddGameModal}
                handleClose={() => setShowBulkAddGameModal(false)}
                handleAdd={handleOnAdd}
                roundId={selectedRoundId}
                players={players}
            />
            <SelectModal
                show={selectModal.show}
                title={selectModal.title}
                subtitle={selectModal.subtitle}
                options={selectModal.options}
                placeholder={selectModal.placeholder}
                confirmText={selectModal.confirmText}
                onConfirm={selectModal.onConfirm}
                onCancel={closeSelectModal}
            />
        </div>
    );
}