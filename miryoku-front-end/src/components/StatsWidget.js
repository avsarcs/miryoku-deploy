import React, { useEffect, useState } from "react";

export default function StatsWidget(props) {

    const [levelBoundary, setLevelBoundary] = useState(1000000000)
    
    const { user } = props
    const [levelProgress, setLevelProgress] = useState(parseFloat(( user?.xp / levelBoundary ) * 100))

    // Keep levelProgress up to date if levelBoundary updates late
    useEffect(() => {
        setLevelProgress(parseFloat(( user?.xp / levelBoundary ) * 100))
        console.log("levelBoundary: " + levelBoundary)

    }, [levelBoundary])

    useEffect(() => {
        console.log("levelProgress: " + levelProgress)
    }, [levelProgress])

    useEffect(() => {
        if (user?.xp) {
            for (let newLevel = 1; newLevel < 1000; newLevel++) {

                if ( newLevel > user?.level ) {
                    setLevelBoundary(60 * ( newLevel * Math.log10(newLevel) ))
                    break;
                }
            }
        }
        
    }, [user])
    

    return (
        <div className="stats-widget-container" style={{"width": props.width}}>
            Current stats:<br />
            <span className="user-stat">| {props.user.title}</span>
            <span className="user-stat"><div className="jump-a-line"/>| Points: {props.user.points}</span>
            <span className="user-stat"><div className="jump-a-line"/>| Level: {props.user.level}</span>
            <span className="user-stat"><div className="jump-a-line"/> {props.user?.xp?.toFixed(0)} / {levelBoundary?.toFixed(0)} xp for the next level {`(${levelProgress?.toFixed(0)}%)`} </span>

            {/* Progress Bar */}
            <div className="meter">
	            <span style={{width: `${levelProgress}%`}}></span>
            </div>
            
        </div>
    )
}