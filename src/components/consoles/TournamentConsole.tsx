import { useEffect, useState } from "react"
import Table from "react-bootstrap/Table"
import { Button } from "react-bootstrap"
import Swal from "sweetalert2"
import AddTournament from "../service/tournament/AddTournament"
import DeleteTournament from "../service/tournament/DeleteTournament"
import EditTournament from "../service/tournament/EditTournament"
import GetRoundsByTournament from "../service/tournament/GetRoundsByTournament"
import GetTournaments from "../service/tournament/GetTournaments"
import RoundGamesModal from "../service/tournament/RoundGamesModal"
import AddRound from "../service/tournament/AddRound"
import DeleteRound from "../service/tournament/DeleteRound"
import { SelectModal } from "./Selectmodal"
import { ConsoleHeader } from "./ConsoleHeader"
import { useAuth } from "../auth/AuthProvider"
import { TournamentPlayersModal } from "../service/tournament/TournamentPlayersModal"
import { sortByNumberAsc } from "../utils/Sorters"
import { OverlaySpinner } from "../utils/OverlaySpinner"

interface Tournament {
    tournamentId: string
    tournamentName: string
    status: string
    tournamentType?: "individual" | "team"
}

interface Round {
    roundId: string
    tournamentId: string
    roundNumber: number
    completed: boolean
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "UPCOMING": return <span className="badge-upcoming">Upcoming</span>
        case "ONGOING":  return <span className="badge-ongoing">Ongoing</span>
        case "FINISHED": return <span className="badge-finished">Finished</span>
        default:         return <span className="badge-default">{status}</span>
    }
}

export function TournamentConsole() {
    const { role } = useAuth()
    const isAdmin = role === "ROLE_ADMIN"

    const [tournamentData, setTournamentData]           = useState<Tournament[]>([])
    const [selectedRow, setSelectedRow]                 = useState<Tournament | null>(null)
    const [showEditModal, setShowEditModal]             = useState(false)
    const [showAddModal, setShowAddModal]               = useState(false)
    const [showRoundGamesModal, setShowRoundGamesModal] = useState(false)
    const [showAddRoundModal, setShowAddRoundModal]     = useState(false)
    const [selectedRoundId, setSelectedRoundId]         = useState<string | null>(null)
    const [selectedRoundNumber, setSelectedRoundNumber] = useState<number | null>(null)
    const [selectedTournamentName, setSelectedTournamentName] = useState("")
    const [selectedTournamentId, setSelectedTournamentId]     = useState("")
    const [nextRoundNumber, setNextRoundNumber]         = useState<number>(1)
    const [modalTournamentId, setModalTournamentId]     = useState<string | null>(null)
    const [modalTournamentName, setModalTournamentName] = useState<string>("")
    const [selectedRoundCompleted, setSelectedRoundCompleted] = useState(false)

    const [pendingTournamentType, setPendingTournamentType] = useState<"individual" | "team">("individual")
    const [modalTournamentType, setModalTournamentType]     = useState<"individual" | "team">("individual")

    // ✅ State for Dynamic Loading Messages
    const [loadingMessage, setLoadingMessage] = useState<string | null>("Loading Tournaments...");

    const [selectModal, setSelectModal] = useState<{
        show: boolean
        title: string
        subtitle?: string
        options: { value: string; label: string }[]
        placeholder: string
        confirmText: string
        onConfirm: (value: string) => void
    }>({
        show: false,
        title: "",
        options: [],
        placeholder: "",
        confirmText: "Next",
        onConfirm: () => {},
    })

    // ✅ Updated loadData to support the Spinner
    const loadData = async (message: string | null = null) => {
        const startTime = Date.now();
        if (message) setLoadingMessage(message);
        
        try {
            const data = await GetTournaments();
            setTournamentData(data);
            
            // Ensure the spinner shows for at least 800ms for a smooth 3D flip
            const duration = Date.now() - startTime;
            if (duration < 800) {
                setTimeout(() => setLoadingMessage(null), 800 - duration);
            } else {
                setLoadingMessage(null);
            }
        } catch (error) {
            console.error("Failed to load tournaments", error);
            setLoadingMessage(null);
        }
    }

    useEffect(() => {
        loadData("Fetching Tournament Records...");
    }, [])

    const closeSelectModal = () => setSelectModal(prev => ({ ...prev, show: false }))

    const handleAddTournamentClick = async () => {
        const result = await Swal.fire({
            title: "Tournament Type",
            text: "What kind of tournament is this?",
            showConfirmButton: true,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Individual",
            denyButtonText: "Team",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#198754",
            denyButtonColor: "#510dfd",
            cancelButtonColor: "#6c757d",
        })

        if (result.isConfirmed) {
            setPendingTournamentType("individual")
            setShowAddModal(true)
        } else if (result.isDenied) {
            setPendingTournamentType("team")
            setShowAddModal(true)
        }
    }

    const handleDelete = async (tournament: Tournament) => {
        const result = await Swal.fire({
            title: "What do you want to delete?",
            icon: "warning",
            showConfirmButton: true,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Tournament",
            denyButtonText: "Round",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d33",
            denyButtonColor: "#e0a800",
            cancelButtonColor: "#6c757d",
        })

        if (result.isConfirmed) {
            const confirm = await Swal.fire({
                title: "Are you sure?",
                text: `This will delete "${tournament.tournamentName}" and all its rounds and games.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Yes, delete it!"
            })
            if (confirm.isConfirmed) {
                setLoadingMessage("Deleting Tournament..."); // ✅ Spinner on
                try {
                    await DeleteTournament(tournament.tournamentId)
                    await loadData("Refreshing Dashboard..."); // ✅ Spinner updates
                    Swal.fire("Deleted!", "Tournament has been deleted.", "success")
                } catch {
                    setLoadingMessage(null);
                    Swal.fire("Error", "Failed to delete tournament.", "error")
                }
            }
        } else if (result.isDenied) {
            setLoadingMessage("Fetching Rounds..."); // ✅ Spinner on
            let rounds: Round[] = []
            try {
                rounds = await GetRoundsByTournament(tournament.tournamentId)
                setLoadingMessage(null);
            } catch {
                setLoadingMessage(null);
                Swal.fire("Error", "Failed to fetch rounds.", "error")
                return
            }

            if (rounds.length === 0) {
                Swal.fire("No Rounds", `${tournament.tournamentName} has no rounds to delete.`, "info")
                return
            }

            const sortedRounds = sortByNumberAsc(rounds, "roundNumber")
            const roundOptions: Record<string, string> = {}
            sortedRounds.forEach(r => { roundOptions[r.roundId] = `Round ${r.roundNumber}` })

            const { value: roundId } = await Swal.fire({
                title: "Select Round to Delete",
                html: `<p style="color:#bfd0e1d1;margin:0">Select a round from "${tournament.tournamentName}"</p>`,
                input: "select",
                inputOptions: roundOptions,
                inputPlaceholder: "Select a round",
                showCancelButton: true,
                confirmButtonText: "Delete Round",
                confirmButtonColor: "#d33",
                inputValidator: (value) =>
                    new Promise(resolve => value ? resolve(undefined) : resolve("Please select a round"))
            })

            if (roundId) {
                const selectedRound = sortedRounds.find(r => r.roundId === roundId)
                const confirm = await Swal.fire({
                    title: "Are you sure?",
                    text: `This will delete Round ${selectedRound?.roundNumber} and all its games.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#6c757d",
                    confirmButtonText: "Yes, delete it!"
                })
                if (confirm.isConfirmed) {
                    setLoadingMessage("Deleting Round..."); // ✅ Spinner on
                    try {
                        await DeleteRound(roundId)
                        setLoadingMessage(null);
                        Swal.fire("Deleted!", `Round ${selectedRound?.roundNumber} has been deleted.`, "success")
                    } catch {
                        setLoadingMessage(null);
                        Swal.fire("Error", "Failed to delete round.", "error")
                    }
                }
            }
        }
    }

    const handleEdit = (row: Tournament) => {
        setSelectedRow(row)
        setShowEditModal(true)
    }

    const handleOnUpdate = (updated: Tournament) => {
        setTournamentData(prev =>
            prev.map(t => t.tournamentId === updated.tournamentId ? updated : t)
        )
    }

    const handleAdd = (newTournament: Tournament) => {
        setTournamentData(prev => [...prev, { ...newTournament, tournamentType: pendingTournamentType }])
    }

    const handleAddRound = async (tournament: Tournament) => {
        setLoadingMessage("Preparing Round Setup..."); // ✅ Spinner on
        setSelectedTournamentId(tournament.tournamentId)
        setSelectedTournamentName(tournament.tournamentName)
        try {
            const rounds = await GetRoundsByTournament(tournament.tournamentId)
            setNextRoundNumber(rounds.length + 1)
        } catch {
            setNextRoundNumber(1)
        } finally {
            setLoadingMessage(null);
            setShowAddRoundModal(true)
        }
    }

    const handleAddPlayersClick = (row: Tournament) => {
        setModalTournamentId(row.tournamentId)
        setModalTournamentName(row.tournamentName)
        setModalTournamentType(row.tournamentType ?? "individual")
    }

    const handleViewRoundsClick = async () => {
        if (tournamentData.length === 0) {
            Swal.fire("No Tournaments", "There are no tournaments yet.", "info")
            return
        }
        const options = tournamentData.map(t => ({ value: t.tournamentId, label: t.tournamentName }))
        setSelectModal({
            show: true,
            title: "Select Tournament",
            options,
            placeholder: "Select a tournament",
            confirmText: "Next",
            onConfirm: async (tournamentId) => {
                closeSelectModal()
                const selectedTournament = tournamentData.find(t => t.tournamentId === tournamentId)!
                await showRoundSelector(selectedTournament)
            },
        })
    }

    const showRoundSelector = async (tournament: Tournament) => {
        setLoadingMessage("Fetching Rounds..."); // ✅ Spinner on
        let rounds: Round[] = []
        try {
            rounds = await GetRoundsByTournament(tournament.tournamentId)
            setLoadingMessage(null);
        } catch {
            setLoadingMessage(null);
            Swal.fire("Error", "Failed to fetch rounds.", "error")
            return
        }
        if (rounds.length === 0) {
            Swal.fire("No Rounds", `${tournament.tournamentName} has no rounds yet.`, "info")
            return
        }

        const sortedRounds = sortByNumberAsc(rounds, "roundNumber")

        const options = sortedRounds.map(r => ({
            value: r.roundId,
            label: `Round ${r.roundNumber}${r.completed ? "  ✓" : ""}`,
        }))

        setSelectModal({
            show: true,
            title: tournament.tournamentName,
            subtitle: "Select a round to view games",
            options,
            placeholder: "Select a round",
            confirmText: "View Games",
            onConfirm: (roundId) => {
                closeSelectModal()
                const selectedRound = sortedRounds.find(r => r.roundId === roundId)
                setSelectedRoundId(roundId)
                setSelectedRoundNumber(selectedRound?.roundNumber ?? null)
                setSelectedRoundCompleted(selectedRound?.completed ?? false)
                setSelectedTournamentName(tournament.tournamentName)
                setShowRoundGamesModal(true)
            },
        })
    }

    const handleActionsClick = (row: Tournament) => {
        const isTeam = row.tournamentType === "team";
        const playersBtnLabel = isTeam ? "Add Teams" : "Add Players";

        Swal.fire({
            title: "Choose Action",
            html: `
                <div style="display: flex; flex-direction: row; gap: 8px; justify-content: center; padding: 10px 0; overflow-x: auto;">
                    <button id="swal-players" class="swal-action-btn btn-register" style="flex: 1; min-width: 100px; padding: 10px 5px; font-size: 0.85rem;">
                        ${playersBtnLabel}
                    </button>
                    <button id="swal-add-round" class="swal-action-btn btn-create" style="flex: 1; min-width: 100px; padding: 10px 5px; font-size: 0.85rem; background-color: #0d6efd; color: white; border: none; border-radius: 4px;">
                        + Round
                    </button>
                    <button id="swal-edit" class="swal-action-btn btn-edit" style="flex: 1; min-width: 80px; padding: 10px 5px; font-size: 0.85rem; background-color: #6c757d; color: white; border: none; border-radius: 4px;">
                        Edit
                    </button>
                    <button id="swal-delete" class="swal-action-btn btn-delete" style="flex: 1; min-width: 80px; padding: 10px 5px; font-size: 0.85rem; background-color: #dc3545; color: white; border: none; border-radius: 4px;">
                        Delete
                    </button>
                </div>
            `,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: "Close",
            background: "#0d0c18",
            color: "#bfd0e1d1",
            cancelButtonColor: "#444",
            didOpen: () => {
                const content = Swal.getHtmlContainer();
                if (content) {
                    content.querySelector("#swal-players")?.addEventListener("click", () => {
                        Swal.close();
                        handleAddPlayersClick(row);
                    });
                    content.querySelector("#swal-add-round")?.addEventListener("click", () => {
                        Swal.close();
                        handleAddRound(row);
                    });
                    content.querySelector("#swal-edit")?.addEventListener("click", () => {
                        Swal.close();
                        handleEdit(row);
                    });
                    content.querySelector("#swal-delete")?.addEventListener("click", () => {
                        Swal.close();
                        handleDelete(row);
                    });
                }
            }
        });
    };

    const tHeads = ["Tournament ID", "Tournament Name", "Status", "Action"]

    return (
        <>
            {/* ✅ Spinner triggers whenever loadingMessage is not null */}
            {loadingMessage && <OverlaySpinner message={loadingMessage} />}

            <div className="console-page">
                <ConsoleHeader
                    title="Tournament Console"
                    subtitle="Oversee tournaments, rounds and standings"
                />

                {isAdmin && (
                    <div className="create-button d-flex justify-content-end gap-2 p-2">
                        <Button className="btn-view" variant="info" onClick={handleViewRoundsClick}>
                            View Tournaments
                        </Button>
                        <Button className="btn-create" variant="success" onClick={handleAddTournamentClick}>
                            + Add Tournament
                        </Button>
                    </div>
                )}

                <div className="console-table-container">
                    <div className="console-table-wrapper">
                        <div className="table-responsive">
                            <Table striped bordered hover className="console-table">
                            <thead>
                                <tr>
                                    {tHeads.map(h => (
                                        <th className="text-center" key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tournamentData.map((row, index) => (
                                    <tr key={row.tournamentId || index}>
                                        <td data-label="Tournament ID" className="text-center">{row.tournamentId}</td>
                                        <td data-label="Tournament Name" className="text-center">{row.tournamentName}</td>
                                        <td data-label="Status" className="text-center">{getStatusBadge(row.status)}</td>
                                        <td data-label="Action">
                                            <div className="d-flex justify-content-center">
                                                {isAdmin ? (
                                                    <Button 
                                                        className="btn-actions-outlined" 
                                                        variant="outline-warning" 
                                                        onClick={() => handleActionsClick(row)}
                                                        style={{ background: "transparent", border: "1px solid #e0d318", color: "#e0d318", fontWeight: "bold", padding: "6px 16px", borderRadius: "20px", fontSize: "0.85rem", transition: "all 0.3s ease" }}
                                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(224,211,24,0.1)"; e.currentTarget.style.boxShadow = "0 0 10px rgba(224,211,24,0.3)"; }}
                                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
                                                    >
                                                        Actions
                                                    </Button>
                                                ) : (
                                                    <Button className="btn-view" variant="info" onClick={() => showRoundSelector(row)}>
                                                        View Rounds
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        </div>
                    </div>
                </div>

                <AddTournament
                    show={showAddModal}
                    handleClose={() => setShowAddModal(false)}
                    handleAdd={handleAdd}
                    refreshTable={() => loadData("Updating Tournament List...")}
                    tournamentType={pendingTournamentType}
                />
                <EditTournament
                    show={showEditModal}
                    selectedRow={selectedRow}
                    handleClose={() => setShowEditModal(false)}
                    handleUpdate={handleOnUpdate}
                    refreshTable={() => loadData("Saving Changes...")}
                />

                <RoundGamesModal
                    show={showRoundGamesModal}
                    handleClose={() => setShowRoundGamesModal(false)}
                    roundId={selectedRoundId}
                    roundNumber={selectedRoundNumber}
                    tournamentName={selectedTournamentName}
                    isCompleted={selectedRoundCompleted}
                    onRoundCompleted={() => setSelectedRoundCompleted(true)}
                />

                <AddRound
                    show={showAddRoundModal}
                    tournamentId={selectedTournamentId}
                    handleClose={() => setShowAddRoundModal(false)}
                    handleAdd={() => setShowAddRoundModal(false)}
                    defaultRoundNumber={nextRoundNumber}
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

                <TournamentPlayersModal
                    show={!!modalTournamentId}
                    onHide={() => setModalTournamentId(null)}
                    tournamentId={modalTournamentId ?? ""}
                    tournamentName={modalTournamentName}
                    tournamentType={modalTournamentType}
                />
            </div>
        </>
    )
}