import { useEffect, useState } from "react"
import Overlay from "../components/Overlay"
import Tabs from "./Tabs"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

export default function FlagOverlay({isOpen, onClose, forWhat, _id, suspectID, submitterID}) {

    

    const [flag, setFlag] = useState({
        "_id": _id,
        "type": "",
        "for": forWhat,
        "suspectID": suspectID,
        "submitterID": submitterID
    })

    useEffect(() => {
        setFlag({
            "_id": _id,
            "type": "",
            "for": forWhat,
            "suspectID": suspectID,
            "submitterID": submitterID
        })
    }, [forWhat, suspectID, submitterID, _id])

    useEffect(() => {
        console.log("current flag is: " + JSON.stringify(flag))
    }, [flag])

    const axiosPrivate = useAxiosPrivate()

    const [flagSubmitted, setFlagSubmitted] = useState(false)

    // useEffect(() => {
    //     console.log("Most current flag type: " + newFlag.type)
    // }, [newFlag])

    const submitFlag = async () => {
        // Actually submit flag (back-end)
        await axiosPrivate.post("/flag", flag)
        setFlagSubmitted(true)
    }

    return (
        <Overlay isOpen={isOpen} onClose={onClose}>
            <div className="overlay-wrapper">
            { flagSubmitted ?
            <div className="sleek-text faded-text">We'll review this content as soon as possible. Thank you for your submittal.</div>
            :
            <>
            <div className="sleek-text">Why do you want to flag this {forWhat}?</div>
            <div className="flex-column" style={{"alignItems": "center"}}>
            <Tabs customClass="verticalRadioBox">
                <div onClick={() => {
                    setFlag((prevNewFlag) => {
                        return {
                            ...prevNewFlag,
                            type: "Harassment"
                        }
                    })
                }} label="Harassment"/>
                <div onClick={() => {
                    setFlag((prevNewFlag) => {
                        return {
                            ...prevNewFlag,
                            type: "Bullying"
                        }
                    })
                }} label="Bullying"/>
                <div onClick={() => {
                    setFlag((prevNewFlag) => {
                        return {
                            ...prevNewFlag,
                            type: "Inappropriate content"
                        }
                    })
                }} label="Inappropriate content"/>
                <div onClick={() => {
                    setFlag((prevNewFlag) => {
                        return {
                            ...prevNewFlag,
                            type: "Hate speech"
                        }
                    })
                }} label="Hate speech"/>
                <div onClick={() => {
                    setFlag((prevNewFlag) => {
                        return {
                            ...prevNewFlag,
                            type: "Suicidal"
                        }
                    })
                }} label="Suicidal content"/>
                <div onClick={() => {
                    setFlag((prevNewFlag) => {
                        return {
                            ...prevNewFlag,
                            type: "Plagiarism"
                        }
                    })
                }} label="Plagiarism"/>
                <div onClick={() => {
                    setFlag((prevNewFlag) => {
                        return {
                            ...prevNewFlag,
                            type: "Spam"
                        }
                    })
                }} label="Spam"/>
            </Tabs>
            <button type="button" style={{"cursor": "pointer"}} onClick={submitFlag} className="everywhere-button">Submit</button>
            </div>
            </>
            }
            </div>
        </Overlay>
    )
}