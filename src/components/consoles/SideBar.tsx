import { Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { useAuth } from '../auth/AuthProvider';

const Sidebar = () => {
    const { isAuthenticated, logout, role } = useAuth();
    const isAdmin = role === "ROLE_ADMIN";
    const navigate = useNavigate();

    const handleLogout = async () => {
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
        Toast.fire({ icon: "warning", title: "You logged out" });
        navigate("/home");
    };

    return (
        <div className="sidebar">
            <Nav className="flex-column sidebar-nav">
                {isAuthenticated && (
                    <>
                        <Nav.Link as={NavLink} to="/profile" className="sidebar-item">
                            <span className="sidebar-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="8" r="4"/>
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                                </svg>
                            </span>
                            <span className="sidebar-label">PROFILE</span>
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/player" className="sidebar-item">
                            <span className="sidebar-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="6" width="20" height="12" rx="3"/>
                                    <path d="M8 12h2m-1-1v2M14 11h.01M16 13h.01"/>
                                </svg>
                            </span>
                            <span className="sidebar-label">PLAYER</span>
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/tournament" className="sidebar-item">
                            <span className="sidebar-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M6 3h12l2 6c0 3.3-2.7 6-6 6H10C6.7 15 4 12.3 4 9L6 3z"/>
                                    <path d="M12 15v4M8 20h8"/>
                                </svg>
                            </span>
                            <span className="sidebar-label">TOURNAMENT</span>
                        </Nav.Link>

                        {isAdmin && (
                            <Nav.Link as={NavLink} to="/game" className="sidebar-item">
                                <span className="sidebar-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 8v4l3 3"/>
                                    </svg>
                                </span>
                                <span className="sidebar-label">GAME</span>
                            </Nav.Link>
                        )}

                        {isAdmin && (
                            <Nav.Link as={NavLink} to="/user" className="sidebar-item">
                                <span className="sidebar-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="9" cy="8" r="3"/>
                                        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
                                        <path d="M16 5c1.7 0 3 1.3 3 3s-1.3 3-3 3"/>
                                        <path d="M21 20c0-3-1.8-5.5-5-6"/>
                                    </svg>
                                </span>
                                <span className="sidebar-label">USER</span>
                            </Nav.Link>
                        )}

                        <Nav.Link as={NavLink} to="/leaderboard" className="sidebar-item">
                            <span className="sidebar-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="12" width="4" height="9"/>
                                    <rect x="10" y="7" width="4" height="14"/>
                                    <rect x="17" y="3" width="4" height="18"/>
                                </svg>
                            </span>
                            <span className="sidebar-label">LEADERBOARD</span>
                        </Nav.Link>

                        <div className="sidebar-footer">
                            <button className="sidebar-logout-btn" onClick={handleLogout}>
                                <span>LOG OUT</span>
                            </button>
                        </div>
                    </>
                )}
            </Nav>
        </div>
    );
};

export default Sidebar;