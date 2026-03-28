import { useState } from "react";
import { Form } from "react-bootstrap";
import { SignUpTask } from "../service/auth/Auth";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AnimatedBackground } from "../utils/AnimatedBackground";

interface SignUp {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    university: string;
    studentNo: string;
    gender: string;
    dob: string;
    phone: string;
    address: string;
    faculty: string;
    academicLevel: string;
}

export const SignUp = () => {
    const [user, SetUser] = useState<SignUp>({
        firstName: "", lastName: "", email: "", password: "",
        university: "", studentNo: "",
        gender: "", dob: "", phone: "", address: "", faculty: "", academicLevel: ""
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        SetUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleOnSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = await SignUpTask(user);
            SetUser({
                firstName: "", lastName: "", email: "", password: "",
                university: "", studentNo: "",
                gender: "", dob: "", phone: "", address: "", faculty: "", academicLevel: ""
            });
            login(token);

            const Toast = Swal.mixin({
                toast: true, position: "top-end",
                showConfirmButton: false, timer: 3000, timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({ icon: "success", title: "Registered successfully" });
            navigate("/homeafter");
        } catch (error) {
            const Toast = Swal.mixin({
                toast: true, position: "top-end",
                showConfirmButton: false, timer: 3000, timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({ icon: "error", title: "Registration failed" });
        }
    };

    const navigate = useNavigate();
    const { login } = useAuth();

    return (
        <div>
            <div className="auth-container d-flex flex-column justify-content-center align-items-center"
                style={{ position: 'relative', zIndex: 2 }}>
                <div className="auth-border-signup">
                    <div className="d-flex flex-column align-items-center mb-3">
                        <h1 className="h-hero-title-auth">SCRABBLIX</h1>
                    </div>
                    <Form onSubmit={handleOnSubmit}>
                        <div className="signup-form-container">
                            <div className="signup-grid">
                                <Form.Group className="mb-3" controlId="firstname">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter First Name"
                                        name="firstName"
                                        value={user.firstName}
                                        onChange={handleOnChange}
                                        required
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
                                        required
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
                                        required
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
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="gender">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select
                                        name="gender"
                                        value={user.gender}
                                        onChange={handleOnChange}
                                        required
                                    >
                                        <option value="" disabled>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="dob">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Enter DOB"
                                        name="dob"
                                        value={user.dob}
                                        onChange={handleOnChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="phone">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Phone"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleOnChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="address">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Address"
                                        name="address"
                                        value={user.address}
                                        onChange={handleOnChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="university">
                                    <Form.Label>University</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter University"
                                        name="university"
                                        value={user.university}
                                        onChange={handleOnChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="faculty">
                                    <Form.Label>Faculty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Faculty"
                                        name="faculty"
                                        value={user.faculty}
                                        onChange={handleOnChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="studentNo">
                                    <Form.Label>Student No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Student No"
                                        name="studentNo"
                                        value={user.studentNo}
                                        onChange={handleOnChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="academicLevel">
                                    <Form.Label>Academic Level</Form.Label>
                                    <Form.Select
                                        name="academicLevel"
                                        value={user.academicLevel}
                                        onChange={handleOnChange}
                                        required
                                    >
                                        <option value="" disabled>Select Academic Level</option>
                                        <option value="Level 1">Level 1</option>
                                        <option value="Level 2">Level 2</option>
                                        <option value="Level 3">Level 3</option>
                                        <option value="Level 4">Level 4</option>
                                        <option value="Level 5">Level 5</option>
                                        <option value="Post Graduate">Post Graduate</option>
                                        <option value="Other">Other</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                            <button className="h-btn-outline" type="submit">REGISTER</button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};