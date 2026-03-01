import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { homeStyles } from '../service/styles/HomeStyles';

export function Home() {
  const navigate = useNavigate();
  // const tileGridRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const link = document.createElement('link');
  //   link.rel = 'stylesheet';
  //   link.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap';
  //   document.head.appendChild(link);

  //   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //   const grid = tileGridRef.current;
  //   if (grid && grid.children.length === 0) {
  //     for (let i = 0; i < 160; i++) {
  //       const t = document.createElement('div');
  //       t.className = 'h-tg-tile';
  //       t.textContent = Math.random() > 0.55 ? letters[Math.floor(Math.random() * 26)] : '';
  //       grid.appendChild(t);
  //     }
  //   }

  //   return () => {
  //     if (document.head.contains(link)) document.head.removeChild(link);
  //   };
  // }, []);

  const tiles: [string, string][] = [
    ['S','1'],['C','3'],['R','1'],['A','1'],['B','3'],
    ['B','3'],['L','1'],['I','1'],['X','8'],
  ];

  return (
    <div className="home-root">
      <style>{homeStyles}</style>

      {/* ── HERO — full viewport, everything on one screen ── */}
      <section className="h-hero">
        {/* <div className="h-tile-grid" ref={tileGridRef}></div> */}
        <div className="h-hero-glow"></div>

        <p className="h-hero-eyebrow">The Official Scrabble Tournament Platform</p>
        <h1 className="h-hero-title">SCRABBLIX</h1>
        <p className="h-hero-tagline">Compete &middot; Rank &middot; Dominate</p>

        <div className="h-score-tiles">
          {tiles.map(([l, p], i) => (
            <div className="h-stile" key={i}>
              <div className="h-stile-letter">{l}</div>
              <div className="h-stile-pts">{p}pt</div>
            </div>
          ))}
        </div>

        <p className="h-hero-desc">
          Track every game, follow tournament standings, study your performance stats,
          and climb the leaderboard — all in one arena built for serious Scrabble players.
        </p>

        <div className="h-hero-ctas">
          <button className="h-btn-gold" onClick={() => navigate('/signup')}>
            Register Now
          </button>
          <button className="h-btn-outline" onClick={() => navigate('/signin')}>
            Sign In
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      {/* <footer className="h-footer">
        <div className="h-footer-logo">SCRABBLIX</div>
        <div className="h-footer-links">
          <a href="#hero">Home</a>
          <a href="/signin">Sign In</a>
          <a href="/signup">Register</a>
        </div>
        <div className="h-footer-copy">© 2026 SCRABBLIX</div>
      </footer> */}
    </div>
  );
}