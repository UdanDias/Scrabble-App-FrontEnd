import React, { useEffect, useState } from "react";
import Select from "react-select";
import GetTournaments from "../service/tournament/GetTournaments";
import GetSwissPairings from "../service/performance/GetSwissPairings";
import { GetTeamSwissPairings } from "../service/team/GetTeamSwissPairings";
import { jsPDF } from "jspdf";

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

interface TeamPairingDTO {
    boardNumber: number;
    groupNumber: number;
    bye: boolean;
    team1Id: string;
    team1Name: string;
    team1Wins: number;
    team1Rank: number;
    team2Id: string | null;
    team2Name: string | null;
    team2Wins: number;
    team2Rank: number;
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
        minWidth: "200px",
        "&:hover": { outline: "none", borderColor: "rgba(224, 211, 24, 0.6)", boxShadow: "none" },
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
    dropdownIndicator: (base: any) => ({ ...base, color: "rgba(224, 211, 24, 0.6)", "&:hover": { color: "#e0d318d4" } }),
    indicatorSeparator: (base: any) => ({ ...base, backgroundColor: "rgba(224, 211, 24, 0.2)" }),
    menu: (base: any) => ({ ...base, backgroundColor: "#0d0c18", border: "1px solid rgba(224, 211, 24, 0.2)", borderRadius: "8px", zIndex: 9999 }),
    menuList: (base: any) => ({ ...base, backgroundColor: "#0d0c18", borderRadius: "8px", padding: 0 }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    placeholder: (base: any) => ({ ...base, color: "#e0d318d4", textAlign: "center" as const }),
    input: (base: any) => ({ ...base, color: "#e0d318d4" }),
};

const tournamentTypeOptions = [
    { value: "individual", label: "Individual" },
    { value: "team", label: "Team" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const PairingsConsole: React.FC = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<{ value: string; label: string } | null>(null);
    const [tournamentType, setTournamentType] = useState<"individual" | "team">("individual");
    const [pairings, setPairings] = useState<PairingDTO[]>([]);
    const [teamPairings, setTeamPairings] = useState<TeamPairingDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [tournamentsLoading, setTournamentsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = 210;
        const marginX = 10;
        const tableWidth = pageWidth - marginX * 2;
        const rowHeight = 10;

        const tournamentLabel = selectedTournament?.label ?? "Tournament";
        const isIndividual = tournamentType === "individual";
        const byeName = isIndividual
            ? (byePairing?.player1Name ?? "None")
            : (teamByePairing?.team1Name ?? "None");

        // ── Column widths ──
        const boardColW = 18;
        const vsColW = 14;
        const winsColW = 28;
        const nameColW = (tableWidth - boardColW - vsColW - winsColW) / 2;

        const drawDarkBackground = () => {
            doc.setFillColor(6, 4, 19);
            doc.rect(0, 0, 210, 297, "F");
        };

        drawDarkBackground();

        // ── Title: Tournament Name ──
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(224, 211, 24);
        doc.text(tournamentLabel.toUpperCase(), pageWidth / 2, 18, { align: "center" });

        // ── Subtitle: PAIRINGS ──
        doc.setFontSize(10);
        doc.setTextColor(191, 208, 225);
        doc.setFont("helvetica", "normal");
        doc.text("PAIRINGS", pageWidth / 2, 25, { align: "center" });

        // // ── Type label ──
        // doc.setFontSize(8);
        // doc.setTextColor(120, 120, 120);
        // doc.text(isIndividual ? "INDIVIDUAL" : "TEAM", pageWidth / 2, 31, { align: "center" });

        // ── Stat row: BOARDS + BYE ──
        const statY = 36;
        const statBoxW = 40;
        const statBoxH = 14;

        // // Boards box
        // doc.setFillColor(13, 12, 24);
        // doc.setDrawColor(224, 211, 24, );
        // doc.setLineWidth(0.2);
        // doc.roundedRect(marginX, statY, statBoxW, statBoxH, 2, 2, "FD");
        // doc.setFontSize(6);
        // doc.setTextColor(224, 211, 24);
        // doc.setFont("helvetica", "normal");
        // doc.text("BOARDS", marginX + statBoxW / 2, statY + 5, { align: "center" });
        // doc.setFontSize(9);
        // doc.setTextColor(218, 230, 242);
        // doc.setFont("helvetica", "bold");
        // doc.text(
        //     String(isIndividual ? boards : teamBoards),
        //     marginX + statBoxW / 2, statY + 11, { align: "center" }
        // );

        // // Bye box
        // const byeName = isIndividual
        //     ? (byePairing?.player1Name ?? "None")
        //     : (teamByePairing?.team1Name ?? "None");

        // doc.setFillColor(13, 12, 24);
        // doc.roundedRect(marginX + statBoxW + 6, statY, statBoxW + 20, statBoxH, 2, 2, "FD");
        // doc.setFontSize(6);
        // doc.setTextColor(224, 211, 24);
        // doc.setFont("helvetica", "normal");
        // doc.text("BYE", marginX + statBoxW + 6 + (statBoxW + 20) / 2, statY + 5, { align: "center" });
        // doc.setFontSize(8);
        // doc.setTextColor(218, 230, 242);
        // doc.setFont("helvetica", "bold");
        // doc.text(byeName, marginX + statBoxW + 6 + (statBoxW + 20) / 2, statY + 11, { align: "center" });

        // // ── Bye box — centered ──
        // const byeBoxW = statBoxW + 20;
        // const byeBoxX = (pageWidth - byeBoxW) / 2;  // ✅ centered on page

        // doc.setFillColor(13, 12, 24);
        // doc.roundedRect(byeBoxX, statY, byeBoxW, statBoxH, 2, 2, "FD");
        // doc.setFontSize(6);
        // doc.setTextColor(224, 211, 24);
        // doc.setFont("helvetica", "normal");
        // doc.text("BYE", byeBoxX + byeBoxW / 2, statY + 5, { align: "center" });
        // doc.setFontSize(8);
        // doc.setTextColor(218, 230, 242);
        // doc.setFont("helvetica", "bold");
        // doc.text(byeName, byeBoxX + byeBoxW / 2, statY + 11, { align: "center" });

       // ── Gold divider ──
        doc.setDrawColor(224, 211, 24);
        doc.setLineWidth(0.4);
        doc.line(marginX, 32, pageWidth - marginX, 32);  // ✅ fixed Y instead of statY + statBoxH + 4

        // ── Header row ──
        const headerY = 35;  // ✅ fixed Y instead of statY + statBoxH + 7
        doc.setFillColor(0, 0, 0);
        doc.rect(marginX, headerY, tableWidth, rowHeight, "F");

        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(224, 211, 24);

        const col1X = marginX + boardColW / 2;
        const col2X = marginX + boardColW + nameColW / 2;
        const col3X = marginX + boardColW + nameColW + vsColW / 2;
        const col4X = marginX + boardColW + nameColW + vsColW + nameColW / 2;
        const col5X = marginX + boardColW + nameColW * 2 + vsColW + winsColW / 2;

        doc.text("BOARD", col1X, headerY + 6.5, { align: "center" });
        doc.text(isIndividual ? "PLAYER 1" : "TEAM 1", col2X, headerY + 6.5, { align: "center" });
        doc.text("VS", col3X, headerY + 6.5, { align: "center" });
        doc.text(isIndividual ? "PLAYER 2" : "TEAM 2", col4X, headerY + 6.5, { align: "center" });
        doc.text("WINS", col5X, headerY + 6.5, { align: "center" });

        // Column dividers in header
        doc.setDrawColor(40, 40, 60);
        doc.setLineWidth(0.2);
        [boardColW, boardColW + nameColW, boardColW + nameColW + vsColW, boardColW + nameColW * 2 + vsColW].forEach(offset => {
            doc.line(marginX + offset, headerY, marginX + offset, headerY + rowHeight);
        });

        // ── Data rows ──
        const pairingRows = isIndividual
            ? pairings.filter(p => !p.bye).map(p => ({
                board: p.boardNumber,
                name1: p.player1Name,
                name2: p.player2Name ?? "—",
                wins: `${winsDisplay(p.player1Wins)}W · ${winsDisplay(p.player2Wins)}W`,
                isBye: false,
            }))
            : teamPairings.filter(p => !p.bye).map(p => ({
                board: p.boardNumber,
                name1: p.team1Name,
                name2: p.team2Name ?? "—",
                wins: `${winsDisplay(p.team1Wins)}W · ${winsDisplay(p.team2Wins)}W`,
                isBye: false,
            }));

        // Add bye row at end
        if (isIndividual && byePairing) {
            pairingRows.push({
                board: byePairing.boardNumber,
                name1: byePairing.player1Name,
                name2: "BYE",
                wins: `${winsDisplay(byePairing.player1Wins)}W`,
                isBye: true,
            });
        } else if (!isIndividual && teamByePairing) {
            pairingRows.push({
                board: teamByePairing.boardNumber,
                name1: teamByePairing.team1Name,
                name2: "BYE",
                wins: `${winsDisplay(teamByePairing.team1Wins)}W`,
                isBye: true,
            });
        }

        let currentY = headerY + rowHeight;
        const maxY = 282;

        pairingRows.forEach((row, index) => {
            if (currentY + rowHeight > maxY) {
                doc.addPage();
                drawDarkBackground();
                currentY = 15;
            }

            // Alternating background
            const isEven = index % 2 === 0;
            doc.setFillColor(...(isEven ? [6, 4, 19] as [number, number, number] : [13, 12, 24] as [number, number, number]));
            doc.rect(marginX, currentY, tableWidth, rowHeight, "F");

            doc.setFontSize(7.5);
            doc.setFont("helvetica", "normal");

            // Board #
            doc.setTextColor(224, 211, 24);
            doc.setFont("helvetica", "bold");
            doc.text(`#${row.board}`, col1X, currentY + 6.5, { align: "center" });

            // Player 1
            doc.setTextColor(191, 208, 225);
            doc.setFont("helvetica", "normal");
            doc.text(row.name1 ?? "", col2X, currentY + 6.5, { align: "center", maxWidth: nameColW - 4 });

            // VS
            const vsColor: [number, number, number] = row.isBye ? [82, 147, 238] : [100, 100, 120];
            doc.setTextColor(...vsColor);
            doc.setFont("helvetica", "bold");
            doc.text(row.isBye ? "BYE" : "VS", col3X, currentY + 6.5, { align: "center" });

            // ✅ assign color array first, then spread
            const player2Color: [number, number, number] = row.isBye ? [100, 100, 120] : [191, 208, 225];
            doc.setTextColor(...player2Color);
            doc.setFont("helvetica", "normal");
            doc.text(row.isBye ? "—" : (row.name2 ?? ""), col4X, currentY + 6.5, { align: "center", maxWidth: nameColW - 4 });

            // Wins
            doc.setTextColor(150, 160, 180);
            doc.text(row.wins, col5X, currentY + 6.5, { align: "center" });

            // Column dividers
            doc.setDrawColor(30, 28, 45);
            doc.setLineWidth(0.2);
            [boardColW, boardColW + nameColW, boardColW + nameColW + vsColW, boardColW + nameColW * 2 + vsColW].forEach(offset => {
                doc.line(marginX + offset, currentY, marginX + offset, currentY + rowHeight);
            });

            // Bottom border
            doc.setDrawColor(30, 28, 45);
            doc.setLineWidth(0.1);
            doc.line(marginX, currentY + rowHeight, marginX + tableWidth, currentY + rowHeight);

            currentY += rowHeight;
        });

        // ── Footer ──
        doc.setFontSize(7);
        doc.setTextColor(80, 80, 80);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 292, { align: "center" });

        doc.save(`pairings-${tournamentLabel}.pdf`);
    };

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

    useEffect(() => {
        if (!selectedTournament) {
            setPairings([]);
            setTeamPairings([]);
            return;
        }
        fetchPairings(selectedTournament.value, tournamentType);
    }, [selectedTournament, tournamentType]);

    const fetchPairings = async (tournamentId: string, type: "individual" | "team") => {
        setLoading(true);
        setError(null);
        try {
            if (type === "individual") {
                const data: PairingDTO[] = await GetSwissPairings(tournamentId);
                setPairings(data);
                setTeamPairings([]);
            } else {
                const data: TeamPairingDTO[] = await GetTeamSwissPairings(tournamentId);
                setTeamPairings(data);
                setPairings([]);
            }
        } catch {
            setError(`Could not load ${type} pairings for this tournament.`);
            setPairings([]);
            setTeamPairings([]);
        } finally {
            setLoading(false);
        }
    };

    const tournamentOptions = tournaments.map(t => ({ value: t.tournamentId, label: t.tournamentName }));
    const winsDisplay = (w: number) => (w % 1 === 0 ? w.toString() : w.toFixed(1));

    // Individual derived values
    const boards = pairings.filter(p => !p.bye).length;
    const byePairing = pairings.find(p => p.bye) ?? null;
    const groupedPairings = new Map<number, PairingDTO[]>();
    pairings.filter(p => !p.bye).forEach(p => {
        if (!groupedPairings.has(p.groupNumber)) groupedPairings.set(p.groupNumber, []);
        groupedPairings.get(p.groupNumber)!.push(p);
    });

    // Team derived values
    const teamBoards = teamPairings.filter(p => !p.bye).length;
    const teamByePairing = teamPairings.find(p => p.bye) ?? null;
    const groupedTeamPairings = new Map<number, TeamPairingDTO[]>();
    teamPairings.filter(p => !p.bye).forEach(p => {
        if (!groupedTeamPairings.has(p.groupNumber)) groupedTeamPairings.set(p.groupNumber, []);
        groupedTeamPairings.get(p.groupNumber)!.push(p);
    });

    const activePairings = tournamentType === "individual" ? pairings : teamPairings;
    const hasData = activePairings.length > 0;

    return (
        <div className="console-page" style={{ padding: "30px 20px" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <h2 style={{ fontFamily: "'Cinzel Decorative', cursive", color: "#e0d318", letterSpacing: "6px", fontSize: "1.8rem", textShadow: "0 0 30px rgba(224,211,24,.4)", marginBottom: "6px" }}>
                    PAIRINGS
                </h2>
                <p style={{ color: "#bfd0e1a0", fontSize: "0.85rem", letterSpacing: "1px" }}>
                    Swiss system pairings for selected tournament
                </p>
            </div>

            {/* Selectors row */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "36px", flexWrap: "wrap" }}>
                {/* Tournament type */}
                <Select
                    options={tournamentTypeOptions}
                    value={tournamentTypeOptions.find(o => o.value === tournamentType)}
                    onChange={opt => {
                        setTournamentType((opt?.value ?? "individual") as "individual" | "team");
                    }}
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                />
                {/* Tournament */}
                <Select
                    options={tournamentOptions}
                    value={selectedTournament}
                    onChange={opt => setSelectedTournament(opt)}
                    styles={{ ...customStyles, control: (b: any, s: any) => ({ ...customStyles.control(b, s), minWidth: "320px" }) }}
                    placeholder={tournamentsLoading ? "Loading..." : "Select a Tournament"}
                    isLoading={tournamentsLoading}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                />
                {hasData && (
                    <button
                        onClick={handleDownloadPDF}
                        style={{
                            background: "#11110fd4",
                            border: "1px solid rgba(224, 211, 24, 0.6)",
                            color: "#e0d318d4",
                            borderRadius: "6px",
                            padding: "6px 14px",
                            fontSize: "0.85rem",
                            letterSpacing: "1px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                        onMouseEnter={e => {
                            const btn = e.currentTarget;
                            btn.style.backgroundColor = "rgba(224, 211, 24, 0.15)";
                            btn.style.color = "#ffffff";
                            btn.style.boxShadow = "0 0 10px rgba(224,211,24,0.3)";
                        }}
                        onMouseLeave={e => {
                            const btn = e.currentTarget;
                            btn.style.backgroundColor = "#11110fd4";
                            btn.style.color = "#e0d318d4";
                            btn.style.boxShadow = "none";
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e0d318d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download PDF
                    </button>
                )}
                
            </div>

            {/* Error */}
            {error && (
                <div style={{ textAlign: "center", color: "#e05959", border: "1px solid #c93131", borderRadius: "8px", padding: "12px 20px", width: "fit-content", margin: "0 auto 24px auto", fontSize: "0.85rem" }}>
                    {error}
                </div>
            )}

            {/* Empty prompt */}
            {!selectedTournament && !error && (
                <div style={{ textAlign: "center", color: "#bfd0e150", marginTop: "60px" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="rgba(224,211,24,0.2)" strokeWidth="1" style={{ width: 60, height: 60, margin: "0 auto 16px auto", display: "block" }}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <p style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>Select a tournament to generate pairings</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: "center", color: "#e0d318a0", marginTop: "60px", letterSpacing: "2px" }}>Generating pairings...</div>
            )}

            {/* ── INDIVIDUAL Pairings table ── */}
            {!loading && selectedTournament && tournamentType === "individual" && pairings.length > 0 && (
                <div className="console-table-container" style={{ width: "90%", margin: "0 auto" }}>
                    {/* Stats strip */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <StatCard label="BOARDS" value={boards} />
                        </div>
                        <div style={{ flex: 1, display: "flex", justifyContent: "center", marginLeft: "-125px" }}>
                            <StatCard label="BYE" value={byePairing ? byePairing.player1Name! : "None"} />
                        </div>
                    </div>

                    <div className="console-table-wrapper">
                        <table className="table console-table mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: "80px",textAlign: "center" }}>BOARD</th>
                                    <th style={{ textAlign: "center" }}>PLAYER 1</th>
                                    <th style={{ textAlign: "center", width: "60px" }}>VS</th>
                                    <th style={{ textAlign: "center" }}>PLAYER 2</th>
                                    <th style={{ width: "120px", textAlign: "center" }}>WINS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from(groupedPairings.entries()).map(([groupNum, groupPairings]) => (
                                    <React.Fragment key={groupNum}>
                                        {groupPairings.map(pair => (
                                            <tr key={pair.boardNumber}>
                                                <td style={{ textAlign: "center" }}><span style={{ color: "#e0d318a0", fontWeight: "bold", fontSize: "0.85rem" }}>#{pair.boardNumber}</span></td>
                                                <td style={{ textAlign: "center" }}>{pair.player1Name}</td>
                                                <td style={{ textAlign: "center" }}><span style={{ color: "#bfd0e150", fontWeight: "bold", fontSize: "0.75rem", letterSpacing: "1px" }}>VS</span></td>
                                                <td style={{ textAlign: "center" }}>{pair.player2Name}</td>
                                                <td style={{ textAlign: "center" }}><span style={{ color: "#bfd0e180", fontSize: "0.82rem" }}>{winsDisplay(pair.player1Wins)}W · {winsDisplay(pair.player2Wins)}W</span></td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                                {byePairing && (
                                    <React.Fragment>
                                        
                                        <tr>
                                            <td style={{ textAlign: "center" }}>
                                                <span style={{ color: "#e0d318a0", fontWeight: "bold", fontSize: "0.85rem" }}>
                                                    #{byePairing.boardNumber}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "center" }}>{byePairing.player1Name}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <span className="badge-game-bye" style={{ fontSize: "0.7rem" }}>BYE</span>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
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

            {/* ── TEAM Pairings table ── */}
            {!loading && selectedTournament && tournamentType === "team" && teamPairings.length > 0 && (
                <div className="console-table-container" style={{ width: "90%", margin: "0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <StatCard label="BOARDS" value={teamBoards} />
                        </div>
                        <div style={{ flex: 1, display: "flex", justifyContent: "center", marginLeft: "-125px" }}>
                            <StatCard label="BYE" value={teamByePairing ? teamByePairing.team1Name : "None"} />
                        </div>
                    </div>

                    <div className="console-table-wrapper">
                        <table className="table console-table mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: "80px" }}>BOARD</th>
                                    <th>TEAM 1</th>
                                    <th style={{ textAlign: "center", width: "60px" }}>VS</th>
                                    <th>TEAM 2</th>
                                    <th style={{ width: "120px", textAlign: "center" }}>WINS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from(groupedTeamPairings.entries()).map(([groupNum, groupPairings]) => (
                                    <React.Fragment key={groupNum}>
                                        {groupPairings.map(pair => (
                                            <tr key={pair.boardNumber}>
                                                <td><span style={{ color: "#e0d318a0", fontWeight: "bold", fontSize: "0.85rem" }}>#{pair.boardNumber}</span></td>
                                                <td>{pair.team1Name}</td>
                                                <td style={{ textAlign: "center" }}><span style={{ color: "#bfd0e150", fontWeight: "bold", fontSize: "0.75rem", letterSpacing: "1px" }}>VS</span></td>
                                                <td>{pair.team2Name}</td>
                                                <td style={{ textAlign: "center" }}><span style={{ color: "#bfd0e180", fontSize: "0.82rem" }}>{winsDisplay(pair.team1Wins)}W · {winsDisplay(pair.team2Wins)}W</span></td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                                {teamByePairing && (
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan={5} style={{ borderTop: "1px solid rgba(29,97,193,0.3)", padding: "6px 14px", fontSize: "0.68rem", letterSpacing: "2px", color: "#5293ee80", textTransform: "uppercase", backgroundColor: "#060413" }}>Bye</td>
                                        </tr>
                                        <tr>
                                            <td><span style={{ color: "#e0d318a0", fontWeight: "bold", fontSize: "0.85rem" }}>#{teamByePairing.boardNumber}</span></td>
                                            <td>{teamByePairing.team1Name}</td>
                                            <td style={{ textAlign: "center" }}><span className="badge-game-bye" style={{ fontSize: "0.7rem" }}>BYE</span></td>
                                            <td><span style={{ color: "#bfd0e140", fontStyle: "italic" }}>—</span></td>
                                            <td style={{ textAlign: "center" }}><span style={{ color: "#5293ee", fontSize: "0.85rem" }}>{winsDisplay(teamByePairing.team1Wins)}W</span></td>
                                        </tr>
                                    </React.Fragment>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loading && selectedTournament && !hasData && !error && (
                <div style={{ textAlign: "center", color: "#bfd0e150", marginTop: "60px" }}>
                    <p style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>
                        No {tournamentType === "team" ? "teams" : "players"} found for this tournament yet.
                    </p>
                </div>
            )}
        </div>
    );
};

// ─── Reusable stat card ───────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div style={{ background: "#0d0c18", border: "1px solid rgba(224,211,24,0.15)", borderRadius: "8px", padding: "10px 20px", textAlign: "center", minWidth: "130px" }}>
        <div style={{ color: "#e0d318a0", fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
        <div style={{ color: "#dae6f2d1", fontWeight: "bold", fontSize: "0.95rem" }}>{value}</div>
    </div>
);