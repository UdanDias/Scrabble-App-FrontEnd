import { useEffect, useState } from "react";
import { Accordion, Table, Form } from "react-bootstrap";
import { GetPlayersByRank } from "../service/performance/GetPlayersByRank";
import GetTournaments from "../service/tournament/GetTournaments";
import axios from "axios";
import FetchToken from "../service/auth/FetchToken";
import { GetLeaderBoardByTournament } from "../service/performance/GetLeaderBoardByTournament";
import Swal from "sweetalert2";
import Select from "react-select";
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

interface Tournament {
    tournamentId: string;
    tournamentName: string;
}

export function LeaderBoard() {
    const [rankedPlayerData, SetRankedPlayerData] = useState<RankedPlayerData[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
    const [activeKey, setActiveKey] = useState<string | null>(null);




const tournamentOptions = [
    { value: "", label: "All Tournaments" },
    ...tournaments.map(t => ({ value: t.tournamentId, label: t.tournamentName }))
];

// const customStyles = {
//     control: (base: any, state: any) => ({
//         ...base,
//         backgroundColor: "#0d0c18",
//         border: `1px solid ${state.isFocused ? "rgba(224, 211, 24, 0.8)" : "rgba(224, 211, 24, 0.3)"}`,
//         borderRadius: "8px",
//         boxShadow: state.isFocused ? "0 0 12px rgba(224, 211, 24, 0.3)" : "none",
//         "&:hover": {
//             borderColor: "rgba(224, 211, 24, 0.6)",
//             boxShadow: "0 0 8px rgba(224, 211, 24, 0.2)"
//         }
//     }),
//     menu: (base: any) => ({
//         ...base,
//         backgroundColor: "#0d0c18",
//         border: "1px solid rgba(224, 211, 24, 0.2)",
//         borderRadius: "8px",
//     }),
//     option: (base: any, state: any) => ({
//         ...base,
//         backgroundColor: state.isFocused ? "rgba(224, 211, 24, 0.15)" : "#0d0c18",
//         color: state.isFocused ? "#ffffff" : "#bfd0e1d1",
//         cursor: "pointer",
//         "&:active": {
//             backgroundColor: "rgba(224, 211, 24, 0.25)"
//         }
//     }),
//     singleValue: (base: any) => ({
//         ...base,
//         color: "#bfd0e1d1"
//     }),
//     dropdownIndicator: (base: any) => ({
//         ...base,
//         color: "rgba(224, 211, 24, 0.6)",
//         "&:hover": { color: "#e0d318d4" }
//     }),
//     indicatorSeparator: (base: any) => ({
//         ...base,
//         backgroundColor: "rgba(224, 211, 24, 0.2)"
//     }),
// };
const customStyles = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: "#0d0c18",
        border: `1px solid ${state.isFocused ? "rgba(224, 211, 24, 0.8)" : "rgba(224, 211, 24, 0.3)"}`,
        borderRadius: "8px",
        boxShadow: state.isFocused ? "0 0 12px rgba(224, 211, 24, 0.3)" : "none",
        "&:hover": {
            borderColor: "rgba(224, 211, 24, 0.6)",
            boxShadow: "0 0 8px rgba(224, 211, 24, 0.2)"
        }
    }),
    valueContainer: (base: any) => ({
        ...base,
        justifyContent: "center",
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: "#0d0c18",
        border: "1px solid rgba(224, 211, 24, 0.2)",
        borderRadius: "8px",
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused ? "rgba(224, 211, 24, 0.15)" : "#0d0c18",
        color: state.isFocused ? "#ffffff" : "#bfd0e1d1",
        cursor: "pointer",
        textAlign: "center" as const,
        "&:active": {
            backgroundColor: "rgba(224, 211, 24, 0.25)"
        }
    }),
    singleValue: (base: any) => ({
        ...base,
        color: "#bfd0e1d1",
        textAlign: "center" as const,
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: "rgba(224, 211, 24, 0.6)",
        "&:hover": { color: "#e0d318d4" }
    }),
    indicatorSeparator: (base: any) => ({
        ...base,
        backgroundColor: "rgba(224, 211, 24, 0.2)"
    }),
};

    const sortPlayers = (players: RankedPlayerData[]) => {
        return [...players].sort((a, b) => {
            if (a.totalGamesPlayed === 0 && b.totalGamesPlayed > 0) return 1;
            if (a.totalGamesPlayed > 0 && b.totalGamesPlayed === 0) return -1;
            if (a.totalGamesPlayed === 0 && b.totalGamesPlayed === 0) return 0;
            return a.playerRank - b.playerRank;
        });
    };

    const handlePopulateLeaderBoard = async (tournamentId?: string) => {
    try {
        let leaderBoards;

        if (tournamentId) {
            try {
                leaderBoards = await GetLeaderBoardByTournament(tournamentId);
            } catch (error: any) {
                // 404 or empty = no games played for this tournament
                if (error?.response?.status === 404 || error?.response?.status === 400) {
                    Swal.fire({
                        title: "No Games Found",
                        text: "No games have been played for this tournament yet.",
                        icon: "warning"
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to fetch leaderboard data.",
                        icon: "error"
                    });
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
            // API returned empty list — no games played
            if (tournamentId) {
                Swal.fire({
                    title: "No Games Found",
                    text: "No games have been played for this tournament yet.",
                    icon: "warning"
                });
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
            handlePopulateLeaderBoard();
        };
        init();
    }, []);

    const handleTournamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedTournamentId(val);
        setActiveKey(null); // collapse all
        handlePopulateLeaderBoard(val || undefined);
    };

    return (
        <div className="leaderboard-page">
            <div className="console-table-container">
                <div className="mb-3" style={{ maxWidth: "400px", margin: "0 auto 16px auto" }}>
                    <Select
    options={tournamentOptions}
    styles={customStyles}
    value={tournamentOptions.find(o => o.value === selectedTournamentId) ?? tournamentOptions[0]}
    onChange={(selected) => {
        const val = selected?.value ?? "";
        setSelectedTournamentId(val);
        setActiveKey(null);
        handlePopulateLeaderBoard(val || undefined);
    }}
/>
                </div>

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
                                No players found for this tournament.
                            </div>
                        ) : (
                            rankedPlayerData.map((player, index) => (
                                <Accordion.Item eventKey={String(index)} key={player.playerId}>
                                    <Accordion.Header>
                                        <div className="d-flex w-100 pe-3 position-relative">
                                            <div className="rank-divider" style={{ width: "45px" }}>
                                                #{player.playerRank}
                                            </div>
                                            <div className="position-absolute start-50 translate-middle-x" style={{ fontSize: "18px" }}>
                                                {player.firstName} {player.lastName}
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className="leaderboard-inner-table-wrapper">
                                            <table className="leaderboard-inner-table w-100">
                                                <tbody>
                                                    <tr>
                                                        <th>Total Games Played</th>
                                                        <td>{player.totalGamesPlayed}</td>
                                                        <th>Total Wins</th>
                                                        <td>{player.totalWins}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Cum Margin</th>
                                                        <td>{player.cumMargin}</td>
                                                        <th>Avg Margin</th>
                                                        <td>{player.avgMargin}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="leaderboard-rank-badge">
                                            <span className={`badge fs-6 ${
                                                player.playerRank === 1 ? "bg-warning text-dark" :
                                                player.playerRank === 2 ? "bg-secondary" :
                                                player.playerRank === 3 ? "bg-danger" :
                                                "bg-primary"
                                            }`}>
                                                Rank #{player.playerRank}
                                            </span>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))
                        )}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}