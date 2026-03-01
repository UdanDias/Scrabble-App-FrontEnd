// import { useEffect, useState } from "react";
// import { Accordion, Card } from "react-bootstrap";
// import { getPlayerIdFromToken } from "../service/auth/GetPlayerId";
// import { getGamesByPlayer, getSelectedPlayer } from "../service/player/GetPlayer";
// import { GetSelectedPerformance } from "../service/performance/GetPlayersByRank";

// interface Player {
//     playerId: string;
//     firstName: string;
//     lastName: string;
//     age: number;
//     gender: string;
//     dob: string;
//     email: string;
//     phone: string;
//     address: string;
//     faculty: string;
//     academicLevel: string;
//     accountCreatedDate: string;
// }
// interface Performance {
//     playerId: string;
//     totalWins: number;
//     totalGamesPlayed: number;
//     cumMargin: number;
//     avgMargin: number;
//     playerRank: number;
// }
// interface PlayerGame {
//     gameId: string;
//     player1Id: string;
//     player2Id: string;
//     player1Name: string;
//     player2Name: string;
//     winnerName: string;
//     score1: number;
//     score2: number;
//     margin: number;
//     gameTied: boolean;
//     winnerId: string;
//     gameDate: string;
//     bye: boolean;
// }

// export function Profile() {
//     const [player, SetPlayer] = useState<Player | null>({
//         playerId: "", firstName: "", lastName: "", age: 0, gender: "",
//         dob: "", email: "", phone: "", address: "", faculty: "",
//         academicLevel: "", accountCreatedDate: ""
//     });
//     const [games, SetGames] = useState<PlayerGame[] | null>([]);
//     const [performance, SetPerformance] = useState<Performance | null>({
//         playerId: "", totalWins: 0, totalGamesPlayed: 0,
//         cumMargin: 0, avgMargin: 0, playerRank: 0
//     });

//     const fetchData = async () => {
//         const playerId = getPlayerIdFromToken();
//         if (playerId) {
//             try {
//                 const selectedPlayer = await getSelectedPlayer(playerId);
//                 const selectedPerformance = await GetSelectedPerformance(playerId);
//                 const playerGames = await getGamesByPlayer(playerId);
//                 SetPlayer(selectedPlayer);
//                 SetPerformance(selectedPerformance);
//                 SetGames(playerGames);
//             } catch (error) {
//                 console.error("Error fetching profile data:", error);
//             }
//         }
//     };

//     useEffect(() => { fetchData() }, []);

//     const getGameResult = (game: PlayerGame) => {
//         if (game.bye) return <span className="badge bg-secondary fs-6">Bye Game</span>;
//         if (game.gameTied) return <span className="badge bg-warning text-dark fs-6">Game Tied</span>;
//         if (game.winnerId === player?.playerId) return <span className="badge bg-success fs-6">Won the Game</span>;
//         return <span className="badge bg-danger fs-6">Lost the Game</span>;
//     };

//     return (
//         <>
//             <div className="console-page">
//                 <div className="console-table-container" style={{ width: '70%' }}>

//                     {/* Player Profile Card */}
//                     <div className="profile-card mb-4">
//                         <h3 className="profile-card-title">Personal Details</h3>
//                         <div className="leaderboard-inner-table-wrapper">
//                             <table className="profile-games-table w-100">
//                                 <tbody>
//                                     <tr>
//                                         <th>First Name</th>
//                                         <td>{player?.firstName}</td>
//                                         <th>Email</th>
//                                         <td>{player?.email}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Last Name</th>
//                                         <td>{player?.lastName}</td>
//                                         <th>Phone</th>
//                                         <td>{player?.phone}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Age</th>
//                                         <td>{player?.age}</td>
//                                         <th>Address</th>
//                                         <td>{player?.address}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Gender</th>
//                                         <td>{player?.gender}</td>
//                                         <th>Faculty</th>
//                                         <td>{player?.faculty}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Date of Birth</th>
//                                         <td>{player?.dob}</td>
//                                         <th>Academic Level</th>
//                                         <td>{player?.academicLevel}</td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>

//                     {/* Bottom Section */}
//                     <div className="d-flex gap-4 align-items-stretch">

//                         {/* Performance Card */}
//                         <div className="profile-card" style={{ width: '50%' }}>
//                             <h3 className="profile-card-title">Performance</h3>
//                             <div className="leaderboard-inner-table-wrapper">
//                                 <table className="profile-games-table w-100">
//                                     <tbody>
//                                         <tr>
//                                             <th>Player ID</th>
//                                             <td colSpan={3}>{performance?.playerId}</td>
//                                         </tr>
//                                         <tr>
//                                             <th>Cum Margin</th>
//                                             <td>{performance?.cumMargin}</td>
//                                             <th>Total Games</th>
//                                             <td>{performance?.totalGamesPlayed}</td>
//                                         </tr>
//                                         <tr>
//                                             <th>Avg Margin</th>
//                                             <td>{performance?.avgMargin}</td>
//                                             <th>Total Wins</th>
//                                             <td>{performance?.totalWins}</td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="d-flex justify-content-center mt-3">
//                                 <span className={`badge fs-6 ${
//                                     performance?.playerRank === 1 ? "bg-warning text-dark" :
//                                     performance?.playerRank === 2 ? "bg-secondary" :
//                                     performance?.playerRank === 3 ? "bg-danger" :
//                                     "bg-primary"
//                                 }`}>
//                                     Rank #{performance?.playerRank}
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Games Card */}
//                         <div className="profile-card d-flex flex-column" style={{ width: '50%' }}>
//                             <h3 className="profile-card-title">Games</h3>
//                             <div className="console-table-wrapper" style={{ flex: 1, maxHeight: 'none', overflow: 'visible' }}>
//                                 {games && games.length === 0 ? (
//                                     <p className="text-center profile-value">No games found.</p>
//                                 ) : (
//                                     <Accordion className="leaderboard-accordion">
//                                         {games?.map((game, index) => (
//                                             <Accordion.Item eventKey={String(index)} key={game.gameId}>
//                                                 <Accordion.Header>Game {index + 1}</Accordion.Header>
//                                                 <Accordion.Body>
//                                                     <div className="leaderboard-inner-table-wrapper">
//                                                         <table className="profile-games-table w-100">
//                                                             <tbody>
//                                                                 <tr>
//                                                                     <th>Game ID</th>
//                                                                     <td>{game.gameId}</td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <th>Date</th>
//                                                                     <td>{game.gameDate}</td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <th>Player 1</th>
//                                                                     <td>{game.player1Name}</td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <th>Player 2</th>
//                                                                     <td>{game.player2Name}</td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <th>Score</th>
//                                                                     <td>{game.score1} - {game.score2}</td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <th>Margin</th>
//                                                                     <td>{game.margin}</td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <th>Winner</th>
//                                                                     <td>{game.winnerName}</td>
//                                                                 </tr>
//                                                                 <tr>
//                                                                     <th>Tied</th>
//                                                                     <td>{game.gameTied ? "Yes" : "No"}</td>
//                                                                 </tr>
//                                                             </tbody>
//                                                         </table>
//                                                     </div>
//                                                     <div className="leaderboard-rank-badge">
//                                                         {getGameResult(game)}
//                                                     </div>
//                                                 </Accordion.Body>
//                                             </Accordion.Item>
//                                         ))}
//                                     </Accordion>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
import React, { useEffect, useState } from "react";
import { Accordion, Button, Modal, FloatingLabel, Form } from "react-bootstrap";
import { getPlayerIdFromToken } from "../service/auth/GetPlayerId";
import { getGamesByPlayer, getSelectedPlayer } from "../service/player/GetPlayer";
import { GetSelectedPerformance } from "../service/performance/GetPlayersByRank";
import UpdatePlayer from "../service/player/UpdatePlayer";
import ReactSelect from "react-select";
import { customStyles } from "../service/styles/CustomStyles";

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
    const handleSave = async () => {
        if (!editData) return;
        try {
            const { age, ...dataToSend } = editData;
            await UpdatePlayer(editData);
            await fetchData();    // re-fetch everything instead of relying on returned value
            handleEditClose();
        } catch (error) {
            console.error("Error updating player:", error);
        }
    };

    const getGameResult = (game: PlayerGame) => {
        if (game.bye) return <span className="badge bg-secondary fs-6">Bye Game</span>;
        if (game.gameTied) return <span className="badge bg-warning text-dark fs-6">Game Tied</span>;
        if (game.winnerId === player?.playerId) return <span className="badge bg-success fs-6">Won the Game</span>;
        return <span className="badge bg-danger fs-6">Lost the Game</span>;
    };
    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
    ];

    return (
        <>
            <div className="console-page">
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
                        <div className="profile-card" style={{ width: '50%' }}>
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
                            <div className="d-flex justify-content-center mt-3">
                                <span className={`badge fs-6 ${
                                    performance?.playerRank === 1 ? "bg-warning text-dark" :
                                    performance?.playerRank === 2 ? "bg-secondary" :
                                    performance?.playerRank === 3 ? "bg-danger" :
                                    "bg-primary"
                                }`}>
                                    Rank #{performance?.playerRank}
                                </span>
                            </div>
                        </div>

                        {/* Games Card */}
                        <div className="profile-card d-flex flex-column" style={{ width: '50%' }}>
                            <h3 className="profile-card-title">Games</h3>
                            <div className="console-table-wrapper" style={{ flex: 1, maxHeight: 'none', overflow: 'visible' }}>
                                {games && games.length === 0 ? (
                                    <p className="text-center profile-value">No games found.</p>
                                ) : (
                                    <Accordion className="leaderboard-accordion">
                                        {games?.map((game, index) => (
                                            <Accordion.Item eventKey={String(index)} key={game.gameId}>
                                                <Accordion.Header>Game {index + 1}</Accordion.Header>
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