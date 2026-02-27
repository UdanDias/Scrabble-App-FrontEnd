import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { getPlayer } from '../service/player/GetPlayer';
import { Button } from 'react-bootstrap';
import EditPlayer from '../service/player/EditPlayer';
import DeletePlayer from '../service/player/DeletePlayer';
import AddPlayer from '../service/player/AddPlayer';
import { GamesByPlayer } from '../service/player/GamesByPlayer';


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
    const [selectedRow,SetSelectedRow]=useState<Player|null>(null)
    const [showEditPlayerModal,SetShowEditPlayerModal]= useState(false)
    const [showAddPlayerModal,SetShowAddPlayerModal]=useState(false);
    const [showGamesByPlayerModal,setShowGamesByPlayerModal]=useState(false);

    const handleDelete=async(playerId:string)=>{
        await DeletePlayer(playerId);
        SetPlayerData(playerData.filter(player=>player.playerId!==playerId))
    }

    const handleOnUpdate=async(updatedPlayer:Player)=>{
        const updatedPlayers=playerData.map((player)=>{
            return player.playerId===updatedPlayer.playerId?updatedPlayer:player
        })
        SetPlayerData(updatedPlayers)
    }
    const refreshTable=()=>{
        loadData(SetPlayerData)
    }
    const handleAdd=(newPlayer:Player)=>{
        SetPlayerData((prev)=>([...prev,newPlayer]))

    }

    const handleEdit=(row:Player)=>{
        console.log("row data",row)
        SetSelectedRow(row)
        SetShowEditPlayerModal(true)
    }

    const handleGetGamesByPlayer=(row:Player)=>{
        SetSelectedRow(row)
        setShowGamesByPlayerModal(true)
    }

    const handleOnCloseEdit=()=>{
        SetShowEditPlayerModal(false)
    }
    const handleCloseAdd=()=>{
        SetShowAddPlayerModal(false)
    }
    const handleCloseGames=()=>{
        setShowGamesByPlayerModal(false)
    }

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
        <div className="player-page">
            <div className="create-button d-flex justify-content-end  ">
                <Button 
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #00ff95d0',
                        color: '#00ff95d0',
                        letterSpacing: '1px'
                    }} 
                    onClick={()=>SetShowAddPlayerModal(true)}>
                    + Create Player
                </Button>
            </div>
            
        <div className="player-table-container">
            <div className="player-table-wrapper">
            <Table striped bordered hover  className="player-table">
                <thead>
                    <tr>
                        {tHeads.map((headings)=>(
                            <th className="text-center" key={headings}>{headings}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                        {playerData.map((row,index)=>(
                            <tr key={row.playerId||index}>
                                {Object.values(row).map((cell,index)=>(
                                    <td  className="text-center"key={index}>{cell !== null && cell !== undefined ? String(cell) : ''}</td>
                                ))}
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Button 
                                            style={{
                                            backgroundColor: 'transparent',
                                            border: '1px solid #59a9b4',
                                            color: '#6ac8d4',
                                            letterSpacing: '1px',
                                            fontSize: '0.8rem'
                                            }} 
                                            onClick={()=>handleGetGamesByPlayer(row)}>Games</Button>

                                        <Button 
                                            style={{
                                            backgroundColor: 'transparent',
                                            border: '1px solid #767976',
                                            color: '#c8d0c8',
                                            letterSpacing: '1px',
                                            fontSize: '0.8rem'
                                            }} 
                                            onClick={()=>handleEdit(row)}>Edit</Button>

                                        <Button 
                                            style={{
                                            backgroundColor: 'transparent',
                                            border: '1px solid #c93131',
                                            color: '#e05959',
                                            letterSpacing: '1px',
                                            fontSize: '0.8rem'
                                            }} 
                                            onClick={()=>handleDelete(row.playerId)}>Delete</Button>
                                        </div>
                                </td>
                                
                                
                            </tr>
                        ))}
                </tbody>
            </Table>
            </div>
            <EditPlayer
            show={showEditPlayerModal}
            selectedRow={selectedRow}
            handleClose={handleOnCloseEdit}
            handleUpdate={handleOnUpdate}
            refreshTable={refreshTable}
            />
            <AddPlayer
            show={showAddPlayerModal}
            handleClose={handleCloseAdd}
            handleAdd={handleAdd}
            refreshTable={refreshTable}
            />
            <GamesByPlayer
            show={showGamesByPlayerModal}
            handleClose={handleCloseGames}
            selectedRow={selectedRow}
            />
            </div>
            </div>
        </>
        
    );
}