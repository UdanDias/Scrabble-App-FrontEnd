import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";


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
}
const EditPlayer=({show,selectedRow,handleClose}:EditPlayerProps)=>{
    return(
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingInput" label="Player Id" className="mb-3">
                        <Form.Control 
                        readOnly
                        type="text" 
                        name="playerId" 
                        placeholder="Player Id" />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="First Name" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="firstName" 
                        placeholder="First Name" />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Last Name" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="lastName" 
                        placeholder="Last Name" />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Age" className="mb-3">
                        <Form.Control 
                        type="number" 
                        name="age" 
                        placeholder="Age" />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Gender" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="" 
                        placeholder="Gender" />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Date of Birth" className="mb-3">
                        <Form.Control 
                        type="date" 
                        name="dateOfBirth"
                        placeholder="Date of Birth" />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="email"
                        placeholder="Email" />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Phone" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="phone"
                        placeholder="Phone"/>
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Address" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="address"
                        placeholder="Address" />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Faculty" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="faculty"
                        placeholder="Faculty" />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingInput" label="Academic Level" className="mb-3">
                        <Form.Control 
                        type="text" 
                        name="academicLevel"
                        placeholder="Academic Level" />
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="floatingInput" label="Account Created Date" className="mb-3">
                        <Form.Control 
                        type="date" 
                        name="accountCreatedDate"
                        placeholder="Account Created Date" />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Update
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default EditPlayer;