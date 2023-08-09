import React, { useRef } from "react"
import Tabs from "../components/Tabs";
import YouTube from "react-youtube";
import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import parse from 'html-react-parser'
import Overlay from "../components/Overlay";
import Comment from "../components/Comment";
import Feedback from "../components/Feedback"
import FlagOverlay from "../components/FlagOverlay";
import ReadMore from "../components/ReadMore";

import StarRating from "../components/StarRating";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"
import { useUser } from "../context/UserContext";

export default function Artwork(props) {

    const { id } = useParams()
    const axiosPrivate = useAxiosPrivate()
    const [artwork, setArtwork] = useState({})
    const [artworkOwner, setArtworkOwner] = useState({})
    const navigate = useNavigate()
    const { auth } = useAuth()
    const { user, setUser } = useUser()
    const hasAuth = auth?.accessToken
    const [ownArtwork, setOwnArtwork] = useState(false)

    // Keep "ownArtwork" up to date
    useEffect(() => {
        if (user && artworkOwner) {
            setOwnArtwork(user?._id === artworkOwner?._id)
        }

    }, [user, artworkOwner])

    async function deleteArtwork (e) {
        e.preventDefault()
        try {
            await axiosPrivate.delete(`/artwork/${artwork._id}`)
            console.log("Right after the delete call")
            navigate('/feed', { replace: true } )
        } catch (error) {
            console.log("You got into errorLand")
            console.error(error)
        }
    }

    const [isDeleteOverlayOpen, setIsDeleteOverlayOpen] = useState(false)
    
    const toggleDeleteOverlay = () => {
        setIsDeleteOverlayOpen((prev) => !prev)
    }

    // Populate user
    useEffect(() => {
        if (auth?.accessToken) {
            const populateUser = async () => {
                const fetchedUser = await axios.get(`/user/${user._id}`)
                setUser(fetchedUser.data)
            }

            populateUser()
        }
    }, [])

    // Populate artwork
    useEffect(() => {
        const populateArtwork = async () => {
            const fetchedArtwork = await axios.get(`/artwork/${id}`)
            setArtwork(fetchedArtwork.data)
        }
        populateArtwork()
    }, [])

    // Populate artworkOwner
    useEffect(() => {
        if (Object.keys(artwork).length !== 0) {
            const populateArtworkOwner = async () => {
                const fetchedArtworkOwner = await axios.get(`/user/${artwork.ownerID}`)
                setArtworkOwner(fetchedArtworkOwner.data)
            }
            populateArtworkOwner()
        }
    }, [artwork])

    // Populate comments
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (Object.keys(artwork).length !== 0) {
            const populateComments = async () => {
                const fetchedArtworkComments = await axios.get(`/comment/artwork/${artwork._id}`)
                setComments(fetchedArtworkComments.data)
            }
            populateComments()
        }

    }, [artwork])


    // Populate feedbacks
    const [feedbacks, setFeedbacks] = useState([])

    useEffect(() => {
        if (Object.keys(artwork).length !== 0) {
            const populateFeedbacks = async () => {
                const fetchedArtworkFeedbacks = await axios.get(`/feedback/artwork/${artwork._id}`)
                setFeedbacks(fetchedArtworkFeedbacks.data)
            }
            populateFeedbacks()
        }

    }, [artwork])

    // Configure the forms for new comment and new feedback


    const [comment, setComment] = useState({
        "artworkID": artwork._id,
        "commenterID": auth?.accessToken ? user?._id : -1,
        "likes": 0,
        "dateCreated": (new Date()).toISOString(),
        "body": ""
    })

    const [feedback, setFeedback] = useState({
        "artworkID": artwork._id,
        "ownerID": auth?.accessToken ? user?._id : -1,
        "usefulness": {
            "rating": 0,
            "count": 0
        },
        "body": ""
    })

    // Keep 'feedback' and 'comment' up to date if user changes
    useEffect(() => {

        setFeedback((prevFeedback) => {
            return {
                ...prevFeedback,
                "ownerID": user?._id,
                "artworkID": artwork?._id
            }
        })

        setComment((prevComment) => {
            return {
                ...prevComment,
                "commenterID": user?._id,
                "artworkID": artwork?._id
            }
        })
    }, [user, artwork])

    const [commentButtonStyle, setCommentButtonStyle] = useState({
        "display": "none"
    })

    const [feedbackButtonStyle, setFeedbackButtonStyle] = useState({
        "display": "none"
    })

    const commentBarRef = useRef(null)

    const feedbackBarRef = useRef(null)

    const [commentBarStyle, setCommentBarStyle] = useState({
        "borderColor": "lightgray"
    })

    const [feedbackBarStyle, setFeedbackBarStyle] = useState({
        "borderColor": "lightgray"
    })

    // Make the comment and feedback bar grow or shrink accordingly as new lines are entered or deleted.
    function adjustTextareaHeight(textareaRef) {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.style.height = "auto";
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      }

    // Change comment object when the user writes new stuff.
    function handleComment(e) {

        const { value } = e.target
        setComment( (comment) => {
            return {
                ...comment,
                "body": value
            }
        });

        adjustTextareaHeight(commentBarRef)
    }

    function handleFeedback(e) {
        const { value } = e.target
        setFeedback( (feedback) => {
            return {
                ...feedback,
                "body": value
            }
        });

        if (feedbackBarRef.current) {
            feedbackBarRef.current.style.paddingBottom = "0"
        }
        adjustTextareaHeight(feedbackBarRef)
    }

    async function handleFeedbackSubmit(e) {
        e.preventDefault()

        try {
            await axiosPrivate.post('/feedback', feedback)
            navigate(0)
        } catch (error) {
            console.error(error)
        }

    }

    async function handleCommentSubmit(e) {
        e.preventDefault()

        try {
            await axiosPrivate.post('/comment', comment)
            navigate(0)
        } catch (error) {
            console.error(error)
        }
    }

    // Show the submit comment button only if the comment bar is clicked.
    function commentBarClicked(e) {

        setCommentBarStyle({
            "borderColor": "black"
        })

        setCommentButtonStyle({
            "display": "block"
        })
    }

    function commentBarUnclicked(e) {

        setCommentBarStyle({
            "borderColor": "lightgray"
        })

        setCommentButtonStyle({
            "display": "none"
        })
    }

    function feedbackBarClicked(e) {

        setFeedbackBarStyle({
            "borderColor": "black"
        })

        setFeedbackButtonStyle({
            "display": "block"
        })
    }

    function feedbackBarUnclicked(e) {

        setFeedbackBarStyle({
            "borderColor": "lightgray"
        })

        setFeedbackButtonStyle({
            "display": "none"
        })
    }

    // Make stars glow orange

    async function handleStarClick(rating) {
        try {
            await axiosPrivate.post(`/artwork/rate/${id}`, { rating } )
        } catch (error) {
            console.error(error)
        }
    }

    const [userRating, setUserRating] = useState()
    // Populate user rating once the user is fetched

    useEffect(() => {

        if (user?.awRatings) {
            if (user?.awRatings[artwork._id]) {
                setUserRating(user.awRatings[artwork._id])
            } else {
                setUserRating(0)
            }
        }
        
    }, [user, artwork])

    useEffect(() => {
        console.log("userRating is: " + userRating)
    }, [userRating])

    // For video artworks
    const [youtubePlayerOpts, setYoutubePlayerOpts] = useState({
        height: '390',
        width: '640',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 0,
        },
      })

      useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth > 750) {
            setYoutubePlayerOpts((prevYoutubePlayerOpts) => {
                return {
                    ...prevYoutubePlayerOpts,
                    height: '390',
                    width: '640'
                }
            })
          }

          if (window.innerWidth < 750 && youtubePlayerOpts.width !== '320') {
            setYoutubePlayerOpts((prevYoutubePlayerOpts) => {
                return {
                    ...prevYoutubePlayerOpts,
                    height: (window.innerWidth - ((window.innerWidth / 100) * 20)) * (9/16),
                    width: (window.innerWidth - ((window.innerWidth / 100) * 20))
                }
            })
          }
        }
    
        window.addEventListener('resize', handleResize)
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }, [])

      // Set youtubePlayerOpts width on mount.
      useEffect(() => {
        if (window.innerWidth > 700) {
            setYoutubePlayerOpts((prevYoutubePlayerOpts) => {
                return {
                    ...prevYoutubePlayerOpts,
                    height: '390',
                    width: '640'
                }
            })
          }

          if (window.innerWidth < 750 && youtubePlayerOpts.width !== '320') {
            setYoutubePlayerOpts((prevYoutubePlayerOpts) => {
                return {
                    ...prevYoutubePlayerOpts,
                    height: (window.innerWidth - ((window.innerWidth / 100) * 20)) * (9/16),
                    width: (window.innerWidth - ((window.innerWidth / 100) * 20))
                }
            })
          }
      }, [])

    // For image artworks
    const [imageWidth, setImageWidth] = useState(0)

    useEffect(() => {

        // if (window.innerWidth > 750) {
        //     setImageWidth((prevImageWidth) => window.innerWidth - 400)
        // } else {
            setImageWidth((prevImageWidth) => window.innerWidth - ((window.innerWidth / 100) * 20))
        // }

        const handleResize = () => {
            // if (window.innerWidth > 750) {
            //     setImageWidth((prevImageWidth) => window.innerWidth - 400)
            // } else {
                setImageWidth((prevImageWidth) => window.innerWidth - ((window.innerWidth / 100) * 20))
            // }
        }
    
        window.addEventListener('resize', handleResize)
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }, [])

    // Part below is related to the flag overlay functionality
    const [isFlagOverlayOpen, setIsFlagOverlayOpen] = useState(false)

    const toggleFlagOverlay = () => {
        setIsFlagOverlayOpen((prevState) => !prevState)
    }

    return (
        <div className="all-container">
            { ownArtwork &&
            <Overlay isOpen={isDeleteOverlayOpen} onClose={toggleDeleteOverlay}>
                <div className="overlay-wrapper">
                    <form onSubmit={deleteArtwork}>
                        <div className="sleek-text">Are you sure you want to delete this artwork?</div>
                        <button type="submit" className="everywhere-button">Yes</button>
                    </form>
                </div>
            </Overlay>
            }

                {
                    hasAuth &&
                        <FlagOverlay
                            isOpen={isFlagOverlayOpen}
                            onClose={toggleFlagOverlay}
                            forWhat={"artwork"}
                            _id={artwork?._id}
                            suspectID={artworkOwner?._id}
                            submitterID={user?._id}/>
                }

            <div className="artwork-container">
                <div className="artwork-title" style={artwork?.titleStyle}>{artwork?.title}</div>
                <div className="artwork-info" style={artwork?.titleStyle}>
                    <Link style={{"all": "unset", "cursor": "pointer"}} to={`/user/${artworkOwner?._id}`}>by {artworkOwner?.name}</Link> &emsp; &emsp; {artwork?.type}
                    {(artwork?.type === "Fiction" || artwork?.type === "Other") && "📖" }
                    {(artwork?.type === "Poetry") && "🪶"}
                    {(artwork?.type === "Music") && "🎶"}
                    {(artwork?.type === "Cinema") && "🎥"}
                    {(artwork?.type === "Photography") && "📷" }
                    {(artwork?.type === "Painting") && "🎨"}
                    &emsp;&emsp; <div className="jump-a-line"/> {artwork?.rating?.score} / 5.0 ({artwork?.rating?.count})</div>
                <div className="tag-filter filter-sub artwork-tags">
                    {
                        artwork?.tags?.map( (tag) => (
                            <label key={tag} className="cool-label tag-label" style={{fontSize: "0.9em"}} >{tag}</label>
                        ) )
                    }
                    { hasAuth &&
                        <button
                            className="margin-right"
                            style={{"all": "unset", "cursor": "pointer"}}
                            onClick={toggleFlagOverlay}>
                                <i className="fas fa-flag"/>
                        </button>
                    }
                    <div style={{"display": "inline-block"}}className="margin-right"></div>
                    {
                        ownArtwork &&
                        <button
                            style={{"all": "unset", "cursor": "pointer"}}
                            className="margin-left"
                            onClick={toggleDeleteOverlay}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                        </button>
                    }
                    {

                    }
                </div>
                <span className="long-description">
                    <ReadMore>
                    {artwork?.longDescription}
                    </ReadMore>
                </span>
                    
                <div className="artwork-body" style={artwork?.bodyStyle}>

                    {
                    
                        (artwork?.type === "Fiction" || artwork?.type === "Poetry" || artwork?.type === "Other") &&

                        // artwork?.body && artwork.body.split("\\n").map((line, index) => {
                        //     if (line === "") {
                        //         return (<br key={index}/>)
                        //     }
                        //     else { return (
                        //     <div key={index}>
                        //         <ReactMarkdown>{line}</ReactMarkdown>
                        //     </div>
                        //     )}
                        // })

                        artwork?.body && parse(artwork.body)
                    
                    }

                    {
                        (artwork?.type === "Cinema" || artwork?.type === "Music") &&
                        <YouTube
                            style={{"marginTop": "1em"}}
                            videoId={artwork?.body}
                            opts={youtubePlayerOpts}/>
                    }

                    {
                        (artwork?.type === "Painting" || artwork?.type === "Photography") &&
                        <div style={{"width": imageWidth}}>
                            <img style={{"width": imageWidth}} alt="Painting" src={artwork.body} />
                        </div>
                    }

                </div>
               { hasAuth &&
                    <StarRating starCount={5} currentUserRating={parseInt(userRating)} handleClick={handleStarClick} />
                }
                {
                    !(hasAuth) && (<i className="login-warning">Login to be able to rate the artwork, comment, reply to other people and more.</i>)
                }
                <div className="tabs-wrapper">
                <Tabs>
                    <div label="Comments">
                        {
                            hasAuth && (
                            <form onSubmit={handleCommentSubmit}>
                                <div className="comment-submit-container">
                                    <textarea maxLength={10000} ref={commentBarRef} rows="1" id="commentTextArea" className="comment-bar" name="commentText" style={commentBarStyle} value={comment.body}
                                        placeholder="Write a comment.." onClick={commentBarClicked} onChange={handleComment}/>
                                    <div className="comment-submit-buttons" style={commentButtonStyle}>
                                        <button className="comment-button" onClick={commentBarUnclicked} type="button">Cancel</button>
                                        <button className="comment-button" type="submit">Submit</button>
                                    </div>
                                </div>
                            </form>
                            )
                        }
                        {
                            comments.length > 0 ? comments.map(
                                comment => (
                                    <Comment key={comment._id} comment={comment}/>
                                )
                            ) : ""
                        }
                    </div>
                    <div label="Feedback">
                    {
                            hasAuth && (
                            <form onSubmit={handleFeedbackSubmit}>
                                <div className="feedback-submit-container">
                                    <textarea maxLength={30000} ref={feedbackBarRef} rows="1" id="feedbackTextArea" className="feedback-bar" name="feedbackText" style={feedbackBarStyle} value={feedback.body}
                                        placeholder="Give feedback.." onClick={feedbackBarClicked} onChange={handleFeedback}/>
                                    <div className="feedback-submit-buttons" style={feedbackButtonStyle}>
                                        <button className="feedback-button" onClick={feedbackBarUnclicked} type="button">Cancel</button>
                                        <button className="feedback-button" type="submit">Submit</button>
                                    </div>
                                </div>
                            </form>
                            )
                        }
                        {
                            feedbacks.length > 0 ? feedbacks.map(
                                    feedback => (
                                        <Feedback key={feedback._id} feedback={feedback}/>
                                    )
                                ) : ""
                         }
                    </div>
                </Tabs>
                </div>
            </div>
        </div>
    )
    
}