import { Container, Nav, Navbar } from "react-bootstrap";

function NavBar(){
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#" className="fw-bold fs-4 px-2 ">Scrabble</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Players</Nav.Link>
                        <Nav.Link href="#pricing">LeaderBoard</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}
export default NavBar