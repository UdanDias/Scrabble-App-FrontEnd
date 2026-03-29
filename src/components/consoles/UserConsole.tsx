import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import GetUsers from '../service/user/GetUser';
import DeleteUser from '../service/user/DeleteUser';
import { ConsoleHeader } from './ConsoleHeader';
import EditUser from '../service/user/EditUser';
import { OverlaySpinner } from '../utils/OverlaySpinner';
import Swal from 'sweetalert2';
import { DataCount } from '../utils/DataCount';
import { SearchBar } from '../utils/SearchBar';

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface User {
    userId: string;
    playerId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    age: number;
    gender: string;
    dob: string;
    phone: string;
    address: string;
    faculty: string;
    academicLevel: string;
    accountCreatedDate: string;
}

export function UserConsole() {
    const [userData, SetUserData] = useState<User[]>([]);
    const [selectedRow, SetSelectedRow] = useState<User | null>(null);
    const [showEditUserModal, SetShowEditUserModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // ✅ Swal Toast Mixin (same pattern as GameConsole)
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const loadData = async (isFirstLoad = false) => {
        const startTime = Date.now();
        if (isFirstLoad) setIsInitialLoading(true);
        setLoading(true);

        try {
            const userDetails = await GetUsers();
            SetUserData(userDetails);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            Toast.fire({
                icon: 'error',
                title: 'Failed to load users'
            });
        } finally {
            setLoading(false);

            if (isFirstLoad) {
                const duration = Date.now() - startTime;
                const minWait = 1000;

                if (duration < minWait) {
                    setTimeout(() => setIsInitialLoading(false), minWait - duration);
                } else {
                    setIsInitialLoading(false);
                }
            }
        }
    };

    // ✅ FILTER USERS BASED ON SEARCH QUERY
    const filteredUsers = userData.filter(user => {
        const firstName = user.firstName?.toLowerCase() || '';
        const lastName = user.lastName?.toLowerCase() || '';

        const fullName = `${firstName} ${lastName}`;
        const query = searchQuery.toLowerCase();

        return (
            fullName.includes(query) ||
            firstName.includes(query) ||
            lastName.includes(query)
        );
    });

    // ✅ DELETE WITH TOAST
    const handleDelete = async (userId: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the user.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        try {
            await DeleteUser(userId);
            SetUserData(userData.filter(user => user.userId !== userId));

            Toast.fire({
                icon: 'success',
                title: 'User deleted successfully'
            });

        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: 'Failed to delete user'
            });
        }
    };

    // ✅ UPDATE WITH TOAST
    const handleOnUpdate = async (updatedUser: User) => {
        const updatedUsers = userData.map((user) =>
            user.userId === updatedUser.userId ? updatedUser : user
        );

        SetUserData(updatedUsers);

        Toast.fire({
            icon: 'success',
            title: 'User details updated successfully'
        });
    };

    const refreshTable = () => {
        loadData(false);
    };

    const handleEdit = (row: User) => {
        SetSelectedRow(row);
        SetShowEditUserModal(true);
    };

    const handleOnCloseEdit = () => {
        SetShowEditUserModal(false);
    };

    useEffect(() => {
        loadData(true);
    }, []);

    const tHeads: string[] = [
        "User Id",
        "Player Id",
        "First Name",
        "Last Name",
        "Email",
        "Role",
        "Account Created Date",
        "Action"
    ];

    return (
        <>
            {isInitialLoading && <OverlaySpinner message="Loading User Accounts..." />}

            <div className="console-page">
                <ConsoleHeader
                    title="User Console"
                    subtitle="Manage user accounts and roles"
                />

                <div className="console-table-container">
                    {/* ✅ USER COUNT & SEARCH BAR - USING REUSABLE COMPONENTS */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '20px',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <DataCount 
                            label="Total Registered Users"
                            totalCount={userData.length}
                            filteredCount={filteredUsers.length}
                            showFiltered={!!searchQuery}
                        />

                        <SearchBar 
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                    </div>

                    <div className="console-table-wrapper">

                        {loading && !isInitialLoading && (
                            <div style={{ textAlign: 'center', color: '#e0d318', paddingBottom: '10px' }}>
                                Refreshing data...
                            </div>
                        )}

                        <div className="table-responsive">
                            <Table striped bordered hover className="console-table">
                                <thead>
                                    <tr>
                                        {tHeads.map((head) => (
                                            <th className="text-center" key={head}>{head}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 && !loading ? (
                                        <tr>
                                            <td colSpan={tHeads.length} className="text-center" style={{ color: '#bfd0e150', padding: '20px' }}>
                                                {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((row, index) => (
                                            <tr key={row.userId || index}>
                                                <td className="text-center">{row.userId}</td>
                                                <td className="text-center">{row.playerId}</td>
                                                <td className="text-center">{row.firstName}</td>
                                                <td className="text-center">{row.lastName}</td>
                                                <td className="text-center">{row.email}</td>
                                                <td className="text-center" style={{ textTransform: 'capitalize' }}>{row.role}</td>
                                                <td className="text-center">{row.accountCreatedDate}</td>
                                                <td>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <Button className="btn-edit" onClick={() => handleEdit(row)}>Edit</Button>
                                                        <Button className="btn-delete" onClick={() => handleDelete(row.userId)}>Delete</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>

                <EditUser
                    show={showEditUserModal}
                    selectedRow={selectedRow}
                    handleClose={handleOnCloseEdit}
                    handleUpdate={handleOnUpdate}
                    refreshTable={refreshTable}
                />
            </div>
        </>
    );
}