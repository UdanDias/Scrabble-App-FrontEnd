import { useEffect, useState } from "react";
import { Accordion, Table } from "react-bootstrap";
import { GetPlayersByRank } from "../service/performance/GetPlayersByRank";
import GetTournaments from "../service/tournament/GetTournaments";
import { GetLeaderBoardByTournament } from "../service/performance/GetLeaderBoardByTournament";
import { GetTeamLeaderboard } from "../service/team/GetTeamLeaderBoard";
import Swal from "sweetalert2";
import Select from "react-select";
import { ConsoleHeader } from "./ConsoleHeader";

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