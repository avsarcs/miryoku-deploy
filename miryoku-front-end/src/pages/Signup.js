import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import validator from "validator"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
const REGISTER_URL = '/register'

export default function Signup(props) {

    const navigate = useNavigate()
    const { auth } = useAuth()
    const signedIn = auth?.accessToken

    useEffect(() => {
        let isMounted = true

        const waitRedirect = async () => {
            if (auth?.accessToken) {

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


    const [userDetails, setUserDetails] = useState({
        "name": "",
        "email": "",
        "password": "",
        "about": "",
        "skills": []
    })

    //

    const [validName, setValidName] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [validEmail, setValidEmail] = useState(false)

    const [success, setSuccess] = useState(false)

    const [nameFocus, setNameFocus] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)
    const [emailFocus, setEmailFocus] = useState(false)

    const NAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

    useEffect(() => {
        setValidName( validName => NAME_REGEX.test(userDetails.name) )
    }, [userDetails.name])

    useEffect(() => {
        setValidPassword( PWD_REGEX.test(userDetails.password) )
    }, [userDetails.password])

    useEffect(() => {
        setValidEmail( validator.isEmail(userDetails.email) )
    }, [userDetails.email])


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post( REGISTER_URL,
                JSON.stringify(userDetails),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        withCredentials: true
                    }
                }
            )

            setSuccess(true)
            setTimeout(() => {
                navigate('/login')
            }, 5000);


        } catch (error) {
            
        }
    }

    //

    const [radioData, setRadioData] = useState({
        Musician: false,
        Poet: false,
        Writer: false,
        Director: false,
        Painter: false,
        Photographer: false
    })

    const handleRadioChange = (e) => {

        const { name, checked } = e.target

        setRadioData((prevRadioData) => {
            return {
                ...prevRadioData,
                [name]: checked
            }
        })

        if (checked) {
            setUserDetails((prevUserDetails) => {
                return {
                    ...prevUserDetails,
                    "skills": [...prevUserDetails.skills, name]
                }
            })
        }
        else {

            const skillIndex = userDetails.skills.indexOf(name)

            setUserDetails((prevUserDetails) => {
                return {
                    ...prevUserDetails,
                    "skills": prevUserDetails.skills.slice(0, skillIndex).concat( prevUserDetails.skills.slice(skillIndex + 1) )
                }
            })
        }

    }


    const handleChange = (e) => {
        const { name, value } = e.target

        setUserDetails((prevUserDetails) => {
            return {
                ...prevUserDetails,
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

    return (
        <>
        {signedIn ?
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
            
        ) :
        success ? 
        (<div className="all-container">
            <div className="artwork-container">
            <div className="flex-column margin-top sleek-text slightly-larger" style={{"alignItems": "center", "justifyContent": "center", "textAlign": "center"}}>
                <div className="fancy-title">Successfully created the new profile!</div>
                    <p className="sleek-text">You will be redirected to the login page.</p>
                    <p className="sleek-text">You may also click <Link style={{"all": "unset", "cursor": "pointer"}} to="/login"><u>here</u></Link> to login with your new profile.</p>
                </div>
            </div>
        </div>)
        :
        (
        <div className="all-container">
            <div className="artwork-container" style={{"width": restrictWidth}}>
                <form onSubmit={handleSubmit}>
                <div className="flex-column margin-top sleek-text slightly-larger" style={{"alignItems": "center", "justifyContent": "center", "textAlign": "center"}}>
                    <div className="fancy-title">Creating a Profile</div>
                            <div style={{"width": "15em"}} className="form__group field">
                                <input
                                    onFocus={() => setNameFocus(true)}
                                    onBlur={() => setNameFocus(false)}
                                    maxLength={25} type="input" onChange={handleChange} className="form__field" placeholder="name" name="name" id='name' required />
                                <label htmlFor="name" className="form__label">Name</label>
                                <p className={!validName && nameFocus ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters.<br />
                                    Must begin with a letter.<br />
                                    Letters, numbers, underscores, hyphens allowed.
                                </p>
                            </div>
                            <div style={{"width": "15em"}} className="form__group field">
                                <input
                                    onFocus={() => setPasswordFocus(true)}
                                    onBlur={() => setPasswordFocus(false)}
                                    type="password" onChange={handleChange} className="form__field" placeholder="password" name="password" id='password' required />
                                <label htmlFor="password" className="form__label">Password</label>
                                <p className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.<br />
                                    Must include uppercase and lowercase letters, and a number.
                                </p>
                            </div>
                            <div style={{"width": "15em"}} className="form__group field">
                                <input
                                    onFocus={() => setEmailFocus(true)}
                                    onBlur={() => setEmailFocus(false)}
                                    maxLength={400} type="email" onChange={handleChange} className="form__field" placeholder="email" name="email" id='email' required />
                                <label htmlFor="email" className="form__label">Email</label>
                                <p className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} /> Must be a valid email.
                                </p>
                            </div>
                    <div className="margin-top">What kind of artist are you?</div>
                    <div className="margin-bottom">(Select all that applies)</div>
                    <div className="type-filter filter-sub" style={{"display": "flex", "justifyContent": "center"}}>
                            <input className="hide" type="checkbox" name="Musician" id="Musician" checked={radioData.Musician} onChange={handleRadioChange} />
                            <label className={`cool-label ${radioData.Musician ? "type-selected" : ""}`} htmlFor="Musician">Musician</label>

                            <input className="hide" type="checkbox" name="Painter" id="Painter" checked={radioData.Painter} onChange={handleRadioChange} />
                            <label className={`cool-label ${radioData.Painter ? "type-selected" : ""}`} htmlFor="Painter">Painter</label>

                            <input className="hide" type="checkbox" name="Writer" id="Writer" checked={radioData.Writer} onChange={handleRadioChange} />
                            <label className={`cool-label ${radioData.Writer ? "type-selected" : ""}`} htmlFor="Writer">Writer</label>

                            <input className="hide" type="checkbox" name="Poet" id="Poet" checked={radioData.Poet} onChange={handleRadioChange} />
                            <label className={`cool-label ${radioData.Poet ? "type-selected" : ""}`} htmlFor="Poet">Poet</label>

                            <input className="hide" type="checkbox" name="Director" id="Director" checked={radioData.Director} onChange={handleRadioChange} />
                            <label className={`cool-label ${radioData.Director ? "type-selected" : ""}`} htmlFor="Director">Video Director</label>

                            <input className="hide" type="checkbox" name="Photographer" id="Photographer" checked={radioData.Photographer} onChange={handleRadioChange} />
                            <label className={`cool-label ${radioData.Photographer ? "type-selected" : ""}`} htmlFor="Photographer">Photographer</label>

                    </div>

                    <div className="margin-top margin-bottom">
                        Describe yourself in a few sentences, if you want to:
                    </div>
                    <textarea maxLength={10000} name="about" onChange={handleChange} style={{"background": "white", "height": "6em", "width": "18em", "borderWidth": "2px", "fontSize": "0.8em"}} className="changeable-text about-customize"/>
                    <button
                    disabled={!validName || !validEmail || !validPassword ? true : false}
                    type="submit"
                    className={!validName || !validEmail || !validPassword ?
                        "regular-button-disabled margin-top"
                     : "regular-button margin-top" }>Create profile</button>
                </div>
                </form>
            </div>
        </div> )}
        </>
    )
}