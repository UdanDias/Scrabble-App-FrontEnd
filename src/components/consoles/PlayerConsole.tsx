import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { getPlayer } from '../service/player/GetPlayer';
import { Button } from 'react-bootstrap';
import EditPlayer from '../service/player/EditPlayer';
import DeletePlayer from '../service/player/DeletePlayer';
import AddPlayer from '../service/player/AddPlayer';
import { GamesByPlayer } from '../service/player/GamesByPlayer';
import Swal from 'sweetalert2';
import BulkAddPlayer from '../service/player/Bulkaddplayer';
import { ConsoleHeader } from './ConsoleHeader';
import { useAuth } from '../auth/AuthProvider';
import { OverlaySpinner } from '../utils/OverlaySpinner';


interface Player {
    playerId: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    dob: string;
    email: string;
    phone: string;
    address: string;
    faculty: string;
    academicLevel: string;
    accountCreatedDate: string;
    username: string;
}

export function PlayerConsole() {
    const { role } = useAuth();
    const isAdmin = role === "ROLE_ADMIN";

    const [playerData, SetPlayerData] = useState<Player[]>([]);
    const [selectedRow, SetSelectedRow] = useState<Player | null>(null);
    const [showEditPlayerModal, SetShowEditPlayerModal] = useState(false);
    const [showAddPlayerModal, SetShowAddPlayerModal] = useState(false);
    const [showGamesByPlayerModal, setShowGamesByPlayerModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    
    // ✅ Add loading state
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    /* ===========================
        DATA LOADING LOGIC
    =========================== */
    const loadData = async (showSpinner: boolean = false) => {
        const startTime = Date.now();
        if (showSpinner) setIsInitialLoading(true);

        try {
            const playerDetails = await getPlayer();
            SetPlayerData(playerDetails);
            
            // Minimum wait logic for premium feel
            const duration = Date.now() - startTime;
            const minWait = 800; 

            if (duration < minWait) {
                setTimeout(() => setIsInitialLoading(false), minWait - duration);
            } else {
                setIsInitialLoading(false);
            }
        } catch (error) {
            console.error("Error loading players:", error);
            setIsInitialLoading(false);
        }
    };

    useEffect(() => { 
        loadData(true); 
    }, []);

    const refreshTable = () => loadData(true);

    /* ===========================
        HANDLERS
    =========================== */
    const handleDelete = async (playerId: string) => {
        try {
            const confirm = await Swal.fire({
                title: "Are You Sure?",
                text: `This Will Delete The Player.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Yes, Delete It!"
            });
            if (!confirm.isConfirmed) return;

            setIsInitialLoading(true); // Show spinner during delete API call
            await DeletePlayer(playerId);
            
            await loadData(false); // Refresh data silently then hide spinner
            setIsInitialLoading(false);

            Swal.fire({ 
                toast: true, position: "top-end", icon: "success", 
                title: "Deleted Player Successfully", showConfirmButton: false, timer: 3000 
            });
        } catch (error) {
            setIsInitialLoading(false);
            Swal.fire({ 
                toast: true, position: "top-end", icon: "error", 
                title: "Player Deletion Failed", showConfirmButton: false, timer: 3000 
            });
        }
    };

    const handleOnUpdate = async (updatedPlayer: Player) => {
        SetPlayerData(playerData.map(p => p.playerId === updatedPlayer.playerId ? updatedPlayer : p));
    };

    const handleAdd = (newPlayer: Player) => SetPlayerData(prev => [...prev, newPlayer]);
    const handleEdit = (row: Player) => { SetSelectedRow(row); SetShowEditPlayerModal(true); };
    const handleGetGamesByPlayer = (row: Player) => { SetSelectedRow(row); setShowGamesByPlayerModal(true); };

    const tHeads: string[] = [
        "Player Id", "First Name", "Last Name", "Username", "Age", "Gender",
        "Date Of Birth", "Email", "Phone", "Address", "Faculty",
        "Academic Level", "Account Created Date", "Action"
    ];

    return (
        <>
            {/* ✅ Global Spinner Overlay */}
            {isInitialLoading && <OverlaySpinner message="Loading Player Records..." />}

            <div className="console-page">
                <ConsoleHeader
                    title="Player Console"
                    subtitle="Manage registered players and their profiles"
                />

                {isAdmin && (
                    <div className="create-button d-flex justify-content-end gap-2 mt-3">
                        <Button className="btn-create" onClick={() => SetShowAddPlayerModal(true)}>+ Create Player</Button>
                        <Button className="btn-view" onClick={() => setShowBulkModal(true)}>+ Bulk Add</Button>
                    </div>
                )}

                <div className="console-table-container">
                    <div className="console-table-wrapper">
                        <Table striped bordered hover className="console-table text-center align-middle">
                            <thead>
                                <tr>
                                    {tHeads.map(head => <th key={head}>{head}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {playerData.map(row => (
                                    <tr key={row.playerId}>
                                        <td>{row.playerId}</td>
                                        <td>{row.firstName}</td>
                                        <td>{row.lastName}</td>
                                        <td>{row.username}</td>
                                        <td>{row.age}</td>
                                        <td>{row.gender}</td>
                                        <td>{row.dob}</td>
                                        <td>{row.email}</td>
                                        <td>{row.phone}</td>
                                        <td>{row.address}</td>
                                        <td>{row.faculty}</td>
                                        <td>{row.academicLevel}</td>
                                        <td>{row.accountCreatedDate}</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button className="btn-games" onClick={() => handleGetGamesByPlayer(row)}>Games</Button>
                                                {isAdmin && (
                                                    <>
                                                        <Button className="btn-edit" onClick={() => handleEdit(row)}>Edit</Button>
                                                        <Button className="btn-delete" onClick={() => handleDelete(row.playerId)}>Delete</Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <EditPlayer
                        show={showEditPlayerModal}
                        selectedRow={selectedRow}
                        handleClose={() => SetShowEditPlayerModal(false)}
                        handleUpdate={handleOnUpdate}
                        refreshTable={refreshTable}
                    />
                    <AddPlayer
                        show={showAddPlayerModal}
                        handleClose={() => SetShowAddPlayerModal(false)}
                        handleAdd={handleAdd}
                        refreshTable={refreshTable}
                    />
                    <GamesByPlayer
                        show={showGamesByPlayerModal}
                        handleClose={() => setShowGamesByPlayerModal(false)}
                        selectedRow={selectedRow}
                    />
                    <BulkAddPlayer
                        show={showBulkModal}
                        handleClose={() => setShowBulkModal(false)}
                        refreshTable={refreshTable}
                    />
                </div>
            </div>
        </>
    );
}