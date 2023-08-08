import React, { useState, useRef, useEffect } from 'react'
import Reply from './Reply';
import { Link, useNavigate } from "react-router-dom"
import StarRating from './StarRating';
import FlagOverlay from './FlagOverlay';
import useAuth from '../hooks/useAuth';
import { useUser } from '../context/UserContext';
import axios from '../api/axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Overlay from './Overlay';
import ReadMore from './ReadMore';

export default function Feedback(props) {
    const { feedback } = props
    const { auth } = useAuth()
    const { user } = useUser()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const hasAuth = auth?.accessToken

    const feedbackID = feedback._id;

    const [currentUserRating, setCurrentUserRating] = useState(hasAuth ? user?.feedbackRatings[feedback._id] : 0)
    const [artwork, setArtwork] = useState(props.artwork)
    const [replies, setReplies] = useState([])
    const [replyCount, setReplyCount] = useState(0)
    const [reviewer, setReviewer] = useState({})

    // DELETE OVERLAY
    const [isDeleteOverlayOpen, setIsDeleteOverlayOpen] = useState(false)

    const toggleDeleteOverlay = () => {
        setIsDeleteOverlayOpen((prev) => !prev)
    }

    const deleteFeedback = async (e) => {
        e.preventDefault()
        try {
            await axiosPrivate.delete(`/feedback/${feedback._id}`)
            navigate(0)
        } catch (error) {
            console.error(error)
        }
    }

    const [ownFeedback, setOwnFeedback] = useState(false)

    useEffect(() => {
        if (user && feedback) {
            setOwnFeedback(user?._id === feedback?.ownerID)
        }
    }, [user, feedback])

    // END OF DELETE OVERLAY RELATED CODE

    // Keep currentUserRating up to date if user loads late
    useEffect(() => {
        setCurrentUserRating(hasAuth ? user?.feedbackRatings[feedback._id] : 0)
    }, [user])

    // Populate reviewer
    useEffect(() => {
        const populateReviewer = async () => {
            const fetchedReviewer = await axios.get(`/user/minimal/${feedback.ownerID}`)
            setReviewer(fetchedReviewer.data)
        }
        populateReviewer()
    }, [])

    // Populate replies & replyCount
    useEffect(() => {
        if (feedback) {
            const populateReplies = async () => {
                const fetchedReplies = await axios.get(`/reply/feedback/${feedback._id}`)
                setReplies(fetchedReplies.data)
            }
            populateReplies()
        }
    }, [feedback])

    useEffect(() => {
        setReplyCount(replies.length)
    }, [replies])

    // Fetch the artwork name only if the feedback is outside the artwork
    useEffect(() => {
        if (props.isOutside) {
            const populateArtwork = async () => {
                const fetchedArtwork = await axios.get(`/artwork/title/${feedback.artworkID}`)
                setArtwork(fetchedArtwork.data)
            }
            populateArtwork()
        }
    }, [])

    // Represent a reply as an object (going to be stored in the database)
    const [ reply, setReply ] = useState({
        "parentID": props?._id,
        "body": "",
        "ownerID": user?._id,
        "for": "feedback",
        "dateCreated": (new Date()).toISOString(),
        "dateUpdated": (new Date()).toISOString()
    })

    // Configuring the reply bar stylistically
    const [replyButtonStyle, setReplyButtonStyle] = useState({
        "display": "none"
    })

    const replyBarRef = useRef(null)

    const [replyBarStyle, setReplyBarStyle] = useState({
        "borderColor": "lightgray"
    })

    // Make the reply bar grow or shrink accordingly as new lines are entered or deleted.
    React.useEffect(() => {
        const replyBar = replyBarRef.current

        const adjustReplyBarHeight = () => {
            replyBar.style.height = "auto"
            replyBar.style.height = `${replyBar.scrollHeight}px`
        }

        const handleInput = () => {
            adjustReplyBarHeight()
        }

        if (replyBar) {
            replyBar.addEventListener("input", handleInput)
        }

        return () => {
            if (replyBar) {
                replyBar.removeEventListener("input", handleInput)
            }
        }

    }, [])

    async function handleFeedbackRating(rating) {
        try {
            await axiosPrivate.post(`/feedback/${feedback._id}`, { rating })
        } catch (error) {
            console.error(error)
        }
    }

    // Change reply object when the user writes new stuff.
    function handleReply(e) {

        const { value } = e.target
        setReply( (reply) => {
            return {
                ...reply,
                "body": value
            }
        });
    }

    // Show the submit reply button only if the reply bar is clicked.
    function replyBarClicked(e) {

        setReplyBarStyle({
            "borderColor": "black"
        })

        setReplyButtonStyle({
            "display": "block"
        })
    }

    function replyBarUnclicked(e) {

        setReplyBarStyle({
            "borderColor": "lightgray"
        })

        setReplyButtonStyle({
            "display": "none"
        })
    }

    // Keep track of whether the reply section is open or not
    const [ repliesOpen, setRepliesOpen ] = useState(false);

    // Part below is related to the flag overlay functionality
    const [isFlagOverlayOpen, setIsFlagOverlayOpen] = useState(false)

    const toggleFlagOverlay = () => {
        setIsFlagOverlayOpen((prevState) => !prevState)
    }

    return (
        <div className='feedback-box'>

            { hasAuth &&
            <FlagOverlay
                isOpen={isFlagOverlayOpen}
                onClose={toggleFlagOverlay}
                forWhat={"feedback"}
                _id={feedbackID}
                suspectID={feedback?.ownerID}
                submitterID={user?._id}/>
            }

            {
                ownFeedback &&
                <Overlay isOpen={isDeleteOverlayOpen} onClose={toggleDeleteOverlay}>
                <div className="overlay-wrapper">
                    <form onSubmit={deleteFeedback}>
                        <div className="sleek-text">Are you sure you want to delete this feedback?</div>
                        <button type="submit" className="everywhere-button">Yes</button>
                    </form>
                </div>
                </Overlay>
            }

            <div className='feedback-details'>
                <Link style={{"all": "unset", "cursor": "pointer"}} target='_blank' to={`/user/${reviewer?._id}`}><div className='feedback-detail'> {reviewer?.name} </div></Link>
                <div className='feedback-detail'> | Level {reviewer?.level} </div>
                { hasAuth &&
                    <button
                        style={{"all": "unset", "cursor": "pointer"}}
                        onClick={toggleFlagOverlay}>
                            <i class="fas fa-flag"/>
                    </button>
                }
                <div style={{"display": "inline-block"}}className="margin-right"></div>
                    {
                        ownFeedback &&
                        <button
                            style={{"all": "unset", "cursor": "pointer"}}
                            className="margin-left"
                            onClick={toggleDeleteOverlay}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                        </button>
                    }
            </div>
            <div className='feedback-body'>
                {
                    props.isOutside ?
                        (<Link style={{"all": "unset", "cursor": "pointer"}} target="_blank" to={"/artwork/" + feedback.artworkID}>
                            <div className='faded-text'>Written for {artwork?.title}</div>
                        </Link>)
                        :
                        (<></>)
                }

                    <ReadMore>{feedback.body}</ReadMore>
                    
            </div>
            {/* This is where the user will rate the usefulness of the feedback */}
            {
                hasAuth && (
                    <form>
                        <div className="reply-submit-container">
                            <textarea ref={replyBarRef} rows="1" id="replyTextArea" className="reply-bar" name="replyText" style={replyBarStyle} value={reply.body}
                                placeholder="Write a reply.." onClick={replyBarClicked} onChange={handleReply}/>
                            <div className="reply-submit-buttons" style={replyButtonStyle}>
                                <button className="reply-button" onClick={replyBarUnclicked} type="button">Cancel</button>
                                <button className="reply-button" type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                    )
            }
            <div className='usefulness-rating-container'>
                { parseInt(feedback.usefulness.count) !== 0 && (<div className="usefulness-stat">This feedback has a usefulness rating of {feedback.usefulness.rating} out of 10
                    {" (" + feedback.usefulness.count + (parseInt(feedback.usefulness.count) === 1 ? " person" : " people" ) + " voted)"}</div>)}
                {
                    hasAuth && (<>
                    <div className='rating-call-to-action'>How helpful do you find {parseInt(feedback.usefulness.count) === 0 ? " this feedback?" : " it?"}</div>
                    <StarRating starCount={10} currentUserRating={currentUserRating} handleClick={handleFeedbackRating} />
                    </>
                    )
                }
            </div>
            {
                // Render the reply toggle button only if there is any.
                replyCount > 0 && (
                    <button className='toggle-replies-button' onClick={
                        () => {
                            setRepliesOpen( repliesOpen => !repliesOpen )
                        }
                    }>  {repliesOpen ? "Hide " : "Show "} {replyCount} {replyCount > 1 ? "replies" : "reply"}</button>
                )
            }

            {

                // Render the replies only if there is any and the replies have been opened.
                replyCount > 0 && ( repliesOpen &&
                    ( replies.map( (reply) => <Reply key={reply._id} reply={reply} user={user} hasAuth={hasAuth} /> ) ) )
            }
        </div>
    )

}