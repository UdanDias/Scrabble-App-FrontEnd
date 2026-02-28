import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {SignInTask} from "../service/auth/Auth"
import { AuthProvider, useAuth } from "./AuthProvider";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
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
        const handleOnSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();
            try {
                const token = await SignInTask(user);
                SetUser({ email: "", password: "" });
                login(token);

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
                Toast.fire({ icon: "success", title: "Signed in successfully" });

                navigate("/player");
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
                Toast.fire({ icon: "error", title: "Invalid email or password" });
            }
        };
        const {login}=useAuth();
        const navigate=useNavigate()
    return (
        <>
        <div className="auth-container d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="auth-border-login">
                <div className="d-flex flex-column align-items-center">
                    <h1 className="auth-font">Login</h1>
                </div>
                <Form className="d-flex flex-column align-items-center mt-3 w-100" onSubmit={handleOnSubmit}>
                    <div className="w-100">
                        <div className="signup-form-container">
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
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <Button className="btn-create" type="submit">
                                Login
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
        </>
    );
}