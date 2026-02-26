import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { getPlayer } from './service/player/GetPlayer';
import { Button } from 'react-bootstrap';
import EditPlayer from './service/player/EditPlayer';
import DeletePlayer from './service/player/DeletePlayer';
import AddPlayer from './service/player/AddPlayer';
import { GamesByPlayer } from './service/player/GamesByPlayer';
import GetUsers from './service/user/GetUser';


interface User {
    userId:string;
    playerId:string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    age: number;
    gender: string;
    dob: string;
    phone: string;
    address: string;
    faculty: string;
    academicLevel: string;
}
export const loadData= async (
        SetUserData:React.Dispatch<React.SetStateAction<User[]>>
    )=>{
        const userDetails=await GetUsers()
        console.log(userDetails)
        SetUserData(userDetails)
    };

export  function UserConsole(){

    const [userData , SetUserData]=useState<User[]>([])
    const [selectedRow,SetSelectedRow]=useState<User|null>(null)
    const [showEditUserModal,SetShowEditUserModal]= useState(false)
    const [showAddUserModal,SetShowAddUserModal]=useState(false);

    const handleDelete=async(userId:string)=>{
        await DeleteUser(userId);
        SetUserData(userData.filter(user=>user.userId!==userId))
    }

    const handleOnUpdate=async(updatedUser:User)=>{
        const updatedUsers=userData.map((user)=>{
            return user.userId===updatedUser.userId?updatedUser:user
        })
        SetUserData(updatedUsers)
    }
    const refreshTable=()=>{
        loadData(SetUserData)
    }
    const handleAdd=(newUser:User)=>{
        SetUserData((prev)=>([...prev,newUser]))

    }

    const handleEdit=(row:User)=>{
        console.log("row data",row)
        SetSelectedRow(row)
        SetShowEditUserModal(true)
    }

    const handleOnCloseEdit=()=>{
        SetShowEditUserModal(false)
    }
    const handleCloseAdd=()=>{
        SetShowAddUserModal(false)
    }
    

    useEffect(()=>{
        loadData(SetUserData)
    },[])

    

    const tHeads :string []=[
        "User Id",
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
        {/* <div className="d-flex justify-content-end p-2">
            <Button  variant="success" onClick={()=>SetShowAddUserModal(true)}>Create User</Button>
        </div> */}
            <Table striped bordered hover >
                <thead>
                    <tr>
                        {tHeads.map((headings)=>(
                            <th className="text-center" key={headings}>{headings}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                        {userData.map((row,index)=>(
                            <tr key={row.userId||index}>
                                {Object.values(row).map((cell,index)=>(
                                    <td  className="text-center"key={index}>{cell !== null && cell !== undefined ? String(cell) : ''}</td>
                                ))}
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Button variant="secondary" onClick={()=>handleEdit(row)}>Edit</Button>
                                        <Button variant="danger" onClick={()=>handleDelete(row.playerId)}>Delete</Button>
                                    </div>
                                </td>
                                
                                
                            </tr>
                        ))}
                </tbody>
            </Table>
            <EditUser
            show={showEditUserModal}
            selectedRow={selectedRow}
            handleClose={handleOnCloseEdit}
            handleUpdate={handleOnUpdate}
            refreshTable={refreshTable}
            />
            <AddUser
            show={showAddUserModal}
            handleClose={handleCloseAdd}
            handleAdd={handleAdd}
            refreshTable={refreshTable}
            />
            
        </>
        
    );
}