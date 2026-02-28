import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { getPlayer } from '../service/player/GetPlayer';
import { Button } from 'react-bootstrap';
import EditPlayer from '../service/player/EditPlayer';
import DeletePlayer from '../service/player/DeletePlayer';
import AddPlayer from '../service/player/AddPlayer';
import { GamesByPlayer } from '../service/player/GamesByPlayer';
import Swal from 'sweetalert2';


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
        try {
            const confirm = await Swal.fire({
            title: "Are You Sure?",
            text: `This Will Delete The Player.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, Delete It!"
        })
        if (!confirm.isConfirmed) return;
            await DeletePlayer(playerId);
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
            Toast.fire({ icon: "success", title: "Deleted Player Successfully" });
            SetPlayerData(playerData.filter(player=>player.playerId!==playerId))
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
            Toast.fire({ icon: "error", title: "Player Deletion Failed" });
        }
        
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
        <div className="console-page">
            <div className="create-button d-flex justify-content-end  ">
                <Button className="btn-create" onClick={()=>SetShowAddPlayerModal(true)}>
                    + Create Player
                </Button>
            </div>
            
            <div className="console-table-container">
                <div className="console-table-wrapper">
                <Table striped bordered hover  className="console-table">
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
                                            <Button className="btn-games" onClick={()=>handleGetGamesByPlayer(row)}>Games</Button>

                                            <Button className="btn-edit" onClick={()=>handleEdit(row)}>Edit</Button>

                                            <Button className="btn-delete" onClick={()=>handleDelete(row.playerId)}>Delete</Button>
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