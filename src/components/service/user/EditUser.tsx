import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import UpdateUser from "./UpdateUser";

interface User {
    userId: string;
    playerId: string;
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

interface EditUserProps {
    show: boolean;
    selectedRow: User | null;
    handleClose: () => void;
    handleUpdate: (updatedUser: User) => void;
    refreshTable: () => void;
}

const EditUser = ({ show, selectedRow, handleClose, handleUpdate, refreshTable }: EditUserProps) => {

    const [userDetails, setUserDetails] = useState<User>({
        userId: "",
        playerId: "",
        firstName: "",
        lastName: "",
        age: 0,
        gender: "",
        dob: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        address: "",
        faculty: "",
        academicLevel: "",
        accountCreatedDate:""
    });

    useEffect(() => {
        if (selectedRow) {
            setUserDetails({ ...selectedRow })
        }
    }, [selectedRow])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        try {
            const updatedUser = await UpdateUser(userDetails);
            handleUpdate(updatedUser);
            refreshTable();
            handleClose();
        } catch (error) {
            console.error("Error updating user", error);
            throw error;
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel label="User Id" className="mb-3">
                        <Form.Control
                            readOnly
                            type="text"
                            name="userId"
                            placeholder="User Id"
                            value={userDetails.userId}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Player Id" className="mb-3">
                        <Form.Control
                            readOnly
                            type="text"
                            name="playerId"
                            placeholder="Player Id"
                            value={userDetails.playerId}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="First Name" className="mb-3">
                        <Form.Control
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={userDetails.firstName}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Last Name" className="mb-3">
                        <Form.Control
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={userDetails.lastName}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Age" className="mb-3">
                        <Form.Control
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={userDetails.age}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Gender" className="mb-3">
                        <Form.Select name="gender" value={userDetails.gender} onChange={handleOnChange}>

                            <option value="" disabled>Select a Gender</option>
                            <option value="Male" disabled>Male</option>
                            <option value="Female" disabled>Female</option>

                        </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel label="Date of Birth" className="mb-3">
                        <Form.Control
                            type="date"
                            name="dob"
                            placeholder="Date of Birth"
                            value={userDetails.dob}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Email" className="mb-3">
                        <Form.Control
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={userDetails.email}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Password" className="mb-3">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password (leave blank to keep current)"
                            value={userDetails.password}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Role" className="mb-3">
                        <Form.Control
                            type="text"
                            name="role"
                            placeholder="Role"
                            value={userDetails.role}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Phone" className="mb-3">
                        <Form.Control
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={userDetails.phone}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Address" className="mb-3">
                        <Form.Control
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={userDetails.address}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Faculty" className="mb-3">
                        <Form.Control
                            type="text"
                            name="faculty"
                            placeholder="Faculty"
                            value={userDetails.faculty}
                            onChange={handleOnChange} />
                    </FloatingLabel>

                    <FloatingLabel label="Academic Level" className="mb-3">
                        <Form.Control
                            type="text"
                            name="academicLevel"
                            placeholder="Academic Level"
                            value={userDetails.academicLevel}
                            onChange={handleOnChange} />
                    </FloatingLabel>
                    <FloatingLabel label="Account Created Date" className="mb-3">
                        <Form.Control
                            type="text"
                            name="accountCreatedDate"
                            placeholder="Account Created Date"
                            value={userDetails.accountCreatedDate}
                            onChange={handleOnChange} />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditUser;