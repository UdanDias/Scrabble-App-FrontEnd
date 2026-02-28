import { SetStateAction, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import GetGames from "../service/game/GetGames";
import EditGame from "../service/game/EditGame";
import DeleteGame from "../service/game/DeleteGame";
import { AddGame } from "../service/game/AddGame";
import Swal from "sweetalert2";
import { AddByeGame } from "../service/game/AddByeGame";
import GetTournaments from "../service/tournament/GetTournaments";
import GetRoundsByTournament from "../service/tournament/GetRoundsByTournament";
import { getPlayer } from "../service/player/GetPlayer";

interface Game {
    gameId: string;
    player1Id: string;
    player2Id: string;
    score1: number;
    score2: number;
    margin: number;
    isgameTied: string;
    winnerId: string;
    gameDate: string;
    isByeGame: string;
}

interface GameWithRoundId extends Game {
    roundId: string;
}

interface Tournament {
    tournamentId: string;
    tournamentName: string;
}

interface Round {
    roundId: string;
    tournamentId: string;
    roundNumber: number;
    roundName: string;
}

interface PlayerIdToName {
    playerId: string;
    firstName: string;
    lastName: string;
}

/* ===========================
   LOAD GAME DATA
=========================== */
const loadGameData = async (
    SetGameData: React.Dispatch<SetStateAction<GameWithRoundId[]>>,
    players: PlayerIdToName[]
) => {
    try {
        const gameDetails: GameWithRoundId[] = await GetGames();

        const tournaments: Tournament[] = await GetTournaments();
        const roundMap: Record<string, string> = {};

        for (const t of tournaments) {
            const rounds: Round[] = await GetRoundsByTournament(t.tournamentId);
            rounds.forEach(r => {
                roundMap[r.roundId] = `${t.tournamentName} - Round ${r.roundNumber}`;
            });
        }

        const resolvedGames: GameWithRoundId[] = gameDetails.map(game => {
            const player1 = players.find(p => p.playerId === game.player1Id);
            const player2 = players.find(p => p.playerId === game.player2Id);
            const winner  = players.find(p => p.playerId === game.winnerId);

            return {
                ...game,
                player1Id: player1 ? `${player1.firstName} ${player1.lastName}` : game.player1Id,
                player2Id: player2 ? `${player2.firstName} ${player2.lastName}` : game.player2Id,
                winnerId:  winner  ? `${winner.firstName} ${winner.lastName}`   : game.winnerId,
                roundId:   roundMap[game.roundId] ?? game.roundId,
            };
        });

        SetGameData(resolvedGames);

    } catch (error) {
        console.error("Error while fetching game Data", error);
    }
};

/* ===========================
   COMPONENT
=========================== */

export function GameConsole() {

    const [gameData, SetGameData] = useState<GameWithRoundId[]>([]);
    const [showEditGameModal, SetShowEditGameModal] = useState(false);
    const [selectedRow, SetSelectedRow] = useState<GameWithRoundId | null>(null);
    const [showAddGameModal, SetShowAddGameModal] = useState(false);
    const [showAddByeGameModal, SetShowAddByeGameModal] = useState(false);
    const [selectedRoundId, SetSelectedRoundId] = useState<string | null>(null);
    const [players, setPlayers] = useState<PlayerIdToName[]>([]);

    /* ===========================
       INITIAL LOAD
    =========================== */
    useEffect(() => {
        const init = async () => {
            try {
                const playersList = await getPlayer();
                setPlayers(playersList);
                await loadGameData(SetGameData, playersList);
            } catch (error) {
                console.error("error during init", error);
            }
        };
        init();
    }, []);

    const refreshTable = async () => {
        const playersList = await getPlayer();
        await loadGameData(SetGameData, playersList);
    };

    /* ===========================
       CRUD HANDLERS
    =========================== */

    const handleUpdate = async () => {
        await refreshTable();
    };

    const handleOnAdd = async () => {
        await refreshTable();
    };

    const handleOnAddBye = async () => {
        await refreshTable();
    };

    const handleEdit = (row: GameWithRoundId) => {
        SetSelectedRow(row);
        SetShowEditGameModal(true);
    };

    const handleDelete = async (gameId: string) => {
        try {
            const confirm = await Swal.fire({
                title: "Are You Sure?",
                text: "This Will Delete The Game.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Yes, Delete It!"
            });

            if (!confirm.isConfirmed) return;

            await DeleteGame(gameId);

            await refreshTable();

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Deleted Game Successfully",
                showConfirmButton: false,
                timer: 3000
            });

        } catch {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Game Deletion Failed",
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    /* ===========================
       TABLE HEADERS
    =========================== */

    const theads: string[] = [
        "Game Id",
        "Player1 Name",
        "Player2 Name",
        "Score 1",
        "Score 2",
        "Margin",
        "Game Tied",
        "Winner",
        "Game Date",
        "Is Bye Game",
        "Round",
        "Action"
    ];

    /* ===========================
       RENDER
    =========================== */

    return (
        <div className="console-page">

            <div className="create-button d-flex justify-content-end p-2">
                <Button className="btn-create" onClick={() => SetShowAddGameModal(true)}>
                    + Add Game
                </Button>
            </div>
<div className="console-table-container">
  
  <div className="console-table-wrapper">

    <Table
      striped
      bordered
      hover
      className="console-table text-center align-middle"
    >
      <thead>
        <tr>
          {theads.map(head => (
            <th key={head}>{head}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {gameData.map(row => (
          <tr key={row.gameId}>

            <td>{row.gameId}</td>
            <td>{row.player1Id}</td>
            <td>{row.player2Id}</td>
            <td>{row.score1}</td>
            <td>{row.score2}</td>
            <td>{row.margin}</td>
            <td>{row.isgameTied ? "Yes" : "No"}</td>
            <td>{row.winnerId}</td>
            <td>{row.gameDate}</td>
            <td>{row.isByeGame ? "Yes" : "No"}</td>
            <td>{row.roundId}</td>

            <td>
              <div className="d-flex justify-content-center gap-2">
                <Button
                  className="btn-edit"
                  onClick={() => handleEdit(row)}
                >
                  Edit
                </Button>

                <Button
                  className="btn-delete"
                  onClick={() => handleDelete(row.gameId)}
                >
                  Delete
                </Button>
              </div>
            </td>

          </tr>
        ))}
      </tbody>

    </Table>

  </div>

</div>

            <EditGame
                show={showEditGameModal}
                selectedRow={selectedRow}
                handleClose={() => SetShowEditGameModal(false)}
                handleUpdate={handleUpdate}
                refreshTable={refreshTable}
            />

            <AddGame
                show={showAddGameModal}
                handleClose={() => SetShowAddGameModal(false)}
                handleAdd={handleOnAdd}
                roundId={selectedRoundId}
            />

            <AddByeGame
                show={showAddByeGameModal}
                handleClose={() => SetShowAddByeGameModal(false)}
                handleAdd={handleOnAddBye}
                roundId={selectedRoundId}
            />

        </div>
    );
}