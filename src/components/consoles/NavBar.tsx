import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router"; 
import { useAuth } from "../auth/AuthProvider";

function NavBar(){
    const handleOnClick=()=>{
        logout();
        navigate("/signin")
    }
    const navigate=useNavigate()
    const {isAuthenticated}= useAuth();
    const {logout}=useAuth();
    return (
        <>
            <Navbar className="custom-navbar" data-bs-theme="dark">
                
                    <Navbar.Brand href="#" className="fw-bold fs-4 px-2 ">SCRABBLE</Navbar.Brand>
                    <Nav className="me-auto">
                        {isAuthenticated?( 
                            <>  
                                <Nav.Link as = {NavLink} to = "/profile">PROFILE</Nav.Link>
                                <Nav.Link as = {NavLink} to = "/player">PLAYER</Nav.Link>
                                <Nav.Link as = {NavLink} to = "/tournament">TOURNAMENT</Nav.Link>
                                <Nav.Link as = {NavLink} to = "/game">GAME</Nav.Link>
                                <Nav.Link as = {NavLink} to = "/user">USER</Nav.Link>
                                <Nav.Link as = {NavLink} to = "/leaderboard">LEADERBOARD</Nav.Link>
                                <Button variant="warning" onClick={handleOnClick}>LOG OUT</Button>
                            </>
                        ):(
                            <>
                                <Nav.Link as = {NavLink} to = "/signin">Login</Nav.Link>
                                <Nav.Link as = {NavLink} to = "/signup">Register</Nav.Link>
                            </>
                        )}
                        
                        
                        
                    </Nav>
                
            </Navbar>
        </>
    );
}
export default NavBar