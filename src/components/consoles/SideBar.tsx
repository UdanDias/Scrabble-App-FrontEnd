import { Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { useAuth } from '../auth/AuthProvider';

const Sidebar = () => {
    const { isAuthenticated, logout } = useAuth();
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
        navigate("/signin");
    };

    return (
        <div className="sidebar">
            <Nav className="flex-column sidebar-nav">
                {isAuthenticated && (
                    <>
                        <Nav.Link as={NavLink} to="/profile" className="sidebar-item">
                            <span className="sidebar-icon">👤</span>
                            <span className="sidebar-label">PROFILE</span>
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/player" className="sidebar-item">
                            <span className="sidebar-icon">🎮</span>
                            <span className="sidebar-label">PLAYER</span>
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/tournament" className="sidebar-item">
                            <span className="sidebar-icon">🏆</span>
                            <span className="sidebar-label">TOURNAMENT</span>
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/game" className="sidebar-item">
                            <span className="sidebar-icon">🎯</span>
                            <span className="sidebar-label">GAME</span>
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/user" className="sidebar-item">
                            <span className="sidebar-icon">👥</span>
                            <span className="sidebar-label">USER</span>
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/leaderboard" className="sidebar-item">
                            <span className="sidebar-icon">📊</span>
                            <span className="sidebar-label">LEADERBOARD</span>
                        </Nav.Link>

                        <div className="sidebar-footer">
                            <button className="sidebar-logout-btn" onClick={handleLogout}>
                                {/* <span className="sidebar-icon">🚪</span> */}
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