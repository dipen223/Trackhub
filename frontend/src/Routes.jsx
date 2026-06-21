import react,{useEffect} from "react";
import {useNavigate,useRoutes} from 'react-router-dom';

import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import Issue from "./components/issue/Issue.jsx";
import Signup from "./components/auth/Signup.jsx";
import Login from "./components/auth/Login.jsx";

import { useAuth } from "./AuthContext";


const Routes = () => {
    const { currentUser } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        
        if (!currentUser && !["/auth", "/signup"].includes(window.location.pathname)) {
            navigate("/auth");
        }

        if (currentUser && window.location.pathname=="/auth") {
            navigate("/");
        }
    }, [currentUser, navigate]); 

    let element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path:"/issue",
            element:<Issue/>
        },

    ]);

    return element;
}

export default Routes;