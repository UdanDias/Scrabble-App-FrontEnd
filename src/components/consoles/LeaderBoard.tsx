import { useEffect, useState } from "react";
import { Accordion, Table } from "react-bootstrap";
import GetTournaments from "../service/tournament/GetTournaments";
import { GetLeaderBoardByTournament } from "../service/performance/GetLeaderBoardByTournament";
import { GetTeamLeaderboard } from "../service/team/GetTeamLeaderBoard";
import Swal from "sweetalert2";
import Select from "react-select";
import { ConsoleHeader } from "./ConsoleHeader";
import jsPDF from "jspdf";

interface RankedPlayerData {
    playerId: string;
    firstName: string;
    lastName: string;
    username: string;
    playerRank: number;
    totalWins: number;
    totalGamesPlayed: number;
    avgMargin: number;
    cumMargin: number;
    eloRating: number | null;
    provisional: boolean; // ✅ added
    previousEloRating: number | null;
}

interface RankedTeamData {
    teamId: string;
    teamName: string;
    teamRank: number;
    totalWins: number;
    totalGamesPlayed: number;
    avgMargin: number;
    cumMargin: number;
    members: { playerId: string; firstName: string; lastName: string }[];
}

interface Tournament {
    tournamentId: string;
    tournamentName: string;
}

const MINI_TOURNAMENT_NAME = "Mini Tournament Uok";
// const PROVISIONAL_THRESHOLD = 20;
const PROVISIONAL_THRESHOLD = 3;


const tournamentTypeOptions = [
    { value: "individual", label: "Individual" },
    { value: "team", label: "Team" },
];

export function LeaderBoard() {
    const [rankedPlayerData, SetRankedPlayerData] = useState<RankedPlayerData[]>([]);
    const [rankedTeamData, setRankedTeamData] = useState<RankedTeamData[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
    const [selectedTournamentName, setSelectedTournamentName] = useState<string>("");
    const [tournamentType, setTournamentType] = useState<"individual" | "team">("individual");
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const isMinitournament = selectedTournamentName === MINI_TOURNAMENT_NAME;

    const tournamentOptions = [
        { value: "", label: "Select a Tournament" },
        ...tournaments.map(t => ({ value: t.tournamentId, label: t.tournamentName }))
    ];

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = 210;
        const rowHeight = 10;
        const tournamentLabel = selectedTournamentName || "Tournament";
        const isIndividual = tournamentType === "individual";
        const showElo = isMinitournament && isIndividual;

        const rankColWidth = 20;
        const nameColWidth = 45;
        const gamesColW = 18;
        const winsColW = 16;
        const cumColW = 22;
        const oldColW = showElo ? 22 : 0;
        const newColW = showElo ? 22 : 0;
        const changeColW = showElo ? 22 : 0;
        const tableWidth = rankColWidth + nameColWidth + gamesColW + winsColW + cumColW + oldColW + newColW + changeColW;
        const marginX = (pageWidth - tableWidth) / 2;

        const col1X = marginX + rankColWidth / 2;
        const col2X = marginX + rankColWidth + nameColWidth / 2;
        const col3X = marginX + rankColWidth + nameColWidth + gamesColW / 2;
        const col4X = marginX + rankColWidth + nameColWidth + gamesColW + winsColW / 2;
        const col5X = marginX + rankColWidth + nameColWidth + gamesColW + winsColW + cumColW / 2;
        const col6X = showElo ? marginX + rankColWidth + nameColWidth + gamesColW + winsColW + cumColW + oldColW / 2 : 0;
        const col7X = showElo ? marginX + rankColWidth + nameColWidth + gamesColW + winsColW + cumColW + oldColW + newColW / 2 : 0;
        const col8X = showElo ? marginX + rankColWidth + nameColWidth + gamesColW + winsColW + cumColW + oldColW + newColW + changeColW / 2 : 0;

        doc.setFillColor(6, 4, 19);
        doc.rect(0, 0, 210, 297, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(224, 211, 24);
        doc.text(tournamentLabel, pageWidth / 2, 18, { align: "center" });
        doc.setFontSize(10);
        doc.setTextColor(191, 208, 225);
        doc.setFont("helvetica", "normal");
        doc.text("LEADERBOARD", pageWidth / 2, 25, { align: "center" });
        doc.setDrawColor(224, 211, 24);
        doc.setLineWidth(0.4);
        doc.line(marginX, 29, marginX + tableWidth, 29);

        const headerY = 32;
        doc.setFillColor(0, 0, 0);
        doc.rect(marginX, headerY, tableWidth, rowHeight, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(224, 211, 24);
        doc.text("#RANK",                           col1X, headerY + 6.5, { align: "center" });
        doc.text(isIndividual ? "PLAYER" : "TEAM",  col2X, headerY + 6.5, { align: "center" });
        doc.text("GAMES",                           col3X, headerY + 6.5, { align: "center" });
        doc.text("WINS",                            col4X, headerY + 6.5, { align: "center" });
        doc.text("CUM MGN",                         col5X, headerY + 6.5, { align: "center" });
        if (showElo) {
            doc.text("OLD",    col6X, headerY + 6.5, { align: "center" });
            doc.text("NEW",    col7X, headerY + 6.5, { align: "center" });
            doc.text("CHANGE", col8X, headerY + 6.5, { align: "center" });
        }

        const divOffsets = [
            rankColWidth,
            rankColWidth + nameColWidth,
            rankColWidth + nameColWidth + gamesColW,
            rankColWidth + nameColWidth + gamesColW + winsColW,
            rankColWidth + nameColWidth + gamesColW + winsColW + cumColW,
            ...(showElo ? [
                rankColWidth + nameColWidth + gamesColW + winsColW + cumColW + oldColW,
                rankColWidth + nameColWidth + gamesColW + winsColW + cumColW + oldColW + newColW,
            ] : [])
        ];
        doc.setDrawColor(40, 40, 60);
        doc.setLineWidth(0.2);
        divOffsets.forEach(o => doc.line(marginX + o, headerY, marginX + o, headerY + rowHeight));

        const rows = isIndividual
            ? rankedPlayerData.map(p => {
                const diff = p.eloRating != null && p.previousEloRating != null
                    ? p.eloRating - p.previousEloRating : null;
                return {
                    rank: p.playerRank,
                    name: p.username ?? `${p.firstName} ${p.lastName}`,
                    games: p.totalGamesPlayed,
                    wins: p.totalWins,
                    cum: p.cumMargin,
                    oldElo: p.previousEloRating != null ? String(Math.round(p.previousEloRating)) : "—",
                    newElo: p.eloRating != null ? `${Math.round(p.eloRating)}${p.provisional ? "*" : ""}` : null,
                    change: diff != null ? `${diff > 0 ? "+" : ""}${Math.round(diff)}` : "—",
                    changePositive: diff != null && diff > 0,
                    changeNegative: diff != null && diff < 0,
                    provisional: p.provisional,
                };
            })
            : rankedTeamData.map(t => ({
                rank: t.teamRank,
                name: t.teamName,
                games: t.totalGamesPlayed,
                wins: t.totalWins,
                cum: t.cumMargin,
                oldElo: "—", newElo: null, change: "—",
                changePositive: false, changeNegative: false, provisional: false,
            }));

        let currentY = headerY + rowHeight;
        rows.forEach((row, index) => {
            if (currentY + rowHeight > 280) {
                doc.addPage();
                doc.setFillColor(6, 4, 19);
                doc.rect(0, 0, 210, 297, "F");
                currentY = 15;
            }
            doc.setFillColor(...(index % 2 === 0 ? [6, 4, 19] as [number, number, number] : [13, 12, 24] as [number, number, number]));
            doc.rect(marginX, currentY, tableWidth, rowHeight, "F");

            if (row.rank === 1) doc.setTextColor(255, 215, 0);
            else if (row.rank === 2) doc.setTextColor(164, 178, 198);
            else if (row.rank === 3) doc.setTextColor(205, 127, 50);
            else doc.setTextColor(191, 208, 225);
            doc.setFont("helvetica", "bold"); doc.setFontSize(8);
            doc.text(`#${row.rank}`, col1X, currentY + 6.5, { align: "center" });

            doc.setTextColor(191, 208, 225); doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
            doc.text(row.name, col2X, currentY + 6.5, { align: "center", maxWidth: nameColWidth - 4 });

            doc.setTextColor(150, 160, 180); doc.setFontSize(8);
            doc.text(String(row.games), col3X, currentY + 6.5, { align: "center" });
            doc.text(String(row.wins),  col4X, currentY + 6.5, { align: "center" });
            doc.text(String(row.cum),   col5X, currentY + 6.5, { align: "center" });

            if (showElo) {
                // Old rating — muted white
                doc.setTextColor(180, 180, 180);
                doc.text(row.oldElo, col6X, currentY + 6.5, { align: "center" });

                // New rating — blue if provisional, gold if established
                if (row.provisional) doc.setTextColor(82, 147, 238);
                else doc.setTextColor(224, 211, 24);
                if (row.newElo) doc.text(row.newElo, col7X, currentY + 6.5, { align: "center" });

                // Change — green / red / grey
                if (row.changePositive) doc.setTextColor(76, 175, 129);
                else if (row.changeNegative) doc.setTextColor(224, 85, 85);
                else doc.setTextColor(136, 136, 136);
                doc.text(row.change, col8X, currentY + 6.5, { align: "center" });
            }

            doc.setDrawColor(30, 28, 45); doc.setLineWidth(0.2);
            divOffsets.forEach(o => doc.line(marginX + o, currentY, marginX + o, currentY + rowHeight));
            doc.setLineWidth(0.1);
            doc.line(marginX, currentY + rowHeight, marginX + tableWidth, currentY + rowHeight);
            currentY += rowHeight;
        });

        if (showElo && rankedPlayerData.some(p => p.provisional)) {
            doc.setFontSize(6); doc.setTextColor(82, 147, 238);
            doc.text("* Provisional rating (fewer than 20 games played)", marginX, 288, { align: "left" });
        }
        doc.setFontSize(7); doc.setTextColor(80, 80, 80);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 292, { align: "center" });
        doc.save(`leaderboard-${tournamentLabel}.pdf`);
    };

    const sortPlayers = (players: RankedPlayerData[]) =>
        [...players].sort((a, b) => {
            if (a.totalGamesPlayed === 0 && b.totalGamesPlayed > 0) return 1;
            if (a.totalGamesPlayed > 0 && b.totalGamesPlayed === 0) return -1;
            return a.playerRank - b.playerRank;
        });

    const handlePopulateLeaderBoard = async (tournamentId?: string, type?: "individual" | "team") => {
        const activeType = type ?? tournamentType;
        setActiveKey(null);
        if (!tournamentId) { SetRankedPlayerData([]); setRankedTeamData([]); return; }

        if (activeType === "team") {
            try { setRankedTeamData(await GetTeamLeaderboard(tournamentId)); }
            catch { Swal.fire({ title: "Error", text: "Failed to fetch team leaderboard.", icon: "error" }); setRankedTeamData([]); }
            return;
        }
        try {
            const data = await GetLeaderBoardByTournament(tournamentId);
            if (data && data.length > 0) { SetRankedPlayerData(sortPlayers(data)); }
            else { Swal.fire({ title: "No Games Found", text: "No games have been played for this tournament yet.", icon: "warning" }); SetRankedPlayerData([]); }
        } catch (error: any) {
            if (error?.response?.status === 404 || error?.response?.status === 400)
                Swal.fire({ title: "No Games Found", text: "No games have been played for this tournament yet.", icon: "warning" });
            else if (error?.response?.status !== 401)
                Swal.fire({ title: "Error", text: "Failed to fetch leaderboard data.", icon: "error" });
            SetRankedPlayerData([]);
        }
    };

    useEffect(() => {
        GetTournaments().then(setTournaments);
    }, []);

    const handleTypeChange = (type: "individual" | "team") => {
        setTournamentType(type); setActiveKey(null);
        SetRankedPlayerData([]); setRankedTeamData([]);
        handlePopulateLeaderBoard(selectedTournamentId || undefined, type);
    };

    const selectStyles = {
        control: (base: any, state: any) => ({ ...base, backgroundColor: "#0d0c18", border: `1px solid ${state.isFocused ? "#e0d318" : "#e0d318"}`, borderRadius: "8px", boxShadow: state.isFocused ? "0 0 12px rgba(224,211,24,0.4)" : "0 0 6px rgba(224,211,24,0.15)", outline: state.isFocused ? "1px solid #e0d318" : "1px solid rgba(224,211,24,0.2)", "&:hover": { borderColor: "rgba(224,211,24,0.6)", boxShadow: "0 0 10px rgba(224,211,24,0.3)" } }),
        valueContainer: (base: any) => ({ ...base, justifyContent: "center" }),
        option: (base: any, state: any) => ({ ...base, backgroundColor: state.isFocused ? "rgba(224,211,24,0.15)" : "#0d0c18", color: state.isFocused ? "#e0d31877" : "#bfd0e1d1", cursor: "pointer", textAlign: "center" as const, "&:active": { backgroundColor: "rgba(6,6,2,0.25)" } }),
        singleValue: (base: any) => ({ ...base, color: "#fcd809", textAlign: "center" as const, fontSize: "1.4rem", fontWeight: "bold" }),
        dropdownIndicator: (base: any) => ({ ...base, color: "rgba(224,211,24,0.6)", "&:hover": { color: "#e0d318d4" } }),
        indicatorSeparator: (base: any) => ({ ...base, backgroundColor: "rgba(224,211,24,0.2)" }),
        menu: (base: any) => ({ ...base, backgroundColor: "#0d0c18", border: "1px solid rgba(224,211,24,0.2)", borderRadius: "8px", zIndex: 9999 }),
        menuList: (base: any) => ({ ...base, backgroundColor: "#0d0c18", borderRadius: "8px", padding: 0 }),
        menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
        placeholder: (base: any) => ({ ...base, color: "#e0d318d4", textAlign: "center" as const }),
    };

    const typeSelectStyles = {
        ...selectStyles,
        control: (base: any, state: any) => ({ ...base, backgroundColor: "#0d0c18", border: `1px solid ${state.isFocused ? "rgba(224,211,24,0.4)" : "rgba(224,211,24,0.2)"}`, borderRadius: "8px", boxShadow: state.isFocused ? "0 0 8px rgba(224,211,24,0.15)" : "none", outline: "none", "&:hover": { borderColor: "rgba(224,211,24,0.35)", boxShadow: "none" } }),
        singleValue: (base: any) => ({ ...base, color: "#dae6f2d1", textAlign: "center" as const, fontSize: "0.9rem", fontWeight: "normal" }),
    };

    const hasData = tournamentType === "individual" ? rankedPlayerData.length > 0 : rankedTeamData.length > 0;

    return (
        <div className="leaderboard-page">
            <div style={{ marginLeft: "-30px" }}>
                <ConsoleHeader title="Leaderboard" subtitle="Tournament rankings and player standings" />
            </div>
            <div className="console-table-container">
                <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    {hasData && (
                        <div style={{ position: "absolute", right: 0 }}>
                            <button onClick={handleDownloadPDF} style={{ background: "transparent", border: "1px solid rgba(224,211,24,0.6)", color: "#e0d318d4", borderRadius: "6px", padding: "6px 14px", fontSize: "0.85rem", letterSpacing: "1px", cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "6px" }}
                                onMouseEnter={e => { const b = e.currentTarget; b.style.backgroundColor = "rgba(224,211,24,0.15)"; b.style.color = "#fff"; b.style.boxShadow = "0 0 10px rgba(224,211,24,0.3)"; }}
                                onMouseLeave={e => { const b = e.currentTarget; b.style.backgroundColor = "transparent"; b.style.color = "#e0d318d4"; b.style.boxShadow = "none"; }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e0d318d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                Download PDF
                            </button>
                        </div>
                    )}
                    <div style={{ flex: "0 0 180px" }}>
                        <Select options={tournamentTypeOptions} styles={typeSelectStyles} value={tournamentTypeOptions.find(o => o.value === tournamentType)} onChange={s => handleTypeChange((s?.value ?? "individual") as "individual" | "team")} menuPortalTarget={document.body} menuPosition="fixed" />
                    </div>
                    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: "400px" }}>
                        <Select options={tournamentOptions} styles={selectStyles}
                            value={tournamentOptions.find(o => o.value === selectedTournamentId) ?? tournamentOptions[0]}
                            onChange={selected => {
                                const val = selected?.value ?? "";
                                const name = tournaments.find(t => t.tournamentId === val)?.tournamentName ?? "";
                                setSelectedTournamentId(val); setSelectedTournamentName(name); setActiveKey(null);
                                handlePopulateLeaderBoard(val || undefined, tournamentType);
                            }}
                            menuPortalTarget={document.body} menuPosition="fixed" />
                    </div>
                </div>

                {/* No tournament selected */}
                {!selectedTournamentId && (
                    <div style={{ textAlign: "center", marginTop: "60px" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "12px", opacity: 0.3 }}>🏆</div>
                        <p style={{ color: "#bfd0e150", fontSize: "0.9rem", letterSpacing: "1px" }}>
                            Select a tournament to view the leaderboard
                        </p>
                    </div>
                )}

                {/* Individual leaderboard */}
                {selectedTournamentId && tournamentType === "individual" && (
                    <div className="console-table-wrapper">
                        <Table className="leaderboard-header-table" bordered>
                            <thead>
                                <tr>
                                    {/* Rank — fixed width matching rank-divider */}
                                    <th style={{ width: "55px", fontSize: "18px" }}>#Rank</th>

                                    {/* Player — takes remaining space */}
                                    <th style={{ textAlign: "center", paddingLeft: "200px", fontSize: "18px" }}>Player</th>

                                    {/* Rating columns — fixed widths must match row divs below */}
                                    {isMinitournament && (
                                        <>
                                            <th style={{ width: "90px", textAlign: "center", fontSize: "12px", color: "#e0d318a0" }}>Old</th>
                                            <th style={{ width: "90px", textAlign: "center", fontSize: "12px", color: "#e0d318a0" }}>New</th>
                                            <th style={{ width: "80px", textAlign: "center", fontSize: "12px", color: "#e0d318a0", paddingRight: "45px" }}>Change</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                        </Table>
                        <Accordion className="leaderboard-accordion" activeKey={activeKey ?? undefined} onSelect={k => setActiveKey(k as string | null)}>
                            {rankedPlayerData.length === 0 ? (
                                <div style={{ color: "#bfd0e1d1", textAlign: "center", padding: "20px" }}>No players found.</div>
                            ) : rankedPlayerData.map((player, index) => {

                                const diff = (player.eloRating != null && player.previousEloRating != null)
                                    ? player.eloRating - player.previousEloRating
                                    : null;
                                const diffColor = diff == null ? "#888" : diff > 0 ? "#4caf81" : diff < 0 ? "#e05555" : "#888";
                                const diffArrow = diff == null ? "—" : diff > 0 ? "▲" : diff < 0 ? "▼" : "—";

                                return (
                                    <Accordion.Item eventKey={String(index)} key={player.playerId}>
                                        <Accordion.Header>
                                            {/*
                                                Use flex row with exact widths matching the <th> above.
                                                No position:absolute so columns stay aligned.
                                            */}
                                            <div style={{ display: "flex", alignItems: "center", width: "100%", paddingRight: "8px" }}>

                                                {/* Rank — 55px, matches <th width="55px"> */}
                                                <div className="rank-divider" style={{ width: "55px", flexShrink: 0, fontSize: "0.85rem" }}>
                                                    #{player.playerRank}
                                                </div>

                                                {/* Player name — flex:1 takes remaining space */}
                                                <div style={{ flex: 1, textAlign: "center",paddingLeft: "200px", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {player.username ?? `${player.firstName} ${player.lastName}`}
                                                    {isMinitournament && player.provisional && (
                                                        <span style={{
                                                            marginLeft: "8px",
                                                            fontSize: "0.6rem",
                                                            letterSpacing: "1px",
                                                            color: "#5293ee",
                                                            border: "1px solid rgba(82,147,238,0.3)",
                                                            borderRadius: "4px",
                                                            padding: "2px 6px",
                                                            verticalAlign: "middle"
                                                        }}>PROVISIONAL</span>
                                                    )}
                                                </div>

                                                {/* Rating columns — only for Mini Tournament, widths match <th> */}
                                                {isMinitournament && player.eloRating != null && (
                                                    <>
                                                        {/* Old — 90px */}
                                                        <div style={{
                                                            width: "90px", flexShrink: 0,
                                                            textAlign: "center", fontSize: "0.75rem",
                                                            color: "#ffffff8c",
                                                        }}>
                                                            {player.previousEloRating != null ? player.previousEloRating.toFixed(0) : "—"}
                                                        </div>

                                                        {/* New — 90px */}
                                                        <div style={{
                                                            width: "90px", flexShrink: 0,
                                                            textAlign: "center", fontSize: "0.75rem",
                                                            color: player.provisional ? "#5293ee" : "#e0d318d4",
                                                            fontWeight: "bold",
                                                        }}>
                                                            {player.eloRating.toFixed(0)}
                                                        </div>

                                                        {/* Change — 80px */}
                                                        <div style={{
                                                            width: "80px", flexShrink: 0,
                                                            textAlign: "center", fontSize: "0.75rem",
                                                            color: diffColor, fontWeight: "bold",
                                                        }}>
                                                            {diff != null ? `${diffArrow} ${Math.abs(diff).toFixed(0)}` : "—"}
                                                        </div>
                                                    </>
                                                )}

                                                {/* Spacer when not Mini Tournament to keep name centered */}
                                                {!isMinitournament && (
                                                    <div style={{ width: "55px", flexShrink: 0 }} />
                                                )}
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="leaderboard-inner-table-wrapper">
                                                <table className="leaderboard-inner-table w-100">
                                                    <tbody>
                                                        <tr>
                                                            <th>Total Games Played</th><td>{player.totalGamesPlayed}</td>
                                                            <th>Total Wins</th><td>{player.totalWins}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Cum Margin</th><td>{player.cumMargin}</td>
                                                            <th>Avg Margin</th><td>{player.avgMargin}</td>
                                                        </tr>
                                                        {isMinitournament && (
                                                            <tr>
                                                                <th>Status</th>
                                                                <td colSpan={3} style={{ color: player.provisional ? "#5293ee" : "#5ee5aa", fontSize: "0.8rem" }}>
                                                                    {player.provisional
                                                                        ? `Provisional · ${PROVISIONAL_THRESHOLD - player.totalGamesPlayed} games to establish`
                                                                        : "Established"}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="leaderboard-rank-badge">
                                                <span className={`rank-badge ${player.playerRank === 1 ? "rank-badge-gold" : player.playerRank === 2 ? "rank-badge-silver" : player.playerRank === 3 ? "rank-badge-bronze" : "rank-badge-default"}`}>
                                                    Rank #{player.playerRank}
                                                </span>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );
                            })}
                        </Accordion>
                    </div>
                )}

                {/* Team leaderboard */}
                {selectedTournamentId && tournamentType === "team" && (
                    <div className="console-table-wrapper">
                        {rankedTeamData.length === 0 ? (
                            <div style={{ color: "#bfd0e1d1", textAlign: "center", padding: "20px" }}>No team data found for this tournament.</div>
                        ) : (<>
                            <Table className="leaderboard-header-table" bordered>
                                <thead><tr>
                                    <th style={{ width: "60px", fontSize: "20px" }}>#Rank</th>
                                    <th style={{ paddingRight: "120px", textAlign: "center", fontSize: "20px" }}>Team</th>
                                </tr></thead>
                            </Table>
                            <Accordion className="leaderboard-accordion" activeKey={activeKey ?? undefined} onSelect={k => setActiveKey(k as string | null)}>
                                {rankedTeamData.map((team, index) => (
                                    <Accordion.Item eventKey={String(index)} key={team.teamId}>
                                        <Accordion.Header>
                                            <div className="d-flex w-100 pe-3 position-relative">
                                                <div className="rank-divider" style={{ width: "45px" }}>#{team.teamRank}</div>
                                                <div className="position-absolute start-50 translate-middle-x" style={{ fontSize: "0.9rem" }}>{team.teamName}</div>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="leaderboard-inner-table-wrapper">
                                                <table className="leaderboard-inner-table w-100"><tbody>
                                                    <tr><th>Total Games</th><td>{team.totalGamesPlayed}</td><th>Total Wins</th><td>{team.totalWins}</td></tr>
                                                    <tr><th>Cum Margin</th><td>{team.cumMargin}</td><th>Avg Margin</th><td>{team.avgMargin}</td></tr>
                                                </tbody></table>
                                            </div>
                                            {team.members?.length > 0 && (
                                                <div style={{ marginTop: "10px" }}>
                                                    <p style={{ color: "#5ee5eaa0", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px", marginLeft: "5px" }}>Members</p>
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                        {team.members.map(m => (
                                                            <span key={m.playerId} style={{ background: "#0d0c18", border: "1px solid rgba(224,211,24,0.15)", borderRadius: "20px", padding: "3px 10px", fontSize: "0.75rem", color: "#bfd0e1d1" }}>
                                                                {m.firstName} {m.lastName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="leaderboard-rank-badge">
                                                <span className={`rank-badge ${team.teamRank === 1 ? "rank-badge-gold" : team.teamRank === 2 ? "rank-badge-silver" : team.teamRank === 3 ? "rank-badge-bronze" : "rank-badge-default"}`}>
                                                    Rank #{team.teamRank}
                                                </span>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </>)}
                    </div>
                )}
            </div>
        </div>
    );
}