function Footer() {
    return (
        <footer style={{
            backgroundColor: '#060413',
            borderTop: '1px solid rgba(224,211,24,0.14)',
            padding: '25px 32px',        /* matches sidebar-footer padding: 12px 0 + button margin */
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            boxSizing: 'border-box',
        }}>
            {/* brand */}
            <div style={{
                fontFamily: "'Cinzel Decorative', cursive",
                fontSize: '0.85rem',
                color: 'rgba(224,211,24,0.45)',
                letterSpacing: '3px',
            }}>
                SCRABBLIX
            </div>

            {/* copyright */}
            <div style={{
                fontSize: '0.65rem',
                color: 'rgba(191,208,225,0.25)',
                letterSpacing: '1px',
                textAlign: 'center',
            }}>
                © 2026 SCRABBLIX · University of Kelaniya · All rights reserved
            </div>

            {/* version */}
            <div style={{
                fontSize: '0.6rem',
                color: 'rgba(191,208,225,0.15)',
                letterSpacing: '2px',
            }}>
                v1.0.0
            </div>
        </footer>
    );
}

export default Footer;