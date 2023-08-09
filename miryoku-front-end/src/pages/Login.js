import React, { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import axios from "../api/axios"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useUser } from "../context/UserContext"

const LOGIN_URL = '/auth'

export default function Login(props) {

    const { auth, setAuth, persist, setPersist } = useAuth()

    const axiosPrivate = useAxiosPrivate()
    const isInitialRender = useRef(true);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/feed";
    const { user, setUser } = useUser()

    const [message, setMessage] = useState("")

    const [loginDetails, setLoginDetails] = useState({
        "email": "",
        "password": ""
    })


    useEffect(() => {
        let isMounted = true

        const waitRedirect = async () => {
            if (auth?.accessToken) {
                setMessage("You are already logged in! You will be redirected to the feed page.");

                const timer = setTimeout(() => {
                    if (isMounted && auth?.accessToken) {
                        navigate('/feed');
                    }
                }, 3000);

                // Return a cleanup function to clear the timer if the user signs out
                return () => {
                    clearTimeout(timer);
                };
            }
        }
        waitRedirect()

        return () => {
            isMounted = false; // Clean up to prevent state updates on unmounted components
        };

    }, [])

    const [errMessage, setErrMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify(loginDetails),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
            );
    
            const accessToken = response?.data?.accessToken;
            const id = response?.data?.id;
    
            // Update auth state immediately
            setAuth({ id, accessToken });
    
        } catch (error) {
            if (!error?.response) {
                setErrMessage('No server response');
            } else if (error.response?.status === 401) {
                setErrMessage('Incorrect Email or Password');
            } else {
                setErrMessage('Incorrect Email or password');
            }
        }
    }

    // LET THE ASYNCHRONOUS SETAUTH OPERATION BE DONE
    useEffect(() => {
        
        console.log("Here's auth: " + JSON.stringify(auth))

        const populateUser = async () => {
            try {
                const fetchedUser = await axiosPrivate.get('/user/me');
                await setUser(fetchedUser.data);
            } catch (error) {
                if (!error?.response) {
                    setErrMessage('No server response');
                } else if (error.response?.status === 403) {
                    setErrMessage('Invalid access token');
                } 
            }
        }

        if (!isInitialRender.current) {
            populateUser()
        }

    }, [auth])



    useEffect(() => {
        if (!isInitialRender.current) {
            console.log("Here's user: " + JSON.stringify(user));
            setErrMessage('');
            navigate(from, { replace: true });
        } else {
            isInitialRender.current = false;
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target

        setLoginDetails((prevLoginDetails) => {
            return {
                ...prevLoginDetails,
                [name]: value
            }
        })
    }

    const [restrictWidth, setRestrictWidth] = useState("60vw")

    useEffect(() => {

        if (window.innerWidth > 800) {
            setRestrictWidth((prevRestrictWidth) => "60vw")
        }
        else
        {
            setRestrictWidth((prevRestrictWidth) => "90vw")
        }

        const handleResize = () => {
            if (window.innerWidth > 800) {
                setRestrictWidth((prevRestrictWidth) => "60vw")
            }
            else
            {
                setRestrictWidth((prevRestrictWidth) => "60vw")
            }
        }
    
        window.addEventListener('resize', handleResize)
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }, [])

      const togglePersist = () => {
        setPersist((prev) => !prev)
      }

      useEffect(() => {
        localStorage.setItem('persist', persist)
      },[persist])

    return (
        <>
        {message ?
            (
                <div className="all-container">
                    <div className="artwork-container">
                    <div className="flex-column margin-top sleek-text slightly-larger" style={{"alignItems": "center", "justifyContent": "center", "textAlign": "center"}}>
                        <div className="fancy-title">You are already logged in!</div>
                            <p className="sleek-text">You will be redirected to the feed page.</p>
                            <p className="sleek-text">Click <Link style={{"all": "unset", "cursor": "pointer"}} to="/logout"><u>here</u></Link> to signout.</p>
                            <p className="sleek-text">You may also click <Link style={{"all": "unset", "cursor": "pointer"}} to="/feed"><u>here</u></Link> to go to the feed page.</p>
                        </div>
                    </div>
                </div>
            )
            : (<div className="all-container">
            <div className="artwork-container" style={{"width": restrictWidth}}>
                <div className="flex-column" style={{"alignItems": "center", "justifyContent": "center"}}>
                    <div className="flex-column fancy-title"
                    style={{"height": "30vh",
                            "justifyContent": "center"}}>Login</div>
                    <form onSubmit={handleSubmit}>
                        <div className="margin-bottom sleek-text slightly-larger border-it-column">
                            <div className="auth-card">

                                    <label for="email" className="auth-field-label" >Email:</label>
                                    <input className="margin-bottom auth-field" type="input" onChange={handleChange}  placeholder="email" name="email" id='email' required />

                                    <label for="password" className="auth-field-label">Password:</label>
                                    <input className="auth-field" type="password" onChange={handleChange}  placeholder="password" name="password" id='password' required />
                                    
                                <div className="sleek-text margin-top">
                                    <input
                                        type="checkbox"
                                        id="persist"
                                        className="nice-checkbox"
                                        onChange={togglePersist}
                                    />
                                    <label htmlFor="persist"> Stay signed in </label>
                                </div>
                                {
                                    errMessage ?
                                    (
                                    <div className="errorInfo margin-top">
                                        {errMessage}
                                    </div>
                                    )
                                    : (<></>)
                                }
                                <div className="margin-top">If you do not have an account,</div><div>you can create one <Link style={{"all": "unset", "cursor": "pointer"}} to="/signup"><u>here</u></Link>.</div>
                                <button type="submit" className="fade-button bordered-everywhere-button margin-top">Login</button>                            
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>)}
        </>
    )
}