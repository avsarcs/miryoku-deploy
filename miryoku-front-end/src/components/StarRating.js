import React, { useState, useRef } from "react";

export default function StarRating(props) {
    const { currentUserRating, handleClick, starCount } = props

    const [userRating, setUserRating] = useState(currentUserRating)

    const [ratingStarsState, setRatingStarsState] = useState({})

    const [starsJSX, setStarsJSX] = useState()

    React.useEffect( () => {
        setRatingStarsState((prevStarsState) => {
            const updatedStarsState = {}

            for (let i = 0; i < starCount; i++) {
                const currentKey = "star" + (i + 1)
                updatedStarsState[currentKey] = "fa-star-o"
            }
            
            return updatedStarsState
        }) }
        , [])

    React.useEffect(() => {
        setUserRating(currentUserRating)
    }, [currentUserRating])

    React.useEffect(() => {
        setStarsJSX( (prevStarsJSX, index) => {
            const newStarsJSX = []

            for (let i = 1; i <= starCount; i++) {
                const keyName = "star" + i
                const _className = "fa " + ratingStarsState[keyName] + " " + i + "-star"
                newStarsJSX.push(<span
                    key={keyName}
                    className={_className}
                    onClick={updateUserRating}
                    onMouseOver={makeStarsGlow}
                    onMouseLeave={resetStarGlow}/>)
            }

            return newStarsJSX
        } )
    }, [ratingStarsState])

    const timesLoaded = useRef(0)

    React.useEffect( () => {
        resetStarGlow()
        if (starCount === 10 && timesLoaded.current > 0) {
            handleClick(userRating)
        } else {

            if (userRating !== 0 && timesLoaded.current > 1) {
                handleClick(userRating)
            }
            else if (userRating === 0 && timesLoaded.current > 1) {
                handleClick(userRating)
            } else {
                timesLoaded.current++
            }
        }       
    }
    , [userRating])

    function updateUserRating(e) {
        const newUserRating = e.currentTarget.className
            .split(" ")
            .filter((className) => !isNaN(className[0]))[0].split("-")[0]
        
        setUserRating(userRating => newUserRating)

        console.log("You rated the artwork " + newUserRating + " out of " + starCount + " stars")
    }

    function resetStarGlow() {

        setRatingStarsState((prevState) => {
            const updatedState = { ...prevState }
            for (const key in updatedState) {
              if (parseInt(key.substring(4)) <= userRating) {
                updatedState[key] = "fa-star"
              } else {
                updatedState[key] = "fa-star-o"
              }
            }
            return updatedState;
          })

    }

    function makeStarsGlow(e) {
        const whichStar = parseInt(
            e.currentTarget.className
              .split(" ")
              .filter((className) => !isNaN(className[0]))[0].split("-")[0]
          )
        
          setRatingStarsState((prevState) => {
            const updatedState = { ...prevState }
            for (const key in updatedState) {
              if (parseInt(key.substring(4)) <= whichStar) {
                updatedState[key] = "fa-star";
              }
            }
            return updatedState
          })
    }

    return (
        <div className="rate-container">
            {starsJSX}
        </div>
    )
}