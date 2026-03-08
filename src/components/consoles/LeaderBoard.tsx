import { useEffect, useState } from "react";
import { Accordion, Table } from "react-bootstrap";
import { GetPlayersByRank } from "../service/performance/GetPlayersByRank";
import GetTournaments from "../service/tournament/GetTournaments";
import { GetLeaderBoardByTournament } from "../service/performance/GetLeaderBoardByTournament";
import { GetTeamLeaderboard } from "../service/team/GetTeamLeaderBoard";
import Swal from "sweetalert2";
import Select from "react-select";
import { ConsoleHeader } from "./ConsoleHeader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RankedPlayerData {
    playerId: string;
    firstName: string;
    lastName: string;
    playerRank: number;
    totalWins: number;
    totalGamesPlayed: number;
    avgMargin: number;
    cumMargin: number;
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

const tournamentTypeOptions = [
    { value: "individual", label: "Individual" },
    { value: "team", label: "Team" },
];

export function LeaderBoard() {
    const [rankedPlayerData, SetRankedPlayerData] = useState<RankedPlayerData[]>([]);
    const [rankedTeamData, setRankedTeamData] = useState<RankedTeamData[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
    const [tournamentType, setTournamentType] = useState<"individual" | "team">("individual");
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const tournamentOptions = [
        { value: "", label: "All Tournaments" },
        ...tournaments.map(t => ({ value: t.tournamentId, label: t.tournamentName }))
    ];
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = 210;
        const marginX = 15;
        const tableWidth = pageWidth - marginX * 2;
        const rankColWidth = 30;
        const nameColWidth = tableWidth - rankColWidth;
        const rowHeight = 10;

         const tournamentLabel = tournaments.find(t => t.tournamentId === selectedTournamentId)?.tournamentName ?? "All Tournaments";


        // ── Full dark background ──
        doc.setFillColor(6, 4, 19);
        doc.rect(0, 0, 210, 297, "F");
        // ── Center point of the name column ──
        const nameCenterX = marginX + rankColWidth + nameColWidth / 2;

        // ── Title: SCRABBLIX ──
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(224, 211, 24);
        doc.text(tournamentLabel, nameCenterX, 18, { align: "center" });  // ✅

        // ── Subtitle: LEADERBOARD ──
        doc.setFontSize(10);
        doc.setTextColor(191, 208, 225);
        doc.setFont("helvetica", "normal");
        doc.text("LEADERBOARD", nameCenterX, 25, { align: "center" });  // ✅

        // // ── Tournament name ──
        // doc.setFontSize(8);
        // doc.setTextColor(120, 120, 120);
        // doc.text(tournamentLabel.toUpperCase(), nameCenterX, 31, { align: "center" });  // ✅

        doc.setDrawColor(224, 211, 24);
        doc.setLineWidth(0.4);
        doc.line(marginX, 35, pageWidth - marginX, 35);

        // ── Header row ──
        const headerY = 38;
        doc.setFillColor(0, 0, 0);
        doc.rect(marginX, headerY, tableWidth, rowHeight, "F");

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(224, 211, 24);
        doc.text("#RANK", marginX + rankColWidth / 2, headerY + 6.5, { align: "center" });
        doc.text(tournamentType === "individual" ? "PLAYER" : "TEAM", marginX + rankColWidth + nameColWidth / 2, headerY + 6.5, { align: "center" });

        // ── Rank divider line in header ──
        doc.setDrawColor(40, 40, 60);
        doc.setLineWidth(0.2);
        doc.line(marginX + rankColWidth, headerY, marginX + rankColWidth, headerY + rowHeight);

        // ── Data rows ──
        const isIndividual = tournamentType === "individual";
        const rows = isIndividual
            ? rankedPlayerData.map(p => ({ rank: p.playerRank, name: `${p.firstName} ${p.lastName}` }))
            : rankedTeamData.map(t => ({ rank: t.teamRank, name: t.teamName }));

        let currentY = headerY + rowHeight;
        let currentPage = 1;
        const maxY = 280;

        rows.forEach((row, index) => {
            // ── New page if needed ──
            if (currentY + rowHeight > maxY) {
                doc.addPage();
                currentPage++;
                // dark background on new page
                doc.setFillColor(6, 4, 19);
                doc.rect(0, 0, 210, 297, "F");
                currentY = 15;
            }

            // ── Alternating row background ──
            const isEven = index % 2 === 0;
            doc.setFillColor(...(isEven ? [6, 4, 19] as [number,number,number] : [13, 12, 24] as [number,number,number]));
            doc.rect(marginX, currentY, tableWidth, rowHeight, "F");

            // ── Rank color ──
            if (row.rank === 1) doc.setTextColor(255, 215, 0);        // gold
            else if (row.rank === 2) doc.setTextColor(164, 178, 198); // silver
            else if (row.rank === 3) doc.setTextColor(205, 127, 50);  // bronze
            else doc.setTextColor(191, 208, 225);                     // default #bfd0e1

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.text(`#${row.rank}`, marginX + rankColWidth / 2, currentY + 6.5, { align: "center" });

            // ── Rank divider line ──
            doc.setDrawColor(40, 40, 60);
            doc.setLineWidth(0.2);
            doc.line(marginX + rankColWidth, currentY, marginX + rankColWidth, currentY + rowHeight);

            // ── Player/Team name ──
            doc.setTextColor(191, 208, 225);
            doc.setFont("helvetica", "normal");
            doc.text(row.name, marginX + rankColWidth + nameColWidth / 2, currentY + 6.5, { align: "center" });

            // ── Bottom row border ──
            doc.setDrawColor(30, 28, 45);
            doc.setLineWidth(0.1);
            doc.line(marginX, currentY + rowHeight, marginX + tableWidth, currentY + rowHeight);

            currentY += rowHeight;
        });

        // ── Outer table border ──
        // doc.setDrawColor(224, 211, 24);
        // doc.setLineWidth(0.3);
        // doc.rect(marginX, 38, tableWidth, currentY - 38);

        // ── Footer ──
        doc.setFontSize(7);
        doc.setTextColor(80, 80, 80);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 292, { align: "center" });

        doc.save(`leaderboard-${tournamentLabel}.pdf`);
    };

    const sortPlayers = (players: RankedPlayerData[]) => {
        return [...players].sort((a, b) => {
            if (a.totalGamesPlayed === 0 && b.totalGamesPlayed > 0) return 1;
            if (a.totalGamesPlayed > 0 && b.totalGamesPlayed === 0) return -1;
            if (a.totalGamesPlayed === 0 && b.totalGamesPlayed === 0) return 0;
            return a.playerRank - b.playerRank;
        });
    };

    const handlePopulateLeaderBoard = async (tournamentId?: string, type?: "individual" | "team") => {
        const activeType = type ?? tournamentType;
        setActiveKey(null);

        if (activeType === "team") {
            if (!tournamentId) {
                setRankedTeamData([]);
                return;
            }
            try {
                const data = await GetTeamLeaderboard(tournamentId);
                setRankedTeamData(data);
            } catch {
                Swal.fire({ title: "Error", text: "Failed to fetch team leaderboard.", icon: "error" });
                setRankedTeamData([]);
            }
            return;
        }

        // Individual
        try {
            let leaderBoards;
            if (tournamentId) {
                try {
                    leaderBoards = await GetLeaderBoardByTournament(tournamentId);
                } catch (error: any) {
                    if (error?.response?.status === 404 || error?.response?.status === 400) {
                        Swal.fire({ title: "No Games Found", text: "No games have been played for this tournament yet.", icon: "warning" });
                    } else {
                        Swal.fire({ title: "Error", text: "Failed to fetch leaderboard data.", icon: "error" });
                    }
                    SetRankedPlayerData([]);
                    return;
                }
            } else {
                leaderBoards = await GetPlayersByRank();
            }
            if (leaderBoards && leaderBoards.length > 0) {
                SetRankedPlayerData(sortPlayers(leaderBoards));
            } else {
                if (tournamentId) {
                    Swal.fire({ title: "No Games Found", text: "No games have been played for this tournament yet.", icon: "warning" });
                }
                SetRankedPlayerData([]);
            }
        } catch (error: any) {
            if (error?.response?.status === 401) return;
            console.error("Error fetching ranked player data", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            const tournamentList = await GetTournaments();
            setTournaments(tournamentList);
            handlePopulateLeaderBoard(undefined, "individual");
        };
        init();
    }, []);

    const handleTypeChange = (type: "individual" | "team") => {
        setTournamentType(type);
        setActiveKey(null);
        SetRankedPlayerData([]);
        setRankedTeamData([]);
        handlePopulateLeaderBoard(selectedTournamentId || undefined, type);
    };

    // ── Shared select styles ──
    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            backgroundColor: "#0d0c18",
            border: `1px solid ${state.isFocused ? "#e0d318" : "#e0d318"}`,
            borderRadius: "8px",
            boxShadow: state.isFocused ? "0 0 12px rgba(224,211,24,0.4)" : "0 0 6px rgba(224,211,24,0.15)",
            outline: state.isFocused ? "1px solid #e0d318" : "1px solid rgba(224,211,24,0.2)",
            "&:hover": { borderColor: "rgba(224,211,24,0.6)", boxShadow: "0 0 10px rgba(224,211,24,0.3)" }
        }),
        valueContainer: (base: any) => ({ ...base, justifyContent: "center" }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused ? "rgba(224,211,24,0.15)" : "#0d0c18",
            color: state.isFocused ? "#e0d31877" : "#bfd0e1d1",
            cursor: "pointer",
            textAlign: "center" as const,
            "&:active": { backgroundColor: "rgba(6,6,2,0.25)" }
        }),
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
        control: (base: any, state: any) => ({
            ...base,
            backgroundColor: "#0d0c18",
            border: `1px solid ${state.isFocused ? "rgba(224,211,24,0.4)" : "rgba(224,211,24,0.2)"}`,
            borderRadius: "8px",
            boxShadow: state.isFocused ? "0 0 8px rgba(224,211,24,0.15)" : "none",
            outline: "none",
            "&:hover": { borderColor: "rgba(224,211,24,0.35)", boxShadow: "none" }
        }),
        singleValue: (base: any) => ({ ...base, color: "#dae6f2d1", textAlign: "center" as const, fontSize: "0.9rem", fontWeight: "normal" }),
    };

    return (
        <div className="leaderboard-page">
            <div style={{ marginLeft: "-30px" }}>
                <ConsoleHeader title="Leaderboard" subtitle="Tournament rankings and player standings" />
            </div>
            <div className="console-table-container">

                {/* Two dropdowns: tournament type + tournament selector */}
                <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    {/* Right: download button */}
                    <div style={{ position: "absolute", right: 0 }}>
                        <button
                            onClick={handleDownloadPDF}
                            style={{
                                background: "transparent",
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
                                btn.style.backgroundColor = "transparent";
                                btn.style.color = "#e0d318d4";
                                btn.style.boxShadow = "none";
                            }}
                        >
                            {/* ✅ Gold outlined download icon matching sidebar style */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#e0d318d4"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download PDF
                        </button>
                    </div>
                    {/* Left: tournament type */}
                    <div style={{ flex: "0 0 180px" }}>
                        <Select
                            options={tournamentTypeOptions}
                            styles={typeSelectStyles}
                            value={tournamentTypeOptions.find(o => o.value === tournamentType)}
                            onChange={selected => {
                                const val = (selected?.value ?? "individual") as "individual" | "team";
                                handleTypeChange(val);
                            }}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                    </div>

                    {/* Center: tournament selector */}
                    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: "400px" }}>
                        <Select
                            options={tournamentOptions}
                            styles={selectStyles}
                            value={tournamentOptions.find(o => o.value === selectedTournamentId) ?? tournamentOptions[0]}
                            onChange={(selected) => {
                                const val = selected?.value ?? "";
                                setSelectedTournamentId(val);
                                setActiveKey(null);
                                handlePopulateLeaderBoard(val || undefined, tournamentType);
                            }}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                    </div>
                </div>

                {/* ── INDIVIDUAL leaderboard ── */}
                {tournamentType === "individual" && (
                    <div className="console-table-wrapper">
                        <Table className="leaderboard-header-table" bordered>
                            <thead>
                                <tr>
                                    <th style={{ width: "60px", fontSize: "20px" }}>#Rank</th>
                                    <th style={{ paddingRight: "120px", textAlign: "center", fontSize: "20px" }}>Player</th>
                                </tr>
                            </thead>
                        </Table>
                        <Accordion
                            className="leaderboard-accordion"
                            activeKey={activeKey ?? undefined}
                            onSelect={(key) => setActiveKey(key as string | null)}
                        >
                            {rankedPlayerData.length === 0 ? (
                                <div style={{ color: "#bfd0e1d1", textAlign: "center", padding: "20px" }}>
                                    No players found.
                                </div>
                            ) : (
                                rankedPlayerData.map((player, index) => (
                                    <Accordion.Item eventKey={String(index)} key={player.playerId}>
                                        <Accordion.Header>
                                            <div className="d-flex w-100 pe-3 position-relative">
                                                <div className="rank-divider" style={{ width: "45px" }}>#{player.playerRank}</div>
                                                <div className="position-absolute start-50 translate-middle-x" style={{ fontSize: "0.9rem" }}>
                                                    {player.firstName} {player.lastName}
                                                </div>
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
                                ))
                            )}
                        </Accordion>
                    </div>
                )}

                {/* ── TEAM leaderboard ── */}
                {tournamentType === "team" && (
                    <div className="console-table-wrapper">
                        {!selectedTournamentId ? (
                            <div style={{ color: "#bfd0e150", textAlign: "center", padding: "30px", fontSize: "0.9rem", letterSpacing: "1px" }}>
                                Select a tournament to view team standings
                            </div>
                        ) : rankedTeamData.length === 0 ? (
                            <div style={{ color: "#bfd0e1d1", textAlign: "center", padding: "20px" }}>
                                No team data found for this tournament.
                            </div>
                        ) : (
                            <>
                                <Table className="leaderboard-header-table" bordered>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "60px", fontSize: "20px" }}>#Rank</th>
                                            <th style={{ paddingRight: "120px", textAlign: "center", fontSize: "20px" }}>Team</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <Accordion
                                    className="leaderboard-accordion"
                                    activeKey={activeKey ?? undefined}
                                    onSelect={(key) => setActiveKey(key as string | null)}
                                >
                                    {rankedTeamData.map((team, index) => (
                                        <Accordion.Item eventKey={String(index)} key={team.teamId}>
                                            <Accordion.Header>
                                                <div className="d-flex w-100 pe-3 position-relative">
                                                    <div className="rank-divider" style={{ width: "45px" }}>#{team.teamRank}</div>
                                                    <div className="position-absolute start-50 translate-middle-x" style={{ fontSize: "0.9rem" }}>
                                                        {team.teamName}
                                                    </div>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className="leaderboard-inner-table-wrapper">
                                                    <table className="leaderboard-inner-table w-100">
                                                        <tbody>
                                                            <tr>
                                                                <th>Total Games</th><td>{team.totalGamesPlayed}</td>
                                                                <th>Total Wins</th><td>{team.totalWins}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Cum Margin</th><td>{team.cumMargin}</td>
                                                                <th>Avg Margin</th><td>{team.avgMargin}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {team.members && team.members.length > 0 && (
                                                    <div style={{ marginTop: "10px" }}>
                                                        <p style={{ color: "#5ee5eaa0", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" ,marginLeft:"5px"}}>
                                                            Members
                                                        </p>
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
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}