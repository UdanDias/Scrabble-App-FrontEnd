
// import { useEffect, useState } from "react"
// import Table from "react-bootstrap/Table"
// import { Button, Badge } from "react-bootstrap"
// import Swal from "sweetalert2"
// import AddTournament from "./service/tournament/AddTournament"
// import DeleteTournament from "./service/tournament/DeleteTournament"
// import EditTournament from "./service/tournament/EditTournament"
// import GetRoundsByTournament from "./service/tournament/GetRoundsByTournament"
// import GetTournaments from "./service/tournament/GetTournaments"
// import RoundGamesModal from "./service/tournament/RoundGamesModal"


// interface Tournament {
//     tournamentId: string
//     tournamentName: string
//     startDate: string
//     endDate: string
//     status: string
// }

// interface Round {
//     roundId: string
//     tournamentId: string
//     roundNumber: number
// }

// const loadData = async (setData: React.Dispatch<React.SetStateAction<Tournament[]>>) => {
//     const data = await GetTournaments()
//     setData(data)
// }

// const getStatusBadge = (status: string) => {
//     switch (status) {
//         case "UPCOMING": return <Badge bg="primary">Upcoming</Badge>
//         case "ONGOING": return <Badge bg="success">Ongoing</Badge>
//         case "COMPLETED": return <Badge bg="secondary">Completed</Badge>
//         default: return <Badge bg="light" text="dark">{status}</Badge>
//     }
// }

// export function TournamentConsole() {
//     const [tournamentData, setTournamentData] = useState<Tournament[]>([])
//     const [selectedRow, setSelectedRow] = useState<Tournament | null>(null)
//     const [showEditModal, setShowEditModal] = useState(false)
//     const [showAddModal, setShowAddModal] = useState(false)
//     const [showRoundGamesModal, setShowRoundGamesModal] = useState(false)
//     const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null)
//     const [selectedRoundNumber, setSelectedRoundNumber] = useState<number | null>(null)
//     const [selectedTournamentName, setSelectedTournamentName] = useState("")

//     useEffect(() => {
//         loadData(setTournamentData)
//     }, [])

//     const handleDelete = async (tournamentId: string) => {
//         const result = await Swal.fire({
//             title: "Are you sure?",
//             text: "This will delete the tournament and all its rounds and games.",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             cancelButtonColor: "#3085d6",
//             confirmButtonText: "Yes, delete it!"
//         })
//         if (result.isConfirmed) {
//             await DeleteTournament(tournamentId)
//             setTournamentData(prev => prev.filter(t => t.tournamentId !== tournamentId))
//             Swal.fire("Deleted!", "Tournament has been deleted.", "success")
//         }
//     }

//     const handleEdit = (row: Tournament) => {
//         setSelectedRow(row)
//         setShowEditModal(true)
//     }

//     const handleOnUpdate = (updated: Tournament) => {
//         setTournamentData(prev =>
//             prev.map(t => t.tournamentId === updated.tournamentId ? updated : t)
//         )
//     }

//     const handleAdd = (newTournament: Tournament) => {
//         setTournamentData(prev => [...prev, newTournament])
//     }

//     // Rounds button click — show Swal select with round options
//     const handleRoundsClick = async (tournament: Tournament) => {
//         let rounds: Round[] = []
//         try {
//             rounds = await GetRoundsByTournament(tournament.tournamentId)
//         } catch (error) {
//             Swal.fire("Error", "Failed to fetch rounds.", "error")
//             return
//         }

//         if (rounds.length === 0) {
//             Swal.fire({
//                 title: "No Rounds",
//                 text: `${tournament.tournamentName} has no rounds yet.`,
//                 icon: "info"
//             })
//             return
//         }

//         // Build inputOptions for Swal select
//         const inputOptions: Record<string, string> = {}
//         rounds.forEach(r => {
//             inputOptions[r.roundId] = `Round ${r.roundNumber}`
//         })

//         const { value: roundId } = await Swal.fire({
//             title: `${tournament.tournamentName}`,
//             html: `<p class="text-muted mb-0">Select a round to view games</p>`,
//             input: "select",
//             inputOptions: inputOptions,
//             inputPlaceholder: "Select a round",
//             showCancelButton: true,
//             confirmButtonText: "View Games",
//             inputValidator: (value) => {
//                 return new Promise(resolve => {
//                     if (value) {
//                         resolve(undefined)
//                     } else {
//                         resolve("Please select a round")
//                     }
//                 })
//             }
//         })

//         if (roundId) {
//             const selectedRound = rounds.find(r => r.roundId === roundId)
//             setSelectedRoundId(roundId)
//             setSelectedRoundNumber(selectedRound?.roundNumber ?? null)
//             setSelectedTournamentName(tournament.tournamentName)
//             setShowRoundGamesModal(true)
//         }
//     }

//     const tHeads = [
//         "Tournament ID",
//         "Tournament Name",
//         "Start Date",
//         "End Date",
//         "Status",
//         "Action"
//     ]

//     return (
//         <>
//             <div className="d-flex justify-content-end p-2">
//                 <Button variant="success" onClick={() => setShowAddModal(true)}>
//                     + Add Tournament
//                 </Button>
//             </div>

//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         {tHeads.map(h => (
//                             <th className="text-center" key={h}>{h}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {tournamentData.map((row, index) => (
//                         <tr key={row.tournamentId || index}>
//                             <td className="text-center">{row.tournamentId}</td>
//                             <td className="text-center">{row.tournamentName}</td>
//                             <td className="text-center">{row.startDate}</td>
//                             <td className="text-center">{row.endDate}</td>
//                             <td className="text-center">{getStatusBadge(row.status)}</td>
//                             <td>
//                                 <div className="d-flex gap-2 justify-content-center">
//                                     <Button variant="info" onClick={() => handleRoundsClick(row)}>
//                                         Rounds
//                                     </Button>
//                                     <Button variant="secondary" onClick={() => handleEdit(row)}>
//                                         Edit
//                                     </Button>
//                                     <Button variant="danger" onClick={() => handleDelete(row.tournamentId)}>
//                                         Delete
//                                     </Button>
//                                 </div>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             <AddTournament
//                 show={showAddModal}
//                 handleClose={() => setShowAddModal(false)}
//                 handleAdd={handleAdd}
//                 refreshTable={() => loadData(setTournamentData)}
//             />

//             <EditTournament
//                 show={showEditModal}
//                 selectedRow={selectedRow}
//                 handleClose={() => setShowEditModal(false)}
//                 handleUpdate={handleOnUpdate}
//                 refreshTable={() => loadData(setTournamentData)}
//             />

//             <RoundGamesModal
//                 show={showRoundGamesModal}
//                 handleClose={() => setShowRoundGamesModal(false)}
//                 roundId={selectedRoundId}
//                 roundNumber={selectedRoundNumber}
//                 tournamentName={selectedTournamentName}
//             />
//         </>
//     )
// }
import { useEffect, useState } from "react"
import Table from "react-bootstrap/Table"
import { Button, Badge } from "react-bootstrap"
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
// import AddRound from "./service/tournament/AddRound"

interface Tournament {
    tournamentId: string
    tournamentName: string
    status: string
}

interface Round {
    roundId: string
    tournamentId: string
    roundNumber: number
}

const loadData = async (setData: React.Dispatch<React.SetStateAction<Tournament[]>>) => {
    const data = await GetTournaments()
    setData(data)
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "UPCOMING": return <span className="badge-upcoming">Upcoming</span>
        case "ONGOING": return <span className="badge-ongoing">Ongoing</span>
        case "FINISHED": return <span className="badge-finished">Finished</span>
        default: return <span className="badge-default">{status}</span>
    }
}

export function TournamentConsole() {
    const [tournamentData, setTournamentData] = useState<Tournament[]>([])
    const [selectedRow, setSelectedRow] = useState<Tournament | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showRoundGamesModal, setShowRoundGamesModal] = useState(false)
    const [showAddRoundModal, setShowAddRoundModal] = useState(false)
    const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null)
    const [selectedRoundNumber, setSelectedRoundNumber] = useState<number | null>(null)
    const [selectedTournamentName, setSelectedTournamentName] = useState("")
    const [selectedTournamentId, setSelectedTournamentId] = useState("")

    useEffect(() => {
        loadData(setTournamentData)
    }, [])

    const handleDelete = async (tournament: Tournament) => {
    // Step 1 — ask what to delete
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
        // Delete tournament
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
            try {
                await DeleteTournament(tournament.tournamentId)
                setTournamentData(prev => prev.filter(t => t.tournamentId !== tournament.tournamentId))
                Swal.fire("Deleted!", "Tournament has been deleted.", "success")
            } catch (error) {
                Swal.fire("Error", "Failed to delete tournament.", "error")
            }
        }

    } else if (result.isDenied) {
        // Delete round — fetch rounds first
        let rounds: Round[] = []
        try {
            rounds = await GetRoundsByTournament(tournament.tournamentId)
        } catch {
            Swal.fire("Error", "Failed to fetch rounds.", "error")
            return
        }

        if (rounds.length === 0) {
            Swal.fire("No Rounds", `${tournament.tournamentName} has no rounds to delete.`, "info")
            return
        }

        const roundOptions: Record<string, string> = {}
        rounds.forEach(r => { roundOptions[r.roundId] = `Round ${r.roundNumber}` })

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
            const selectedRound = rounds.find(r => r.roundId === roundId)
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
                try {
                    await DeleteRound(roundId)  // you'll need this service
                    Swal.fire("Deleted!", `Round ${selectedRound?.roundNumber} has been deleted.`, "success")
                } catch (error) {
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
        setTournamentData(prev => [...prev, newTournament])
    }

    const handleAddRound = (tournament: Tournament) => {
        setSelectedTournamentId(tournament.tournamentId)
        setSelectedTournamentName(tournament.tournamentName)
        setShowAddRoundModal(true)
    }

    // Top right "View Rounds" — pick tournament then round
    // const handleViewRoundsClick = async () => {
    //     if (tournamentData.length === 0) {
    //         Swal.fire("No Tournaments", "There are no tournaments yet.", "info")
    //         return
    //     }

    //     const tournamentOptions: Record<string, string> = {}
    //     tournamentData.forEach(t => { tournamentOptions[t.tournamentId] = t.tournamentName })

    //     const { value: tournamentId } = await Swal.fire({
    //         title: "Select Tournament",
    //         input: "select",
    //         inputOptions: tournamentOptions,
    //         inputPlaceholder: "Select a tournament",
    //         showCancelButton: true,
    //         confirmButtonText: "Next",
    //         inputValidator: (value) =>
    //             new Promise(resolve => value ? resolve(undefined) : resolve("Please select a tournament"))
    //     })

    //     if (!tournamentId) {
    //         return
    //     }

    //     const selectedTournament = tournamentData.find(t => t.tournamentId === tournamentId)!
    //     await showRoundSelector(selectedTournament)
    // }
    const handleViewRoundsClick = async () => {
        if (tournamentData.length === 0) {
            Swal.fire("No Tournaments", "There are no tournaments yet.", "info");
            return;
        }

        const options = tournamentData.map(t => ({
            value: t.tournamentId,
            label: t.tournamentName,
        }));

        setSelectModal({
            show: true,
            title: "Select Tournament",
            options,
            placeholder: "Select a tournament",
            confirmText: "Next",
            onConfirm: async (tournamentId) => {
                closeSelectModal();
                const selectedTournament = tournamentData.find(t => t.tournamentId === tournamentId)!;
                await showRoundSelector(selectedTournament);
            },
        });
    };

    // // Row "Rounds" button — directly pick round for that tournament
    // const handleViewRoundsForRow = async (tournament: Tournament) => {
    //     await showRoundSelector(tournament)
    // }

    // Shared round selector logic
    // const showRoundSelector = async (tournament: Tournament) => {
    //     let rounds: Round[] = []
    //     try {
    //         rounds = await GetRoundsByTournament(tournament.tournamentId)
    //     } catch {
    //         Swal.fire("Error", "Failed to fetch rounds.", "error")
    //         return
    //     }

    //     if (rounds.length === 0) {
    //         Swal.fire("No Rounds", `${tournament.tournamentName} has no rounds yet.`, "info")
    //         return
    //     }

    //     const roundOptions: Record<string, string> = {}
    //     rounds.forEach(r => {
    //         roundOptions[r.roundId] = `Round ${r.roundNumber}`
    //     })

    //     const { value: roundId } = await Swal.fire({
    //         title: tournament.tournamentName,
    //         html: `<p style="color:#bfd0e1d1;margin:0">Select a round to view games</p>`,
    //         input: "select",
    //         inputOptions: roundOptions,
    //         inputPlaceholder: "Select a round",
    //         showCancelButton: true,
    //         confirmButtonText: "View Games",
    //         inputValidator: (value) =>
    //             new Promise(resolve => value ? resolve(undefined) : resolve("Please select a round"))
    //     })

    //     if (roundId) {
    //         const selectedRound = rounds.find(r => r.roundId === roundId)
    //         setSelectedRoundId(roundId)
    //         setSelectedRoundNumber(selectedRound?.roundNumber ?? null)
    //         setSelectedTournamentName(tournament.tournamentName)
    //         setShowRoundGamesModal(true)
    //     }
    // }
    const showRoundSelector = async (tournament: Tournament) => {
        let rounds: Round[] = [];
        try {
            rounds = await GetRoundsByTournament(tournament.tournamentId);
        } catch {
            Swal.fire("Error", "Failed to fetch rounds.", "error");
            return;
        }

        if (rounds.length === 0) {
            Swal.fire("No Rounds", `${tournament.tournamentName} has no rounds yet.`, "info");
            return;
        }

        const options = rounds.map(r => ({
            value: r.roundId,
            label: `Round ${r.roundNumber}`,
        }));

        setSelectModal({
            show: true,
            title: tournament.tournamentName,
            subtitle: "Select a round to view games",
            options,
            placeholder: "Select a round",
            confirmText: "View Games",
            onConfirm: (roundId) => {
                closeSelectModal();
                const selectedRound = rounds.find(r => r.roundId === roundId);
                setSelectedRoundId(roundId);
                setSelectedRoundNumber(selectedRound?.roundNumber ?? null);
                setSelectedTournamentName(tournament.tournamentName);
                setShowRoundGamesModal(true);
            },
        });
    };

    const tHeads = [
        "Tournament ID",
        "Tournament Name",
        "Status",
        "Action"
    ]
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


    return (
        <>
        <div className="console-page">
            <ConsoleHeader
                title="Tournament Console"
                subtitle="Oversee tournaments, rounds and standings"
                icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(224,211,24,0.7)" strokeWidth="1.5">
                        <path d="M6 3h12l2 6c0 3.3-2.7 6-6 6H10C6.7 15 4 12.3 4 9L6 3z"/>
                        <path d="M12 15v4M8 20h8"/>
                    </svg>
                }
            />
            {/* Top right buttons */}
            <div className="create-button d-flex justify-content-end gap-2 p-2">
                <Button className="btn-view" variant="info" onClick={handleViewRoundsClick}>
                    View Tournaments
                </Button>
                <Button className="btn-create" variant="success" onClick={() => setShowAddModal(true)}>
                    + Add Tournament
                </Button>
            </div>
            <div className="console-table-container">
                <div className="console-table-wrapper">
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
                                    <td className="text-center">{row.tournamentId}</td>
                                    <td className="text-center">{row.tournamentName}</td>
                                    <td className="text-center">{getStatusBadge(row.status)}</td>
                                    <td>
                                        <div className="d-flex gap-2 justify-content-center">
                                            {/* <Button variant="info" onClick={() => handleViewRoundsForRow(row)}>
                                                Rounds
                                            </Button> */}
                                            <Button  className="btn-create" variant="primary" onClick={() => handleAddRound(row)}>
                                            + Add Round
                                            </Button>
                                            <Button className="btn-edit" variant="secondary" onClick={() => handleEdit(row)}>
                                                Edit
                                            </Button>
                                            <Button className="btn-delete" variant="danger" onClick={() => handleDelete(row)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            

            <AddTournament
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                handleAdd={handleAdd}
                refreshTable={() => loadData(setTournamentData)}
            />

            <EditTournament
                show={showEditModal}
                selectedRow={selectedRow}
                handleClose={() => setShowEditModal(false)}
                handleUpdate={handleOnUpdate}
                refreshTable={() => loadData(setTournamentData)}
            />

            <RoundGamesModal
                show={showRoundGamesModal}
                handleClose={() => setShowRoundGamesModal(false)}
                roundId={selectedRoundId}
                roundNumber={selectedRoundNumber}
                tournamentName={selectedTournamentName}
            />

            <AddRound
                show={showAddRoundModal}
                tournamentId={selectedTournamentId}
                handleClose={() => setShowAddRoundModal(false)}
                handleAdd={() => setShowAddRoundModal(false)}
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
        </>
    )
}