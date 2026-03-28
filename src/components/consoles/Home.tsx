import { useNavigate } from 'react-router';
import { AnimatedBackground } from '../utils/AnimatedBackground';

export function Home() {
  const navigate = useNavigate();

  const heroTiles: [string, string][] = [
    ['S','1'],['C','3'],['R','1'],['A','1'],['B','3'],
    ['B','3'],['L','1'],['I','1'],['X','8'],
  ];

  return (
    <div className="home-root" >

      <section className="h-hero" style={{ position: 'relative', zIndex: 2 }}>
        <div className="h-hero-glow" />
        <p className="h-hero-eyebrow">The Official Scrabble Tournament Platform</p>
        <h1 className="h-hero-title">SCRABBLIX</h1>
        <p className="h-hero-tagline">Compete &middot; Rank &middot; Dominate</p>

        <div className="h-score-tiles">
          {heroTiles.map(([l, p], i) => (
            <div className="h-stile" key={i}>
              <div className="h-stile-letter">{l}</div>
              <div className="h-stile-pts">{p}</div>
            </div>
          ))}
        </div>

        <p className="h-hero-desc">
          Track every game, follow tournament standings, study your performance stats,
          and climb the leaderboard — all in one arena built for serious Scrabble players.
        </p>

        <div className="h-hero-ctas">
          <button className="h-btn-gold" onClick={() => navigate('/signup')}>Register Now</button>
          <button className="h-btn-outline" onClick={() => navigate('/signin')}>Sign In</button>
        </div>
      </section>
    </div>
  );
}