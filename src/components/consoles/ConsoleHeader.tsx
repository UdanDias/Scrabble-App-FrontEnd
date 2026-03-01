interface ConsoleHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

export function ConsoleHeader({ title, subtitle, icon }: ConsoleHeaderProps) {
    return (
        <div style={{
            width: '90%',
            margin: '0 auto 4px auto',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(224,211,24,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            justifyContent:"center",
        }}>
            {icon && (
                <div style={{
                    width: '42px', height: '42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(224,211,24,0.25)',
                    background: 'rgba(224,211,24,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 0 12px rgba(224,211,24,0.1)',
                }}>
                    {icon}
                </div>
            )}
            <div>
                <h2 style={{
                    fontFamily: "'Cinzel', serif",
                    color: '#e0d318d4',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    margin: 0,
                    textShadow: '0 0 20px rgba(224,211,24,0.2)',
                }}>
                    {title}
                </h2>
                {subtitle && (
                    <p style={{
                        color: 'rgba(191,208,225,0.45)',
                        fontSize: '0.72rem',
                        letterSpacing: '1.5px',
                        margin: '3px 0 0 0',
                        fontFamily: "'Lato', sans-serif",
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}