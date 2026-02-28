import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import UpdatePlayer from "./UpdatePlayer";
import Swal from "sweetalert2";


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

interface EditPlayerProps{
    show:boolean;
    selectedRow:Player|null;
    handleClose:()=>void;
    handleUpdate:(updatedPlayer:Player)=>void;
    refreshTable:()=>void;
}
const EditPlayer=({show,selectedRow,handleClose,handleUpdate,refreshTable}:EditPlayerProps)=>{

const [playerDetails,SetPlayerDetails]=useState<Player>({
     playerId:"",
    firstName:"",
    lastName:"",
    age:0,
    gender:"",
    dob:"",
    email:"",
    phone:"",
    address:"",
    faculty:"",
    academicLevel:"",
    accountCreatedDate:""

})

useEffect(()=>{
    if(selectedRow){
        SetPlayerDetails({...selectedRow})  
    }
    
},[selectedRow])

const handleOnChange=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
    SetPlayerDetails({...playerDetails,[e.target.name]:e.target.value})
}

const handlesave=async()=>{
    try {
        const updatedPlayer=await UpdatePlayer(playerDetails);
        handleUpdate(updatedPlayer)
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
            Toast.fire({ icon: "success", title: "Player Updated Successfully" });
        refreshTable()
        handleClose()
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
            Toast.fire({ icon: "error", title: "Updating Player failed" });


    }
}

    return(
        <>
            <Modal show={show} onHide={handleClose} className="dark-modal">
                <Modal.Header closeButton>
                <Modal.Title>Edit Player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingInput" label="Player Id" className="mb-3">
                        <Form.Control 
                        readOnly
                        type="text" 
                        name="playerId" 
                        placeholder="Player Id"
                        value={playerDetails.playerId}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="First Name" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="firstName" 
                        placeholder="First Name"
                        value={playerDetails.firstName}
                        onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Last Name" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="lastName" 
                        placeholder="Last Name"
                        value={playerDetails.lastName}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Age" className="mb-3">
                        <Form.Control 
                        type="number" 
                        name="age" 
                        placeholder="Age"
                        value={playerDetails.age}
                        onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Gender" className="mb-3">
                        <Form.Select name="gender" value={playerDetails.gender} onChange={handleOnChange}>
                            <option value="" disabled>Select Gender</option> 
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Form.Select>
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Date of Birth" className="mb-3">
                        <Form.Control 
                        type="date" 
                        name="dob"
                        placeholder="Date of Birth" 
                        value={playerDetails.dob}
                        onChange={handleOnChange}/>
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="email"
                        placeholder="Email"
                        value={playerDetails.email}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Phone" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="phone"
                        placeholder="Phone"
                        value={playerDetails.phone}
                        onChange={handleOnChange}/>
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Address" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="address"
                        placeholder="Address"
                        value={playerDetails.address}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Faculty" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="faculty"
                        placeholder="Faculty"
                        value={playerDetails.faculty}
                        onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Academic Level" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="academicLevel"
                        placeholder="Academic Level" 
                        value={playerDetails.academicLevel}
                        onChange={handleOnChange}/>
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Account Created Date" className="mb-3">
                        <Form.Control 
                        type="date" 
                        name="accountCreatedDate"
                        placeholder="Account Created Date"
                        value={playerDetails.accountCreatedDate}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                <Button className="btn-edit" onClick={handleClose}>
                    Close
                </Button>
                <Button className="btn-create" onClick={handlesave}>
                    Update
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default EditPlayer;