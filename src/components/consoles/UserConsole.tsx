import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import GetUsers from '../service/user/GetUser';
import DeleteUser from '../service/user/DeleteUser';
import EditUser from '../service/user/EditUser';


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
    accountCreatedDate:string;
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
   

    const handleEdit=(row:User)=>{
        console.log("row data",row)
        SetSelectedRow(row)
        SetShowEditUserModal(true)
    }

    const handleOnCloseEdit=()=>{
        SetShowEditUserModal(false)
    }
    
    

    useEffect(()=>{
        loadData(SetUserData)
    },[])

    

    const tHeads :string []=[
        "User Id",
        "Player Id",
        "First Name",
        "Last Name",
        "Email",
        "role",
        "Account Created Date",
        "Action"
    ]
    return(
        <>
        {/* <div className="d-flex justify-content-end p-2">
            <Button  variant="success" onClick={()=>SetShowAddUserModal(true)}>Create User</Button>
        </div> */}
        <div className="console-page">
            <div className="console-table-container">
                <div className="console-table-wrapper">
                    <Table striped bordered hover className="console-table" >
                        <thead>
                            <tr>
                                {tHeads.map((headings)=>(
                                    <th className="text-center" key={headings}>{headings}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {userData.map((row, index) => (
                                <tr key={row.userId || index}>
                                    <td className="text-center">{row.userId}</td>
                                    <td className="text-center">{row.playerId}</td>
                                    <td className="text-center">{row.firstName}</td>
                                    <td className="text-center">{row.lastName}</td>
                                    <td className="text-center">{row.email}</td>
                                    <td className="text-center">{row.role}</td>
                                    <td className="text-center">{row.accountCreatedDate}</td>
                                    <td>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <Button className="btn-edit" variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
                                            <Button className="btn-delete" variant="danger" onClick={() => handleDelete(row.userId)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            
            <EditUser
            show={showEditUserModal}
            selectedRow={selectedRow}
            handleClose={handleOnCloseEdit}
            handleUpdate={handleOnUpdate}
            refreshTable={refreshTable}
            />
           
        </div>  
        </>
        
    );
}