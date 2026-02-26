import { useEffect, useState } from "react"
import { Accordion, Modal, Badge, Spinner } from "react-bootstrap"
import GetGamesByRound from "./GetGamesByRound"

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
}

const RoundGamesModal = ({ show, handleClose, roundId, roundNumber, tournamentName }: RoundGamesModalProps) => {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(false)

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

    const getGameResult = (game: Game) => {
        if (game.bye) return <Badge bg="secondary" className="fs-6">Bye Game</Badge>
        if (game.gameTied) return <Badge bg="warning" text="dark" className="fs-6">Game Tied</Badge>
        return <Badge bg="info" className="fs-6">Completed</Badge>
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {tournamentName} — Round {roundNumber}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Loading games...</p>
                    </div>
                ) : games.length === 0 ? (
                    <p className="text-center text-muted py-3">No games found for this round.</p>
                ) : (
                    <Accordion>
                        {games.map((game, index) => (
                            <Accordion.Item eventKey={String(index)} key={game.gameId}>
                                <Accordion.Header>
                                    Game {String(index + 1).padStart(2, "0")}
                                    {game.bye && <Badge bg="secondary" className="ms-2">Bye</Badge>}
                                    {game.gameTied && <Badge bg="warning" text="dark" className="ms-2">Tied</Badge>}
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
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleClose}>Close</button>
            </Modal.Footer>
        </Modal>
    )
}

export default RoundGamesModal