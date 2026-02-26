import { useEffect, useState } from "react"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import CreateTournament from "./CreateTournament"

interface Tournament {
    tournamentId: string
    tournamentName: string
    startDate: string
    endDate: string
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
        startDate: "",
        endDate: "",
        status: "UPCOMING"
    })

    useEffect(() => {
        if (show) {
            setDetails({ tournamentName: "", startDate: "", endDate: "", status: "UPCOMING" })
        }
    }, [show])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async () => {
        try {
            const created = await CreateTournament(details)
            handleAdd(created)
            refreshTable()
            handleClose()
        } catch (error) {
            console.error("Error creating tournament", error)
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
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

                <FloatingLabel label="Start Date" className="mb-3">
                    <Form.Control
                        type="date"
                        name="startDate"
                        placeholder="Start Date"
                        value={details.startDate}
                        onChange={handleOnChange} />
                </FloatingLabel>

                <FloatingLabel label="End Date" className="mb-3">
                    <Form.Control
                        type="date"
                        name="endDate"
                        placeholder="End Date"
                        value={details.endDate}
                        onChange={handleOnChange} />
                </FloatingLabel>

                <FloatingLabel label="Status" className="mb-3">
                    <Form.Select name="status" value={details.status} onChange={handleOnChange}>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                    </Form.Select>
                </FloatingLabel>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleSubmit}>Save Tournament</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddTournament