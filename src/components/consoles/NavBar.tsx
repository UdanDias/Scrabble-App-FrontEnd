import { Button, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router"; 
import { useAuth } from "../auth/AuthProvider";
import Swal from "sweetalert2";

function NavBar(){
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

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
            navigate("/signin");
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
            {/* Brand always on the left */}
            <Navbar.Brand href="#" className="fw-bold fs-4 px-2">SCRABBLE</Navbar.Brand>

            {!isAuthenticated ? (
                // No token: links sit right next to the brand on the left
                <Nav>
                    <Nav.Link as={NavLink} to="/signin">Login</Nav.Link>
                    <Nav.Link as={NavLink} to="/signup">Register</Nav.Link>
                </Nav>
            ) : (
                // Has token: links pushed to the far right with ms-auto
                <Nav className="ms-auto">
                    <Nav.Link as={NavLink} className="me-3" to="/home">HOME</Nav.Link>
                    <Nav.Link as={NavLink} className="me-3" to="/signup">REGISTER</Nav.Link>
                    <Button variant="warning" className="me-3" onClick={handleOnClick}>LOG OUT</Button>
                </Nav>
            )}
        </Navbar>
    );
}

export default NavBar;