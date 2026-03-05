import React, { useEffect, useState } from "react";
import Select from "react-select";
import GetTournaments from "../service/tournament/GetTournaments";
import GetSwissPairings from "../service/performance/GetSwissPairings";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PairingDTO {
    boardNumber: number;
    player1Id: string;
    player1Name: string;
    player1Wins: number;
    player1Rank: number;
    player2Id: string | null;
    player2Name: string | null;
    player2Wins: number;
    player2Rank: number;
    bye: boolean;
    groupNumber: number;
}

interface Tournament {
    tournamentId: string;
    tournamentName: string;
}

// ─── React-Select styles ──────────────────────────────────────────────────────
const customStyles = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: "#0d0c18",
        border: `1px solid ${state.isFocused ? "rgba(224, 211, 24, 0.8)" : "#151321"}`,
        borderRadius: "8px",
        boxShadow: "none",
        outline: "none",
        minWidth: "320px",
        "&:hover": {
            outline: "none",
            borderColor: "rgba(224, 211, 24, 0.6)",
            boxShadow: "none",
        },
    }),
    valueContainer: (base: any) => ({ ...base, justifyContent: "center" }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused ? "rgba(224, 211, 24, 0.15)" : "#0d0c18",
        color: state.isSelected ? "#dae6f2d1" : state.isFocused ? "#e0d31877" : "#dae6f2d1",
        cursor: "pointer",
        textAlign: "center" as const,
        "&:active": { backgroundColor: "rgba(6, 6, 2, 0.25)" },
    }),
    singleValue: (base: any) => ({ ...base, color: "#dae6f2d1", textAlign: "center" as const }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: "rgba(224, 211, 24, 0.6)",
        "&:hover": { color: "#e0d318d4" },
    }),
    indicatorSeparator: (base: any) => ({ ...base, backgroundColor: "rgba(224, 211, 24, 0.2)" }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: "#0d0c18",
        border: "1px solid rgba(224, 211, 24, 0.2)",
        borderRadius: "8px",
        zIndex: 9999,
    }),
    menuList: (base: any) => ({ ...base, backgroundColor: "#0d0c18", borderRadius: "8px", padding: 0 }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    placeholder: (base: any) => ({ ...base, color: "#e0d318d4", textAlign: "center" as const }),
    input: (base: any) => ({ ...base, color: "#e0d318d4" }),
};

// ─── Component ────────────────────────────────────────────────────────────────
export const PairingsConsole: React.FC = () => {
    const BASE_URL = "http://localhost:8081/api/v1";

    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<{ value: string; label: string } | null>(null);
    const [pairings, setPairings] = useState<PairingDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [tournamentsLoading, setTournamentsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch tournaments on mount
    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const data: Tournament[] = await GetTournaments();
                setTournaments(data);
            } catch {
                setError("Could not load tournaments.");
            } finally {
                setTournamentsLoading(false);
            }
        };
        fetchTournaments();
    }, []);

    // Fetch pairings from backend when tournament changes
    useEffect(() => {
    if (!selectedTournament) {
        setPairings([]);
        return;
    }
    const fetchPairings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data: PairingDTO[] = await GetSwissPairings(selectedTournament.value);
            setPairings(data);
        } catch {
            setError("Could not load pairings for this tournament.");
            setPairings([]);
        } finally {
            setLoading(false);
        }
    };
    fetchPairings();
}, [selectedTournament]);

    const tournamentOptions = tournaments.map((t) => ({
        value: t.tournamentId,
        label: t.tournamentName,
    }));

    const winsDisplay = (w: number) => (w % 1 === 0 ? w.toString() : w.toFixed(1));

    const boards = pairings.filter((p) => !p.bye).length;
    const byePairing = pairings.find((p) => p.bye) ?? null;

    // Group normal pairings by groupNumber for section dividers
    const groupedPairings = new Map<number, PairingDTO[]>();
    pairings.filter((p) => !p.bye).forEach((p) => {
        if (!groupedPairings.has(p.groupNumber)) groupedPairings.set(p.groupNumber, []);
        groupedPairings.get(p.groupNumber)!.push(p);
    });

    return (
        <div className="console-page" style={{ padding: "30px 20px" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <h2
                    style={{
                        fontFamily: "'Cinzel Decorative', cursive",
                        color: "#e0d318",
                        letterSpacing: "6px",
                        fontSize: "1.8rem",
                        textShadow: "0 0 30px rgba(224,211,24,.4)",
                        marginBottom: "6px",
                    }}
                >
                    PAIRINGS
                </h2>
                <p style={{ color: "#bfd0e1a0", fontSize: "0.85rem", letterSpacing: "1px" }}>
                    Swiss system pairings for selected tournament
                </p>
            </div>

            {/* Tournament Selector */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "36px" }}>
                <Select
                    options={tournamentOptions}
                    value={selectedTournament}
                    onChange={(opt) => setSelectedTournament(opt)}
                    styles={customStyles}
                    placeholder={tournamentsLoading ? "Loading tournaments..." : "Select a Tournament"}
                    isLoading={tournamentsLoading}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                />
            </div>

            {/* Error */}
            {error && (
                <div
                    style={{
                        textAlign: "center",
                        color: "#e05959",
                        border: "1px solid #c93131",
                        borderRadius: "8px",
                        padding: "12px 20px",
                        width: "fit-content",
                        margin: "0 auto 24px auto",
                        fontSize: "0.85rem",
                        letterSpacing: "0.5px",
                    }}
                >
                    {error}
                </div>
            )}

            {/* Empty prompt */}
            {!selectedTournament && !error && (
                <div style={{ textAlign: "center", color: "#bfd0e150", marginTop: "60px" }}>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(224,211,24,0.2)"
                        strokeWidth="1"
                        style={{ width: 60, height: 60, margin: "0 auto 16px auto", display: "block" }}
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <p style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>
                        Select a tournament to generate pairings
                    </p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: "center", color: "#e0d318a0", marginTop: "60px", letterSpacing: "2px" }}>
                    Generating pairings...
                </div>
            )}

            {/* Pairings table */}
            {!loading && selectedTournament && pairings.length > 0 && (
                <div className="console-table-container" style={{ width: "90%", margin: "0 auto" }}>

                    {/* Stats strip */}
                    {/* <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
                        {[
                            { label: "BOARDS", value: boards },
                            // { label: "GROUPS", value: groupedPairings.size },
                            { label: "BYE", value: byePairing ? byePairing.player1Name : "None" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                style={{
                                    background: "#0d0c18",
                                    border: "1px solid rgba(224,211,24,0.15)",
                                    borderRadius: "8px",
                                    padding: "10px 20px",
                                    textAlign: "center",
                                    minWidth: "130px",
                                }}
                            >
                                <div style={{ color: "#e0d318a0", fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>
                                    {stat.label}
                                </div>
                                <div style={{ color: "#dae6f2d1", fontWeight: "bold", fontSize: "0.95rem" }}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div> */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        {/* Left: BOARDS + GROUPS */}
                        <div style={{ display: "flex", gap:"16px" }}>
                            {[
                                { label: "BOARDS", value: boards },
                                // { label: "GROUPS", value: groupedPairings.size },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    style={{
                                        background: "#0d0c18",
                                        border: "1px solid rgba(224,211,24,0.15)",
                                        borderRadius: "8px",
                                        padding: "10px 20px",
                                        textAlign: "center",
                                        minWidth: "130px",
                                    }}
                                >
                                    <div style={{ color: "#e0d318a0", fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>
                                        {stat.label}
                                    </div>
                                    <div style={{ color: "#dae6f2d1", fontWeight: "bold", fontSize: "0.95rem" }}>
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: BYE centered in remaining space */}
                        <div style={{ flex: 1, display: "flex", justifyContent: "center",marginLeft: "-125px" }}>
                            <div
                                style={{
                                    background: "#0d0c18",
                                    border: "1px solid rgba(224,211,24,0.15)",
                                    borderRadius: "8px",
                                    padding: "10px 20px",
                                    textAlign: "center",
                                    minWidth: "130px",
                                }}
                            >
                                <div style={{ color: "#e0d318a0", fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>
                                    BYE
                                </div>
                                <div style={{ color: "#dae6f2d1", fontWeight: "bold", fontSize: "0.95rem" }}>
                                    {byePairing ? byePairing.player1Name : "None"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="console-table-wrapper">
                        <table className="table console-table mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: "80px" }}>BOARD</th>
                                    <th>PLAYER 1</th>
                                    <th style={{ textAlign: "center", width: "60px" }}>VS</th>
                                    <th>PLAYER 2</th>
                                    <th style={{ width: "120px", textAlign: "center" }}>WINS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from(groupedPairings.entries()).map(([groupNum, groupPairings]) => (
                                    <React.Fragment key={groupNum}>
                                        {/* Group divider */}
                                        {/* <tr>
                                            <td
                                                colSpan={5}
                                                style={{
                                                    borderTop: "1px solid rgba(224,211,24,0.12)",
                                                    padding: "6px 14px",
                                                    fontSize: "0.68rem",
                                                    letterSpacing: "2px",
                                                    color: "#e0d318a0",
                                                    textTransform: "uppercase",
                                                    backgroundColor: "#060413",
                                                }}
                                            >
                                                
                                            </td>
                                        </tr> */}

                                        {groupPairings.map((pair) => (
                                            <tr key={pair.boardNumber}>
                                                <td>
                                                    <span style={{ color: "#e0d318a0", fontWeight: "bold", fontSize: "0.85rem" }}>
                                                        #{pair.boardNumber}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        {/* <span style={{ fontSize: "0.7rem", color: "#e0d318a0", minWidth: "30px" }}>
                                                            #{pair.player1Rank}
                                                        </span> */}
                                                        {pair.player1Name}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <span style={{ color: "#bfd0e150", fontWeight: "bold", fontSize: "0.75rem", letterSpacing: "1px" }}>
                                                        VS
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        {/* <span style={{ fontSize: "0.7rem", color: "#e0d318a0", minWidth: "30px" }}>
                                                            #{pair.player2Rank}
                                                        </span> */}
                                                        {pair.player2Name}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <span style={{ color: "#bfd0e180", fontSize: "0.82rem" }}>
                                                        {winsDisplay(pair.player1Wins)}W · {winsDisplay(pair.player2Wins)}W
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}

                                {/* BYE row */}
                                {byePairing && (
                                    <React.Fragment>
                                        <tr>
                                            <td
                                                colSpan={5}
                                                style={{
                                                    borderTop: "1px solid rgba(29,97,193,0.3)",
                                                    padding: "6px 14px",
                                                    fontSize: "0.68rem",
                                                    letterSpacing: "2px",
                                                    color: "#5293ee80",
                                                    textTransform: "uppercase",
                                                    backgroundColor: "#060413",
                                                }}
                                            >
                                                Bye
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span style={{ color: "#e0d318a0", fontWeight: "bold", fontSize: "0.85rem" }}>
                                                    #{byePairing.boardNumber}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    {/* <span style={{ fontSize: "0.7rem", color: "#e0d318a0", minWidth: "30px" }}>
                                                        #{byePairing.player1Rank}
                                                    </span> */}
                                                    {byePairing.player1Name}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <span className="badge-game-bye" style={{ fontSize: "0.7rem" }}>BYE</span>
                                            </td>
                                            <td>
                                                <span style={{ color: "#bfd0e140", fontStyle: "italic" }}>—</span>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <span style={{ color: "#5293ee", fontSize: "0.85rem" }}>
                                                    {winsDisplay(byePairing.player1Wins)}W
                                                </span>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loading && selectedTournament && pairings.length === 0 && !error && (
                <div style={{ textAlign: "center", color: "#bfd0e150", marginTop: "60px" }}>
                    <p style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>
                        No players found for this tournament yet.
                    </p>
                </div>
            )}
        </div>
    );
};