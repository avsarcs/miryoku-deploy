import Tabs from "../components/Tabs";
import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Create(props) {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const fontOptions = [
        { value: 'Sofia Sans', label: 'Sofia Sans' },
        { value: 'Montserrat', label: 'Montserrat' },
        { value: 'Unbounded', label: 'Unbounded' },
        { value: 'Oswald', label: 'Oswald' },
        { value: 'Quicksand', label: 'Quicksand' },
        { value: 'Barlow', label: 'Barlow' },
        { value: 'Josefin Sans', label: 'Josefin Sans' },
        { value: 'Pacifico', label: 'Pacifico' },
        { value: 'Lobster', label: 'Lobster' },
        { value: 'Roboto', label: 'Roboto' },
        { value: 'Open Sans', label: 'Open Sans' },
        { value: 'Source Sans Pro', label: 'Source Sans Pro' },
        { value: 'Ubuntu', label: 'Ubuntu' },
        { value: 'Lato', label: 'Lato' },
        { value: 'Nunito Sans', label: 'Nunito Sans' },
        { value: 'PT Sans', label: 'PT Sans' },
        { value: 'Raleway', label: 'Raleway' },
        { value: 'Merriweather', label: 'Merriweather' },
        { value: 'Playfair Display', label: 'Playfair Display' },
        { value: 'Cabin', label: 'Cabin' },
        { value: 'Inconsolata', label: 'Inconsolata' },
        { value: 'Droid Sans', label: 'Droid Sans' },
        { value: 'Fira Sans', label: 'Fira Sans' },
        { value: 'Work Sans', label: 'Work Sans' },
        { value: 'Poppins', label: 'Poppins' },
        { value: 'Montserrat Alternates', label: 'Montserrat Alternates' },
        { value: 'Alegreya Sans', label: 'Alegreya Sans' },
        { value: 'Cairo', label: 'Cairo' },
        { value: 'Bitter', label: 'Bitter' },
        { value: 'Muli', label: 'Muli' },
        { value: 'Exo', label: 'Exo' },
        { value: 'Rubik', label: 'Rubik' },
        { value: 'Oxygen', label: 'Oxygen' },
        { value: 'Crimson Text', label: 'Crimson Text' },
        { value: 'Abel', label: 'Abel' },
        { value: 'Quattrocento Sans', label: 'Quattrocento Sans' },
        { value: 'Fjalla One', label: 'Fjalla One' },
        { value: 'Archivo', label: 'Archivo' },
        { value: 'Josefin Slab', label: 'Josefin Slab' },
        { value: 'Noto Sans', label: 'Noto Sans' },
        { value: 'Varela Round', label: 'Varela Round' },
        { value: 'Maven Pro', label: 'Maven Pro' },
        { value: 'Pacifico', label: 'Pacifico' },
        { value: 'Amatic SC', label: 'Amatic SC' },
        { value: 'Shadows Into Light', label: 'Shadows Into Light' },
        { value: 'Cabin Condensed', label: 'Cabin Condensed' },
        { value: 'Karla', label: 'Karla' },
        { value: 'Archivo Black', label: 'Archivo Black' },
        { value: 'Fira Mono', label: 'Fira Mono' },
        { value: 'Signika', label: 'Signika' },
        { value: 'Asap', label: 'Asap' },
        { value: 'Dosis', label: 'Dosis' },
        { value: 'Anton', label: 'Anton' },
        { value: 'Catamaran', label: 'Catamaran' },
        { value: 'Cormorant', label: 'Cormorant'}
    ]

    const { user, setUser } = useUser()

    // Populate user
    const timesLoaded = useRef(0)
    useEffect(() => {
        
        const populateUser = async () => {
            const fetchedUser = await axiosPrivate.get('/user/me')
            setUser(fetchedUser.data)
        }
    
        if (timesLoaded.current === 0) {
            timesLoaded.current++;
            populateUser();
        }
    }, [])

    const [defaultTitleFontOption, setDefaultTitleFontOption] = useState(fontOptions[40])
    const [defaultBodyFontOption, setDefaultBodyFontOption] = useState(fontOptions[26])

    const [artwork, setArtwork] = useState({
        "title": "",
        "type": "",
        "tags": [],
        "ownerID": user?._id,
        "description": "",
        "longDescription": "",
        "body": "",
        "titleStyle": {
            "fontFamily": defaultTitleFontOption.value + ", Verdana"
        },
        "bodyStyle": {
            "fontFamily": defaultBodyFontOption.value + ", Gill Sans",
            "fontSize": "1.3em"
        },
        "rating": {
            "score": "0",
            "count": "0"
        }
    })

    // Keep artwork up to date if user loads late
    useEffect(() => {
        
        setArtwork((prevArtwork) => {
            return {
                ...prevArtwork,
                "ownerID": user?._id
            }
        })
    }, [user])

    const handleTitleFontCustomize = (option) =>  {
        setDefaultTitleFontOption(option)
        updateTitleStyle("fontFamily", option.value + ", Gill Sans")
    }

    const handleBodyFontCustomize = (option) =>  {
        setDefaultBodyFontOption(option)
        updateBodyStyle("fontFamily", option.value + ", Gill Sans")
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target

        setArtwork( (prevNewArtwork) => {
            return {
            ...prevNewArtwork,
            [name]: type === "checkbox" ? checked : value
        } } )
    }

    function updateTitleStyle(name, value) {
        
        setArtwork( (prevNewArtwork) => {
            return {
                ...prevNewArtwork,
                "titleStyle": {
                    ...prevNewArtwork.titleStyle,
                    [name]: value
                }
            }
        } )
    }

    function updateBodyStyle(name, value) {
        setArtwork( (prevNewArtwork) => {
            return {
                ...prevNewArtwork,
                "bodyStyle": {
                    ...prevNewArtwork.bodyStyle,
                    [name]: value
                }
            }
        } )
    }

    const [artworkType, setArtworkType] = useState("Fiction")

    useEffect(() => {
        
        setArtwork((prevNewArtwork) => {
            return {
                ...prevNewArtwork,
                "type": artworkType
            }
        })
    }, [artworkType])

    // Code for entering tags

    const [tag, setTag] = useState("")
    const [tagLimitWarning, setTagLimitWarning] = useState(false)
    const [tagsJSX, setTagsJSX] = useState([])

    const TAG_LIMIT = 5

    // Handles tag input change
    function handleTagChange(e) {
        setTag(e.target.value)
    }

    // Updates searchData.tags as user enters or deletes tags
    function handleTagClick(e) {

        const cleanTag = tag.trim().toLowerCase()

        if (cleanTag && artwork.tags.length < TAG_LIMIT) {
            setArtwork( (prevNewArtwork) => {
                    return {
                        ...prevNewArtwork,
                        tags: [...prevNewArtwork.tags, cleanTag]
                    }
                })   
        }

        if (artwork.tags.length >= TAG_LIMIT) {
            setTagLimitWarning(true)
        }

            setTag("")       
    }

    // Removes tag when a tag label is clicked.
    function removeTag(tag) {

        const tagIndex = artwork.tags.indexOf(tag)

        setArtwork((prevNewArtwork) => {
            return {
                ...prevNewArtwork,
                tags: prevNewArtwork.tags.slice(0, tagIndex).concat( prevNewArtwork.tags.slice(tagIndex + 1) )
            }
        })
    } 

    React.useEffect( () => {
        setTagsJSX( () => {
            return artwork.tags.map( (tag, index) => {
                const cleanTag = tag.trim().toLowerCase()
                return (
                    <label className="cool-label tag-label" onClick={() => removeTag(cleanTag)} name={cleanTag} key={index}>{cleanTag}</label>
                )
            } )
        } )

    }, [artwork.tags])

    // End of code for entering tags
    
    // Code for MD editors

    const [artworkBody, setArtworkBody] = useState(``)

    useEffect(() => {
        setArtwork((prevNewArtwork) => {
            return {
                ...prevNewArtwork,
                "body": artworkBody
            }
        })
    }, [artworkBody])

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], // styling
      
        [{ 'header': 1 }, { 'header': 2 }], // headers
      
        [{ 'size': ['small', false, 'large', 'huge'] }], // remove formatting button
      ];

    const textMD = []

    textMD[0] = (<div style={{"backgroundColor": "white"}}>
            <ReactQuill
                theme="snow"
                value={artworkBody}
                modules={{toolbar: toolbarOptions}}
                style={{"fontFamily": artwork.bodyStyle.fontFamily}}
                onChange={setArtworkBody} />
        </div>)

    // End of code for MD editors

    // Code for entering non-writing types of artworks

    function getYouTubeVideoId(link) {
        // const regex = /(?:\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=|\/watch\?.+&v=)([^#\&\?\n\/<>"']+)/;
        // const match = link.match(regex);
      
        // if (match && match[1]) {
        //   return match[1];
        // } else {
        //   return null;
        // }
        if (link.split("watch?v=").length > 1 && link.split("watch?v=")[1].length > 10) {

            return link.split("watch?v=")[1].substring(0, 11)

        } else if (link.split('.be/').length > 1 && link.split('.be/')[1].length > 10) {
            
            return link.split('.be/')[1].substring(0, 11)

        } else {
            return ""
        }

      }


    // Check the type, surround the link with the appropriate markdown
    function handleBodyChange(e) {
        const { value } = e.target

        switch ( artwork.type ) {
            case "Cinema":
                setArtwork((prevNewArtwork) => {
                    return {
                        ...prevNewArtwork,
                        "body": getYouTubeVideoId(value)
                    }
                })
                break;
            case "Painting":
                setArtwork((prevNewArtwork) => {
                    return {
                        ...prevNewArtwork,
                        "body": value
                    }
                })
                break;
            case "Photography":
                setArtwork((prevNewArtwork) => {
                    return {
                        ...prevNewArtwork,
                        "body": value
                    }
                })
                break;
            case "Music":
                setArtwork((prevNewArtwork) => {
                    return {
                        ...prevNewArtwork,
                        "body": getYouTubeVideoId(value)
                    }
                })
                break;
            default:
                break;
        }

    }

    const getYoutubeLink = []

    getYoutubeLink[0] = (<>
                                    <span className="sleek-text" style={{"fontSize": "1.3em"}}>Enter the YouTube link of your artwork: </span>
                                    <input name="title" className="changeable-text-long margin-left" rows={1} onChange={handleBodyChange}/>
                                </>)

    // End of code for entering non-writing types of artworks

    async function handleArtworkSubmit(e) {
        e.preventDefault()
        let responseError
        try {
            const response = await axiosPrivate.post(`/artwork`, artwork)
            navigate('/feed')
        } catch (error) {
            console.error(error)
        }
    }

    // Error message to show if the youtube or image links are not entered correctly
    const [errorMessage, setErrorMessage] = useState('')

    // A variable that will enable or disable the submit button according to validity of the artwork body
    const [safeToSubmit, setSafeToSubmit] = useState(false)

    useEffect(()=> {

        switch (artwork.type) {
            case "Cinema":

                if (artwork.body.length < 11) {
                    setSafeToSubmit(false)
                    setErrorMessage("Please enter a valid YouTube link")
                } else {
                    setSafeToSubmit(true)
                    setErrorMessage("")
                }
                break;
            case "Music":
                if (artwork.body.length < 11) {
                    setSafeToSubmit(false)
                    setErrorMessage("Please enter a valid YouTube link")
                } else {
                    setSafeToSubmit(true)
                    setErrorMessage("")
                }
                break;
            case "Painting":
                if (
                    artwork.body.includes('.jpg') ||
                    artwork.body.includes('.jpeg') ||
                    artwork.body.includes('.png') ||
                    artwork.body.includes('.apng') ||
                    artwork.body.includes('.webp')
                ) {
                    setSafeToSubmit(true)
                    setErrorMessage('')
                } else {
                    setSafeToSubmit(false)
                    setErrorMessage("Please enter a valid image link")
                }
                break;
            case "Photography":
                if (
                    artwork.body.includes('.jpg') ||
                    artwork.body.includes('.jpeg') ||
                    artwork.body.includes('.png') ||
                    artwork.body.includes('.apng') ||
                    artwork.body.includes('.webp')
                ) {
                    setSafeToSubmit(true)
                    setErrorMessage('')
                } else {
                    setSafeToSubmit(false)
                    setErrorMessage("Please enter a valid image link")
                }
                break;
            default:
                if ( artwork.body.length < 100) {
                    setSafeToSubmit(false)
                    setErrorMessage('Your artwork needs to be at least 100 characters long')
                } else {
                    setSafeToSubmit(true)
                    setErrorMessage('')
                }
                break;

        }

    }, [artwork.body, artwork.type])

    const [hasEnoughPoints, setHasEnoughPoints] = useState(true)

    useEffect(() => {
        if (user) {
            if (user?.points < 10) {
                setSafeToSubmit(false)
                setHasEnoughPoints(false)
                setErrorMessage("You must have at least 10 points to post an artwork. Write feedbacks to other artists to gather points. Check out the 'Point System' section inside the 'Code of Conduct' page for more information.")
            }
        }
    }, [user])

    return (<>
        { hasEnoughPoints ?
            <div className="all-container">
            <form onSubmit={handleArtworkSubmit}>
                <div className="artwork-container">
                    <h2 className="fancy-title">Creating New Artwork</h2>
                    <div className="title-textbox-wrapper margin-top sleek-text">
                        <span style={{"fontSize": "1.5em"}}>Title: </span>
                        <input required maxLength={100} name="title" className="changeable-text-long margin-left" rows={1} onChange={handleChange}/>
                    </div>
                    <div className="description-textbox-wrapper margin-top sleek-text">
                        <div className="flex-column">
                            <span style={{"fontSize": "1.5em"}}>Description: </span>
                            <span className="faded-text">This description will appear on the cards on the Feed page. (Max. 240 characters)</span>
                        </div>
                        <textarea required name="description" maxLength={240} className="create-description-textbox" rows={1} onChange={handleChange}/>
                    </div>
                    <div className="description-textbox-wrapper margin-top sleek-text">
                        <div className="flex-column">
                            <span style={{"fontSize": "1.5em"}}>Long Description: </span>
                            <span className="faded-text">This description will appear on the Artwork's page. (Max. 20k characters)</span>
                        </div>
                        <textarea required name="longDescription" maxLength={20000} className="create-long-description-textbox" rows={1} onChange={handleChange}/>
                    </div>

                    <div className="margin-top sleek-text" style={{"width": "30%", "minWidth": "24em", "marginTop": "3em"}}>
                        <span style={{"fontSize": "1.5em"}}>Title Font: </span>
                            <div className="select-menu">
                                <Select
                                    value={defaultTitleFontOption}
                                    onChange={handleTitleFontCustomize}
                                    options={fontOptions}
                                    isSearchable={true}
                                />
                            </div>
                            <div className="margin-top" style={{"fontFamily": artwork.titleStyle.fontFamily}}>Preview</div>
                    </div>

                    <div className="margin-top sleek-text" style={{"width": "30%", "minWidth": "24em"}}>
                        <span style={{"fontSize": "1.5em"}}>Artwork Body Font: </span>
                        <div className="select-menu">
                            <Select
                                value={defaultBodyFontOption}
                                onChange={handleBodyFontCustomize}
                                options={fontOptions}
                                isSearchable={true}
                            />
                        </div>
                        <div className="margin-top" style={{"fontFamily": artwork.bodyStyle.fontFamily}}>Preview</div>
                    </div>

                    <div className="sleek-text margin-top">Add tags: <span className="faded-text">(Optional)</span></div>

                        <div className="tag-filter filter-sub">
                            <input className="tag-text-input" onChange={handleTagChange} value={tag} name="tags" type="text" maxLength="35"/>
                            <button type="button" onClick={handleTagClick} className="add-tag-button">Add tag</button>
                            {tagsJSX}
                            {tagLimitWarning ? (<div className="sleek-text faded-text">You can add at most 5 tags.</div>) : (<></>)} 
                        </div>

                    <h3 className="sleek-text" style={{"marginTop": "2em"}}>Pick the Artwork type</h3>
                    <Tabs customClass="scrollableHorizontal">
                        <div onClick={() => { setArtworkType((prevArtworkType) => "Fiction") }} label="Fiction">
                            {
                                textMD
                            }
                        </div>
                        <div onClick={() => { setArtworkType((prevArtworkType) => "Poetry") }} label="Poetry">
                            {
                                textMD
                            }
                        </div>
                        <div onClick={() => { setArtworkType((prevArtworkType) => "Cinema") }} label="Cinema">
                            {
                                getYoutubeLink
                            }
                        </div>

                        <div onClick={() => { setArtworkType((prevArtworkType) => "Photography") }} label="Photography">
                            <div className="sleek-text faded-text margin-bottom">You may upload your painting to Imgur, DeviantArt or any other image hosting site you wish.</div>
                                <span className="sleek-text" style={{"fontSize": "1.3em"}}>Enter the image link of your painting: </span>
                                <input name="title" className="changeable-text-long margin-left" rows={1} onChange={handleBodyChange}/>
                                
                                <div className="sleek-text faded-text">Links that end with .jpg, .jpeg, .png, .apng or .webp are okay</div>
                        </div>

                        <div onClick={() => { setArtworkType((prevArtworkType) => "Painting") }} label="Painting">
                            <div className="sleek-text faded-text margin-bottom">You may upload your painting to Imgur, DeviantArt or any other image hosting site you wish.</div>
                            <span className="sleek-text" style={{"fontSize": "1.3em"}}>Enter the image link of your painting: </span>
                            <input name="title" className="changeable-text-long margin-left" rows={1} onChange={handleBodyChange}/>
                            
                            <div className="sleek-text faded-text">Links that end with .jpg, .jpeg, .png, .apng or .webp are okay</div>
                        </div>
                        <div onClick={() => { setArtworkType((prevArtworkType) => "Music") }} label="Music">
                            {
                                getYoutubeLink
                            }
                        </div>
                        <div onClick={() => { setArtworkType((prevArtworkType) => "Other") }} label="Other">
                            {
                                textMD
                            }
                        </div>
                    </Tabs>
                    {
                        errorMessage ? <div className="faded-text sleek-text margin-bottom">{errorMessage}</div> : ''
                    }
                    <button
                        disabled={!safeToSubmit}
                        className={safeToSubmit ? "regular-button margin-bottom" : "regular-button-disabled margin-bottom"}
                        type="submit">
                            Submit
                        </button>                
                </div>
            </form>
        </div>

        :

        <div className="all-container">
                    <div className="artwork-container">
                    <div className="flex-column margin-top sleek-text slightly-larger" style={{"alignItems": "center", "justifyContent": "center", "textAlign": "center"}}>
                        <div className="fancy-title">You don't have enough points!</div>
                            <p className="sleek-text">You can check out how many points you have from your profile page.</p>
                            <p className="sleek-text">It takes 10 points to post an artwork. And the first step to gathering points is giving feedback to other artists.<br/>
                            As your feedbacks are rated useful by other people, your points increase which you can then use to post an artwork.</p>
                            <p>We use the point system in order to create a more fair and enjoyable experience for all users.</p>
                            <p className="sleek-text">Click <Link style={{"all": "unset", "cursor": "pointer"}} to={`/user/${user?._id}`}><u>here</u></Link> to go to your profile page.</p>
                            <p className="sleek-text">You may also click <Link style={{"all": "unset", "cursor": "pointer"}} to="/feed"><u>here</u></Link> to go to the feed page.</p>
                        </div>
                    </div>
                </div>

        }
        </>
    )
}