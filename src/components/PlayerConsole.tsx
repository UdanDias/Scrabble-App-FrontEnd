import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { getPlayer } from './GetPlayer';


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
export const loadData= async (
        SetPlayerData:React.Dispatch<React.SetStateAction<Player[]>>
    )=>{
        const playerDetails=await getPlayer()
        console.log(playerDetails)
        SetPlayerData(playerDetails)
    };

export  function PlayerConsole(){

    const [playerData , SetPlayerData]=useState<Player[]>([])

    useEffect(()=>{
        loadData(SetPlayerData)
    },[])

    

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
        "Account Created Date",
        "Action"
    ]
    return(
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {tHeads.map((headings)=>(
                            <th className="text-center" key={headings}>{headings}</th>
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