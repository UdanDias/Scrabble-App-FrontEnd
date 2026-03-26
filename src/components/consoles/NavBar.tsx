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
        <Navbar className="custom-navbar" data-bs-theme="dark" expand="lg">
            {/* Hamburger menu for mobile when sidebar is present */}
            {!isAuthPage && (
                <Button 
                    variant="outline-light" 
                    className="d-lg-none me-2" 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle sidebar"
                >
                    <span className="navbar-toggler-icon"></span>
                </Button>
            )}
            {/* Brand always on the left */}
            <Navbar.Brand href="#" className="fw-bold fs-4 px-2">SCRABBLIX</Navbar.Brand>

            {!isAuthenticated ? (
                // No token: links sit right next to the brand on the left
                <Nav>
                    {/* <Nav.Link as={NavLink} to="/unauthhome">Home</Nav.Link> */}
                    <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
                    <Nav.Link as={NavLink} to="/signin">Login</Nav.Link>
                    <Nav.Link as={NavLink} to="/signup">Register</Nav.Link>
                    
                </Nav>
            ) : (
                // Has token: links pushed to the far right with ms-auto
                <Nav className="ms-auto">
                    <Nav.Link as={NavLink} className="me-3" to="/homeafter">HOME</Nav.Link>
                    <Nav.Link as={NavLink} className="me-3" to="/signup">REGISTER</Nav.Link>
                    <Button variant="warning" className="me-3" onClick={handleOnClick}>LOG OUT</Button>
                </Nav>
            )}
        </Navbar>
    );
}

export default NavBar;