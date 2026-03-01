import { useLocation } from 'react-router';

function Footer() {
    const location = useLocation();
    const isAuthPage = ['/', '/signin', '/signup', '/home'].includes(location.pathname);

    return (
        <footer style={{
            backgroundColor: '#060413',
            borderTop: '1px solid rgba(224,211,24,0.14)',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: isAuthPage ? 0 : '220px',
            flexWrap: 'wrap',
            gap: '10px',
        }}>
            {/* brand */}
            <div style={{
                fontFamily: "'Cinzel Decorative', cursive",
                fontSize: '0.85rem',
                color: 'rgba(224,211,24,0.55)',
                letterSpacing: '3px',
            }}>
                SCRABBLIX
            </div>

            {/* center */}
            <div style={{
                fontSize: '0.7rem',
                color: 'rgba(191,208,225,0.3)',
                letterSpacing: '1px',
                textAlign: 'center',
            }}>
                © 2026 SCRABBLIX · University of Kelaniya · All rights reserved
            </div>

            {/* right */}
            <div style={{
                fontSize: '0.7rem',
                color: 'rgba(191,208,225,0.25)',
                letterSpacing: '1px',
            }}>
                v1.0.0
            </div>
        </footer>
    );
}

export default Footer;