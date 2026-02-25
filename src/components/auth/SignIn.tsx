import { Form, Button } from "react-bootstrap";

export const SignIn=()=>{
    return (
        <>
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="d-flex flex-column align-items-center ">
                <h1> Login</h1>
            </div>
                <Form className="d-flex flex-column align-items-center mt-3 w-100">
                    <div className="w-25">
                        
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