import { useEffect, useState } from "react"
import { Accordion, Modal, Spinner, Button, Badge } from "react-bootstrap"
import Swal from "sweetalert2"
import GetGamesByRound from "./GetGamesByRound"
import CompleteRound from "./CompleteRound"
import { useAuth } from "../../auth/AuthProvider"

interface Game {
    gameId: string
    player1Id: string
    player2Id: string
    player1Name: string
    player2Name: string
    winnerName: string
    score1: number
    score2: number
    margin: number
    gameTied: boolean
    winnerId: string
    gameDate: string
    bye: boolean
}

interface RoundGamesModalProps {
    show: boolean
    handleClose: () => void
    roundId: string | null
    roundNumber: number | null
    tournamentName: string
    // ── NEW: pass whether this round is already completed ──────────────────
    isCompleted?: boolean
    // ── NEW: called after successful completion so parent can update state ─
    onRoundCompleted?: (roundId: string) => void
}

const RoundGamesModal = ({
    show,
    handleClose,
    roundId,
    roundNumber,
    tournamentName,
    isCompleted = false,
    onRoundCompleted,
}: RoundGamesModalProps) => {
    const { role } = useAuth()
    const isAdmin = role === "ROLE_ADMIN"

    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(false)
    const [completing, setCompleting] = useState(false)
    const [completed, setCompleted] = useState(isCompleted)

    // Sync completed state when the prop changes (e.g. different round opened)
    useEffect(() => {
        setCompleted(isCompleted)
    }, [isCompleted, roundId])

    useEffect(() => {
        if (show && roundId) {
            setGames([])
            setLoading(true)
            GetGamesByRound(roundId)
                .then(data => setGames(data))
                .catch(err => console.error("Error fetching games", err))
                .finally(() => setLoading(false))
        }
    }, [show, roundId])

    // ── Complete round handler ─────────────────────────────────────────────
    const handleCompleteRound = async () => {
        if (!roundId) return

        const confirm = await Swal.fire({
            title: "Complete Round?",
            html: `
                <p style="color:#bfd0e1d1;margin:0">
                    Mark <strong>Round ${roundNumber}</strong> as completed.<br/>
                    <span style="color:#e0d318aa;font-size:0.85rem">
                        Any registered players who did not play in this round
                        will receive a <strong>−50 margin penalty</strong>.
                    </span>
                </p>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, complete it",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#510dfd",
            cancelButtonColor: "#6c757d",
        })

        if (!confirm.isConfirmed) return

        setCompleting(true)
        try {
            await CompleteRound(roundId)
            setCompleted(true)
            onRoundCompleted?.(roundId)

            Swal.fire({
                title: "Round Completed",
                html: `<p style="color:#bfd0e1d1">Round ${roundNumber} has been marked complete. Absence penalties have been applied and rankings updated.</p>`,
                icon: "success",
                confirmButtonColor: "#510dfd",
            })
        } catch (e: any) {
            const status = e?.response?.status
            if (status === 409) {
                // Already completed — just update local state silently
                setCompleted(true)
            } else {
                Swal.fire("Error", "Failed to complete round. Please try again.", "error")
            }
        } finally {
            setCompleting(false)
        }
    }

    const getGameResult = (game: Game) => {
        if (game.bye) return <span className="game-status game-status-bye">Bye Game</span>
        if (game.gameTied) return <span className="game-status game-status-tied">Game Tied</span>
        return <span className="game-status game-status-completed">Completed</span>
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg" className="dark-modal">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center gap-2">
                    <Modal.Title>
                        {tournamentName} — Round {roundNumber}
                    </Modal.Title>
                    {/* Completed badge next to title */}
                    {completed && (
                        <Badge style={{
                            background: "rgba(94,229,170,0.12)",
                            color: "#5ee5aa",
                            border: "1px solid rgba(94,229,170,0.25)",
                            fontWeight: 400,
                            fontSize: "0.68rem",
                            letterSpacing: "0.8px",
                            padding: "4px 8px",
                        }}>
                            COMPLETED
                        </Badge>
                    )}
                </div>
            </Modal.Header>

            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" style={{ color: "#e0d318d4" }} />
                        <p className="mt-2 profile-value">Loading games...</p>
                    </div>
                ) : games.length === 0 ? (
                    <p className="text-center profile-value py-3">No games found for this round.</p>
                ) : (
                    <Accordion className="leaderboard-accordion">
                        {games.map((game, index) => (
                            <Accordion.Item eventKey={String(index)} key={game.gameId}>
                                <Accordion.Header>
                                    Game {String(index + 1).padStart(2, "0")}
                                    {game.bye && <span className="game-status game-status-bye ms-2">Bye</span>}
                                    {game.gameTied && <span className="game-status game-status-tied ms-2">Tied</span>}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="card p-3">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-6 text-start">
                                                    <p><strong>Game ID:</strong> {game.gameId}</p>
                                                    <p><strong>Player 1:</strong> {game.player1Name}</p>
                                                    <p><strong>Player 2:</strong> {game.player2Name}</p>
                                                    <p><strong>Date:</strong> {game.gameDate}</p>
                                                </div>
                                                <div className="col-6 text-start">
                                                    <p><strong>Bye:</strong> {game.bye ? "Yes" : "No"}</p>
                                                    <p><strong>Score:</strong> {game.score1} - {game.score2}</p>
                                                    <p><strong>Margin:</strong> {game.margin}</p>
                                                    <p><strong>Tied:</strong> {game.gameTied ? "Yes" : "No"}</p>
                                                    <p><strong>Winner:</strong> {game.winnerName}</p>
                                                </div>
                                            </div>
                                            <div className="text-center mt-2">
                                                {getGameResult(game)}
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between align-items-center">
                {/* Left side: Complete Round button — admin only, hidden once completed */}
                <div>
                    {isAdmin && !completed && (
                        <button
                            onClick={handleCompleteRound}
                            disabled={completing || games.length === 0}
                            style={{
                                background: completing || games.length === 0
                                    ? "transparent"
                                    : "rgba(94,229,170,0.08)",
                                border: "1px solid rgba(94,229,170,0.3)",
                                color: completing || games.length === 0
                                    ? "rgba(94,229,170,0.3)"
                                    : "#5ee5aa",
                                borderRadius: "6px",
                                padding: "6px 16px",
                                fontSize: "0.8rem",
                                letterSpacing: "0.5px",
                                cursor: completing || games.length === 0 ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => {
                                if (!completing && games.length > 0) {
                                    const btn = e.currentTarget as HTMLButtonElement
                                    btn.style.background = "rgba(94,229,170,0.15)"
                                    btn.style.borderColor = "rgba(94,229,170,0.6)"
                                }
                            }}
                            onMouseLeave={e => {
                                const btn = e.currentTarget as HTMLButtonElement
                                btn.style.background = "rgba(94,229,170,0.08)"
                                btn.style.borderColor = "rgba(94,229,170,0.3)"
                            }}
                        >
                            {completing ? "Completing..." : "✓ Complete Round"}
                        </button>
                    )}

                    {/* Show a static label once completed */}
                    {isAdmin && completed && (
                        <span style={{
                            color: "#5ee5aa80",
                            fontSize: "0.75rem",
                            letterSpacing: "1px",
                        }}>
                            ✓ Round already completed
                        </span>
                    )}
                </div>

                {/* Right side: Close button */}
                <Button className="btn-edit" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RoundGamesModal