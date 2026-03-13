
import React, { useEffect, useState } from "react";
import { Accordion, Button, Modal, FloatingLabel, Form } from "react-bootstrap";
import { getPlayerIdFromToken } from "../service/auth/GetPlayerId";
import { getGamesByPlayer, getSelectedPlayer } from "../service/player/GetPlayer";
import { GetSelectedPerformance } from "../service/performance/GetPlayersByRank";
import UpdatePlayer from "../service/player/UpdatePlayer";
import ReactSelect from "react-select";
import { customStyles } from "../service/styles/CustomStyles";
import { ConsoleHeader } from "./ConsoleHeader";
import Swal from "sweetalert2";
import GetTournaments from "../service/tournament/GetTournaments";
import { GetLeaderBoardByTournament } from "../service/performance/GetLeaderBoardByTournament";

interface Player {
    playerId: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    dob: string;
    email: string;
    phone: string;
    address: string;
    faculty: string;
    academicLevel: string;
    accountCreatedDate: string;
}

interface Performance {
    playerId: string;
    totalWins: number;
    totalGamesPlayed: number;
    cumMargin: number;
    avgMargin: number;
    playerRank: number;
}

interface PlayerGame {
    gameId: string;
    player1Id: string;
    player2Id: string;
    player1Name: string;
    player2Name: string;
    winnerName: string;
    score1: number;
    score2: number;
    margin: number;
    gameTied: boolean;
    winnerId: string;
    gameDate: string;
    bye: boolean;
}

export function Profile() {
    const [player, SetPlayer] = useState<Player | null>(null);
    const [games, SetGames] = useState<PlayerGame[] | null>([]);
    const [performance, SetPerformance] = useState<Performance | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState<Player | null>(null);
    const [miniTournamentRank, setMiniTournamentRank] = useState<number | null>(null);
    const MINI_TOURNAMENT_NAME = "Mini Tournament Uok";

    const fetchData = async () => {
        const playerId = getPlayerIdFromToken();
        if (playerId) {
            try {
                const selectedPlayer = await getSelectedPlayer(playerId);
                const selectedPerformance = await GetSelectedPerformance(playerId);
                const playerGames = await getGamesByPlayer(playerId);
                SetPlayer(selectedPlayer);
                SetPerformance(selectedPerformance);
                SetGames(playerGames);

                // ── Mini Tournament rank ──
                const tournaments = await GetTournaments();
                const mini = tournaments.find(
                    (t: { tournamentName: string }) => t.tournamentName === MINI_TOURNAMENT_NAME
                );
                if (mini) {
                    const leaderboard = await GetLeaderBoardByTournament(mini.tournamentId);
                    const entry = leaderboard.find(
                        (p: { playerId: string }) => p.playerId === playerId
                    );
                    setMiniTournamentRank(entry?.playerRank ?? null);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleEditOpen = () => {
        setEditData(player);
        setShowEditModal(true);
    };

    const handleEditClose = () => {
        setShowEditModal(false);
        setEditData(null);
    };

    // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setEditData((prev) => prev ? { ...prev, [e.target.name]: e.target.value } : prev);
    // };
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement|HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData((prev) => prev ? { 
            ...prev, 
            [name]: name === "age" ? Number(value) : value  // cast age to number
        } : prev);
    };

    // const handleSave = async () => {
    //     if (!editData) return;
    //     try {
    //         const updated = await UpdatePlayer(editData);
    //         SetPlayer(updated);
    //         handleEditClose();
    //     } catch (error) {
    //         console.error("Error updating player:", error);
    //     }
    // };
    // const handleSave = async () => {
    //     if (!editData) return;
    //     try {
    //         const { age, ...dataToSend } = editData;
    //         await UpdatePlayer(editData);
    //         await fetchData();    // re-fetch everything instead of relying on returned value
    //         handleEditClose();
    //     } catch (error) {
    //         console.error("Error updating player:", error);
    //     }
    // };
    const handleSave = async () => {
    if (!editData) return;

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    try {
        const { age, ...dataToSend } = editData;
        await UpdatePlayer(editData);
        await fetchData();
        handleEditClose();
        Toast.fire({ icon: "success", title: "Player Updated Successfully" });
    } catch (error) {
        console.error("Error updating player:", error);
        Toast.fire({ icon: "error", title: "Failed To Update Player" });
    }
};

    const getGameResult = (game: PlayerGame) => {
        if (game.bye) return <span className="badge-game-bye">Bye Game</span>;
        if (game.gameTied) return <span className="badge-game-tied">Game Tied</span>;
        if (game.winnerId === player?.playerId) return <span className="badge-game-won">Won the Game</span>;
        return <span className="badge-game-lost">Lost the Game</span>;
    };
    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
    ];

    return (
        <>
            <div className="console-page">
                <ConsoleHeader
                    title="Profile"
                    subtitle={player ? `Welcome back, ${player.firstName} ${player.lastName} ✦` : "Loading..."}
                    
                />
                <div className="console-table-container" style={{ width: '70%' }}>

                    {/* Personal Details Card */}
                    <div className="profile-card mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h3 className="profile-card-title mb-0">Personal Details</h3>
                            <Button className="btn-edit" onClick={handleEditOpen}>Edit Profile</Button>
                        </div>
                        <div className="leaderboard-inner-table-wrapper">
                            <table className="profile-games-table w-100">
                                <tbody>
                                    <tr>
                                        <th>First Name</th>
                                        <td>{player?.firstName}</td>
                                        <th>Email</th>
                                        <td>{player?.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Last Name</th>
                                        <td>{player?.lastName}</td>
                                        <th>Phone</th>
                                        <td>{player?.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>Age</th>
                                        <td>{player?.age}</td>
                                        <th>Address</th>
                                        <td>{player?.address}</td>
                                    </tr>
                                    <tr>
                                        <th>Gender</th>
                                        <td>{player?.gender}</td>
                                        <th>Faculty</th>
                                        <td>{player?.faculty}</td>
                                    </tr>
                                    <tr>
                                        <th>Date of Birth</th>
                                        <td>{player?.dob}</td>
                                        <th>Academic Level</th>
                                        <td>{player?.academicLevel}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="d-flex gap-4 align-items-stretch">

                        {/* Performance Card */}
                        <div className="profile-card profile-bottom-card" style={{ width: '50%' }}>
                            <h3 className="profile-card-title">Performance</h3>
                            <div className="leaderboard-inner-table-wrapper">
                                <table className="profile-games-table w-100">
                                    <tbody>
                                        <tr>
                                            <th>Player ID</th>
                                            <td colSpan={3}>{performance?.playerId}</td>
                                        </tr>
                                        <tr>
                                            <th>Cum Margin</th>
                                            <td>{performance?.cumMargin}</td>
                                            <th>Total Games</th>
                                            <td>{performance?.totalGamesPlayed}</td>
                                        </tr>
                                        <tr>
                                            <th>Avg Margin</th>
                                            <td>{performance?.avgMargin}</td>
                                            <th>Total Wins</th>
                                            <td>{performance?.totalWins}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-center mt-3 gap-3">
                                {/* <div className="d-flex flex-column align-items-center gap-2">
                                    <span className={`badge fs-6 ${
                                        performance?.playerRank === 1 ? "badge-rank-1" :
                                        performance?.playerRank === 2 ? "badge-rank-2" :
                                        performance?.playerRank === 3 ? "badge-rank-3" :
                                        "badge-rank-default"
                                    }`}>
                                        Rank #{performance?.playerRank}
                                    </span>
                                    <span style={{
                                        fontSize: "0.65rem",
                                        letterSpacing: "1px",
                                        color: "#bfd0e180",
                                        textTransform: "uppercase"
                                    }}>
                                        Overall
                                    </span>
                                </div> */}

                                {miniTournamentRank !== null && (
                                    <div className="d-flex flex-column align-items-center gap-2">
                                        <span className={`badge fs-6 ${
                                            miniTournamentRank === 1 ? "badge-rank-1" :
                                            miniTournamentRank === 2 ? "badge-rank-2" :
                                            miniTournamentRank === 3 ? "badge-rank-3" :
                                            "badge-rank-default"
                                        }`}>
                                            Rank #{miniTournamentRank}
                                        </span>
                                        <span style={{
                                            fontSize: "0.65rem",
                                            letterSpacing: "1px",
                                            color: "#bfd0e180",
                                            textTransform: "uppercase"
                                        }}>
                                            Mini Tournament
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Games Card */}
                        {/* Games Card */}
                            <div className="profile-card profile-bottom-card" style={{ width: '50%' }}>
                                <h3 className="profile-card-title">Games</h3>

                                {/* ONLY ONE scroll container */}
                                <div className="profile-scroll-area" style={{ flex: 1 }}>
                                    {games && games.length === 0 ? (
                                        <div className="d-flex justify-content-center align-items-center h-100">
                                            <p className="profile-value">No games found.</p>
                                        </div>
                                    ) : (
                                        <Accordion className="leaderboard-accordion" alwaysOpen>
                                            {games?.map((game, index) => (
                                                <Accordion.Item eventKey={String(index)} key={game.gameId}>
                                                    <Accordion.Header>
                                                        Game {index + 1}
                                                    </Accordion.Header>

                                                    <Accordion.Body>
                                                        <div className="leaderboard-inner-table-wrapper">
                                                            <table className="profile-games-table w-100">
                                                                <tbody>
                                                                    <tr>
                                                                        <th>Game ID</th>
                                                                        <td>{game.gameId}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Date</th>
                                                                        <td>{game.gameDate}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Player 1</th>
                                                                        <td>{game.player1Name}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Player 2</th>
                                                                        <td>{game.player2Name}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Score</th>
                                                                        <td>{game.score1} - {game.score2}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Margin</th>
                                                                        <td>{game.margin}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Winner</th>
                                                                        <td>{game.winnerName}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Tied</th>
                                                                        <td>{game.gameTied ? "Yes" : "No"}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        <div className="leaderboard-rank-badge">
                                                            {getGameResult(game)}
                                                        </div>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            ))}
                                        </Accordion>
                                    )}
                                </div>
                            </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleEditClose} className="dark-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Personal Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel label="First Name" className="mb-3">
                        <Form.Control
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={editData?.firstName ?? ""}
                            onChange={handleOnChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Last Name" className="mb-3">
                        <Form.Control
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={editData?.lastName ?? ""}
                            onChange={handleOnChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Email" className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={editData?.email ?? ""}
                            onChange={handleOnChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Phone" className="mb-3">
                        <Form.Control
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={editData?.phone ?? ""}
                            onChange={handleOnChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Address" className="mb-3">
                        <Form.Control
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={editData?.address ?? ""}
                            onChange={handleOnChange}
                        />
                    </FloatingLabel>
                    
                    <div className="mb-3">
                        <ReactSelect
                            options={genderOptions}
                            styles={customStyles}
                            placeholder="Select Gender"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            value={genderOptions.find(o => o.value === editData?.gender) ?? null}
                            onChange={(selected) =>
                            setEditData(prev => prev ? { ...prev, gender: selected?.value ?? "" } : prev)
}
                        />
                    </div>
                    <FloatingLabel label="Date of Birth" className="mb-3">
                        <Form.Control
                            type="date"
                            name="dob"
                            placeholder="Date of Birth"
                            value={editData?.dob ?? ""}
                            onChange={handleOnChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Faculty" className="mb-3">
                        <Form.Control
                            type="text"
                            name="faculty"
                            placeholder="Faculty"
                            value={editData?.faculty ?? ""}
                            onChange={handleOnChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Academic Level" className="mb-3">
                        <Form.Control
                            type="text"
                            name="academicLevel"
                            placeholder="Academic Level"
                            value={editData?.academicLevel ?? ""}
                            onChange={handleOnChange}
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-edit" onClick={handleEditClose}>Close</Button>
                    <Button className="btn-create" onClick={handleSave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}