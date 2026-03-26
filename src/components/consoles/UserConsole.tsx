import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import GetUsers from '../service/user/GetUser';
import DeleteUser from '../service/user/DeleteUser';
import { ConsoleHeader } from './ConsoleHeader';
import EditUser from '../service/user/EditUser';
import { OverlaySpinner } from '../utils/OverlaySpinner';
import Swal from 'sweetalert2';

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
    
    // Loading States
    const [loading, setLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const loadData = async (isFirstLoad = false) => {
        const startTime = Date.now();
        if (isFirstLoad) setIsInitialLoading(true);
        setLoading(true);

        try {
            const userDetails = await GetUsers();
            SetUserData(userDetails);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Failed to load users',
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            setLoading(false);
            if (isFirstLoad) {
                // Ensure the "S" spinner stays for at least 1s for visual consistency
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

    const handleDelete = async (userId: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await DeleteUser(userId);
                SetUserData(userData.filter(user => user.userId !== userId));
                Swal.fire('Deleted!', 'User has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete user.', 'error');
            }
        }
    };

    const handleOnUpdate = async (updatedUser: User) => {
        const updatedUsers = userData.map((user) => {
            return user.userId === updatedUser.userId ? updatedUser : user;
        });
        SetUserData(updatedUsers);
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
            {/* The Golden S Spinner (Conditionally Rendered) */}
            {isInitialLoading && <OverlaySpinner message="Loading User Accounts..." />}

            <div className="console-page">
                <ConsoleHeader
                    title="User Console"
                    subtitle="Manage user accounts and roles"
                />
                
                <div className="console-table-container">
                    <div className="console-table-wrapper">
                        {/* Background refresh indicator */}
                        {loading && !isInitialLoading && (
                            <div style={{ textAlign: 'center', color: '#e0d318', paddingBottom: '10px' }}>
                                Refreshing data...
                            </div>
                        )}
                        
                        <Table striped bordered hover className="console-table">
                            <thead>
                                <tr>
                                    {tHeads.map((headings) => (
                                        <th className="text-center" key={headings}>{headings}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {userData.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={tHeads.length} className="text-center" style={{ color: '#bfd0e150', padding: '20px' }}>
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    userData.map((row, index) => (
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