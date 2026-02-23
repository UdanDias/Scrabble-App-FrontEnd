import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import CreatePlayer from "./CreatePlayer";


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
    const [newPlayerDetails,SetNewPlayerDetails]=useState<Omit<Player,"playerId"|'age'>>({
        
        firstName:"",
        lastName:"",
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
                academicLevel:"",
                accountCreatedDate:""
            })
        }
    },[show])
    const handleOnChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        SetNewPlayerDetails((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleOnSubmit=async()=>{
        try {
            const newlyAddedPlayer=await CreatePlayer(newPlayerDetails);
            handleAdd(newlyAddedPlayer);
            refreshTable()
            handleClose()

        } catch (error) {
            console.error("Error while adding player",error)
            throw error;
        }
    }
    
    return(
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Player</Modal.Title>
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
                        <Form.Control 
                        type="text" 
                        name="gender" 
                        placeholder="Gender" 
                        value={newPlayerDetails.gender}
                        onChange={handleOnChange}/>
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
                    
                    <FloatingLabel controlId="floatingInput" label="Account Created Date" className="mb-3">
                        <Form.Control 
                        type="date" 
                        name="accountCreatedDate"
                        placeholder="Account Created Date"
                        value={newPlayerDetails.accountCreatedDate}
                        onChange={handleOnChange} />
                    </FloatingLabel>
                 </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleOnSubmit}>
                    Add
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default AddPlayer;