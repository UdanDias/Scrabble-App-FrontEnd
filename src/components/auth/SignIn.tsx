import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {SignInTask} from "../service/auth/Auth"
import { AuthProvider, useAuth } from "./AuthProvider";
interface SignIn{
    email:string;
    password:string;

}
export const SignIn=()=>{
    const [user,SetUser]=useState<SignIn>({
        email:"",
        password:""
    })
     const handleOnChange=(e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement|HTMLTextAreaElement>)=>{
            SetUser((prev)=>({...prev,[e.target.name]:e.target.value}))
    
        }
        const handleOnSubmit= async (e:React.ChangeEvent<HTMLFormElement>)=>{
            e.preventDefault();
            const token=await SignInTask(user)
            console.log(token);
            SetUser({
                
                email:"",
                password:""
            })
            login(token)
        }
        const {login}=useAuth();
    return (
        <>
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="d-flex flex-column align-items-center ">
                <h1> Login</h1>
            </div>
                <Form className="d-flex flex-column align-items-center mt-3 w-100" onSubmit={handleOnSubmit}>
                    <div className="w-25">
                        
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
                            placeholder="Enter email" 
                            name="password"
                            value={user.password}
                            onChange={handleOnChange}
                            />
                            
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="success" type="submit">
                                Login
                            </Button>
                        </div>
                        
                    </div>
                </Form>
            </div>
        

        </>
    );
}