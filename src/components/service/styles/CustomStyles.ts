export const customStyles = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: "#0d0c18",
        border: `1px solid ${state.isFocused ? "rgba(224, 211, 24, 0.8)" : "rgba(224, 211, 24, 0.3)"}`,
        borderRadius: "8px",
        boxShadow: "none",
        "&:hover": {
            borderColor: "rgba(224, 211, 24, 0.6)",
            boxShadow: "none"
        }
    }),
    valueContainer: (base: any) => ({
        ...base,
        justifyContent: "center",
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused ? "rgba(224, 211, 24, 0.15)" : "#0d0c18",
        color: state.isFocused ? "#e0d31877" : "#bfd0e1d1",
        cursor: "pointer",
        textAlign: "center" as const,
        "&:active": {
            backgroundColor: "rgba(6, 6, 2, 0.25)"
        }
    }),
    singleValue: (base: any) => ({
        ...base,
        color: "#e0d318a1",
        textAlign: "center" as const,
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: "rgba(224, 211, 24, 0.6)",
        "&:hover": { color: "#e0d318d4" }
    }),
    indicatorSeparator: (base: any) => ({
        ...base,
        backgroundColor: "rgba(224, 211, 24, 0.2)"
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: "#0d0c18",
        border: "1px solid rgba(224, 211, 24, 0.2)",
        borderRadius: "8px",
        zIndex: 9999,
    }),
    menuList: (base: any) => ({
        ...base,
        backgroundColor: "#0d0c18",
        borderRadius: "8px",
        padding: 0,
    }),
    menuPortal: (base: any) => ({
        ...base,
        zIndex: 9999,
    }),
    placeholder: (base: any) => ({
        ...base,
        color: "#e0d318d4",
        textAlign: "center" as const,
    }),
};