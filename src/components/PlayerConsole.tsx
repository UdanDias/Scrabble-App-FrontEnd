import { useState } from 'react';
import Table from 'react-bootstrap/Table';

interface Player{
    playerId:string;
    firstName:string;
    lastName:string;
    age:number;
    gender:string;
    dob:string;
    email:string;
    phone:string;
    address:string;
    faculty:string;
    academicLevel:string;
    accountCreatedDate:string;

}

export  function PlayerConsole(){

    const [playerData , SetPlayerData]=useState<Player[]>([])

    const tHeads :string []=[
        "Player Id",
        "First Name",
        "Last Name",
        "Age",
        "Gender",
        "Date Of Birth",
        "Email",
        "Phone",
        "Address",
        "Faculty",
        "Academic Level",
        "Account Created Date"
    ]
    return(
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {tHeads.map((headings)=>(
                            <th className="text-center">{headings}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                        {playerData.map((row)=>(
                            <tr key={row.playerId}>
                                {Object.values(row).map((cell,index)=>(
                                    <td key={index}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </Table>
        </>
    );
}