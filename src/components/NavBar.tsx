import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router"; 

function NavBar(){
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#" className="fw-bold fs-4 px-2 ">Scrabble</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as = {NavLink} to = "/player">Player</Nav.Link>
                        <Nav.Link as = {NavLink} to = "/game">Game</Nav.Link>
                        <Nav.Link as = {NavLink} to = "/leaderboard">LeaderBoard</Nav.Link>
                        <Nav.Link as = {NavLink} to = "/signin">Login</Nav.Link>
                        <Nav.Link as = {NavLink} to = "/signup">Register</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}
export default NavBar