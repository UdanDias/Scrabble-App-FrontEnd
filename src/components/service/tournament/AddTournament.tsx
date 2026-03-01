import { useEffect, useState } from "react"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import CreateTournament from "./CreateTournament"
import Swal from "sweetalert2"
import ReactSelect from "react-select"
import { customStyles } from "../styles/CustomStyles"

interface Tournament {
    tournamentId: string
    tournamentName: string
    status: string
}

interface AddTournamentProps {
    show: boolean
    handleClose: () => void
    handleAdd: (newTournament: Tournament) => void
    refreshTable: () => void
}

const AddTournament = ({ show, handleClose, handleAdd, refreshTable }: AddTournamentProps) => {
    const [details, setDetails] = useState({
        tournamentName: "",
        status: "UPCOMING"
    })

    useEffect(() => {
        if (show) {
            setDetails({ 
                tournamentName: "",
                status: "UPCOMING" })
        }
    }, [show])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async () => {
        try {
            const created = await CreateTournament(details)
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
            Toast.fire({ icon: "success", title: "Created Tournament Successfully" });

            handleAdd(created)
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
            Toast.fire({ icon: "error", title: "Tournament Creation Failed" });
        }
    }
    const statusOptions = [
    { value: "UPCOMING", label: "Upcoming" },
    { value: "ONGOING", label: "Ongoing" },
    { value: "FINISHED", label: "Finished" },
]

    return (
        <Modal show={show} onHide={handleClose} className="dark-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add Tournament</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FloatingLabel label="Tournament Name" className="mb-3">
                    <Form.Control
                        type="text"
                        name="tournamentName"
                        placeholder="Tournament Name"
                        value={details.tournamentName}
                        onChange={handleOnChange} />
                </FloatingLabel>
                    <div className="mb-3">
                        <ReactSelect
                            options={statusOptions}
                            styles={customStyles}
                            placeholder="Select Status"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            value={statusOptions.find(o => o.value === details.status) ?? null}
                            onChange={(selected) =>
                                setDetails(prev => ({ ...prev, status: selected?.value ?? "" }))
                            }
                        />
                    </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-edit" onClick={handleClose}>Close</Button>
                <Button className="btn-create" onClick={handleSubmit}>Save Tournament</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddTournament