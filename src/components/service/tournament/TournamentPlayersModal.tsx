import { useEffect, useState } from "react";
import { Modal, Badge } from "react-bootstrap";
import ReactSelect from "react-select";
import { customStyles } from "../styles/CustomStyles";
import GetTournamentPlayers from "../tournament/GetTournamentPlayers";
import GetAllPlayers from "../tournament/GetAllPlayers";
import RegisterTournamentPlayer from "../tournament/RegisterTournamentPlayers";
import RemoveTournamentPlayer from "../tournament/RemoveTournamentPlayers";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TournamentPlayer {
    tournamentPlayerId: string;
    tournamentId: string;
    tournamentName: string;
    playerId: string;
    firstName: string;
    lastName: string;
    activityStatus: "ACTIVE" | "INACTIVE";
}

interface Player {
    playerId: string;
    firstName: string;
    lastName: string;
}

interface Props {
    show: boolean;
    onHide: () => void;
    tournamentId: string;
    tournamentName: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TournamentPlayersModal({ show, onHide, tournamentId, tournamentName }: Props) {
    const [registeredPlayers, setRegisteredPlayers] = useState<TournamentPlayer[]>([]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ── Load data when modal opens ────────────────────────────────────────────
    useEffect(() => {
        if (!show || !tournamentId) return;
        setError(null);
        setLoading(true);

        Promise.all([GetTournamentPlayers(tournamentId), GetAllPlayers()])
            .then(([registered, all]) => {
                setRegisteredPlayers(registered);
                setAllPlayers(all);
            })
            .catch(() => setError("Failed to load player data."))
            .finally(() => setLoading(false));
    }, [show, tournamentId]);

    // ── Derived: available options for ReactSelect ────────────────────────────
    const registeredIds = new Set(registeredPlayers.map(p => p.playerId));
    const playerOptions = allPlayers
        .filter(p => !registeredIds.has(p.playerId))
        .map(p => ({ value: p.playerId, label: `${p.firstName} ${p.lastName}` }))
        .sort((a, b) => a.label.localeCompare(b.label));

    // ── Register ─────────────────────────────────────────────────────────────
    const handleRegister = async () => {
        if (!selectedOption) return;
        setError(null);
        setAdding(true);
        try {
            await RegisterTournamentPlayer(tournamentId, selectedOption.value);
            const updated = await GetTournamentPlayers(tournamentId);
            setRegisteredPlayers(updated);
            setSelectedOption(null);
        } catch (e: any) {
            const status = e?.response?.status;
            if (status === 409) {
                setError("This player is already registered in the tournament.");
            } else {
                setError("Failed to register player. Please try again.");
            }
        } finally {
            setAdding(false);
        }
    };

    // ── Remove ────────────────────────────────────────────────────────────────
    const handleRemove = async (tournamentPlayerId: string) => {
        setError(null);
        setRemovingId(tournamentPlayerId);
        try {
            await RemoveTournamentPlayer(tournamentPlayerId);
            setRegisteredPlayers(prev =>
                prev.filter(p => p.tournamentPlayerId !== tournamentPlayerId)
            );
        } catch {
            setError("Failed to remove player. Please try again.");
        } finally {
            setRemovingId(null);
        }
    };

    // ── Reset on close ────────────────────────────────────────────────────────
    const handleHide = () => {
        setSelectedOption(null);
        setError(null);
        onHide();
    };

    // ── Status badge ──────────────────────────────────────────────────────────
    const statusBadge = (status: "ACTIVE" | "INACTIVE") =>
        status === "ACTIVE" ? (
            <Badge bg="" style={{
                background: "rgba(94,229,170,0.12)", color: "#5ee5aa",
                border: "1px solid rgba(94,229,170,0.25)", fontWeight: 400,
                fontSize: "0.68rem", letterSpacing: "0.8px", padding: "4px 8px",
            }}>ACTIVE</Badge>
        ) : (
            <Badge bg="" style={{
                background: "rgba(229,94,94,0.12)", color: "#e55e5e",
                border: "1px solid rgba(229,94,94,0.25)", fontWeight: 400,
                fontSize: "0.68rem", letterSpacing: "0.8px", padding: "4px 8px",
            }}>INACTIVE</Badge>
        );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Modal show={show} onHide={handleHide} size="lg" centered contentClassName="border-0">
            <div style={{ background: "#0d0c18", borderRadius: "12px", overflow: "hidden",
                border: "1px solid rgba(224,211,24,0.15)" }}>

                {/* ── Header ───────────────────────────────────────────────── */}
                <Modal.Header closeButton closeVariant="white" style={{
                    background: "#06041399",
                    borderBottom: "1px solid rgba(224,211,24,0.15)",
                    padding: "16px 24px",
                }}>
                    <div>
                        <Modal.Title style={{
                            color: "#e0d318", fontSize: "0.85rem",
                            letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600,
                        }}>
                            {tournamentName}
                        </Modal.Title>
                        <div style={{ color: "#bfd0e150", fontSize: "0.68rem",
                            letterSpacing: "1.5px", marginTop: "2px" }}>
                            REGISTERED PLAYERS
                        </div>
                    </div>
                </Modal.Header>

                {/* ── Body ─────────────────────────────────────────────────── */}
                <Modal.Body style={{ background: "#0d0c18", padding: "20px 24px" }}>

                    {/* Error banner */}
                    {error && (
                        <div style={{
                            color: "#e55e5e", fontSize: "0.78rem", marginBottom: "14px",
                            padding: "9px 14px", border: "1px solid rgba(229,94,94,0.25)",
                            borderRadius: "8px", background: "rgba(229,94,94,0.07)",
                            display: "flex", alignItems: "center", gap: "8px",
                        }}>
                            <span>⚠</span> {error}
                        </div>
                    )}

                    {/* Add player row — ReactSelect + Register button */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                            <ReactSelect
                                options={playerOptions}
                                styles={customStyles}
                                placeholder="Search and select a player..."
                                isSearchable={true}
                                isClearable={true}
                                isDisabled={adding || loading}
                                value={selectedOption}
                                onChange={option => setSelectedOption(option as { value: string; label: string } | null)}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                noOptionsMessage={() => "No players available"}
                            />
                        </div>

                        <button
                            onClick={handleRegister}
                            disabled={!selectedOption || adding}
                            style={{
                                background: selectedOption && !adding ? "rgba(224,211,24,0.1)" : "transparent",
                                border: "1px solid rgba(224,211,24,0.3)",
                                color: selectedOption && !adding ? "#e0d318" : "#e0d31840",
                                borderRadius: "8px", padding: "8px 20px",
                                fontSize: "0.78rem", letterSpacing: "1px",
                                cursor: selectedOption && !adding ? "pointer" : "not-allowed",
                                transition: "all 0.2s", whiteSpace: "nowrap", minWidth: "110px",
                                height: "38px",
                            }}
                        >
                            {adding ? "Adding..." : "+ Register"}
                        </button>
                    </div>

                    {/* Player table */}
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px",
                            color: "#bfd0e140", fontSize: "0.8rem", letterSpacing: "2px" }}>
                            LOADING...
                        </div>
                    ) : registeredPlayers.length === 0 ? (
                        <div style={{
                            textAlign: "center", padding: "40px", color: "#bfd0e130",
                            fontSize: "0.8rem", letterSpacing: "1.5px",
                            border: "1px dashed rgba(224,211,24,0.08)", borderRadius: "8px",
                        }}>
                            No players registered yet.
                        </div>
                    ) : (
                        <div style={{ borderRadius: "8px", overflow: "hidden",
                            border: "1px solid rgba(224,211,24,0.1)" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{
                                        background: "#060413", color: "#e0d318aa",
                                        fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase",
                                    }}>
                                        {["#", "Player", "Player ID", "Status", ""].map((h, i) => (
                                            <th key={i} style={{
                                                padding: "10px 14px", fontWeight: 500,
                                                textAlign: i === 3 ? "center" : i === 4 ? "right" : "left",
                                                borderBottom: "1px solid rgba(224,211,24,0.08)",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {registeredPlayers.map((player, index) => (
                                        <tr key={player.tournamentPlayerId} style={{
                                            background: index % 2 === 0 ? "#0d0c18" : "#08071299",
                                            borderBottom: "1px solid rgba(255,255,255,0.03)",
                                        }}>
                                            <td style={{ padding: "11px 14px", color: "#bfd0e145", fontSize: "0.75rem" }}>
                                                {index + 1}
                                            </td>
                                            <td style={{ padding: "11px 14px", color: "#bfd0e1d1", fontSize: "0.83rem" }}>
                                                {player.firstName} {player.lastName}
                                            </td>
                                            <td style={{ padding: "11px 14px", color: "#bfd0e155",
                                                fontSize: "0.72rem", fontFamily: "monospace" }}>
                                                {player.playerId}
                                            </td>
                                            <td style={{ padding: "11px 14px", textAlign: "center" }}>
                                                {statusBadge(player.activityStatus)}
                                            </td>
                                            <td style={{ padding: "11px 14px", textAlign: "right" }}>
                                                <button
                                                    onClick={() => handleRemove(player.tournamentPlayerId)}
                                                    disabled={removingId === player.tournamentPlayerId}
                                                    style={{
                                                        background: "transparent",
                                                        border: "1px solid rgba(229,94,94,0.25)",
                                                        color: removingId === player.tournamentPlayerId
                                                            ? "#e55e5e40" : "#e55e5e80",
                                                        borderRadius: "6px", padding: "3px 12px",
                                                        fontSize: "0.68rem", letterSpacing: "0.5px",
                                                        cursor: removingId === player.tournamentPlayerId
                                                            ? "not-allowed" : "pointer",
                                                        transition: "all 0.2s",
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (removingId !== player.tournamentPlayerId) {
                                                            const btn = e.currentTarget as HTMLButtonElement;
                                                            btn.style.background = "rgba(229,94,94,0.1)";
                                                            btn.style.color = "#e55e5e";
                                                            btn.style.borderColor = "rgba(229,94,94,0.5)";
                                                        }
                                                    }}
                                                    onMouseLeave={e => {
                                                        const btn = e.currentTarget as HTMLButtonElement;
                                                        btn.style.background = "transparent";
                                                        btn.style.color = "#e55e5e80";
                                                        btn.style.borderColor = "rgba(229,94,94,0.25)";
                                                    }}
                                                >
                                                    {removingId === player.tournamentPlayerId ? "Removing..." : "Remove"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal.Body>

                {/* ── Footer ───────────────────────────────────────────────── */}
                <Modal.Footer style={{
                    background: "#06041399",
                    borderTop: "1px solid rgba(224,211,24,0.08)",
                    padding: "12px 24px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <span style={{ fontSize: "0.72rem", color: "#bfd0e140", letterSpacing: "1px" }}>
                        {registeredPlayers.length} player{registeredPlayers.length !== 1 ? "s" : ""} registered
                    </span>
                    <button onClick={handleHide} style={{
                        background: "transparent",
                        border: "1px solid rgba(224,211,24,0.2)",
                        color: "#bfd0e1c0", borderRadius: "6px",
                        padding: "6px 18px", fontSize: "0.78rem",
                        letterSpacing: "0.5px", cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                        const btn = e.currentTarget as HTMLButtonElement;
                        btn.style.background = "rgba(224,211,24,0.07)";
                        btn.style.borderColor = "rgba(224,211,24,0.4)";
                    }}
                    onMouseLeave={e => {
                        const btn = e.currentTarget as HTMLButtonElement;
                        btn.style.background = "transparent";
                        btn.style.borderColor = "rgba(224,211,24,0.2)";
                    }}>
                        Close
                    </button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}