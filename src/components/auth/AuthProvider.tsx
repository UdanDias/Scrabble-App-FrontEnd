// import { Children,createContext, ReactNode, useContext, useEffect, useState } from "react";

//     interface AuthContextType{
//         isAuthenticated:boolean;
//         login:(token:string)=>void;
//         logout:()=>void;

//     }

//     const AuthContext = createContext<AuthContextType | undefined>(undefined)
//     export const AuthProvider=({children}:{children:ReactNode})=>{

//         const [isAuthenticated,SetIsAuthenticated]=useState(false)
//         useEffect(()=>{
//             const token=localStorage.getItem("scrblToken")
//             if(token){
//                 SetIsAuthenticated(!!token)
//             }

//         },[])


//         const login=(token :string)=>{
//             localStorage.setItem("scrblToken",token.trim())
//             SetIsAuthenticated(true)
//         }

//         const logout=()=>{
//             localStorage.removeItem("scrblToken")
//             SetIsAuthenticated(false)
//         }
//         return(
//         <>
//             <AuthContext.Provider value={{isAuthenticated,login,logout}}>
//                 {children}
//             </AuthContext.Provider>
//         </>
//         );
//     } 
//     export const useAuth=()=>{
//         const context= useContext(AuthContext)
//         if(!context){
//             throw new Error("useAuth should be used within an AuthProvider")
//         }
//         return context;
//     }
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";  // npm install jwt-decode

interface JwtPayload {
    roles: string;
    playerId: string;
    sub: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, SetIsAuthenticated] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("scrblToken");
        if (token) {
            SetIsAuthenticated(true);
            const decoded = jwtDecode<JwtPayload>(token);
            setRole(decoded.roles);  // "ROLE_ADMIN" or "ROLE_USER"
        }
    }, []);

    const login = (token: string) => {  // no change to signature
        localStorage.setItem("scrblToken", token.trim());
        SetIsAuthenticated(true);
        const decoded = jwtDecode<JwtPayload>(token);
        setRole(decoded.roles);
    };

    const logout = () => {
        localStorage.removeItem("scrblToken");
        SetIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth should be used within an AuthProvider");
    return context;
};