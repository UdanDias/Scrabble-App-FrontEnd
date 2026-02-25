import { Form, Button } from "react-bootstrap";

export const SignUp=()=>{
    return (
        <>
        <div className="d-flex flex-column align-items-center mt-5">
            <h1> Sign Up</h1>
        </div>
            <Form className="d-flex flex-column align-items-center mt-3">
                <div className="w-25">
                    <Form.Group className="mb-3" controlId="firstname">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder="Enter First Name" 
                        name="firstname"
                        />
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="lastname">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder="Enter Last Name" 
                        name="lastname"
                        />
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                        type="email" 
                        placeholder="Enter Email" 
                        name="email"
                        />
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        name="password"
                        />
                        
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="role">
                        <Form.Label>Role</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder="Role" 
                        name="role"
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button variant="success" type="submit">
                            Register
                        </Button>
                    </div>
                    
                </div>
            </Form>

        </>
    );
}