import React, { useEffect, useState } from 'react'
import FlagOverlay from './FlagOverlay';
import { useUser } from '../context/UserContext';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Overlay from './Overlay';

export default function Reply(props) {

    const { reply } = props;
    const { user } = useUser()
    const { auth } = useAuth()
    const [likes, setLikes] = useState(reply?.likes)
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const hasAuth = auth?.accessToken

    const [userLikedReply, setUserLikedReply] = useState( hasAuth ?
        reply.for === "comment" ? user?.likedCommentReplies?.filter( replyID => replyID === reply._id)[0] != null
            : user?.likedFbReplies?.filter( replyID => replyID === reply._id)[0] != null
            : false
    )

    // DELETE OVERLAY
    const [isDeleteOverlayOpen, setIsDeleteOverlayOpen] = useState(false)

    const toggleDeleteOverlay = () => {
        setIsDeleteOverlayOpen((prev) => !prev)
    }

    const deleteReply = async (e) => {
        e.preventDefault()
        try {
            await axiosPrivate.delete(`/reply/${reply._id}`)
            navigate(0)
        } catch (error) {
            console.error(error)
        }
    }

    const [ownReply, setOwnReply] = useState(false)

    useEffect(() => {
        if (user && reply) {
            setOwnReply(user?._id === reply?.ownerID)
        }
    }, [user, reply])

    // END OF DELETE OVERLAY RELATED CODE

    async function handleReplyLike(e) {
        try {
            await axiosPrivate.post(`/reply/${reply._id}`)

            if (userLikedReply) {
                setLikes(prev => prev - 1)
            } else {
                setLikes(prev => prev + 1)
            }

            setUserLikedReply(prev => !prev)

        } catch (error) {
            console.error(error)
        }
    }

    // Fetch the minimal details of the replier
    const [replier, setReplier] = useState({})
    useEffect(() => {
        const populateReplier = async () => {
            const fetchedReplier = await axios.get(`/user/minimal/${reply.ownerID}`)
            setReplier(fetchedReplier.data)
        }
        populateReplier()
    }, [])

    // Part below is related to the flag overlay functionality
    const [isFlagOverlayOpen, setIsFlagOverlayOpen] = useState(false)

    const toggleFlagOverlay = () => {
        setIsFlagOverlayOpen((prevState) => !prevState)
    }

    return (
        <div className='reply-container'>
            { auth?.accessToken &&
            <FlagOverlay
                isOpen={isFlagOverlayOpen}
                onClose={toggleFlagOverlay}
                forWhat={"reply"}
                _id={reply._id}
                suspectID={reply.ownerID}
                submitterID={user?._id}/>
            }

            {
                ownReply &&
                <Overlay isOpen={isDeleteOverlayOpen} onClose={toggleDeleteOverlay}>
                <div className="overlay-wrapper">
                    <form onSubmit={deleteReply}>
                        <div className="sleek-text">Are you sure you want to delete this reply?</div>
                        <button type="submit" className="everywhere-button">Yes</button>
                    </form>
                </div>
                </Overlay>
            }

            <div className='reply-details'>
                <div className='reply-detail'><Link to={`/user/${replier?._id}`} style={{"all": "unset", "cursor": "pointer"}}>{replier?.name}</Link></div>
                <div className='reply-detail'>| Level {replier?.level}</div>
            </div>
            <div className='reply-body'>
                {reply.body}
            </div>
            <div className='reply-details'>
                <div className='reply-like-container'> { "👍" } { likes }
                    { hasAuth && (<button type='button' className='reply-like-button margin-right' onClick={handleReplyLike}>
                    {userLikedReply ? "Unlike" : "Like"}</button>)}
                    { hasAuth &&
                    <button
                        style={{"all": "unset", "cursor": "pointer"}}
                        onClick={toggleFlagOverlay}>
                            <i class="fas fa-flag"/>
                    </button>
                    }
                    <div style={{"display": "inline-block"}}className="margin-right"></div>
                    {
                        ownReply &&
                        <button
                            style={{"all": "unset", "cursor": "pointer"}}
                            className="margin-left"
                            onClick={toggleDeleteOverlay}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                        </button>
                    }
                    </div>
            </div>
        </div>
    )
}