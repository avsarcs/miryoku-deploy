import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"
import axios from "../api/axios";

export default function ArtworkCard(props) {

    const [artworkOwner, setArtworkOwner] = useState("")


    useEffect(() => {

            if (props?.artwork?.ownerID) {
                const populateArtworkOwner = async () => {
                    
                    const fetchedArtworkOwner = await axios.get(`/user/minimal/${props?.artwork?.ownerID}`)
                    setArtworkOwner(fetchedArtworkOwner?.data?.name)
                }

                populateArtworkOwner()
            }
        
    }, [])

    return (
        <Link to={"/artwork/" + props?.artwork?._id} style={{all: "unset"}}>
        <div className="artwork-card">
            <div className="card-artwork-info">
                <h1> {props?.artwork?.title} </h1>
                <span> {props?.artwork?.description} </span>
            </div>
            <div className="card-bottom-details">
                <div className="detail margin-right">by {artworkOwner ? artworkOwner : ""}</div>
                <div className="detail">{props?.artwork?.type}</div>
                <div className="margin-left detail">{props?.artwork?.rating?.score} / 5.0 ({props?.artwork?.rating?.count})</div>
            </div>
        </div>
        </Link>
    )
}