import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";

interface BulkAddPlayerProps {
    show: boolean;
    handleClose: () => void;
    refreshTable: () => void;
}

const EXAMPLE = JSON.stringify([
    {
        firstName: "John",
        lastName: "Doe",
        gender: "Male",
        dob: "2000-05-14",
        email: "john@example.com",
        phone: "0771234567",
        address: "Colombo",
        faculty: "Science",
        academicLevel: "Undergraduate"
    },
    {
        firstName: "Jane",
        lastName: "Smith",
        gender: "Female",
        dob: "1999-11-22",
        email: "jane@example.com",
        phone: "0777654321",
        address: "Kandy",
        faculty: "Arts",
        academicLevel: "Postgraduate"
    }
], null, 2);

const BulkAddPlayer = ({ show, handleClose, refreshTable }: BulkAddPlayerProps) => {
    const [jsonInput, setJsonInput] = useState("");
    const [error, setError] = useState("");

    const handleClose_ = () => {
        setJsonInput("");
        setError("");
        handleClose();
    };

    const handleSubmit = async () => {
        // validate JSON
        let parsed: any[];
        try {
            parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) {
                setError("Input must be a JSON array [ {...}, {...} ]");
                return;
            }
            if (parsed.length === 0) {
                setError("Array is empty — add at least one player object.");
                return;
            }
        } catch {
            setError("Invalid JSON — check for missing commas, brackets, or quotes.");
            return;
        }

        setError("");

        try {
            await axios.post(
                "http://localhost:8081/scrabbleapp2026/api/v1/player/addplayers/bulk",
                parsed,
                { headers: { "Content-Type": "application/json" } }
            );

            const Toast = Swal.mixin({
                toast: true, position: "top-end",
                showConfirmButton: false, timer: 3000, timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({ icon: "success", title: `${parsed.length} player(s) added successfully` });

            refreshTable();
            handleClose_();
        } catch (err) {
            const Toast = Swal.mixin({
                toast: true, position: "top-end",
                showConfirmButton: false, timer: 3000, timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({ icon: "error", title: "Bulk player import failed" });
        }
    };

    const handleLoadExample = () => {
        setJsonInput(EXAMPLE);
        setError("");
    };

    return (
        <Modal show={show} onHide={handleClose_} className="dark-modal" size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Bulk Add Players</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ color: "#bfd0e1d1", fontSize: "0.85rem", marginBottom: "12px" }}>
                    Paste a JSON array of player objects below. Each object will be saved as a separate player.
                </p>

                {/* load example button */}
                <div className="mb-2">
                    <button
                        onClick={handleLoadExample}
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(224,211,24,0.4)",
                            color: "#e0d318d4",
                            padding: "4px 14px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            transition: "all 0.2s ease",
                        }}
                    >
                        Load Example
                    </button>
                </div>

                {/* JSON textarea */}
                <Form.Control
                    as="textarea"
                    rows={14}
                    value={jsonInput}
                    onChange={(e) => {
                        setJsonInput(e.target.value);
                        setError("");
                    }}
                    placeholder='[ { "firstName": "John", "lastName": "Doe", ... }, ... ]'
                    style={{
                        backgroundColor: "#0d0c18",
                        border: `1px solid ${error ? "#ff6b6b" : "rgba(255,255,255,0.06)"}`,
                        color: "#bfd0e1",
                        fontFamily: "monospace",
                        fontSize: "0.82rem",
                        borderRadius: "8px",
                        resize: "vertical",
                    }}
                />

                {/* error message */}
                {error && (
                    <p style={{ color: "#ff6b6b", fontSize: "0.78rem", marginTop: "8px", letterSpacing: "0.5px" }}>
                        ⚠ {error}
                    </p>
                )}

                {/* required fields hint */}
                <div style={{
                    marginTop: "12px",
                    padding: "10px 14px",
                    background: "rgba(224,211,24,0.05)",
                    border: "1px solid rgba(224,211,24,0.1)",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    color: "rgba(191,208,225,0.6)",
                    lineHeight: "1.8"
                }}>
                    <strong style={{ color: "#e0d318a1" }}>Required fields per object:</strong><br />
                    firstName, lastName, gender, dob (yyyy-MM-dd), email, phone, address, faculty, academicLevel
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-edit" onClick={handleClose_}>Close</Button>
                <Button className="btn-create" onClick={handleSubmit}>Add Players</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BulkAddPlayer;