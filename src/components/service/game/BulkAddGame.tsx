import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import FetchToken from "../auth/FetchToken";
import { customStyles } from "../styles/CustomStyles";

interface PlayerOption {
    value: string;
    label: string;
}

interface BulkGameRow {
    id: number;
    player1Id: string;
    player2Id: string;
    score1: string;
    score2: string;
}

interface BulkAddGameProps {
    show: boolean;
    handleClose: () => void;
    handleAdd: () => void;
    roundId: string | null;
    players: { playerId: string; firstName: string; lastName: string }[];
}

let rowCounter = 0;

const emptyRow = (): BulkGameRow => ({
    id: ++rowCounter,
    player1Id: "",
    player2Id: "",
    score1: "",
    score2: "",
});

export function BulkAddGame({ show, handleClose, handleAdd, roundId, players }: BulkAddGameProps) {
    const [rows, setRows] = useState<BulkGameRow[]>([emptyRow()]);
    const [submitting, setSubmitting] = useState(false);

    const playerOptions: PlayerOption[] = players.map(p => ({
        value: p.playerId,
        label: `${p.firstName} ${p.lastName}`,
    }));

    const handleClose_ = () => {
        setRows([emptyRow()]);
        handleClose();
    };

    const addRow = () => setRows(prev => [...prev, emptyRow()]);
    const removeRow = (id: number) => setRows(prev => prev.filter(r => r.id !== id));

    const updateRow = (id: number, field: keyof BulkGameRow, value: string) =>
        setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

    const handleSubmit = async () => {
        // Validate all rows
        for (let i = 0; i < rows.length; i++) {
            const r = rows[i];
            if (!r.player1Id || !r.player2Id) {
                Swal.fire({ icon: "warning", title: `Row ${i + 1}: Please select both players.` });
                return;
            }
            if (r.player1Id === r.player2Id) {
                Swal.fire({ icon: "warning", title: `Row ${i + 1}: Player 1 and Player 2 cannot be the same.` });
                return;
            }
            if (r.score1 === "" || r.score2 === "") {
                Swal.fire({ icon: "warning", title: `Row ${i + 1}: Please enter both scores.` });
                return;
            }
        }

        const payload = rows.map(r => ({
            roundId,
            player1Id: r.player1Id,
            player2Id: r.player2Id,
            score1: Number(r.score1),
            score2: Number(r.score2),
        }));

        setSubmitting(true);
        try {
            await axios.post(
                "http://localhost:8081/scrabbleapp2026/api/v1/game/addbulk",
                payload,
                { headers: { "Content-Type": "application/json", Authorization: FetchToken() } }
            );

            Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true })
                .fire({ icon: "success", title: `${rows.length} game(s) added successfully` });

            handleAdd();
            handleClose_();
        } catch {
            Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true })
                .fire({ icon: "error", title: "Bulk game import failed" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose_} className="dark-modal" size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Bulk Add Games</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p style={{ color: "#bfd0e1d1", fontSize: "0.85rem", marginBottom: "16px" }}>
                    Add multiple games at once. Winner, margin, and date are calculated automatically.
                </p>

                {/* Column headers */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 90px 90px 36px",
                    gap: "8px",
                    marginBottom: "6px",
                    padding: "0 4px",
                }}>
                    {["Player 1", "Player 2", "Score 1", "Score 2", ""].map((h, i) => (
                        <span key={i} style={{ color: "#e0d318a0", fontSize: "0.72rem", letterSpacing: "1px", textTransform: "uppercase" }}>
                            {h}
                        </span>
                    ))}
                </div>

                {/* Rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {rows.map((row, index) => (
                        <div key={row.id} style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 90px 90px 36px",
                            gap: "8px",
                            alignItems: "center",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: "8px",
                            padding: "8px",
                        }}>
                            {/* Player 1 */}
                            <ReactSelect
                                options={playerOptions}
                                styles={customStyles}
                                placeholder="Player 1"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                value={playerOptions.find(o => o.value === row.player1Id) ?? null}
                                onChange={s => updateRow(row.id, "player1Id", s?.value ?? "")}
                            />
                            {/* Player 2 */}
                            <ReactSelect
                                options={playerOptions.filter(o => o.value !== row.player1Id)}
                                styles={customStyles}
                                placeholder="Player 2"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                value={playerOptions.find(o => o.value === row.player2Id) ?? null}
                                onChange={s => updateRow(row.id, "player2Id", s?.value ?? "")}
                            />
                            {/* Score 1 */}
                            <Form.Control
                                type="number"
                                min={0}
                                placeholder="0"
                                value={row.score1}
                                onChange={e => updateRow(row.id, "score1", e.target.value)}
                                style={{ backgroundColor: "#0d0c18", border: "1px solid rgba(255,255,255,0.1)", color: "#bfd0e1", borderRadius: "6px", textAlign: "center" }}
                            />
                            {/* Score 2 */}
                            <Form.Control
                                type="number"
                                min={0}
                                placeholder="0"
                                value={row.score2}
                                onChange={e => updateRow(row.id, "score2", e.target.value)}
                                style={{ backgroundColor: "#0d0c18", border: "1px solid rgba(255,255,255,0.1)", color: "#bfd0e1", borderRadius: "6px", textAlign: "center" }}
                            />
                            {/* Remove */}
                            <button
                                onClick={() => rows.length > 1 && removeRow(row.id)}
                                disabled={rows.length === 1}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: rows.length === 1 ? "#ffffff20" : "#e0555580",
                                    fontSize: "1.1rem",
                                    cursor: rows.length === 1 ? "default" : "pointer",
                                    lineHeight: 1,
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add row button */}
                <button
                    onClick={addRow}
                    style={{
                        marginTop: "12px",
                        background: "transparent",
                        border: "1px dashed rgba(224,211,24,0.35)",
                        color: "#e0d318a0",
                        borderRadius: "8px",
                        padding: "7px 0",
                        width: "100%",
                        fontSize: "0.82rem",
                        letterSpacing: "1px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(224,211,24,0.7)"; e.currentTarget.style.color = "#e0d318"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(224,211,24,0.35)"; e.currentTarget.style.color = "#e0d318a0"; }}
                >
                    + Add Row
                </button>
            </Modal.Body>

            <Modal.Footer>
                <Button className="btn-edit" onClick={handleClose_}>Close</Button>
                <Button className="btn-create" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Submitting..." : `Submit ${rows.length} Game${rows.length !== 1 ? "s" : ""}`}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}