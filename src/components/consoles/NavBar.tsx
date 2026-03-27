import { Button, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate, useLocation } from "react-router"; 
import { useAuth } from "../auth/AuthProvider";
import Swal from "sweetalert2";

interface NavBarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

function NavBar({ sidebarOpen, setSidebarOpen }: NavBarProps){
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();

    const isAuthPage = ['/', '/signin', '/signup', '/home'].includes(location.pathname);

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
            Toast.fire({ icon: "error", title: " Failed to Log Out" });
        }
        
        
    };

    return (
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

            {/* Nav links — always horizontal, pushed right */}
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
                    <Button variant="warning" className="ms-2" onClick={handleOnClick}>
                        LOG OUT
                    </Button>
                </Nav>
            )}
        </div>
    </Navbar>
);
}

export default NavBar;