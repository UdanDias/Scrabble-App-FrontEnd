import ReactSelect from "react-select";
import { customStyles } from "../service/styles/CustomStyles";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectModalProps {
    show: boolean;
    title: string;
    subtitle?: string;
    options: SelectOption[];
    placeholder?: string;
    confirmText?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}

export const SelectModal = ({
    show,
    title,
    subtitle,
    options,
    placeholder = "Select an option",
    confirmText = "Next",
    onConfirm,
    onCancel,
}: SelectModalProps) => {
    if (!show) return null;

    let selected: SelectOption | null = null;

    const handleConfirm = () => {
        if (!selected) return;
        onConfirm(selected.value);
    };

    return (
        <div
            style={{
                position: "fixed", inset: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                zIndex: 99999,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div style={{
                backgroundColor: "#060413",
                border: "1px solid rgba(224,211,24,0.15)",
                borderRadius: "16px",
                padding: "32px",
                width: "420px",
                boxShadow: "0 4px 120px rgba(97,71,6,0.8)",
            }}>
                {/* title */}
                <h4 style={{
                    color: "#e0d318d4",
                    fontFamily: "'Lobster Two', cursive",
                    letterSpacing: "2px",
                    textAlign: "center",
                    marginBottom: subtitle ? "8px" : "24px",
                }}>
                    {title}
                </h4>

                {/* subtitle */}
                {subtitle && (
                    <p style={{
                        color: "#bfd0e1d1", fontSize: "0.85rem",
                        textAlign: "center", marginBottom: "24px",
                    }}>
                        {subtitle}
                    </p>
                )}

                {/* react-select */}
                <div style={{ marginBottom: "24px" }}>
                    <ReactSelect
                        options={options}
                        styles={customStyles}
                        placeholder={placeholder}
                        menuPosition="fixed"
                        onChange={(opt) => { selected = opt as SelectOption; }}
                    />
                </div>

                {/* buttons */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button
                        onClick={onCancel}
                        style={{
                            background: "transparent",
                            border: "1px solid #767976",
                            color: "#c8d0c8",
                            padding: "8px 24px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            fontSize: "0.85rem",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => {
                            (e.target as HTMLButtonElement).style.backgroundColor = "rgba(118,121,118,0.2)";
                            (e.target as HTMLButtonElement).style.color = "#fff";
                        }}
                        onMouseLeave={e => {
                            (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                            (e.target as HTMLButtonElement).style.color = "#c8d0c8";
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        style={{
                            background: "transparent",
                            border: "1px solid #510dfd",
                            color: "#a78bfa",
                            padding: "8px 24px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            fontSize: "0.85rem",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => {
                            (e.target as HTMLButtonElement).style.backgroundColor = "rgba(81,13,253,0.2)";
                            (e.target as HTMLButtonElement).style.color = "#fff";
                        }}
                        onMouseLeave={e => {
                            (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                            (e.target as HTMLButtonElement).style.color = "#a78bfa";
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};