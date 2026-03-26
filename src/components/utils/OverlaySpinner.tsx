interface OverlaySpinnerProps {
    message?: string;
}

export function OverlaySpinner({ message = "Loading..." }: OverlaySpinnerProps) {
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(6, 4, 19, 0.88)",
            backdropFilter: "blur(6px)",
            perspective: "1000px",
        }}>
            <style>{`
                @keyframes flipY {
                    0%   { transform: translate(-50%, -50%) rotateY(0deg) scale(1); }
                    50%  { transform: translate(-50%, -50%) rotateY(180deg) scale(1.1); }
                    100% { transform: translate(-50%, -50%) rotateY(360deg) scale(1); }
                }
                @keyframes pulseRing {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50%      { transform: scale(1.18); opacity: 0.05; }
                }
                .os-ring {
                    animation: pulseRing 2s ease-in-out infinite;
                    transform-origin: center;
                }
                .os-text-base {
                    position: absolute;
                    /* Core absolute centering mixin */
                    top: 50%;
                    left: 50%;
                    /* Important: transform is shared with the animation */
                    font-family: 'Cinzel Decorative', cursive;
                    font-size: 80px;
                    font-weight: 900;
                    line-height: 1; /* Essential for text centering */
                    color: #e0d318;
                    text-shadow: 0 0 25px rgba(224, 211, 24, 0.5);
                    backface-visibility: visible;
                    transform-style: preserve-3d;
                    /* Ensure no intrinsic padding/margins cause offsets */
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .os-trail-2 {
                    /* Notice we keep translate(-50%, -50%) in the keyframe */
                    animation: flipY 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    animation-delay: -0.3s;
                    opacity: 0.15;
                }
                .os-trail-1 {
                    animation: flipY 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    animation-delay: -0.15s;
                    opacity: 0.4;
                }
                .os-main {
                    animation: flipY 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .os-message {
                    margin-top: 40px;
                    color: #f5f0e8;
                    font-family: 'Cinzel', serif;
                    font-size: 0.85rem;
                    letter-spacing: 5px;
                    text-transform: uppercase;
                    font-weight: 600;
                    opacity: 0.9;
                    text-align: center;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }
            `}</style>

            {/* Container for the spinner element (160x160) */}
            <div style={{
                position: "relative",
                width: 160,
                height: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transformStyle: "preserve-3d"
            }}>
                {/* 1. Pulsing ring 
                  Centered using top: 50%, left: 50% and translate
                */}
                <svg viewBox="0 0 120 120" width="140" height="140" style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <circle className="os-ring" cx="60" cy="60" r="52" fill="none" stroke="#e0d318" strokeWidth="0.5" />
                </svg>

                {/* 2. Flipping 'S' letters 
                  Centered using top: 50%, left: 50% and flipY animation (which includes translate)
                */}
                <span className="os-text-base os-trail-2">S</span>
                <span className="os-text-base os-trail-1">S</span>
                <span className="os-main os-text-base">S</span>
            </div>

            {message && (
                <p className="os-message">
                    {message}
                </p>
            )}
        </div>
    );
}