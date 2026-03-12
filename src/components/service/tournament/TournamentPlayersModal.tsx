import { useEffect, useState } from "react";
import { Modal, Badge } from "react-bootstrap";
import ReactSelect from "react-select";
import { customStyles } from "../styles/CustomStyles";
import GetTournamentPlayers from "../tournament/GetTournamentPlayers";
import GetAllPlayers from "../tournament/GetAllPlayers";
import RegisterTournamentPlayer from "../tournament/RegisterTournamentPlayers";
import RemoveTournamentPlayer from "../tournament/RemoveTournamentPlayers";
import { GetAllTeams } from "../team/GetAllTeams";
import RegisterTournamentTeam from "../tournament/RegisterTournamentTeam";
import RemoveTournamentTeam from "../tournament/RemoveTournamentTeam";
import GetTournamentTeams from "../tournament/GetTournamentTeam";

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

interface TournamentTeam {
    tournamentTeamId: string;
    tournamentId: string;
    teamId: string;
    teamName: string;
    teamSize: number;
    activityStatus: "ACTIVE" | "INACTIVE";
}

interface Player {
    playerId: string;
    firstName: string;
    lastName: string;
}

interface Team {
    teamId: string;
    teamName: string;
    teamSize: number;
}

interface Props {
    show: boolean;
    onHide: () => void;
    tournamentId: string;
    tournamentName: string;
    tournamentType: "individual" | "team";
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TournamentPlayersModal({ show, onHide, tournamentId, tournamentName, tournamentType }: Props) {
    const isTeam = tournamentType === "team";

    // ── Individual state ──────────────────────────────────────────────────────
    const [registeredPlayers, setRegisteredPlayers] = useState<TournamentPlayer[]>([]);
    const [allPlayers, setAllPlayers]               = useState<Player[]>([]);

    // ── Team state ────────────────────────────────────────────────────────────
    const [registeredTeams, setRegisteredTeams] = useState<TournamentTeam[]>([]);
    const [allTeams, setAllTeams]               = useState<Team[]>([]);

    // ── Shared state ──────────────────────────────────────────────────────────
    const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);
    const [loading, setLoading]   = useState(false);
    const [adding, setAdding]     = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [error, setError]       = useState<string | null>(null);

    // ── Load data when modal opens ────────────────────────────────────────────
    useEffect(() => {
        if (!show || !tournamentId) return;
        setError(null);
        setLoading(true);

        if (isTeam) {
            Promise.all([GetTournamentTeams(tournamentId), GetAllTeams()])
                .then(([registered, all]) => {
                    setRegisteredTeams(registered);
                    setAllTeams(all);
                })
                .catch(() => setError("Failed to load team data."))
                .finally(() => setLoading(false));
        } else {
            Promise.all([GetTournamentPlayers(tournamentId), GetAllPlayers()])
                .then(([registered, all]) => {
                    setRegisteredPlayers(registered);
                    setAllPlayers(all);
                })
                .catch(() => setError("Failed to load player data."))
                .finally(() => setLoading(false));
        }
    }, [show, tournamentId, isTeam]);

    // ── Dropdown options ──────────────────────────────────────────────────────
    const selectOptions = isTeam
        ? (() => {
            const registeredTeamIds = new Set(registeredTeams.map(t => t.teamId));
            return allTeams
                .filter(t => !registeredTeamIds.has(t.teamId))
                .map(t => ({ value: t.teamId, label: t.teamName }))
                .sort((a, b) => a.label.localeCompare(b.label));
        })()
        : (() => {
            const registeredIds = new Set(registeredPlayers.map(p => p.playerId));
            return allPlayers
                .filter(p => !registeredIds.has(p.playerId))
                .map(p => ({ value: p.playerId, label: `${p.firstName} ${p.lastName}` }))
                .sort((a, b) => a.label.localeCompare(b.label));
        })();

    // ── Register ──────────────────────────────────────────────────────────────
    const handleRegister = async () => {
        if (!selectedOption) return;
        setError(null);
        setAdding(true);
        try {
            if (isTeam) {
                await RegisterTournamentTeam(tournamentId, selectedOption.value);
                setRegisteredTeams(await GetTournamentTeams(tournamentId));
            } else {
                await RegisterTournamentPlayer(tournamentId, selectedOption.value);
                setRegisteredPlayers(await GetTournamentPlayers(tournamentId));
            }
            setSelectedOption(null);
        } catch (e: any) {
            const status = e?.response?.status;
            if (status === 409) {
                setError(`This ${isTeam ? "team" : "player"} is already registered in the tournament.`);
            } else {
                setError(`Failed to register ${isTeam ? "team" : "player"}. Please try again.`);
            }
        } finally {
            setAdding(false);
        }
    };

    // ── Remove ────────────────────────────────────────────────────────────────
    const handleRemove = async (id: string) => {
        setError(null);
        setRemovingId(id);
        try {
            if (isTeam) {
                await RemoveTournamentTeam(id);
                setRegisteredTeams(prev => prev.filter(t => t.tournamentTeamId !== id));
            } else {
                await RemoveTournamentPlayer(id);
                setRegisteredPlayers(prev => prev.filter(p => p.tournamentPlayerId !== id));
            }
        } catch {
            setError(`Failed to remove ${isTeam ? "team" : "player"}. Please try again.`);
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

    const registeredCount = isTeam ? registeredTeams.length : registeredPlayers.length;

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
                            REGISTERED {isTeam ? "TEAMS" : "PLAYERS"}
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

                    {/* Add row — ReactSelect + Register button */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                            <ReactSelect
                                options={selectOptions}
                                styles={customStyles}
                                placeholder={`Search and select a ${isTeam ? "team" : "player"}...`}
                                isSearchable
                                isClearable
                                isDisabled={adding || loading}
                                value={selectedOption}
                                onChange={option => setSelectedOption(option as { value: string; label: string } | null)}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                noOptionsMessage={() => `No ${isTeam ? "teams" : "players"} available`}
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

                    {/* Table */}
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px",
                            color: "#bfd0e140", fontSize: "0.8rem", letterSpacing: "2px" }}>
                            LOADING...
                        </div>
                    ) : registeredCount === 0 ? (
                        <div style={{
                            textAlign: "center", padding: "40px", color: "#bfd0e130",
                            fontSize: "0.8rem", letterSpacing: "1.5px",
                            border: "1px dashed rgba(224,211,24,0.08)", borderRadius: "8px",
                        }}>
                            No {isTeam ? "teams" : "players"} registered yet.
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
                                        {(isTeam
                                            ? ["#", "Team", "Team ID", "Size", "Status", ""]
                                            : ["#", "Player", "Player ID", "Status", ""]
                                        ).map((h, i, arr) => (
                                            <th key={i} style={{
                                                padding: "10px 14px", fontWeight: 500,
                                                textAlign: i === arr.length - 1 ? "right"
                                                    : i === arr.length - 2 ? "center" : "left",
                                                borderBottom: "1px solid rgba(224,211,24,0.08)",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isTeam
                                        ? registeredTeams.map((team, index) => (
                                            <tr key={team.tournamentTeamId} style={{
                                                background: index % 2 === 0 ? "#0d0c18" : "#08071299",
                                                borderBottom: "1px solid rgba(255,255,255,0.03)",
                                            }}>
                                                <td style={{ padding: "11px 14px", color: "#bfd0e145", fontSize: "0.75rem" }}>
                                                    {index + 1}
                                                </td>
                                                <td style={{ padding: "11px 14px", color: "#bfd0e1d1", fontSize: "0.83rem" }}>
                                                    {team.teamName}
                                                </td>
                                                <td style={{ padding: "11px 14px", color: "#bfd0e155",
                                                    fontSize: "0.72rem", fontFamily: "monospace" }}>
                                                    {team.teamId}
                                                </td>
                                                <td style={{ padding: "11px 14px", color: "#bfd0e180", fontSize: "0.78rem" }}>
                                                    {team.teamSize} players
                                                </td>
                                                <td style={{ padding: "11px 14px", textAlign: "center" }}>
                                                    {statusBadge(team.activityStatus)}
                                                </td>
                                                <td style={{ padding: "11px 14px", textAlign: "right" }}>
                                                    {removeButton(team.tournamentTeamId)}
                                                </td>
                                            </tr>
                                        ))
                                        : registeredPlayers.map((player, index) => (
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
                                                    {removeButton(player.tournamentPlayerId)}
                                                </td>
                                            </tr>
                                        ))
                                    }
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
                        {registeredCount} {isTeam ? "team" : "player"}{registeredCount !== 1 ? "s" : ""} registered
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

    // ── Shared remove button ──────────────────────────────────────────────────
    function removeButton(id: string) {
        return (
            <button
                onClick={() => handleRemove(id)}
                disabled={removingId === id}
                style={{
                    background: "transparent",
                    border: "1px solid rgba(229, 94, 94, 0.7)",
                    color: removingId === id ? "#e55e5eae" : "#e55e5eb7",
                    borderRadius: "6px", padding: "3px 12px",
                    fontSize: "0.68rem", letterSpacing: "0.5px",
                    cursor: removingId === id ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.background = "rgba(229,94,94,0.1)";
                    btn.style.color = "#e55e5e";
                    btn.style.borderColor = "rgba(229, 94, 94, 0.79)";
                }}
                onMouseLeave={e => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.background = "transparent";
                    btn.style.color = "#e55e5eae";
                    btn.style.borderColor = "rgba(229, 94, 94, 0.7)";
                }}
            >
                {removingId === id ? "REMOVING..." : "REMOVE"}
            </button>
        );
    }
}