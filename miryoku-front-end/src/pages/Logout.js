import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";

export default function Logout (props) {
    const logout = useLogout()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/";

    const { auth } = useAuth()

    useEffect(() => {
        if (auth?.accessToken) {
            logout()
            navigate('/', { replace: true })
        }
    }, [])

    return (<></>)
}