import React, { useEffect } from "react";
import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Feedback(props) {

    
    const { user, setUser } = useUser()

    const [feedback, setFeedback] = useState({
        body: "",
        submitterID: user?._id
    })
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()


    // Populate user
    useEffect(() => {
        const populateUser = async () =>  {
            try {
                const fetchedUser = await axiosPrivate.get('/user/me')
                setUser(fetchedUser.data)
            } catch (error) {
                console.error(error)
            }
        }
        populateUser()
    }, [])

    // Keep feedback up to date with user
    useEffect(() => {
        setFeedback((prevFeedback) => {
            return {
                ...prevFeedback,
                submitterID: user?._id
            }
        })
    }, [user])

    const handleChange = (e) => {
        const { value } = e.target
        setFeedback((prevFeedback) => {
            return {
                ...prevFeedback,
                body: value
            }
        } )
    }

    const [feedbackSent, setFeedbackSent] = useState(false)

    const submitFeedback = async (e) => {
        e.preventDefault()
        // Actually submit the feedback (back-end)
        try {
            await axiosPrivate.post('/opinion', feedback)

            setFeedbackSent(true)
            setTimeout(() => {
                navigate('/feed', { replace: true } )
            }, 3000)

        } catch (error) {
            console.error(error)
        }
        
    }

    return ( <>
        { 
            feedbackSent ?
            <div className="all-container">
                    <div className="artwork-container">
                    <div className="flex-column margin-top sleek-text slightly-larger" style={{"alignItems": "center", "justifyContent": "center", "textAlign": "center"}}>
                        <div className="fancy-title">We got your feedback!</div>
                            <p className="sleek-text">You will be redirected to the feed page.</p>
                            <p className="sleek-text">You may also click <Link style={{"all": "unset", "cursor": "pointer"}} to="/feed"><u>here</u></Link> to go to the feed page.</p>
                        </div>
                    </div>
                </div>
            
            :

        <div className="all-container">
            <form onSubmit={submitFeedback}>
                <div className="flex-column" style={{"alignItems": "center", "justifyContent": "center"}}>
                <div className="margin-top margin-bottom flex-column fancy-title" style={{"height": "30vh", "justifyContent": "center", "textAlign": "center"}}>We want to hear from you :)</div>
                <div className="sleek-text margin-bottom">Share your insights, suggestions and complaints!</div>
                <textarea required className="big-textbox margin-bottom" style={{"width": "40vw"}} onChange={handleChange}/>
                <button type="submit" className="bordered-everywhere-button" >Submit</button>
                </div>
            </form>
        </div>
            
        }
        </>
    )
}