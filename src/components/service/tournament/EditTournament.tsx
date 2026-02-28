import { useEffect, useState } from "react"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import UpdateTournament from "./UpdateTournament"
import Swal from "sweetalert2"

interface Tournament {
    tournamentId: string
    tournamentName: string
    status: string
}

interface EditTournamentProps {
    show: boolean
    selectedRow: Tournament | null
    handleClose: () => void
    handleUpdate: (updated: Tournament) => void
    refreshTable: () => void
}

const EditTournament = ({ show, selectedRow, handleClose, handleUpdate, refreshTable }: EditTournamentProps) => {
    const [details, setDetails] = useState<Tournament>({
        tournamentId: "",
        tournamentName: "",
        status: ""
    })

    useEffect(() => {
        if (selectedRow) {
            setDetails({ ...selectedRow })
        }
    }, [selectedRow])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSave = async () => {
        try {
            const updated = await UpdateTournament(details)
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
            Toast.fire({ icon: "success", title: "Tournament Updated Successfully" });
            handleUpdate(updated)
            refreshTable()
            handleClose()
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
            Toast.fire({ icon: "error", title: "Failed to Update Tournament" });

        }
    }

    return (
        <Modal show={show} onHide={handleClose} className="dark-modal">
            <Modal.Header closeButton>
                <Modal.Title>Edit Tournament</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FloatingLabel label="Tournament ID" className="mb-3">
                    <Form.Control
                        readOnly
                        type="text"
                        name="tournamentId"
                        placeholder="Tournament ID"
                        value={details.tournamentId} />
                </FloatingLabel>

                <FloatingLabel label="Tournament Name" className="mb-3">
                    <Form.Control
                        type="text"
                        name="tournamentName"
                        placeholder="Tournament Name"
                        value={details.tournamentName}
                        onChange={handleOnChange} />
                </FloatingLabel>

                <FloatingLabel label="Status" className="mb-3">
                    <Form.Select name="status" value={details.status} onChange={handleOnChange}>
                        <option value="" disabled>Select Tournament Status</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="FINISHED">Finished</option>
                    </Form.Select>
                </FloatingLabel>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-edit" onClick={handleClose}>Close</Button>
                <Button className="btn-create" onClick={handleSave}>Update</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditTournament