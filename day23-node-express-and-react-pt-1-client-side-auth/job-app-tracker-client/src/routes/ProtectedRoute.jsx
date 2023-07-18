import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }){
    const {currentUser} = useContext(AuthContext);
    
    if (!currentUser) {
        console.log("Current User: ");
        console.log(currentUser);
        return <Navigate to="/login" />;
    }
    else{
        console.log("you are logged in");
    }

    return children;
}