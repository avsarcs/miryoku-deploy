import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useUser } from "../context/UserContext";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    const { auth, persist } = useAuth()
    const isInitialRender = useRef(true)
    const axiosPrivate = useAxiosPrivate()
    const { setUser } = useUser()


    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh()
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)
    }, [])

    useEffect(() => {

        const populateUser = async () => {
            try {
                const fetchedUser = await axiosPrivate.get('/user/me');
                await setUser(fetchedUser.data);
            } catch (error) {
                
            }
        }

        if (!isInitialRender.current) {
            populateUser()
        } else {
            isInitialRender.current = false
        }

    }, [auth])

    
    return (
        <>
            { !persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin;