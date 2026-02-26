import { useEffect, useState } from "react"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import CreateRound from "./CreateRound"

interface Round {
    roundId: string
    tournamentId: string
    roundNumber: number
    roundName: string
}

interface AddRoundProps {
    show: boolean
    tournamentId: string
    handleClose: () => void
    handleAdd: (newRound: Round) => void
}

const AddRound = ({ show, tournamentId, handleClose, handleAdd }: AddRoundProps) => {
    const [details, setDetails] = useState({
        roundNumber: 1,
        roundName: "",
        tournamentId: ""
    })

    useEffect(() => {
        if (show) {
            setDetails({ roundNumber: 1, roundName: "", tournamentId })
        }
    }, [show, tournamentId])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async () => {
        try {
            const created = await CreateRound(details)
            handleAdd(created)
            handleClose()
        } catch (error) {
            console.error("Error creating round", error)
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Round</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FloatingLabel label="Round Number" className="mb-3">
                    <Form.Control
                        type="number"
                        name="roundNumber"
                        placeholder="Round Number"
                        value={details.roundNumber}
                        onChange={handleOnChange} />
                </FloatingLabel>

                <FloatingLabel label="Round Name" className="mb-3">
                    <Form.Control
                        type="text"
                        name="roundName"
                        placeholder="Round Name (optional)"
                        value={details.roundName}
                        onChange={handleOnChange} />
                </FloatingLabel>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleSubmit}>Save Round</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddRound