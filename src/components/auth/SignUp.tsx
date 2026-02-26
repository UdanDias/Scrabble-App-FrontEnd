import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {SignUpTask} from "../service/auth/Auth"
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router";

interface SignUp {
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
export const SignUp=()=>{
    const [user, SetUser] = useState<SignUp>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    age: 0,
    gender: "",
    dob: "",
    phone: "",
    address: "",
    faculty: "",
    academicLevel: ""
})
    const handleOnChange=(e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement|HTMLTextAreaElement>)=>{
        SetUser((prev)=>({...prev,[e.target.name]:e.target.value}))

    }
    const handleOnSubmit= async (e:React.ChangeEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const token=await SignUpTask(user)
        console.log(token);
        SetUser({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "",
            age: 0,
            gender: "",
            dob: "",
            phone: "",
            address: "",
            faculty: "",
            academicLevel: ""
        })
        login(token)
        navigate("/player")
    }
    const navigate=useNavigate()
    const {login} = useAuth();
    
    return (
        <>
        <div className="d-flex flex-column align-items-center mt-5">
            <h1> Sign Up</h1>
        </div>
            <Form className="d-flex flex-column align-items-center mt-3" onSubmit={handleOnSubmit}>
                <div className="w-25">
                    <Form.Group className="mb-3" controlId="firstname">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder="Enter First Name" 
                        name="firstName"
                        value={user.firstName}
                        onChange={handleOnChange}
                        />
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="lastname">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder="Enter Last Name" 
                        name="lastName"
                        value={user.lastName}
                        onChange={handleOnChange}
                        />
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                        type="email" 
                        placeholder="Enter Email" 
                        name="email"
                        value={user.email}
                        onChange={handleOnChange}
                        />
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                        type="password" 
                        placeholder="Enter Password" 
                        name="password"
                        value={user.password}
                        onChange={handleOnChange}
                        />
                        
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Select name="role" value={user.role} onChange={handleOnChange}>
                            <option value="" disabled>Select a Role</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="USER">USER</option>

                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="age">
                        <Form.Label>Age</Form.Label>
                        <Form.Control 
                        type="number" 
                        name="age" 
                        value={user.age} 
                        onChange={handleOnChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select name="gender" value={user.gender} onChange={handleOnChange}>
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="dob">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control 
                        type="date" 
                        name="dob" 
                        value={user.dob} 
                        onChange={handleOnChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control 
                        type="text" 
                        name="phone" 
                        value={user.phone} 
                        onChange={handleOnChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control 
                        type="text" 
                        name="address" 
                        value={user.address} 
                        onChange={handleOnChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="faculty">
                        <Form.Label>Faculty</Form.Label>
                        <Form.Control 
                        type="text" 
                        name="faculty" 
                        value={user.faculty} 
                        onChange={handleOnChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="academicLevel">
                        <Form.Label>Academic Level</Form.Label>
                        <Form.Control 
                        type="text" 
                        name="academicLevel" 
                        value={user.academicLevel} 
                        onChange={handleOnChange} />
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button variant="success" type="submit" >
                            Register
                        </Button>
                    </div>
                    
                </div>
            </Form>

        </>
    );
}