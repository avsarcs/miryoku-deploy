import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function Rules(props) {

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
                setRestrictWidth((prevRestrictWidth) => "90vw")
            }
        }
    
        window.addEventListener('resize', handleResize)
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }, [])

    return (
        <div className="all-container">
            <div className="artwork-container" style={{"width": restrictWidth}}>
                <div className="flex-column" style={{"alignItems": "center", "justifyContent": "center"}}>
                    <div className="flex-column fancy-title"
                    style={{"height": "30vh",
                            "justifyContent": "center", "textAlign": "center"}}> How it works?</div>
                    <div className="margin-bottom sleek-text slightly-larger border-it-column">
                        <div className="margin-bottom">First, if you do not have a profile yet, you can quickly create one <Link style={{"all": "unset", "cursor": "pointer"}} to="/signup">👉 <u>here</u> 👈</Link><br/>
                        Rest of this page assumes that you are logged in.</div>
                        <h3>Sharing an artwork</h3>
                        <div className="margin-bottom">In order to create an artwork, go on the Home Page and click on the <strong>Create New Artwork</strong> button.</div>
                        <h4><u>Why are there two different descriptions?🧐</u></h4>
                        <div className="margin-bottom">When creating a new artwork, you will be asked to enter a Description and a "Long Description."<br/>
                        Description is limited to 240 characters to make sure it fits to the card representing your artwork on other people's feed. So make it short and compelling.</div>
                        <div className="margin-bottom">But if you need more characters to explain the epic backstory of your artwork
                         and how it came to be, feel free to ramble on in the Long Description field! It will show on your artwork's page.</div>
                         <div className="margin-bottom faded-text"><code>If 240 characters are enough to you, you can just copy Description directly into Long Description.</code></div>
                        <h3>Reporting</h3>
                        <div className="margin-bottom">If you see anything inappropriate, hurtful or disturbing in Miryoku click on the <i class="fas fa-flag"/> icon
                        to flag it and we will review the submitted content as soon as possible.</div>

                        <h3>Point System</h3>
                        <div className="margin-bottom">Each profile starts with 100 points and it takes 10 points to submit one artwork. You can give feedback to artworks to gather points.
                        More people rating your feedback as useful will result in higher gains.</div>

                        <h4><u>Why are Comments and Feedback separate?🧐</u></h4>
                        <div className="margin-bottom">If you open an artwork's page and scroll all the way to the bottom, you will see two different tabs: <br/>
                         [Comments] and [Feedback]</div>
                         <div className="margin-bottom">[Comments] are for general types of reactions like "Woah! Amazing poem😯" that spread 💖 love 💖
                         but don't necessarily provide actionable advice. You can also use comments for any general discussion about the artwork.</div>
                         <div className="margin-bottom">[Feedback] is for providing constructive, actionable advice to the creator of the artwork to help them improve.
                         In order to gather points, write feedbacks.</div>

                         <h3>Rating</h3>
                         <div className="margin-bottom">You can rate artworks and feedbacks using the stars attached to them. Try to rate everything
                         you see, it is a kind of feedback in itself and helps people! You can also track the rating of your own artworks and feedbacks from your profile.</div>

                         <h3>Rules</h3>
                         <div className="margin-bottom">By using Miryoku, you agree to the following Terms and Conditions</div>
                         <div style={{"textAlign": "left"}}>
                            <ul>
                                <li>Anything you post to Miryoku will be entirely, from top to bottom, your own work. You, the User, is liable for any damage that may be caused
                                    to third parties resulting from copyright infriction.
                                </li>
                                <li>You will not post AI-generated content.</li>
                                <li>You will be supportive and positive towards other artists in Miryoku.</li>
                                <li>Your art will not break any of the local laws of where you happen to reside.</li>
                                <li>You will not post any content that encourages suicide or suicidal behaviour.</li>
                                <li>You will not post sexually explicit content.</li>
                                <li>You will not use Miryoku outside of its purpose e.g. for promoting your YouTube channel and posting every video
                                    without consideration to whether they count as "art"
                                </li>
                                <li>You will be a decent person in general.</li>
                            </ul>
                            <div className="margin-top">
                                If it is determined that an account has breached the Terms and Conditions, it will be suspended immediately.
                            </div>
                         </div>

                    </div>
                </div>
            </div>
        </div>
    )
}