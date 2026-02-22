import { Table } from "react-bootstrap";

const theads:string[]=[
    "Game Id",
    "Player1 Id",
    "Player2 Id",
    "Score 1",
    "Score 2",
    "Margin",
    "Is Game Tied",
    "Winner Id",
    "Game Date",
    "Is Bye Game"
]
    



export function GameConsole(){
    return (
        <>
             <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <td>3</td>
                    <td colSpan={2}>Larry the Bird</td>
                    <td>@twitter</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
}