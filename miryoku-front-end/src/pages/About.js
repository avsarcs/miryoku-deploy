import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function About(props) {

    const [restrictWidth, setRestrictWidth] = useState("60vw")
    const [alignWhere, setAlignWhere] = useState("center")

    useEffect(() => {

        if (window.innerWidth > 800) {
            setRestrictWidth((prevRestrictWidth) => "60vw")
            setAlignWhere("center")
        }
        else
        {
            setRestrictWidth((prevRestrictWidth) => "80vw")
            setAlignWhere("left")
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
        <div className="all-container">
            <div className="artwork-container" style={{"width": restrictWidth}}>
                <div className="flex-column" style={{"alignItems": "center", "justifyContent": alignWhere}}>
                    <div className="flex-column fancy-title"
                    style={{"height": "40vh",
                            "justifyContent": "center", "textAlign": "center"}}> Grow as an artist</div>
                    <div className="margin-bottom sleek-text slightly-larger border-it-column">
                        <div className="margin-bottom">Miryoku aims to be a place where anyone dabbling with arts --whether they are an amateur/professional; painter, writer, cinematographer or anything else-- can come to flourish.<br/> </div>
                        <div className="margin-bottom">We believe that constant iteration and <strong>feedback</strong> create great artists.<br/>
                        Therefore, we put together a system that will bring artists out of isolation.<br/>
                        </div>
                        <div className="margin-bottom">
                        For aspiring artists, working in isolation is not only boring but also ineffective.<br/>
                        To realistically assess the greatness of your craft and improve, you need a <strong>community</strong>.</div>
                        <div className="margin-bottom">This is exactly what Miryoku provides.</div>
                        <div className="margin-bottom">
                        <Link style={{"all": "unset", "cursor": "pointer"}} to="/signup"><u>Create a profile</u></Link> and share your artwork with others to gather useful, constructive feedback.<br/>
                        </div>
                        <div>
                            Click on the <strong>Create New Artwork</strong> button on the home page to share your artwork today.
                            </div>    
                    </div>
                </div>
            </div>
        </div>
    )
}