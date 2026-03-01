import { useEffect, useState } from "react"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import UpdateTournament from "./UpdateTournament"
import Swal from "sweetalert2"
import ReactSelect from "react-select"
import { customStyles } from "../styles/CustomStyles"

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
    const statusOptions = [
    { value: "UPCOMING", label: "Upcoming" },
    { value: "ONGOING", label: "Ongoing" },
    { value: "FINISHED", label: "Finished" },
]

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
                <Button className="btn-create" onClick={handleSave}>Update</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditTournament