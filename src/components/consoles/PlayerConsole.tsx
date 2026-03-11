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
    username: string; // ✅ added
}

export const loadData = async (SetPlayerData: React.Dispatch<React.SetStateAction<Player[]>>) => {
    const playerDetails = await getPlayer();
    SetPlayerData(playerDetails);
};

export function PlayerConsole() {
    const { role } = useAuth();
    const isAdmin = role === "ROLE_ADMIN";

    const [playerData, SetPlayerData] = useState<Player[]>([]);
    const [selectedRow, SetSelectedRow] = useState<Player | null>(null);
    const [showEditPlayerModal, SetShowEditPlayerModal] = useState(false);
    const [showAddPlayerModal, SetShowAddPlayerModal] = useState(false);
    const [showGamesByPlayerModal, setShowGamesByPlayerModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);

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
            await DeletePlayer(playerId);
            const Toast = Swal.mixin({
                toast: true, position: "top-end", showConfirmButton: false,
                timer: 3000, timerProgressBar: true,
                didOpen: (toast) => { toast.onmouseenter = Swal.stopTimer; toast.onmouseleave = Swal.resumeTimer; }
            });
            Toast.fire({ icon: "success", title: "Deleted Player Successfully" });
            SetPlayerData(playerData.filter(player => player.playerId !== playerId));
        } catch (error) {
            const Toast = Swal.mixin({
                toast: true, position: "top-end", showConfirmButton: false,
                timer: 3000, timerProgressBar: true,
                didOpen: (toast) => { toast.onmouseenter = Swal.stopTimer; toast.onmouseleave = Swal.resumeTimer; }
            });
            Toast.fire({ icon: "error", title: "Player Deletion Failed" });
        }
    };

    const handleOnUpdate = async (updatedPlayer: Player) => {
        SetPlayerData(playerData.map(p => p.playerId === updatedPlayer.playerId ? updatedPlayer : p));
    };

    const refreshTable = () => loadData(SetPlayerData);
    const handleAdd = (newPlayer: Player) => SetPlayerData(prev => [...prev, newPlayer]);
    const handleEdit = (row: Player) => { SetSelectedRow(row); SetShowEditPlayerModal(true); };
    const handleGetGamesByPlayer = (row: Player) => { SetSelectedRow(row); setShowGamesByPlayerModal(true); };

    useEffect(() => { loadData(SetPlayerData); }, []);

    const tHeads: string[] = [
        "Player Id", "First Name", "Last Name", "Username", "Age", "Gender",
        "Date Of Birth", "Email", "Phone", "Address", "Faculty",
        "Academic Level", "Account Created Date", "Action"
    ];

    return (
        <>
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
                        {/* ✅ Same pattern as GameConsole — explicit <td> per field, Action rendered last manually */}
                        <Table striped bordered hover className="console-table text-center align-middle">
                            <thead>
                                <tr>
                                    {tHeads.map(head => <th key={head}>{head}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {playerData.map(row => (
                                    <tr key={row.playerId}>
                                        {/* ✅ Explicit td per field — no Object.values(), same as GameConsole */}
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
                                        {/* ✅ Action column — explicit, last, matches header exactly */}
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
                        refreshTable={() => loadData(SetPlayerData)}
                    />
                </div>
            </div>
        </>
    );
}