import React, { useEffect, useState } from "react";
import { Accordion, Button, Table } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import { customStyles } from "../service/styles/CustomStyles";
import { GetAllTeams } from "../service/team/GetAllTeams";
import {  CreateTeam} from "../service/team/CreateTeam";
import {  UpdateTeam } from "../service/team/UpdateTeam";
import {  DeleteTeam } from "../service/team/DeleteTeam";
import { getPlayer } from "../service/player/GetPlayer";
import { ConsoleHeader } from "./ConsoleHeader";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeamMember {
    playerId: string;
    firstName: string;
    lastName: string;
}

interface Team {
    teamId: string;
    teamName: string;
    teamSize: number;
    playerIds: string[];
    members: TeamMember[];
}

interface Player {
    playerId: string;
    firstName: string;
    lastName: string;
}

// ─── Add Team Modal ───────────────────────────────────────────────────────────
interface AddTeamModalProps {
    show: boolean;
    players: Player[];
    onClose: () => void;
    onSave: () => void;
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({ show, players, onClose, onSave }) => {
    const [teamName, setTeamName] = useState("");
    const [teamSize, setTeamSize] = useState<number | "">("");
    const [selectedPlayers, setSelectedPlayers] = useState<(string | null)[]>([]);
    const [saving, setSaving] = useState(false);

    const playerOptions = players.map(p => ({
        value: p.playerId,
        label: `${p.firstName} ${p.lastName}`,
    }));

    const handleSizeChange = (val: string) => {
        const n = parseInt(val);
        if (!isNaN(n) && n > 0) {
            setTeamSize(n);
            setSelectedPlayers(Array(n).fill(null));
        } else {
            setTeamSize("");
            setSelectedPlayers([]);
        }
    };

    const handlePlayerSelect = (index: number, value: string | null) => {
        const updated = [...selectedPlayers];
        updated[index] = value;
        setSelectedPlayers(updated);
    };

    const handleSave = async () => {
        if (!teamName.trim()) {
            Swal.fire({ toast: true, position: "top-end", icon: "warning", title: "Team name is required", showConfirmButton: false, timer: 2500 });
            return;
        }
        if (!teamSize || teamSize < 1) {
            Swal.fire({ toast: true, position: "top-end", icon: "warning", title: "Please set a valid team size", showConfirmButton: false, timer: 2500 });
            return;
        }
        const validIds = selectedPlayers.filter(Boolean) as string[];
        setSaving(true);
        try {
            await CreateTeam({ teamName: teamName.trim(), teamSize: teamSize as number, playerIds: validIds });
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Team created!", showConfirmButton: false, timer: 2500 });
            setTeamName(""); setTeamSize(""); setSelectedPlayers([]);
            onSave();
            onClose();
        } catch {
            Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to create team", showConfirmButton: false, timer: 2500 });
        } finally {
            setSaving(false);
        }
    };

    if (!show) return null;

    return (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ backgroundColor: "#060413", border: "1px solid rgba(224,211,24,0.15)", borderRadius: "16px", padding: "32px", width: "520px", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 4px 120px rgba(97,71,6,0.8)" }}>
                <h4 style={{ color: "#e0d318d4", fontFamily: "'Lobster Two', cursive", letterSpacing: "2px", textAlign: "center", marginBottom: "24px" }}>
                    Create Team
                </h4>

                {/* Team Name */}
                <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Team Name</label>
                    <input
                        className="form-control"
                        value={teamName}
                        onChange={e => setTeamName(e.target.value)}
                        placeholder="Enter team name"
                        style={inputStyle}
                    />
                </div>

                {/* Team Size */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={labelStyle}>Team Size (number of players)</label>
                    <input
                        className="form-control"
                        type="number"
                        min={1}
                        max={20}
                        value={teamSize}
                        onChange={e => handleSizeChange(e.target.value)}
                        placeholder="e.g. 5"
                        style={inputStyle}
                    />
                </div>

                {/* Player selects — rendered based on teamSize */}
                {typeof teamSize === "number" && teamSize > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ ...labelStyle, marginBottom: "12px", display: "block" }}>
                            Select Players ({teamSize} slots)
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {Array.from({ length: teamSize }).map((_, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ color: "#e0d318a0", fontSize: "0.75rem", minWidth: "20px" }}>
                                        {i + 1}.
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <Select
                                            options={playerOptions.filter(o =>
                                                !selectedPlayers.includes(o.value) || selectedPlayers[i] === o.value
                                            )}
                                            value={playerOptions.find(o => o.value === selectedPlayers[i]) ?? null}
                                            onChange={opt => handlePlayerSelect(i, opt?.value ?? null)}
                                            styles={customStyles}
                                            placeholder={`Player ${i + 1}`}
                                            isClearable
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "8px" }}>
                    <button onClick={handleSave} disabled={saving} style={confirmBtnStyle}>
                        {saving ? "Saving..." : "Create Team"}
                    </button>
                    <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

// ─── Edit Team Modal ──────────────────────────────────────────────────────────
interface EditTeamModalProps {
    show: boolean;
    team: Team | null;
    players: Player[];
    onClose: () => void;
    onSave: () => void;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({ show, team, players, onClose, onSave }) => {
    const [teamName, setTeamName] = useState("");
    const [teamSize, setTeamSize] = useState<number>(0);
    const [selectedPlayers, setSelectedPlayers] = useState<(string | null)[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (team) {
            setTeamName(team.teamName);
            setTeamSize(team.teamSize);
            const slots: (string | null)[] = Array(team.teamSize).fill(null);
            team.playerIds.forEach((id, i) => { if (i < team.teamSize) slots[i] = id; });
            setSelectedPlayers(slots);
        }
    }, [team]);

    const playerOptions = players.map(p => ({ value: p.playerId, label: `${p.firstName} ${p.lastName}` }));

    const handleSizeChange = (val: string) => {
        const n = parseInt(val);
        if (!isNaN(n) && n > 0) {
            setTeamSize(n);
            setSelectedPlayers(prev => {
                const updated = [...prev];
                while (updated.length < n) updated.push(null);
                return updated.slice(0, n);
            });
        }
    };

    const handlePlayerSelect = (index: number, value: string | null) => {
        const updated = [...selectedPlayers];
        updated[index] = value;
        setSelectedPlayers(updated);
    };

    const handleSave = async () => {
        if (!team) return;
        if (!teamName.trim()) return;
        const validIds = selectedPlayers.filter(Boolean) as string[];
        setSaving(true);
        try {
            await UpdateTeam(team.teamId, { teamName: teamName.trim(), teamSize, playerIds: validIds });
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Team updated!", showConfirmButton: false, timer: 2500 });
            onSave();
            onClose();
        } catch {
            Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to update team", showConfirmButton: false, timer: 2500 });
        } finally {
            setSaving(false);
        }
    };

    if (!show || !team) return null;

    return (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ backgroundColor: "#060413", border: "1px solid rgba(224,211,24,0.15)", borderRadius: "16px", padding: "32px", width: "520px", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 4px 120px rgba(97,71,6,0.8)" }}>
                <h4 style={{ color: "#e0d318d4", fontFamily: "'Lobster Two', cursive", letterSpacing: "2px", textAlign: "center", marginBottom: "24px" }}>
                    Edit Team
                </h4>

                <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Team Name</label>
                    <input className="form-control" value={teamName} onChange={e => setTeamName(e.target.value)} style={inputStyle} />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={labelStyle}>Team Size</label>
                    <input className="form-control" type="number" min={1} max={20} value={teamSize} onChange={e => handleSizeChange(e.target.value)} style={inputStyle} />
                </div>

                {teamSize > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ ...labelStyle, marginBottom: "12px", display: "block" }}>Players ({teamSize} slots)</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {Array.from({ length: teamSize }).map((_, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ color: "#e0d318a0", fontSize: "0.75rem", minWidth: "20px" }}>{i + 1}.</span>
                                    <div style={{ flex: 1 }}>
                                        <Select
                                            options={playerOptions.filter(o => !selectedPlayers.includes(o.value) || selectedPlayers[i] === o.value)}
                                            value={playerOptions.find(o => o.value === selectedPlayers[i]) ?? null}
                                            onChange={opt => handlePlayerSelect(i, opt?.value ?? null)}
                                            styles={customStyles}
                                            placeholder={`Player ${i + 1}`}
                                            isClearable
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "8px" }}>
                    <button onClick={handleSave} disabled={saving} style={confirmBtnStyle}>{saving ? "Saving..." : "Save Changes"}</button>
                    <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const TeamsConsole: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editTeam, setEditTeam] = useState<Team | null>(null);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const loadAll = async () => {
        try {
            const [teamData, playerData] = await Promise.all([GetAllTeams(), getPlayer()]);
            setTeams(teamData);
            setPlayers(playerData);
        } catch {
            Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to load data", showConfirmButton: false, timer: 2500 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAll(); }, []);

    const handleDelete = async (team: Team) => {
        const confirm = await Swal.fire({
            title: "Delete Team?",
            text: `This will delete "${team.teamName}".`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!"
        });
        if (!confirm.isConfirmed) return;
        try {
            await DeleteTeam(team.teamId);
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Team deleted", showConfirmButton: false, timer: 2500 });
            loadAll();
        } catch {
            Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Failed to delete", showConfirmButton: false, timer: 2500 });
        }
    };

    const getPlayerName = (playerId: string) => {
        const p = players.find(pl => pl.playerId === playerId);
        return p ? `${p.firstName} ${p.lastName}` : playerId;
    };

    return (
        <div className="console-page">
            <ConsoleHeader title="Teams" subtitle="Manage teams and their members" />

            <div className="create-button d-flex justify-content-end p-2">
                <Button className="btn-create" onClick={() => setShowAdd(true)}>+ Add Team</Button>
            </div>

            <div className="console-table-container">
                {loading ? (
                    <div style={{ textAlign: "center", color: "#e0d318a0", padding: "40px", letterSpacing: "2px" }}>Loading teams...</div>
                ) : teams.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#bfd0e150", padding: "40px" }}>
                        <p style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>No teams created yet.</p>
                    </div>
                ) : (
                <>
                    <Table className="leaderboard-header-table" bordered>
                        <thead>
                            <tr>
                                <th style={{ width: "60px", fontSize: "20px" }}>#No</th>
                                <th style={{ textAlign: "center", fontSize: "20px" }}>Team Name</th>
                                <th style={{ width: "160px", textAlign: "center", fontSize: "20px" }}>Action</th>
                            </tr>
                        </thead>
                    </Table>
                    <Accordion
                        className="leaderboard-accordion"
                        activeKey={activeKey ?? undefined}
                        onSelect={k => setActiveKey(k as string | null)}
                    >
                        {teams.map((team, index) => (
                            <Accordion.Item eventKey={String(index)} key={team.teamId}>
                                <Accordion.Header>
                                    <div className="d-flex w-100 pe-3 align-items-center justify-content-between">
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <span style={{ color: "#e0d318a0", fontSize: "1rem", minWidth: "24px" }}>
                                                {index + 1}.
                                            </span>
                                            <span style={{ fontWeight: "bold",fontSize:"1rem" }}>{team.teamName}</span>
                                            <span style={{ color: "#bfd0e150", fontSize: "0.75rem" }}>
                                                ({team.members?.length ?? 0}/{team.teamSize} players)
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", gap: "8px" }} onClick={e => e.stopPropagation()}>
                                            <Button className="btn-edit" style={{  padding: "7px 14px" }}
                                                onClick={() => setEditTeam(team)}>
                                                Edit
                                            </Button>
                                            <Button className="btn-delete" style={{  padding: "7px 14px" }}
                                                onClick={() => handleDelete(team)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="leaderboard-inner-table-wrapper">
                                        {team.members && team.members.length > 0 ? (
                                            <table className="leaderboard-inner-table w-100" >
                                                <thead >
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Player ID</th>
                                                        <th>Name</th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {team.members.map((member, i) => (
                                                        <tr key={member.playerId}>
                                                            <td>{i + 1}</td>
                                                            <td>{member.playerId}</td>
                                                            <td>{member.firstName} {member.lastName}</td>
                                                            
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p style={{ color: "#bfd0e150", fontSize: "0.85rem", margin: 0, padding: "8px" }}>
                                                No players assigned yet.
                                            </p>
                                        )}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </>
                    
                )}
            </div>

            <AddTeamModal
                show={showAdd}
                players={players}
                onClose={() => setShowAdd(false)}
                onSave={loadAll}
            />
            <EditTeamModal
                show={!!editTeam}
                team={editTeam}
                players={players}
                onClose={() => setEditTeam(null)}
                onSave={loadAll}
            />
        </div>
    );
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
    color: "#e0d318d4",
    fontSize: "0.75rem",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "6px",
    display: "block",
};

const inputStyle: React.CSSProperties = {
    backgroundColor: "#0d0c18",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#bfd0e1d1",
    borderRadius: "8px",
};

const confirmBtnStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #510dfd",
    color: "#a78bfa",
    padding: "8px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    letterSpacing: "1px",
    fontSize: "0.85rem",
};

const cancelBtnStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #767976",
    color: "#c8d0c8",
    padding: "8px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    letterSpacing: "1px",
    fontSize: "0.85rem",
};