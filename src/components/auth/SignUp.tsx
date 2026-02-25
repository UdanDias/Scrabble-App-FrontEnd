import { useState } from "react";
import { Form, Button } from "react-bootstrap";

interface SignUp{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    role:string;
}
export const SignUp=()=>{
    const [user,SetUser]= useState<SignUp>({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        role:""
    })
    const handleOnChange=(e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement|HTMLTextAreaElement>)=>{
        SetUser((prev)=>({...prev,[e.target.name]:e.target.value}))

    }
    const handleOnSubmit=(e:React.ChangeEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log(user);
        SetUser({
            firstName:"",
            lastName:"",
            email:"",
            password:"",
            role:""
        })
    }
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