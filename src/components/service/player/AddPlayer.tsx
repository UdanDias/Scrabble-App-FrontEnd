import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import CreatePlayer from "./CreatePlayer";
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

interface AddPlayerProps{
    show:boolean;
    handleClose:()=>void;
    handleAdd:(newPlayer:Player)=>void;
    refreshTable:()=>void;
}
const AddPlayer=({show,handleClose,handleAdd,refreshTable}:AddPlayerProps)=>{
    const [newPlayerDetails,SetNewPlayerDetails]=useState<Omit<Player,"playerId"|'age'|'accountCreatedDate'>>({
        
        firstName:"",
        lastName:"",
        gender:"",
        dob:"",
        email:"",
        phone:"",
        address:"",
        faculty:"",
        academicLevel:""
        })
    useEffect(()=>{
        if(show){
            SetNewPlayerDetails({
                firstName:"",
                lastName:"",
                gender:"",
                dob:"",
                email:"",
                phone:"",
                address:"",
                faculty:"",
                academicLevel:""
            })
        }
    },[show])
    const handleOnChange=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement| HTMLTextAreaElement>)=>{
        SetNewPlayerDetails((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleOnSubmit=async()=>{
        try {
            const newlyAddedPlayer=await CreatePlayer(newPlayerDetails);
            handleAdd(newlyAddedPlayer);
            
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
                Toast.fire({ icon: "success", title: "Player Created successfully" });

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
            Toast.fire({ icon: "error", title: "Player Creation Failed" });
        }
    }
    
    return(
        <>
            <Modal show={show} onHide={handleClose} className="dark-modal">
                <Modal.Header closeButton>
                    <Modal.Title >Add Player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
            <FloatingLabel controlId="floatingInput" label="First Name" className="mb-3">
                                    <Form.Control 
                                    type="text" 
                                    name="firstName" 
                                    placeholder="First Name"
                                    value={newPlayerDetails.firstName}
                                    onChange={handleOnChange} />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingInput" label="Last Name" className="mb-3">
                                    <Form.Control 
                                    type="text" 
                                    name="lastName" 
                                    placeholder="Last Name"
                                    value={newPlayerDetails.lastName}
                                    onChange={handleOnChange} />
                                </FloatingLabel>
                                
                                {/* <FloatingLabel controlId="floatingInput" label="Age" className="mb-3">
                                    <Form.Control 
                                    type="number" 
                                    name="age" 
                                    placeholder="Age"
                                    value={newPlayerDetails.age}
                                    onChange={handleOnChange} />
                                </FloatingLabel> */}

                                <FloatingLabel controlId="floatingInput" label="Gender" className="mb-3">
                                    <Form.Select name="gender" value={newPlayerDetails.gender} onChange={handleOnChange}>
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
                                    value={newPlayerDetails.dob}
                                    onChange={handleOnChange}/>
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
                                    <Form.Control 
                                    type="text" 
                                    name="email"
                                    placeholder="Email"
                                    value={newPlayerDetails.email}
                                    onChange={handleOnChange} />
                                </FloatingLabel>
                                
                                <FloatingLabel controlId="floatingInput" label="Phone" className="mb-3">
                                    <Form.Control 
                                    type="text" 
                                    name="phone"
                                    placeholder="Phone"
                                    value={newPlayerDetails.phone}
                                    onChange={handleOnChange}/>
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingInput" label="Address" className="mb-3">
                                    <Form.Control 
                                    type="text" 
                                    name="address"
                                    placeholder="Address"
                                    value={newPlayerDetails.address}
                                    onChange={handleOnChange} />
                                </FloatingLabel>
                                
                                <FloatingLabel controlId="floatingInput" label="Faculty" className="mb-3">
                                    <Form.Control 
                                    type="text" 
                                    name="faculty"
                                    placeholder="Faculty"
                                    value={newPlayerDetails.faculty}
                                    onChange={handleOnChange} />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingInput" label="Academic Level" className="mb-3">
                                    <Form.Control 
                                    type="text" 
                                    name="academicLevel"
                                    placeholder="Academic Level" 
                                    value={newPlayerDetails.academicLevel}
                                    onChange={handleOnChange}/>
                                </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-edit" onClick={handleClose}>Close</Button>
                    <Button className="btn-create" onClick={handleOnSubmit}>Save Player</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default AddPlayer;



