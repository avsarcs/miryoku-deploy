import Feed from "./Feed"
import { Link } from "react-router-dom"

export default function Home(props) {

        // JSX when the user is not signed in.
        return (
            <>
            
            <div className="stories">
            <div className="story-one">
                <ul class="background">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <h1>Grow as an artist</h1>
                <p>Miryoku is a feedback-driven<div className="jump-a-line"></div> artwork sharing platform.</p>
                <div className="buttons">
                <Link style={{"all": "unset"}} to="/signup"><button>Sign Up</button></Link>
                <Link style={{"all": "unset"}} to="/login"><button>Login</button></Link>
                </div>
            </div>
            <div className="story-two">
                <div className="artwork-container">
                    <div className="flex-column" style={{"alignItems": "center", "justifyContent": "center", "textAlign": "center"}}>
                        <div className="flex-column"
                        style={{"height": "30vh",
                                "justifyContent": "center"}}>Follow your dreams</div>
                        <div className="margin-bottom sleek-text slightly-larger">
                            <div className="margin-bottom">This is a place where anyone dabbling with arts --whether they are an amateur/professional; painter, writer, cinematographer or anything else-- can come to flourish.<br/> </div>
                            <div className="margin-bottom">We believe that constant iteration and <strong>feedback</strong> create great work.<br/>
                            Therefore, we put together a system that will bring artists out of isolation.<br/>
                            </div>
                            <div className="margin-bottom">
                            For aspiring artists, working in isolation is not only boring but also ineffective.<br/>
                            To realistically assess the greatness of your craft and improve, you need a <strong>community</strong>.</div>
                            <div className="margin-bottom">This is exactly what Miryoku provides. You can share your artworks to get feedback from other aspiring
                            artists.</div>
                            <div className="margin-bottom">
                            Click to <Link style={{"all": "unset", "cursor": "pointer"}} to="/signup"><u>create a profile</u></Link> and share your artwork with others today.<br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            </div>
            </>
        )
}