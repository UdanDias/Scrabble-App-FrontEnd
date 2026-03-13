import "./LoadingSpinnerStyles.css";

interface LoadingSpinnerProps {
    message?: string;
    size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ message = "Loading...", size = "md" }: LoadingSpinnerProps) {
    return (
        <div className={`spinner-wrapper spinner-${size}`}>
            <div className="spinner-ring">
                <svg viewBox="0 0 50 50" className="spinner-svg">
                    <circle
                        cx="25" cy="25" r="20"
                        fill="none"
                        strokeWidth="3"
                        className="spinner-track"
                    />
                    <circle
                        cx="25" cy="25" r="20"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="spinner-arc"
                    />
                </svg>
            </div>
            {message && <p className="spinner-message">{message}</p>}
        </div>
    );
}