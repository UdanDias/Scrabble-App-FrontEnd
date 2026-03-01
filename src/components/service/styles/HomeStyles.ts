export const homeStyles = `
  :root {
    --gold:       #e0d318;
    --gold-bright:#f5e228;
    --gold-dim:   rgba(224,211,24,0.55);
    --gold-faint: rgba(224,211,24,0.10);
    --gold-glow:  rgba(224,211,24,0.22);
    --bg-deep:    #060413;
    --bg-dark:    #0d0c18;
    --bg-mid:     #12102a;
    --bg-card:    #0f0d1f;
    --cream:      #f5f0e8;
    --muted:      #bfd0e1;
    --border:     rgba(224,211,24,0.14);
  }

  /* ── ROOT ── */
  .home-root {
    background: var(--bg-deep);
    color: var(--cream);
    font-family: 'Lato', sans-serif;
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
  }

  /* noise texture overlay */
  .home-root::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0;
  }

  /* ── HERO ── */
  .h-hero {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 100px 40px 60px;
    overflow: hidden;
  }

  /* GOLD LETTER BACKGROUND — grid container */
  .h-tile-grid {
    position: absolute; inset: 0;
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    grid-template-rows: repeat(10, 1fr);
    pointer-events: none; z-index: -1;
  }

  /* GOLD LETTER BACKGROUND — each letter tile */
  .h-tg-tile {
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cinzel Decorative', cursive;
    font-size: 0.9rem; font-weight: 700;
    color: rgba(224,211,24,0.18);          /* gold at 18% opacity */
    border: 1px solid rgba(224,211,24,0.04);
    animation: hTilePulse 6s ease-in-out infinite;
  }
  .h-tg-tile:nth-child(3n+1) { animation-delay: 0s; }
  .h-tg-tile:nth-child(3n+2) { animation-delay: 2s; }
  .h-tg-tile:nth-child(3n)   { animation-delay: 4s; }
  @keyframes hTilePulse {
    0%,100% { opacity: .15; }
    50%     { opacity: .6; }
  }

  /* radial glow behind the title */
  .h-hero-glow {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-55%);
    width: 900px; height: 600px;
    background: radial-gradient(ellipse, rgba(224,211,24,.07) 0%, transparent 68%);
    pointer-events: none;
  }

  .h-hero-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem; letter-spacing: 5px;
    text-transform: uppercase; color: rgba(224,211,24,0.55);
    margin-bottom: 20px;
    animation: hFadeUp .8s ease both;
  }
  .h-hero-title {
    font-family: 'Cinzel Decorative', cursive;
    font-size: clamp(3.8rem,10vw,7.5rem);
    font-weight: 900; line-height: 1;
    color: #e0d318;
    text-shadow: 0 0 50px rgba(224,211,24,.45), 0 0 120px rgba(224,211,24,.12);
    letter-spacing: 8px;
    animation: hFadeUp .9s ease .08s both;
  }
  .h-hero-tagline {
    font-family: 'Cinzel', serif;
    font-size: clamp(.9rem,2vw,1.25rem);
    color: #f5f0e8; opacity: .75;
    letter-spacing: 3px; margin-top: 18px;
    animation: hFadeUp .9s ease .18s both;
  }

  /* ── SCRABBLE LETTER TILES (S C R A B B L I X) ── */
  .h-score-tiles {
    display: flex; gap: 10px; justify-content: center;
    margin-top: 36px;
    animation: hFadeUp .9s ease .3s both;
  }
.h-stile {
  width: 52px; height: 58px;
  background: #0f0d1f;
  border: 1px solid rgba(224,211,24,0.14);
  border-radius: 7px;
  display: flex;
  align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,.5);
  transition: transform .2s, box-shadow .2s;
  cursor: default;
  position: relative; /* ← add this */
}
.h-stile-letter {
  font-family: 'Cinzel Decorative', cursive;
  font-size: 1.3rem; font-weight: 900; color: #e0d318;
}
.h-stile-pts {
  position: absolute; /* ← add this */
  bottom: 4px;        /* ← add this */
  right: 5px;         /* ← add this */
  font-size: .5rem; font-weight: 700;
  color: rgba(224,211,24,0.55); letter-spacing: 1px;
}
  .h-stile:hover { transform: translateY(-5px); box-shadow: 0 0 20px rgba(224,211,24,0.22); }
  .h-hero-desc {
    max-width: 540px;
    font-size: .95rem; color: #bfd0e1;
    line-height: 1.85; font-weight: 300;
    margin-top: 32px;
    animation: hFadeUp .9s ease .42s both;
  }
  .h-hero-ctas {
    display: flex; gap: 14px; margin-top: 40px;
    flex-wrap: wrap; justify-content: center;
    animation: hFadeUp .9s ease .54s both;
  }

  /* ── BUTTONS ── */
  .h-btn-gold {
    background: #e0d318; color: #060413;
    border: none; padding: 14px 38px;
    font-family: 'Cinzel', serif; font-size: .78rem;
    font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    border-radius: 5px; cursor: pointer; text-decoration: none;
    transition: all .25s; display: inline-block;
  }
  .h-btn-gold:hover {
    background: #f5f0e8;
    box-shadow: 0 0 32px rgba(224,211,24,.45);
    transform: translateY(-2px);
  }
  .h-btn-outline {
    background: transparent; color: #e0d318;
    border: 1px solid rgba(224,211,24,.45);
    padding: 14px 38px;
    font-family: 'Cinzel', serif; font-size: .78rem;
    font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    border-radius: 5px; cursor: pointer; text-decoration: none;
    transition: all .25s; display: inline-block;
  }
  .h-btn-outline:hover {
    background: rgba(224,211,24,0.10);
    border-color: #e0d318;
    transform: translateY(-2px);
  }

  /* ── CTA SECTION ── */
  .h-cta-wrap {
    position: relative; z-index: 1;
    padding: 120px 60px; text-align: center; overflow: hidden;
  }
  .h-cta-wrap::before {
    content: ''; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 700px; height: 500px;
    background: radial-gradient(ellipse, rgba(224,211,24,.065) 0%, transparent 65%);
    pointer-events: none;
  }
  .h-cta-title {
    font-family: 'Cinzel Decorative', cursive;
    font-size: clamp(1.8rem,4vw,3.2rem); color: #e0d318; letter-spacing: 3px;
    text-shadow: 0 0 40px rgba(224,211,24,.3); margin-bottom: 14px;
  }
  .h-cta-sub {
    font-family: 'Cinzel', serif; font-size: 1rem;
    color: #f5f0e8; opacity: .7; letter-spacing: 2px; margin-bottom: 44px;
  }
  .h-cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

  /* ── FOOTER ── */
  .h-footer {
    position: relative; z-index: 1;
    background: #060413;
    border-top: 1px solid rgba(224,211,24,0.14);
    padding: 28px 56px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .h-footer-logo {
    font-family: 'Cinzel Decorative', cursive;
    font-size: 1rem; color: rgba(224,211,24,.55); letter-spacing: 3px;
  }
  .h-footer-links { display: flex; gap: 28px; }
  .h-footer-links a {
    font-family: 'Cinzel', serif; font-size: .62rem;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(191,208,225,.35); text-decoration: none; transition: color .2s;
  }
  .h-footer-links a:hover { color: #e0d318; }
  .h-footer-copy { font-size: .7rem; color: rgba(191,208,225,.3); letter-spacing: 1px; }

  /* ── ANIMATIONS ── */
  @keyframes hFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── RESPONSIVE ── */
  @media(max-width: 900px) {
    .h-hero-ctas { flex-direction: column; align-items: center; }
    .h-score-tiles { flex-wrap: wrap; }
    .h-cta-wrap { padding: 80px 24px; }
    .h-footer { flex-direction: column; gap: 16px; text-align: center; padding: 24px; }
    .h-footer-links { justify-content: center; }
  }
`;