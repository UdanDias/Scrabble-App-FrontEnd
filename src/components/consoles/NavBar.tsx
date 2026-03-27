import { Button, Modal, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router"; 
import { useAuth } from "../auth/AuthProvider";
import Swal from "sweetalert2";
import { getPendingAdminRequests, resolveAdminRequest } from "../service/adminRequest/AdminRequestService";
import { useState, useEffect } from "react";

interface NavBarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

function NavBar({ sidebarOpen, setSidebarOpen }: NavBarProps){
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, role } = useAuth();

    const isAuthPage = ['/', '/signin', '/signup', '/home'].includes(location.pathname);
    const isAdmin = role === "ROLE_ADMIN";
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [showRequestsModal, setShowRequestsModal] = useState(false);

    const fetchPending = async () => {
        if (!isAdmin) return;
        try {
            const data = await getPendingAdminRequests();
            setPendingRequests(data);
        } catch { /* silently fail */ }
    };

    useEffect(() => {
        fetchPending();
        const interval = setInterval(fetchPending, 60000);
        return () => clearInterval(interval);
    }, [isAdmin]);

    const handleResolve = async (requestId: string, status: "APPROVED" | "REJECTED") => {
        await resolveAdminRequest(requestId, status);
        setPendingRequests(prev => prev.filter(r => r.requestId !== requestId));
        Swal.fire({
            icon: status === "APPROVED" ? "success" : "warning",
            title: status === "APPROVED" ? "Access Granted" : "Request Rejected",
            toast: true, position: "top-end", showConfirmButton: false, timer: 3000
        });
    };

    const handleOnClick = () => {
        try {
            logout();
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
            Toast.fire({ icon: "warning", title: "You Logged Out" });
            navigate("/home");
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
            Toast.fire({ icon: "error", title: "Failed to Log Out" });
        }
    };

    return (
        <>
            <Navbar className="custom-navbar" data-bs-theme="dark" expand={false}>
                <div className="d-flex align-items-center w-100 px-2">

                    {/* Hamburger for sidebar — mobile only, auth pages hidden */}
                    {!isAuthPage && (
                        <Button
                            variant="outline-light"
                            className="d-lg-none me-2 flex-shrink-0"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle sidebar"
                            style={{ padding: '4px 8px' }}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </Button>
                    )}

                    {/* Brand */}
                    <Navbar.Brand href="#" className="fw-bold flex-shrink-0">
                        SCRABBLIX
                    </Navbar.Brand>

                    {/* Nav links */}
                    {!isAuthenticated ? (
                        <Nav className="ms-auto d-flex flex-row align-items-center flex-nowrap gap-2">
                            <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/signin">Login</Nav.Link>
                            <Nav.Link as={NavLink} to="/signup">Register</Nav.Link>
                        </Nav>
                    ) : (
                        <Nav className="ms-auto d-flex flex-row align-items-center flex-nowrap gap-2">
                            <Nav.Link as={NavLink} to="/homeafter">HOME</Nav.Link>
                            <Nav.Link as={NavLink} to="/signup">REGISTER</Nav.Link>

                            {/* ── Bell icon (admin only) ── */}
                            {isAdmin && (
                                <button
                                    className="nav-bell-btn"
                                    onClick={() => { fetchPending(); setShowRequestsModal(true); }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                    </svg>
                                    {pendingRequests.length > 0 && (
                                        <span className="nav-bell-badge">{pendingRequests.length}</span>
                                    )}
                                </button>
                            )}

                            <Button variant="warning" className="ms-2" onClick={handleOnClick}>
                                LOG OUT
                            </Button>
                        </Nav>
                    )}
                </div>
            </Navbar>

            {/* ── Admin Requests Modal ── */}
            <Modal show={showRequestsModal} onHide={() => setShowRequestsModal(false)} className="dark-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Pending Admin Requests</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {pendingRequests.length === 0 ? (
                        <p className="text-center" style={{ color: "#bfd0e1" }}>No pending requests.</p>
                    ) : (
                        <table className="profile-games-table w-100">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map(req => (
                                    <tr key={req.requestId}>
                                        <td>{req.firstName} {req.lastName}</td>
                                        <td>{req.email}</td>
                                        <td>{req.requestedDate}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button size="sm" className="btn-create"
                                                    onClick={() => handleResolve(req.requestId, "APPROVED")}>
                                                    ✓
                                                </Button>
                                                <Button size="sm" className="btn-delete"
                                                    onClick={() => handleResolve(req.requestId, "REJECTED")}>
                                                    ✕
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-edit" onClick={() => setShowRequestsModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NavBar;