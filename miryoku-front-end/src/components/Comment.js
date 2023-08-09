import React, { useState, useRef, useEffect } from 'react'
import Reply from './Reply';
import FlagOverlay from './FlagOverlay';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import Overlay from './Overlay';
import ReadMore from './ReadMore';

export default function Comment(props) {
    const { comment } = props
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()
    const [commenterID, setCommenterID] = useState(comment.commenterID)
    const navigate = useNavigate()

    const hasAuth = auth?.accessToken
    const { user } = useUser()

    const [commenter, setCommenter] = useState({})
    const [replies, setReplies] = useState([])
    const [replyCount, setReplyCount] = useState(0)
    const [likes, setLikes] = useState(comment?.likes)

    const [ownComment, setOwnComment] = useState(false)

    useEffect(() => {
        if (user && commenter) {
            setOwnComment(user?._id === commenter?._id)
        }
    }, [user, commenter])

    const [isDeleteOverlayOpen, setIsDeleteOverlayOpen] = useState(false)

    const toggleDeleteOverlay = () => {
        setIsDeleteOverlayOpen((prev) => !prev)
    }

    const deleteComment = async (e) => {
        e.preventDefault()
        try {
            await axiosPrivate.delete(`/comment/${comment?._id}`)
            navigate(0)
        } catch (error) {
            console.error(error)
        }
    }
    

    // Populate commenter
    useEffect(() => {
        if (commenterID) {
            const populateCommenter = async () => {
                const fetchedCommenter = await axios.get(`/user/minimal/${commenterID}`)
                setCommenter(fetchedCommenter.data)
            }
            populateCommenter()
        }
    }, [commenterID])

    // Populate replies & replyCount
    useEffect(() => {
        const populateReplies = async () => {

            const fetchedReplies = await axios.get(`/reply/comment/${comment._id}`)
            setReplies(fetchedReplies.data)
        }
        populateReplies()
    }, [])

    // useEffect(() => {
    //     console.log(JSON.stringify(replies))
    // }, [replies])

    useEffect(() => {
        setReplyCount(replies.length)
    }, [replies])

    const commentID = comment._id

    const [userLikedComment, setUserLikedComment] = useState(
        hasAuth ? user?.likedComments?.filter( commentID => commentID === comment._id)[0] != null
            : false
    )

    // Keep userLikedComment up to date if user changes
    useEffect(() => {
        setUserLikedComment(hasAuth ? user?.likedComments?.filter( commentID => commentID === comment._id)[0] != null
        : false)
    }, [user])

    // Represent a reply as an object (going to be stored in the database)
    const [ reply, setReply ] = useState({
        "parentID": comment._id,
        "body": "",
        "ownerID": user?._id,
        "for": "comment",
        "dateCreated": (new Date()).toISOString(),
        "dateUpdated": (new Date()).toISOString()
    })

    // Keep reply up to date if comment or user changes
    useEffect(() => {
        setReply((prevReply) => {
            return {
                ...prevReply,
                "parentID": comment._id,
                "ownerID": user?._id
            }
        })
    }, [comment._id, user])


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

    async function handleReplySubmit(e) {
        e.preventDefault()
        try {
            await axiosPrivate.post('reply', reply)
            navigate(0)
        } catch (error) {
            console.error(error)
        }
    }


    // Like comment
    // Written as a placeholder in front-end because server-side code is required to actually implement this functionality.
    async function handleCommentLike(e) {
        try {
            await axiosPrivate.post(`/comment/${comment._id}`)

            if (userLikedComment) {
                setLikes(prev => prev - 1)
            } else {
                setLikes(prev => prev + 1)
            }

            setUserLikedComment(prev => !prev)

        } catch (error) {
            console.error(error)
        }
        
    }

    useEffect(() => {
        console.log("userLikedComment is: " + userLikedComment)
    }, [userLikedComment])

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
        <div className='comment-box'>
            { hasAuth &&
            <FlagOverlay
                isOpen={isFlagOverlayOpen}
                onClose={toggleFlagOverlay}
                forWhat={"comment"}
                _id={comment._id}
                suspectID={comment.commenterID}
                submitterID={user?._id}/>
            }

            {
                ownComment &&
                <Overlay isOpen={isDeleteOverlayOpen} onClose={toggleDeleteOverlay}>
                <div className="overlay-wrapper">
                    <form onSubmit={deleteComment}>
                        <div className="sleek-text">Are you sure you want to delete this comment?</div>
                        <button type="submit" className="everywhere-button">Yes</button>
                    </form>
                </div>
                </Overlay>
            }

            <div className='commenter-details'>
                <div className='commenter-detail'> <Link to={`/user/${commenter?._id}`} style={{"all": "unset", "cursor": "pointer"}}>{commenter?.name}</Link> </div>
                <div className='commenter-detail'> | Level {commenter?.level} </div>
            </div>
            <div className='comment-body'>
                        <ReadMore>{comment.body}</ReadMore>
            </div>
            <div className='comment-like-container'>
                    { "👍" }
                    { likes }
                    { hasAuth &&
                (<button onClick={handleCommentLike} type='button' className='like-button'>
                    {userLikedComment ? "Unlike" : "Like"}</button>)
                    }
                    { hasAuth &&
                    <button
                        style={{"all": "unset", "cursor": "pointer"}}
                        onClick={toggleFlagOverlay}>
                            <i class="fas fa-flag"/>
                    </button>
                    }
                    <div style={{"display": "inline-block"}}className="margin-right"></div>
                    {
                        ownComment &&
                        <button
                            style={{"all": "unset", "cursor": "pointer"}}
                            className="margin-left"
                            onClick={toggleDeleteOverlay}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                        </button>
                    }
            </div>
            {
                hasAuth && (
                    <form onSubmit={handleReplySubmit}>
                        <div className="reply-submit-container">
                            <textarea maxLength={5000} ref={replyBarRef} rows="1" id="replyTextArea" className="reply-bar" name="replyText" style={replyBarStyle} value={reply.body}
                                placeholder="Write a reply.." onClick={replyBarClicked} onChange={handleReply}/>
                            <div className="reply-submit-buttons" style={replyButtonStyle}>
                                <button className="reply-button" onClick={replyBarUnclicked} type="button">Cancel</button>
                                <button className="reply-button" type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                    )
            }
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