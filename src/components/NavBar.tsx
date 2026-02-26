import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router"; 
import { useAuth } from "./auth/AuthProvider";

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
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#" className="fw-bold fs-4 px-2 ">Scrabble</Navbar.Brand>
                    <Nav className="me-auto">
                        {isAuthenticated?(
                            <>  
                                <Nav.Link as = {NavLink} to = "/profile">Profile</Nav.Link>
                                <Nav.Link as = {NavLink} to = "/player">Player</Nav.Link>
                                <Nav.Link as = {NavLink} to = "/game">Game</Nav.Link>
                                <Nav.Link as = {NavLink} to = "/leaderboard">LeaderBoard</Nav.Link>
                                <Button variant="warning" onClick={handleOnClick}>Logout</Button>
                            </>
                        ):(
                            <>
                                <Nav.Link as = {NavLink} to = "/signin">Login</Nav.Link>
                                <Nav.Link as = {NavLink} to = "/signup">Register</Nav.Link>
                            </>
                        )}
                        
                        
                        
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}
export default NavBar